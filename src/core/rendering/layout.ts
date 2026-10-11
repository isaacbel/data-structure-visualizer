import type { VisualNode } from '@/types'

// ---------------------------------------------------------------------------
// Linear / Queue / Stack layouts
// ---------------------------------------------------------------------------

export const layoutLinear = (nodes: VisualNode[], startX = 50, startY = 200, spacing = 80): void => {
  nodes.forEach((n, i) => {
    n.x = startX + i * spacing
    n.y = startY
  })
}

export const layoutStack = (nodes: VisualNode[], startX = 400, startY = 320, spacing = 60): void => {
  nodes.forEach((n, i) => {
    n.x = startX
    n.y = startY - i * spacing
  })
}

export const layoutQueue = (nodes: VisualNode[], startX = 50, startY = 200, spacing = 80): void => {
  nodes.forEach((n, i) => {
    n.x = startX + i * spacing
    n.y = startY
  })
}

export const layoutLinkedList = (state: {
  nodes: VisualNode[]
  edges: Array<{ from: string; to: string; type?: string; directed?: boolean }>
  head?: string
}): void => {
  let current = state.head
  let i = 0
  const positioned = new Set<string>()
  while (current && !positioned.has(current)) {
    positioned.add(current)
    const node = state.nodes.find((n) => n.id === current)
    if (node) { node.x = 60 + i * 110; node.y = 200 }
    current = node?.next ?? undefined
    i++
  }
  state.edges.length = 0
  current = state.head
  const linked = new Set<string>()
  while (current && !linked.has(current)) {
    linked.add(current)
    const node = state.nodes.find((n) => n.id === current)
    if (node?.next) {
      const isCircular = node.next === state.head
      state.edges.push({ from: current, to: node.next, type: isCircular ? 'loop' : undefined })
    }
    if (node?.prev) {
      state.edges.push({ from: current, to: node.prev, type: 'back' })
    }
    current = node?.next ?? undefined
  }
}

// ---------------------------------------------------------------------------
// Graph layouts
// ---------------------------------------------------------------------------

export const layoutGraph = (nodes: VisualNode[], width = 800, height = 400): void => {
  const radius = Math.min(width, height) / 2 - 60
  const cx = width / 2
  const cy = height / 2
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2
    n.x = cx + radius * Math.cos(angle)
    n.y = cy + radius * Math.sin(angle)
  })
}

export const layoutGraphGrid = (nodes: VisualNode[], width = 800, height = 400): void => {
  const cols = Math.ceil(Math.sqrt(nodes.length))
  const spacingX = Math.min(140, (width - 100) / Math.max(cols - 1, 1))
  const spacingY = Math.min(130, (height - 100) / Math.max(Math.ceil(nodes.length / cols) - 1, 1))
  nodes.forEach((n, i) => {
    n.x = 80 + (i % cols) * spacingX
    n.y = 80 + Math.floor(i / cols) * spacingY
  })
}

export const layoutGraphHierarchical = (
  nodes: VisualNode[],
  edges: { from: string; to: string }[],
  width = 800,
  height = 420,
): void => {
  // Build in-degree map
  const inDegree = new Map(nodes.map((n) => [n.id, 0]))
  edges.forEach((e) => inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1))
  const roots = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0)
  if (roots.length === 0) { layoutGraph(nodes, width, height); return }

  const levels: string[][] = []
  const visited = new Set<string>()
  const queue = roots.map((n) => ({ id: n.id, level: 0 }))
  while (queue.length > 0) {
    const { id, level } = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)
    levels[level] = [...(levels[level] ?? []), id]
    edges.filter((e) => e.from === id).forEach((e) => queue.push({ id: e.to, level: level + 1 }))
  }
  // Also place any nodes not reachable from roots
  nodes.forEach((n) => {
    if (!visited.has(n.id)) levels[0] = [...(levels[0] ?? []), n.id]
  })

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const levelGap = Math.min(110, (height - 80) / Math.max(levels.length - 1, 1))
  levels.forEach((ids, depth) => {
    const gap = Math.min(160, (width - 80) / Math.max(ids.length, 1))
    ids.forEach((id, index) => {
      const node = byId.get(id)
      if (!node) return
      node.x = 60 + index * gap + (ids.length === 1 ? width / 2 - 60 : 0)
      node.y = 50 + depth * levelGap
    })
  })
}

// Force-directed layout — spring embedder (fast version: 80 iterations)
export const layoutGraphForce = (
  nodes: VisualNode[],
  edges: { from: string; to: string }[],
  width = 800,
  height = 420,
  iterations = 80,
): void => {
  if (nodes.length === 0) return
  // Initialise positions in a circle
  layoutGraph(nodes, width, height)

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const k = Math.sqrt((width * height) / nodes.length) * 1.2
  const vx = new Map(nodes.map((n) => [n.id, 0]))
  const vy = new Map(nodes.map((n) => [n.id, 0]))

  for (let iter = 0; iter < iterations; iter++) {
    const temp = k * Math.max(0.01, 1 - iter / iterations)
    // Repulsion
    nodes.forEach((a) => {
      let fx = 0, fy = 0
      nodes.forEach((b) => {
        if (a.id === b.id) return
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
        const force = (k * k) / dist
        fx += (dx / dist) * force
        fy += (dy / dist) * force
      })
      vx.set(a.id, (vx.get(a.id) ?? 0) + fx)
      vy.set(a.id, (vy.get(a.id) ?? 0) + fy)
    })
    // Attraction
    edges.forEach((e) => {
      const a = byId.get(e.from)
      const b = byId.get(e.to)
      if (!a || !b) return
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
      const force = (dist * dist) / k
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      vx.set(a.id, (vx.get(a.id) ?? 0) + fx)
      vy.set(a.id, (vy.get(a.id) ?? 0) + fy)
      vx.set(b.id, (vx.get(b.id) ?? 0) - fx)
      vy.set(b.id, (vy.get(b.id) ?? 0) - fy)
    })
    // Apply velocities with damping
    nodes.forEach((n) => {
      const dvx = vx.get(n.id) ?? 0
      const dvy = vy.get(n.id) ?? 0
      const mag = Math.max(1, Math.sqrt(dvx * dvx + dvy * dvy))
      n.x += (dvx / mag) * Math.min(mag, temp)
      n.y += (dvy / mag) * Math.min(mag, temp)
      n.x = Math.max(40, Math.min(width - 40, n.x))
      n.y = Math.max(40, Math.min(height - 40, n.y))
      vx.set(n.id, 0)
      vy.set(n.id, 0)
    })
  }
}

// ---------------------------------------------------------------------------
// Radial layout — BFS layers arranged in concentric circles
// ---------------------------------------------------------------------------

export const layoutGraphRadial = (
  nodes: VisualNode[],
  edges: { from: string; to: string }[],
  width = 800,
  height = 420,
): void => {
  if (nodes.length === 0) return
  const cx = width / 2
  const cy = height / 2

  // BFS from first node
  const adj = new Map<string, string[]>()
  edges.forEach((e) => {
    adj.set(e.from, [...(adj.get(e.from) ?? []), e.to])
    adj.set(e.to, [...(adj.get(e.to) ?? []), e.from])
  })

  const visited = new Set<string>()
  const levels: string[][] = []
  const queue: Array<{ id: string; level: number }> = [{ id: nodes[0].id, level: 0 }]
  visited.add(nodes[0].id)

  while (queue.length > 0) {
    const { id, level } = queue.shift()!
    levels[level] = [...(levels[level] ?? []), id]
    for (const nb of adj.get(id) ?? []) {
      if (!visited.has(nb)) { visited.add(nb); queue.push({ id: nb, level: level + 1 }) }
    }
  }

  // Place unreachable nodes on outermost ring
  nodes.forEach((n) => { if (!visited.has(n.id)) { visited.add(n.id); levels[levels.length] = [n.id] } })

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const maxRadius = Math.min(width, height) / 2 - 50
  levels.forEach((ids, depth) => {
    const r = depth === 0 ? 0 : (depth / (levels.length - 1 || 1)) * maxRadius
    ids.forEach((id, i) => {
      const angle = (2 * Math.PI * i) / ids.length - Math.PI / 2
      const node = byId.get(id)
      if (!node) return
      node.x = cx + r * Math.cos(angle)
      node.y = cy + r * Math.sin(angle)
    })
  })
}

// ---------------------------------------------------------------------------
// Bipartite layout — two vertical columns
// ---------------------------------------------------------------------------

export const layoutGraphBipartite = (
  nodes: VisualNode[],
  _edges: { from: string; to: string }[],
  width = 800,
  height = 420,
): void => {
  const half = Math.ceil(nodes.length / 2)
  const leftNodes = nodes.slice(0, half)
  const rightNodes = nodes.slice(half)
  const gapY = Math.min(100, (height - 80) / Math.max(Math.max(leftNodes.length, rightNodes.length) - 1, 1))

  leftNodes.forEach((n, i) => { n.x = width * 0.25; n.y = 60 + i * gapY })
  rightNodes.forEach((n, i) => { n.x = width * 0.75; n.y = 60 + i * gapY })
}

// ---------------------------------------------------------------------------
// Fruchterman–Reingold — temperature-based force-directed
// ---------------------------------------------------------------------------

export const layoutFruchtermanReingold = (
  nodes: VisualNode[],
  edges: { from: string; to: string }[],
  width = 800,
  height = 420,
  iterations = 100,
): void => {
  if (nodes.length === 0) return
  layoutGraph(nodes, width, height)

  const area = width * height
  const k = Math.sqrt(area / nodes.length) * 0.9
  const pos = new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y, dx: 0, dy: 0 }]))

  for (let iter = 0; iter < iterations; iter++) {
    const temp = width / (1 + iter * 0.1)

    // Reset displacements
    pos.forEach((p) => { p.dx = 0; p.dy = 0 })

    // Repulsive forces
    const nodeArr = [...pos.entries()]
    for (let i = 0; i < nodeArr.length; i++) {
      for (let j = i + 1; j < nodeArr.length; j++) {
        const [aid, a] = nodeArr[i]
        const [bid, b] = nodeArr[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.max(0.01, Math.sqrt(dx * dx + dy * dy))
        const force = (k * k) / dist
        const nx = (dx / dist) * force, ny = (dy / dist) * force
        const pa = pos.get(aid)!, pb = pos.get(bid)!
        pa.dx += nx; pa.dy += ny; pb.dx -= nx; pb.dy -= ny
      }
    }

    // Attractive forces
    edges.forEach((e) => {
      const a = pos.get(e.from), b = pos.get(e.to)
      if (!a || !b) return
      const dx = b.x - a.x, dy = b.y - a.y
      const dist = Math.max(0.01, Math.sqrt(dx * dx + dy * dy))
      const force = (dist * dist) / k
      const nx = (dx / dist) * force, ny = (dy / dist) * force
      a.dx += nx; a.dy += ny; b.dx -= nx; b.dy -= ny
    })

    // Apply, clamp to temp
    pos.forEach((p) => {
      const mag = Math.max(0.01, Math.sqrt(p.dx * p.dx + p.dy * p.dy))
      const factor = Math.min(mag, temp) / mag
      p.x = Math.max(50, Math.min(width - 50, p.x + p.dx * factor))
      p.y = Math.max(50, Math.min(height - 50, p.y + p.dy * factor))
    })
  }

  nodes.forEach((n) => { const p = pos.get(n.id); if (p) { n.x = p.x; n.y = p.y } })
}

// ---------------------------------------------------------------------------
// Kamada–Kawai — stress minimization (approximate, 50 iterations)
// ---------------------------------------------------------------------------

export const layoutKamadaKawai = (
  nodes: VisualNode[],
  edges: { from: string; to: string }[],
  width = 800,
  height = 420,
): void => {
  if (nodes.length === 0) return
  layoutGraph(nodes, width, height)
  if (nodes.length < 3) return

  const n = nodes.length
  const L = Math.min(width, height) * 0.5 / (n > 1 ? Math.sqrt(n) : 1)
  const K = 1.0

  // Floyd-Warshall shortest paths (unweighted BFS distance)
  const adj = new Map<string, string[]>()
  edges.forEach((e) => {
    adj.set(e.from, [...(adj.get(e.from) ?? []), e.to])
    adj.set(e.to, [...(adj.get(e.to) ?? []), e.from])
  })

  const ids = nodes.map((n) => n.id)
  const idx = new Map(ids.map((id, i) => [id, i]))
  const INF = 1e9
  const dist: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : INF)))

  edges.forEach((e) => {
    const i = idx.get(e.from) ?? -1, j = idx.get(e.to) ?? -1
    if (i >= 0 && j >= 0) { dist[i][j] = 1; dist[j][i] = 1 }
  })

  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j]

  const pos = nodes.map((nd) => ({ x: nd.x, y: nd.y }))

  for (let iter = 0; iter < 50; iter++) {
    for (let m = 0; m < n; m++) {
      let dEx = 0, dEy = 0, ddExx = 0, ddEyy = 0
      for (let o = 0; o < n; o++) {
        if (m === o) continue
        const d = dist[m][o] < INF ? dist[m][o] : n
        const lmo = L * d
        const kmo = K / (d * d)
        const dx = pos[m].x - pos[o].x, dy = pos[m].y - pos[o].y
        const r = Math.max(0.01, Math.sqrt(dx * dx + dy * dy))
        dEx += kmo * (dx - (lmo * dx / r))
        dEy += kmo * (dy - (lmo * dy / r))
        ddExx += kmo * (1 - lmo * dy * dy / (r * r * r))
        ddEyy += kmo * (1 - lmo * dx * dx / (r * r * r))
      }
      const det = ddExx * ddEyy
      if (Math.abs(det) > 1e-9) {
        pos[m].x -= (ddEyy * dEx) / det
        pos[m].y -= (ddExx * dEy) / det
      }
    }
  }

  // Scale to fit
  const xs = pos.map((p) => p.x), ys = pos.map((p) => p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const scaleX = (maxX - minX) > 1 ? (width - 100) / (maxX - minX) : 1
  const scaleY = (maxY - minY) > 1 ? (height - 100) / (maxY - minY) : 1
  const scale = Math.min(scaleX, scaleY)

  nodes.forEach((nd, i) => {
    nd.x = 50 + (pos[i].x - minX) * scale
    nd.y = 50 + (pos[i].y - minY) * scale
  })
}

// ---------------------------------------------------------------------------
// Layered / Sugiyama-style — proper DAG hierarchical with crossing reduction
// ---------------------------------------------------------------------------

export const layoutLayered = (
  nodes: VisualNode[],
  edges: { from: string; to: string }[],
  width = 800,
  height = 420,
): void => {
  if (nodes.length === 0) return

  // Assign layers using longest-path algorithm
  const inDegree = new Map(nodes.map((n) => [n.id, 0]))
  const adj = new Map<string, string[]>()
  edges.forEach((e) => {
    if (e.from !== e.to) {
      adj.set(e.from, [...(adj.get(e.from) ?? []), e.to])
      inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1)
    }
  })

  const layer = new Map<string, number>()
  const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id)
  queue.forEach((id) => layer.set(id, 0))

  const visited = new Set<string>()
  const bfsQ = [...queue]
  while (bfsQ.length > 0) {
    const id = bfsQ.shift()!
    if (visited.has(id)) continue
    visited.add(id)
    for (const nb of adj.get(id) ?? []) {
      const newLayer = (layer.get(id) ?? 0) + 1
      if (newLayer > (layer.get(nb) ?? 0)) layer.set(nb, newLayer)
      bfsQ.push(nb)
    }
  }
  nodes.forEach((n) => { if (!layer.has(n.id)) layer.set(n.id, 0) })

  const byLayer = new Map<number, string[]>()
  layer.forEach((l, id) => byLayer.set(l, [...(byLayer.get(l) ?? []), id]))

  const numLayers = Math.max(...byLayer.keys()) + 1
  const layerGap = Math.min(120, (height - 80) / Math.max(numLayers - 1, 1))
  const byId = new Map(nodes.map((n) => [n.id, n]))

  byLayer.forEach((ids, l) => {
    const gap = Math.min(150, (width - 80) / Math.max(ids.length, 1))
    ids.forEach((id, i) => {
      const node = byId.get(id)
      if (!node) return
      node.x = 60 + i * gap + (width - 60 - (ids.length - 1) * gap) / 2
      node.y = 50 + l * layerGap
    })
  })
}

// ---------------------------------------------------------------------------
// Spring layout — simpler Hooke's law
// ---------------------------------------------------------------------------

export const layoutSpring = (
  nodes: VisualNode[],
  edges: { from: string; to: string }[],
  width = 800,
  height = 420,
  iterations = 60,
): void => {
  if (nodes.length === 0) return
  layoutGraph(nodes, width, height)

  const L0 = Math.min(width, height) * 0.3
  const k_spring = 0.1
  const k_repel = 8000

  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map(nodes.map((n) => [n.id, { fx: 0, fy: 0 }]))

    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
        const force = k_repel / (dist * dist)
        const fa = forces.get(a.id)!, fb = forces.get(b.id)!
        fa.fx += (dx / dist) * force; fa.fy += (dy / dist) * force
        fb.fx -= (dx / dist) * force; fb.fy -= (dy / dist) * force
      }
    }

    // Attraction along edges
    edges.forEach((e) => {
      const a = nodes.find((n) => n.id === e.from), b = nodes.find((n) => n.id === e.to)
      if (!a || !b) return
      const dx = b.x - a.x, dy = b.y - a.y
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
      const force = k_spring * (dist - L0)
      const fa = forces.get(a.id)!, fb = forces.get(b.id)!
      fa.fx += (dx / dist) * force; fa.fy += (dy / dist) * force
      fb.fx -= (dx / dist) * force; fb.fy -= (dy / dist) * force
    })

    nodes.forEach((n) => {
      const f = forces.get(n.id)!
      n.x = Math.max(40, Math.min(width - 40, n.x + f.fx * 0.5))
      n.y = Math.max(40, Math.min(height - 40, n.y + f.fy * 0.5))
    })
  }
}

// ---------------------------------------------------------------------------
// Organic layout — improved force-directed with cooling schedule
// ---------------------------------------------------------------------------

export const layoutOrganic = (
  nodes: VisualNode[],
  edges: { from: string; to: string }[],
  width = 800,
  height = 420,
): void => layoutFruchtermanReingold(nodes, edges, width, height, 150)

// ---------------------------------------------------------------------------
// Binary tree layout — inorder leaf numbering (O(n), always terminates)
// ---------------------------------------------------------------------------

/** Maximum tree depth guard to prevent runaway recursion on corrupted graphs. */
export const MAX_TREE_LAYOUT_DEPTH = 10_000

export const layoutTree = (
  rootId: string,
  nodes: VisualNode[],
  depth = 0,
  xRange: [number, number] = [50, 750],
  yStart = 60,
  yGap = 78,
): void => {
  if (!nodes || nodes.length === 0) return

  const byId = new Map(nodes.map((n) => [n.id, n]))
  if (!rootId || !byId.has(rootId)) {
    const rootCandidate = nodes.find((n) => !n.parent || !byId.has(n.parent))
    if (!rootCandidate) return
    rootId = rootCandidate.id
  }

  const rangeW = xRange[1] - xRange[0]
  const xGap = Math.max(28, Math.min(72, rangeW / Math.max(nodes.length, 1)))
  let leafIndex = 0
  const visited = new Set<string>()

  const assign = (id: string | null | undefined, level: number): void => {
    if (!id || !byId.has(id) || level > MAX_TREE_LAYOUT_DEPTH) return
    if (visited.has(id)) return
    visited.add(id)

    const node = byId.get(id)!
    const left = node.left && byId.has(node.left) ? node.left : null
    const right = node.right && byId.has(node.right) ? node.right : null

    if (left) assign(left, level + 1)

    node.x = leafIndex * xGap
    node.y = yStart + level * yGap
    leafIndex++

    if (right) assign(right, level + 1)
  }

  assign(rootId, depth)
  if (leafIndex === 0) return

  const allX = nodes.map((n) => n.x)
  const minX = Math.min(...allX)
  const maxX = Math.max(...allX)
  const contentW = maxX - minX || 1
  const offsetX = xRange[0] + rangeW / 2 - (minX + contentW / 2)
  nodes.forEach((n) => { n.x += offsetX })
}
