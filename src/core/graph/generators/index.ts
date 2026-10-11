import { createRng, randInt, shuffle } from '../rng'
import type { GraphData, GraphEdge, GraphGeneratorOptions, GraphModel } from '../types'
import { addEdgeUnique, isConnected } from '../adjacency'

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeNodes(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `v${i}`)
}

function makeWeight(opts: GraphGeneratorOptions, rng: () => number): number | undefined {
  if (!opts.weighted) return undefined
  const min = opts.weightMin ?? 1
  const max = opts.weightMax ?? 20
  const w = randInt(rng, min, Math.max(min, max))
  return opts.allowNegativeWeights && rng() < 0.2 ? -w : w
}

function ensureConnected(nodes: string[], edges: GraphEdge[], opts: GraphGeneratorOptions, rng: () => number): void {
  if (nodes.length <= 1) return
  // Build union-find
  const parent = new Map(nodes.map((n) => [n, n]))
  const find = (x: string): string => {
    const p = parent.get(x) ?? x
    if (p === x) return x
    const root = find(p)
    parent.set(x, root)
    return root
  }
  const union = (a: string, b: string) => parent.set(find(a), find(b))
  edges.forEach((e) => union(e.from, e.to))

  // Connect components
  const shuffled = shuffle(nodes, rng)
  for (let i = 1; i < shuffled.length; i++) {
    if (find(shuffled[i]) !== find(shuffled[0])) {
      edges.push({
        from: shuffled[i - 1],
        to: shuffled[i],
        weight: makeWeight(opts, rng),
        directed: opts.directed ?? false,
      })
      union(shuffled[i - 1], shuffled[i])
    }
  }
}

// ── Erdős–Rényi ──────────────────────────────────────────────────────────────

export function generateErdosRenyi(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(2, opts.vertexCount ?? 8)
  const nodes = makeNodes(n)
  const edges: GraphEdge[] = []
  const directed = opts.directed ?? false

  // G(n,p) model
  const p = opts.density ?? (opts.edgeCount ? (2 * opts.edgeCount) / (n * (n - 1)) : 0.4)

  for (let i = 0; i < n; i++) {
    const start = directed ? 0 : i + 1
    for (let j = start; j < n; j++) {
      if (i === j) continue
      if (rng() < p) {
        addEdgeUnique(edges, {
          from: nodes[i],
          to: nodes[j],
          weight: makeWeight(opts, rng),
          directed,
        }, directed, opts.allowMultiEdges ?? false)
      }
    }
  }

  if (opts.connected !== false) ensureConnected(nodes, edges, opts, rng)

  // Trim to edgeCount if specified
  const maxEdges = opts.edgeCount
  if (maxEdges && edges.length > maxEdges) edges.splice(maxEdges)

  return {
    nodes,
    edges,
    metadata: { model: 'erdos-renyi', directed, weighted: opts.weighted ?? false, connected: opts.connected !== false, seed: opts.seed },
  }
}

// ── Barabási–Albert (scale-free) ─────────────────────────────────────────────

export function generateBarabasiAlbert(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(3, opts.vertexCount ?? 12)
  const m = Math.max(1, Math.min(opts.preferentialAttachment ?? 2, n - 1))
  const directed = opts.directed ?? false

  const nodes = makeNodes(n)
  const edges: GraphEdge[] = []
  const degree = new Map<string, number>(nodes.map((v) => [v, 0]))

  // Start with a clique of m+1 nodes
  for (let i = 0; i <= m; i++) {
    for (let j = i + 1; j <= m; j++) {
      edges.push({ from: nodes[i], to: nodes[j], weight: makeWeight(opts, rng), directed })
      degree.set(nodes[i], (degree.get(nodes[i]) ?? 0) + 1)
      degree.set(nodes[j], (degree.get(nodes[j]) ?? 0) + 1)
    }
  }

  // Add remaining nodes with preferential attachment
  for (let i = m + 1; i < n; i++) {
    const newNode = nodes[i]
    const totalDegree = [...degree.values()].reduce((s, d) => s + d, 0)
    const targets = new Set<string>()
    const existing = nodes.slice(0, i)

    while (targets.size < Math.min(m, existing.length)) {
      let r = rng() * totalDegree
      for (const v of existing) {
        r -= degree.get(v) ?? 0
        if (r <= 0) { targets.add(v); break }
      }
      // fallback
      if (targets.size < m) targets.add(existing[Math.floor(rng() * existing.length)])
    }

    for (const target of targets) {
      edges.push({ from: newNode, to: target, weight: makeWeight(opts, rng), directed })
      degree.set(newNode, (degree.get(newNode) ?? 0) + 1)
      degree.set(target, (degree.get(target) ?? 0) + 1)
    }
  }

  return {
    nodes,
    edges,
    metadata: { model: 'barabasi-albert', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed },
  }
}

// ── Watts–Strogatz (small world) ─────────────────────────────────────────────

export function generateWattsStrogatz(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(4, opts.vertexCount ?? 12)
  const k = Math.max(2, Math.min(Math.floor(n / 3), 4)) // each node connects to k nearest
  const beta = Math.max(0, Math.min(1, opts.rewireProbability ?? 0.2))
  const directed = opts.directed ?? false
  const nodes = makeNodes(n)
  const edgeSet = new Set<string>()
  const edges: GraphEdge[] = []

  const key = (a: string, b: string) => (directed ? `${a}→${b}` : [a, b].sort().join('--'))

  // Ring lattice
  for (let i = 0; i < n; i++) {
    for (let d = 1; d <= k / 2; d++) {
      const j = (i + d) % n
      const ek = key(nodes[i], nodes[j])
      if (!edgeSet.has(ek)) {
        edgeSet.add(ek)
        edges.push({ from: nodes[i], to: nodes[j], weight: makeWeight(opts, rng), directed })
      }
    }
  }

  // Rewire
  const toRewire = edges.filter(() => rng() < beta)
  for (const edge of toRewire) {
    const newTarget = nodes[Math.floor(rng() * n)]
    if (newTarget !== edge.from && newTarget !== edge.to && !edgeSet.has(key(edge.from, newTarget))) {
      edgeSet.delete(key(edge.from, edge.to))
      edgeSet.add(key(edge.from, newTarget))
      edge.to = newTarget
    }
  }

  return {
    nodes,
    edges,
    metadata: { model: 'watts-strogatz', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed },
  }
}

// ── Random Tree (Prüfer sequence) ─────────────────────────────────────────────

export function generateRandomTree(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(2, opts.vertexCount ?? 8)
  const nodes = makeNodes(n)
  const edges: GraphEdge[] = []
  const directed = opts.directed ?? false

  if (n === 2) {
    edges.push({ from: nodes[0], to: nodes[1], weight: makeWeight(opts, rng), directed })
    return { nodes, edges, metadata: { model: 'random-tree', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed } }
  }

  // Generate Prüfer sequence
  const prufer = Array.from({ length: n - 2 }, () => Math.floor(rng() * n))
  const degree = new Array(n).fill(1)
  for (const v of prufer) degree[v]++

  // Decode Prüfer sequence
  for (const v of prufer) {
    for (let i = 0; i < n; i++) {
      if (degree[i] === 1) {
        edges.push({ from: nodes[i], to: nodes[v], weight: makeWeight(opts, rng), directed })
        degree[i]--
        degree[v]--
        break
      }
    }
  }

  // Add last edge (remaining two nodes with degree 1)
  const leaves = Array.from({ length: n }, (_, i) => i).filter((i) => degree[i] === 1)
  if (leaves.length >= 2) {
    edges.push({ from: nodes[leaves[0]], to: nodes[leaves[1]], weight: makeWeight(opts, rng), directed })
  }

  return {
    nodes,
    edges,
    metadata: { model: 'random-tree', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed },
  }
}

// ── Random DAG ────────────────────────────────────────────────────────────────

export function generateRandomDAG(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(2, opts.vertexCount ?? 8)
  const nodes = makeNodes(n)
  const edges: GraphEdge[] = []
  const targetEdges = opts.edgeCount ?? Math.floor(n * 1.5)

  // Topological order: edges only go from lower to higher index
  let attempts = 0
  while (edges.length < targetEdges && attempts < targetEdges * 10) {
    attempts++
    const i = Math.floor(rng() * (n - 1))
    const j = i + 1 + Math.floor(rng() * (n - 1 - i))
    addEdgeUnique(edges, { from: nodes[i], to: nodes[j], weight: makeWeight(opts, rng), directed: true }, true, false)
  }

  if (opts.connected !== false) ensureConnected(nodes, edges, { ...opts, directed: true }, rng)

  return {
    nodes,
    edges,
    metadata: { model: 'random-dag', directed: true, weighted: opts.weighted ?? false, connected: opts.connected !== false, seed: opts.seed },
  }
}

// ── Random Grid ───────────────────────────────────────────────────────────────

export function generateRandomGrid(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const cols = Math.max(2, Math.round(Math.sqrt(opts.vertexCount ?? 9)))
  const rows = Math.max(2, Math.ceil((opts.vertexCount ?? 9) / cols))
  const n = rows * cols
  const nodes = makeNodes(n)
  const edges: GraphEdge[] = []
  const directed = opts.directed ?? false

  const idx = (r: number, c: number) => r * cols + c

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) {
        edges.push({ from: nodes[idx(r, c)], to: nodes[idx(r, c + 1)], weight: makeWeight(opts, rng), directed })
      }
      if (r + 1 < rows) {
        edges.push({ from: nodes[idx(r, c)], to: nodes[idx(r + 1, c)], weight: makeWeight(opts, rng), directed })
      }
    }
  }

  return {
    nodes: nodes.slice(0, n),
    edges,
    metadata: { model: 'random-grid', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed },
  }
}

// ── Random Bipartite ──────────────────────────────────────────────────────────

export function generateRandomBipartite(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(4, opts.vertexCount ?? 8)
  const half = Math.floor(n / 2)
  const nodes = makeNodes(n)
  const edges: GraphEdge[] = []
  const directed = opts.directed ?? false
  const p = opts.density ?? 0.5

  for (let i = 0; i < half; i++) {
    for (let j = half; j < n; j++) {
      if (rng() < p) {
        addEdgeUnique(edges, { from: nodes[i], to: nodes[j], weight: makeWeight(opts, rng), directed }, directed, false)
      }
    }
  }

  if (opts.connected !== false) ensureConnected(nodes, edges, opts, rng)

  return {
    nodes,
    edges,
    metadata: { model: 'random-bipartite', directed, weighted: opts.weighted ?? false, connected: opts.connected !== false, seed: opts.seed },
  }
}

// ── Complete Graph ────────────────────────────────────────────────────────────

export function generateCompleteGraph(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(2, Math.min(opts.vertexCount ?? 6, 20))
  const nodes = makeNodes(n)
  const edges: GraphEdge[] = []
  const directed = opts.directed ?? false

  for (let i = 0; i < n; i++) {
    const start = directed ? 0 : i + 1
    for (let j = start; j < n; j++) {
      if (i !== j) {
        edges.push({ from: nodes[i], to: nodes[j], weight: makeWeight(opts, rng), directed })
      }
    }
  }

  return {
    nodes,
    edges,
    metadata: { model: 'complete', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed },
  }
}

// ── Special Graphs ────────────────────────────────────────────────────────────

export function generateStarGraph(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(2, opts.vertexCount ?? 7)
  const nodes = makeNodes(n)
  const directed = opts.directed ?? false
  const edges: GraphEdge[] = nodes.slice(1).map((leaf) => ({
    from: nodes[0],
    to: leaf,
    weight: makeWeight(opts, rng),
    directed,
  }))
  return { nodes, edges, metadata: { model: 'star', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed } }
}

export function generateWheelGraph(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(4, opts.vertexCount ?? 7)
  const nodes = makeNodes(n)
  const directed = opts.directed ?? false
  const edges: GraphEdge[] = []

  // Hub to spokes
  for (let i = 1; i < n; i++) {
    edges.push({ from: nodes[0], to: nodes[i], weight: makeWeight(opts, rng), directed })
  }
  // Outer ring
  for (let i = 1; i < n; i++) {
    const next = i === n - 1 ? 1 : i + 1
    edges.push({ from: nodes[i], to: nodes[next], weight: makeWeight(opts, rng), directed })
  }
  return { nodes, edges, metadata: { model: 'wheel', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed } }
}

export function generateCycleGraph(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(3, opts.vertexCount ?? 6)
  const nodes = makeNodes(n)
  const directed = opts.directed ?? false
  const edges: GraphEdge[] = nodes.map((v, i) => ({
    from: v,
    to: nodes[(i + 1) % n],
    weight: makeWeight(opts, rng),
    directed,
  }))
  return { nodes, edges, metadata: { model: 'ring', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed } }
}

export function generatePathGraph(opts: GraphGeneratorOptions): GraphData {
  const rng = createRng(opts.seed)
  const n = Math.max(2, opts.vertexCount ?? 6)
  const nodes = makeNodes(n)
  const directed = opts.directed ?? false
  const edges: GraphEdge[] = nodes.slice(0, -1).map((v, i) => ({
    from: v,
    to: nodes[i + 1],
    weight: makeWeight(opts, rng),
    directed,
  }))
  return { nodes, edges, metadata: { model: 'path', directed, weighted: opts.weighted ?? false, connected: true, seed: opts.seed } }
}

export function generatePetersenGraph(_opts: GraphGeneratorOptions): GraphData {
  const nodes = makeNodes(10)
  // Outer ring: 0-4, inner star: 5-9
  const edges: GraphEdge[] = [
    // Outer cycle
    { from: 'v0', to: 'v1' }, { from: 'v1', to: 'v2' }, { from: 'v2', to: 'v3' },
    { from: 'v3', to: 'v4' }, { from: 'v4', to: 'v0' },
    // Spokes
    { from: 'v0', to: 'v5' }, { from: 'v1', to: 'v6' }, { from: 'v2', to: 'v7' },
    { from: 'v3', to: 'v8' }, { from: 'v4', to: 'v9' },
    // Inner pentagram
    { from: 'v5', to: 'v7' }, { from: 'v7', to: 'v9' }, { from: 'v9', to: 'v6' },
    { from: 'v6', to: 'v8' }, { from: 'v8', to: 'v5' },
  ]
  return { nodes, edges, metadata: { model: 'petersen', directed: false, weighted: false, connected: true } }
}

export function generateHypercubeGraph(opts: GraphGeneratorOptions): GraphData {
  const dim = Math.max(1, Math.min(opts.vertexCount ? Math.floor(Math.log2(opts.vertexCount)) : 3, 4))
  const n = Math.pow(2, dim)
  const nodes = makeNodes(n)
  const edges: GraphEdge[] = []
  const rng = createRng(opts.seed)

  for (let i = 0; i < n; i++) {
    for (let d = 0; d < dim; d++) {
      const j = i ^ (1 << d)
      if (j > i) {
        edges.push({ from: nodes[i], to: nodes[j], weight: makeWeight(opts, rng), directed: opts.directed ?? false })
      }
    }
  }
  return { nodes, edges, metadata: { model: 'random-grid', directed: opts.directed ?? false, weighted: opts.weighted ?? false, connected: true, seed: opts.seed } }
}

// ── Sparse & Dense ────────────────────────────────────────────────────────────

export function generateSparseGraph(opts: GraphGeneratorOptions): GraphData {
  return generateErdosRenyi({ ...opts, density: 0.1 + (opts.density ?? 0) * 0.1, model: 'random-sparse' })
}

export function generateDenseGraph(opts: GraphGeneratorOptions): GraphData {
  return generateErdosRenyi({ ...opts, density: 0.7 + (opts.density ?? 0) * 0.2, model: 'random-dense' })
}

// ── Main dispatcher ───────────────────────────────────────────────────────────

export function generateGraph(opts: GraphGeneratorOptions & { model: GraphModel }): GraphData {
  switch (opts.model) {
    case 'erdos-renyi': return generateErdosRenyi(opts)
    case 'barabasi-albert': return generateBarabasiAlbert(opts)
    case 'watts-strogatz': return generateWattsStrogatz(opts)
    case 'random-tree': return generateRandomTree(opts)
    case 'random-dag': return generateRandomDAG(opts)
    case 'random-grid': return generateRandomGrid(opts)
    case 'random-bipartite': return generateRandomBipartite(opts)
    case 'complete': return generateCompleteGraph(opts)
    case 'star': return generateStarGraph(opts)
    case 'ring': return generateCycleGraph(opts)
    case 'wheel': return generateWheelGraph(opts)
    case 'path': return generatePathGraph(opts)
    case 'grid': return generateRandomGrid(opts)
    case 'petersen': return generatePetersenGraph(opts)
    case 'random-sparse': return generateSparseGraph(opts)
    case 'random-dense': return generateDenseGraph(opts)
    default: return generateErdosRenyi(opts)
  }
}
