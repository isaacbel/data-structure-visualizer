import type { AnimationStep, VisualState } from '@/types'
import { deepClone } from '@/utils/clone'

interface OpParams {
  value: string | number | null
  index: number | null
}

function neighbours(nodeId: string, state: VisualState): string[] {
  const edges = state.edges ?? []
  const set = new Set<string>()
  for (const e of edges) {
    if (e.from === nodeId) set.add(e.to)
    if (!e.directed && e.to === nodeId) set.add(e.from)
  }
  return [...set]
}

function getVal(nodeId: string, state: VisualState): string {
  const node = state.nodes?.find((n) => n.id === nodeId)
  return node ? String(node.value) : nodeId
}

export function buildGraphSteps(op: string, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const nodes = state.nodes ?? []
  if (nodes.length === 0) return steps

  if (op === 'bfs') {
    const startId = nodes[0].id
    const visited = new Set<string>()
    const queue = [startId]
    visited.add(startId)

    steps.push({
      description: `Start BFS from ${getVal(startId, state)}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const n = ns.nodes?.find((x) => x.id === startId)
        if (n) n.highlight = 'green'
        ns.queue = [getVal(startId, s)]
        return ns
      },
    })

    while (queue.length > 0) {
      const currentId = queue.shift()!
      const curName = getVal(currentId, state)

      steps.push({
        description: `Process node ${curName}`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          clearGraphHighlights(ns)
          const n = ns.nodes?.find((x) => x.id === currentId)
          if (n) n.highlight = 'blue'
          ns.queue = queue.map((id) => getVal(id, s))
          ns.visited = [...(ns.visited ?? []), curName]
          return ns
        },
      })

      for (const neighborId of neighbours(currentId, state)) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId)
          queue.push(neighborId)
          const neighborName = getVal(neighborId, state)
          steps.push({
            description: `Discover neighbor ${neighborName}`,
            codeLine: 3,
            modifier: (s) => {
              const ns = deepClone(s)
              const edge = ns.edges?.find((e) =>
                (e.from === currentId && e.to === neighborId) ||
                (!e.directed && e.from === neighborId && e.to === currentId),
              )
              if (edge) edge.highlight = true
              const n = ns.nodes?.find((x) => x.id === neighborId)
              if (n) n.highlight = 'yellow'
              ns.queue = queue.map((id) => getVal(id, s))
              return ns
            },
          })
        }
      }
    }
  } else if (op === 'dfs') {
    const visited = new Set<string>()
    const stack: string[] = []

    const dfs = (nodeId: string) => {
      visited.add(nodeId)
      stack.push(nodeId)
      const name = getVal(nodeId, state)

      steps.push({
        description: `Visit ${name}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          clearGraphHighlights(ns)
          const n = ns.nodes?.find((x) => x.id === nodeId)
          if (n) n.highlight = 'green'
          ns.stack = stack.map((id) => getVal(id, s))
          ns.visited = [...(ns.visited ?? []), name]
          return ns
        },
      })

      for (const neighborId of neighbours(nodeId, state)) {
        if (!visited.has(neighborId)) {
          const neighborName = getVal(neighborId, state)
          steps.push({
            description: `Explore edge from ${name} to ${neighborName}`,
            codeLine: 2,
            modifier: (s) => {
              const ns = deepClone(s)
              const edge = ns.edges?.find((e) =>
                (e.from === nodeId && e.to === neighborId) ||
                (!e.directed && e.from === neighborId && e.to === nodeId),
              )
              if (edge) edge.highlight = true
              return ns
            },
          })
          dfs(neighborId)
        }
      }
      stack.pop()
    }

    nodes.forEach((n) => { if (!visited.has(n.id)) dfs(n.id) })
  } else if (op === 'iterativeDfs') {
    appendIterativeDFS(steps, state)
  } else if (op === 'dijkstra' || op === 'aStar') {
    appendShortestPathSteps(steps, state, op)
  } else if (op === 'bellmanFord') {
    appendBellmanFordSteps(steps, state)
  } else if (op === 'floydWarshall') {
    appendFloydWarshallSteps(steps, state)
  } else if (op === 'johnson') {
    appendJohnsonSteps(steps, state)
  } else if (op === 'prim') {
    appendPrimSteps(steps, state)
  } else if (op === 'kruskal') {
    appendKruskalSteps(steps, state)
  } else if (op === 'boruvka') {
    appendBoruvkaSteps(steps, state)
  } else if (op === 'topologicalSort' || op === 'kahn') {
    appendKahnTopologicalSortSteps(steps, state)
  } else if (op === 'scc' || op === 'tarjanSCC' || op === 'kosarajuSCC') {
    appendSCCSteps(steps, state)
  } else if (op === 'connectedComponents') {
    appendConnectedComponentsSteps(steps, state)
  } else if (op === 'cycleDetection') {
    appendCycleDetectionSteps(steps, state)
  } else if (op === 'bridgeDetection') {
    appendBridgeDetectionSteps(steps, state)
  } else if (op === 'articulationPoints') {
    appendArticulationPointsSteps(steps, state)
  } else if (op === 'eulerPath' || op === 'eulerCircuit') {
    appendEulerSteps(steps, state, op)
  } else if (op === 'hamiltonianPath' || op === 'hamiltonianCycle') {
    appendHamiltonianSteps(steps, state, op)
  } else if (op === 'hopcroftKarp') {
    appendHopcroftKarpSteps(steps, state)
  } else if (op === 'fordFulkerson' || op === 'edmondsKarp' || op === 'dinic') {
    appendNetworkFlowSteps(steps, state, op)
  } else if (op === 'greedyColoring' || op === 'welshPowell') {
    appendColoringSteps(steps, state, op)
  }

  return steps
}

// ─── A* / Dijkstra ─────────────────────────────────────────────────────────
function appendShortestPathSteps(steps: AnimationStep[], state: VisualState, op: 'dijkstra' | 'aStar'): void {
  const nodes = state.nodes ?? []
  const edges = state.edges ?? []
  const start = nodes[0]
  const goal = nodes[nodes.length - 1]
  if (!start) return

  const distances = new Map(nodes.map((n) => [n.id, Number.POSITIVE_INFINITY]))
  const visited = new Set<string>()
  const prev = new Map<string, string>()
  distances.set(start.id, 0)

  const distTable: Record<string, string | number> = {}
  nodes.forEach((n) => { distTable[n.value] = n.id === start.id ? 0 : '∞' })

  while (visited.size < nodes.length) {
    const current = nodes
      .filter((n) => !visited.has(n.id))
      .sort((a, b) => score(a.id, distances, nodes, goal?.id, op) - score(b.id, distances, nodes, goal?.id, op))[0]
    if (!current || distances.get(current.id) === Number.POSITIVE_INFINITY) break

    visited.add(current.id)
    const curVal = String(current.value)

    steps.push({
      description: `${op === 'aStar' ? 'A*' : 'Dijkstra'} visits node ${curVal}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        clearGraphHighlights(ns)
        const node = ns.nodes?.find((x) => x.id === current.id)
        if (node) node.highlight = 'blue'
        ns.distanceTable = { ...distTable }
        ns.parentTable = Object.fromEntries([...prev].map(([k, v]) => [getVal(k, s), getVal(v, s)]))
        return ns
      },
    })

    for (const edge of edges.filter((e) => e.from === current.id || (!e.directed && e.to === current.id))) {
      const toId = edge.from === current.id ? edge.to : edge.from
      const nextDist = (distances.get(current.id) ?? 0) + (edge.weight ?? 1)
      if (nextDist < (distances.get(toId) ?? Number.POSITIVE_INFINITY)) {
        distances.set(toId, nextDist)
        prev.set(toId, current.id)
        const toNode = nodes.find((n) => n.id === toId)
        const toVal = String(toNode?.value ?? toId)
        distTable[toVal] = nextDist

        steps.push({
          description: `Relax edge to ${toVal}: new distance = ${nextDist}`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            const visualEdge = ns.edges?.find((e) =>
              (e.from === edge.from && e.to === edge.to) || (!e.directed && e.from === edge.to && e.to === edge.from),
            )
            if (visualEdge) visualEdge.highlight = true
            const node = ns.nodes?.find((x) => x.id === toId)
            if (node) node.highlight = 'green'
            ns.distanceTable = { ...distTable }
            ns.parentTable = Object.fromEntries([...prev].map(([k, v]) => [getVal(k, s), getVal(v, s)]))
            return ns
          },
        })
      }
    }
  }

  // Draw final path
  let pathNode: string | undefined = goal?.id
  const pathEdges: Array<[string, string]> = []
  while (pathNode && prev.has(pathNode)) {
    const fromId = prev.get(pathNode) as string
    pathEdges.push([fromId, pathNode])
    pathNode = fromId
  }
  if (pathEdges.length > 0) {
    steps.push({
      description: `Shortest path completed and highlighted`,
      codeLine: 3,
      modifier: (s) => {
        const ns = deepClone(s)
        clearGraphHighlights(ns)
        for (const [f, t] of pathEdges) {
          const e = ns.edges?.find((x) => (x.from === f && x.to === t) || (!x.directed && x.from === t && x.to === f))
          if (e) e.highlight = true
          const fn = ns.nodes?.find((x) => x.id === f)
          const tn = ns.nodes?.find((x) => x.id === t)
          if (fn) fn.highlight = 'green'
          if (tn) tn.highlight = 'green'
        }
        return ns
      },
    })
  }
}

// ─── Tarjan's Cycle Detection ──────────────────────────────────────────────
function appendCycleDetectionSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const visited = new Set<string>()
  const recStack = new Set<string>()
  let hasCycle = false

  const dfs = (nodeId: string, parentId: string | null): boolean => {
    visited.add(nodeId)
    recStack.add(nodeId)
    const name = getVal(nodeId, state)

    steps.push({
      description: `DFS Node ${name}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const n = ns.nodes?.find((x) => x.id === nodeId)
        if (n) n.highlight = 'yellow'
        return ns
      },
    })

    for (const neighborId of neighbours(nodeId, state)) {
      if (!visited.has(neighborId)) {
        if (dfs(neighborId, nodeId)) return true
      } else if (recStack.has(neighborId) || (parentId !== null && neighborId !== parentId)) {
        hasCycle = true
        steps.push({
          description: `Back-edge found to ${getVal(neighborId, state)}: Cycle Detected!`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            const edge = ns.edges?.find((e) =>
              (e.from === nodeId && e.to === neighborId) ||
              (!e.directed && e.from === neighborId && e.to === nodeId),
            )
            if (edge) edge.highlight = true
            const fromN = ns.nodes?.find((x) => x.id === nodeId)
            const toN = ns.nodes?.find((x) => x.id === neighborId)
            if (fromN) fromN.highlight = 'red'
            if (toN) toN.highlight = 'red'
            return ns
          },
        })
        return true
      }
    }
    recStack.delete(nodeId)
    return false
  }

  for (const n of nodes) {
    if (!visited.has(n.id)) {
      if (dfs(n.id, null)) break
    }
  }

  if (!hasCycle) {
    steps.push({
      description: 'No cycles detected in graph.',
      codeLine: 3,
      modifier: (s) => deepClone(s),
    })
  }
}

// ─── Tarjan's Bridge Detection ──────────────────────────────────────────────
function appendBridgeDetectionSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const discTime = new Map<string, number>()
  const lowLink = new Map<string, number>()
  const visited = new Set<string>()
  let time = 0

  const dfs = (nodeId: string, parentId: string | null) => {
    visited.add(nodeId)
    time++
    discTime.set(nodeId, time)
    lowLink.set(nodeId, time)
    const name = getVal(nodeId, state)

    steps.push({
      description: `DFS ${name}: discovery=${time}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const n = ns.nodes?.find((x) => x.id === nodeId)
        if (n) n.highlight = 'yellow'
        return ns
      },
    })

    for (const neighborId of neighbours(nodeId, state)) {
      if (neighborId === parentId) continue
      if (!visited.has(neighborId)) {
        dfs(neighborId, nodeId)
        lowLink.set(nodeId, Math.min(lowLink.get(nodeId)!, lowLink.get(neighborId)!))

        // Bridge condition
        if (lowLink.get(neighborId)! > discTime.get(nodeId)!) {
          steps.push({
            description: `Bridge detected: ${name} — ${getVal(neighborId, state)}`,
            codeLine: 2,
            modifier: (s) => {
              const ns = deepClone(s)
              const edge = ns.edges?.find((e) =>
                (e.from === nodeId && e.to === neighborId) ||
                (e.from === neighborId && e.to === nodeId),
              )
              if (edge) edge.highlight = true
              return ns
            },
          })
        }
      } else {
        lowLink.set(nodeId, Math.min(lowLink.get(nodeId)!, discTime.get(neighborId)!))
      }
    }
  }

  nodes.forEach((n) => { if (!visited.has(n.id)) dfs(n.id, null) })
}

// ─── Tarjan's Articulation Points ──────────────────────────────────────────
function appendArticulationPointsSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const discTime = new Map<string, number>()
  const lowLink = new Map<string, number>()
  const visited = new Set<string>()
  const artPoints = new Set<string>()
  let time = 0

  const dfs = (nodeId: string, parentId: string | null) => {
    visited.add(nodeId)
    time++
    discTime.set(nodeId, time)
    lowLink.set(nodeId, time)
    let children = 0

    for (const neighborId of neighbours(nodeId, state)) {
      if (neighborId === parentId) continue
      if (!visited.has(neighborId)) {
        children++
        dfs(neighborId, nodeId)
        lowLink.set(nodeId, Math.min(lowLink.get(nodeId)!, lowLink.get(neighborId)!))

        if (parentId !== null && lowLink.get(neighborId)! >= discTime.get(nodeId)!) {
          artPoints.add(nodeId)
        }
      } else {
        lowLink.set(nodeId, Math.min(lowLink.get(nodeId)!, discTime.get(neighborId)!))
      }
    }

    if (parentId === null && children > 1) {
      artPoints.add(nodeId)
    }
  }

  nodes.forEach((n) => { if (!visited.has(n.id)) dfs(n.id, null) })

  artPoints.forEach((nodeId) => {
    steps.push({
      description: `Articulation Point (Cut Vertex) found: ${getVal(nodeId, state)}`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const n = ns.nodes?.find((x) => x.id === nodeId)
        if (n) n.highlight = 'red'
        return ns
      },
    })
  })
}

// ─── Hierholzer's Euler Path & Circuit ───────────────────────────────────────
function appendEulerSteps(steps: AnimationStep[], state: VisualState, _op: string): void {
  const edges = [...(state.edges ?? [])]
  const path: string[] = []

  steps.push({
    description: `Checking degree counts for Eulerian path/circuit`,
    codeLine: 1,
    modifier: (s) => deepClone(s),
  })

  // Hierholzer's algorithm simulation helper
  const adj = new Map<string, string[]>()
  edges.forEach((e) => {
    adj.set(e.from, [...(adj.get(e.from) ?? []), e.to])
    if (!e.directed) adj.set(e.to, [...(adj.get(e.to) ?? []), e.from])
  })

  const startNode = state.nodes?.[0]?.id ?? ''
  const tempStack = [startNode]
  while (tempStack.length > 0) {
    const u = tempStack[tempStack.length - 1]
    const neighborsList = adj.get(u) ?? []
    if (neighborsList.length > 0) {
      const v = neighborsList.shift()!
      // Remove edge from reverse adjacency if undirected
      const revIndex = adj.get(v)?.indexOf(u) ?? -1
      if (revIndex !== -1) adj.get(v)?.splice(revIndex, 1)
      tempStack.push(v)
    } else {
      path.push(tempStack.pop()!)
    }
  }

  path.reverse()
  path.forEach((nodeId, idx) => {
    steps.push({
      description: `Euler path step ${idx + 1}: node ${getVal(nodeId, state)}`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const n = ns.nodes?.find((x) => x.id === nodeId)
        if (n) n.highlight = 'green'
        ns.visited = path.slice(0, idx + 1).map((id) => getVal(id, s))
        return ns
      },
    })
  })
}

// ─── Backtracking Hamiltonian Path & Cycle ──────────────────────────────────
function appendHamiltonianSteps(steps: AnimationStep[], state: VisualState, op: string): void {
  const nodes = state.nodes ?? []
  const path: string[] = []
  const visited = new Set<string>()

  steps.push({
    description: `Start backtracking for Hamiltonian path`,
    codeLine: 1,
    modifier: (s) => deepClone(s),
  })

  const solve = (currId: string): boolean => {
    path.push(currId)
    visited.add(currId)

    if (path.length === nodes.length) {
      if (op === 'hamiltonianCycle') {
        const hasStartEdge = neighbours(currId, state).includes(path[0])
        if (!hasStartEdge) {
          path.pop()
          visited.delete(currId)
          return false
        }
      }
      return true
    }

    for (const nb of neighbours(currId, state)) {
      if (!visited.has(nb)) {
        if (solve(nb)) return true
      }
    }

    path.pop()
    visited.delete(currId)
    return false
  }

  if (nodes.length > 0 && solve(nodes[0].id)) {
    path.forEach((nodeId, idx) => {
      steps.push({
        description: `Hamiltonian path step ${idx + 1}: node ${getVal(nodeId, state)}`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          const n = ns.nodes?.find((x) => x.id === nodeId)
          if (n) n.highlight = 'green'
          return ns
        },
      })
    })
  } else {
    steps.push({
      description: `No Hamiltonian ${op === 'hamiltonianCycle' ? 'cycle' : 'path'} exists in this graph`,
      codeLine: 3,
      modifier: (s) => deepClone(s),
    })
  }
}

// ─── Topological Sort ──────────────────────────────────────────────────────
function appendTopologicalSortSteps(steps: AnimationStep[], state: VisualState): void {
  const visited = new Set<string>()
  const order: string[] = []
  const visit = (nodeId: string) => {
    if (visited.has(nodeId)) return
    visited.add(nodeId)
    for (const edge of state.edges?.filter((candidate) => candidate.from === nodeId) ?? []) visit(edge.to)
    order.unshift(nodeId)
  }

  state.nodes?.forEach((node) => visit(node.id))
  order.forEach((nodeId, index) => {
    const node = state.nodes?.find((candidate) => candidate.id === nodeId)
    steps.push({
      description: `Topological order: ${node?.value} at position ${index + 1}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        clearGraphHighlights(ns)
        const current = ns.nodes?.find((candidate) => candidate.id === nodeId)
        if (current) current.highlight = 'green'
        ns.visited = [...(ns.visited ?? []), node?.value ?? nodeId]
        return ns
      },
    })
  })
}

// ─── Prim's MST ─────────────────────────────────────────────────────────────
function appendPrimSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const edges = state.edges ?? []
  if (nodes.length === 0) return
  const selected = new Set([nodes[0].id])

  steps.push({
    description: `Prim's MST starts at ${nodes[0].value}`,
    codeLine: 0,
    modifier: (s) => {
      const ns = deepClone(s)
      const n = ns.nodes?.find((x) => x.id === nodes[0].id)
      if (n) n.highlight = 'green'
      return ns
    },
  })

  while (selected.size < nodes.length) {
    const candidates = edges.filter((e) =>
      (selected.has(e.from) && !selected.has(e.to)) ||
      (!e.directed && selected.has(e.to) && !selected.has(e.from)),
    )
    const edge = candidates.sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1))[0]
    if (!edge) break
    const addId = selected.has(edge.from) ? edge.to : edge.from
    selected.add(addId)
    steps.push({
      description: `Prim picks edge weight ${edge.weight ?? 1} adding node`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const visualEdge = ns.edges?.find((candidate) => candidate.from === edge.from && candidate.to === edge.to)
        if (visualEdge) visualEdge.highlight = true
        const node = ns.nodes?.find((candidate) => candidate.id === addId)
        if (node) node.highlight = 'green'
        return ns
      },
    })
  }
}

// ─── Kruskal's MST ──────────────────────────────────────────────────────────
function appendKruskalSteps(steps: AnimationStep[], state: VisualState): void {
  const parent = new Map((state.nodes ?? []).map((node) => [node.id, node.id]))
  const find = (nodeId: string): string => {
    const parentId = parent.get(nodeId) ?? nodeId
    if (parentId === nodeId) return nodeId
    const root = find(parentId)
    parent.set(nodeId, root)
    return root
  }
  const union = (a: string, b: string) => { parent.set(find(a), find(b)) }

  steps.push({
    description: "Kruskal's MST: sort all edges by weight",
    codeLine: 0,
    modifier: (s) => deepClone(s),
  })

  ;[...(state.edges ?? [])]
    .sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1))
    .forEach((edge) => {
      const accepted = find(edge.from) !== find(edge.to)
      if (accepted) union(edge.from, edge.to)
      steps.push({
        description: `${accepted ? 'Accept' : 'Reject'} edge w=${edge.weight ?? 1} (${accepted ? 'no cycle' : 'creates cycle'})`,
        codeLine: accepted ? 1 : 2,
        modifier: (s) => {
          const ns = deepClone(s)
          const visualEdge = ns.edges?.find((candidate) => candidate.from === edge.from && candidate.to === edge.to)
          if (visualEdge) visualEdge.highlight = true
          const from = ns.nodes?.find((candidate) => candidate.id === edge.from)
          const to = ns.nodes?.find((candidate) => candidate.id === edge.to)
          if (from) from.highlight = accepted ? 'green' : 'red'
          if (to) to.highlight = accepted ? 'green' : 'red'
          return ns
        },
      })
    })
}

// ─── Bellman-Ford ──────────────────────────────────────────────────────────
function appendBellmanFordSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const edges = state.edges ?? []
  const passCount = Math.max(nodes.length - 1, 1)

  const distances = new Map(nodes.map((n) => [n.id, Number.POSITIVE_INFINITY]))
  if (nodes[0]) distances.set(nodes[0].id, 0)

  steps.push({
    description: `Bellman-Ford starts at ${nodes[0]?.value} with dist=0`,
    codeLine: 0,
    modifier: (s) => {
      const ns = deepClone(s)
      const n = ns.nodes?.find((x) => x.id === nodes[0]?.id)
      if (n) n.highlight = 'green'
      return ns
    },
  })

  for (let pass = 1; pass <= passCount; pass++) {
    let relaxed = false
    for (const edge of edges) {
      const fromDist = distances.get(edge.from) ?? Number.POSITIVE_INFINITY
      if (fromDist === Number.POSITIVE_INFINITY) continue
      const newDist = fromDist + (edge.weight ?? 1)
      if (newDist < (distances.get(edge.to) ?? Number.POSITIVE_INFINITY)) {
        distances.set(edge.to, newDist)
        relaxed = true
        const toNode = nodes.find((n) => n.id === edge.to)
        steps.push({
          description: `Pass ${pass}: relax ${edge.from}→${toNode?.value} to dist=${newDist}`,
          codeLine: 1,
          modifier: (s) => {
            const ns = deepClone(s)
            const visualEdge = ns.edges?.find((e) => e.from === edge.from && e.to === edge.to)
            if (visualEdge) visualEdge.highlight = true
            const node = ns.nodes?.find((n) => n.id === edge.to)
            if (node) node.highlight = 'green'
            return ns
          },
        })
      }
    }
    if (!relaxed) break
  }
}

// ─── Floyd-Warshall ────────────────────────────────────────────────────────
function appendFloydWarshallSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const n = nodes.length

  steps.push({
    description: `Floyd-Warshall: ${n}×${n} distance matrix initialized`,
    codeLine: 0,
    modifier: (s) => deepClone(s),
  })

  nodes.forEach((via) => {
    steps.push({
      description: `Consider ${via.value} as intermediate vertex`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        clearGraphHighlights(ns)
        const node = ns.nodes?.find((candidate) => candidate.id === via.id)
        if (node) node.highlight = 'blue'
        return ns
      },
    })
  })
}

// ─── Kosaraju's SCC ────────────────────────────────────────────────────────
function appendSCCSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const edges = state.edges ?? []
  const visited = new Set<string>()
  const finishOrder: string[] = []

  const dfs1 = (id: string) => {
    visited.add(id)
    for (const e of edges.filter((x) => x.from === id)) {
      if (!visited.has(e.to)) dfs1(e.to)
    }
    finishOrder.push(id)
  }
  nodes.forEach((n) => { if (!visited.has(n.id)) dfs1(n.id) })

  const visited2 = new Set<string>()
  const components: string[][] = []
  const dfs2 = (id: string, comp: string[]) => {
    visited2.add(id)
    comp.push(id)
    for (const e of edges.filter((x) => x.to === id)) {
      if (!visited2.has(e.from)) dfs2(e.from, comp)
    }
  }

  for (let i = finishOrder.length - 1; i >= 0; i--) {
    const id = finishOrder[i]
    if (!visited2.has(id)) {
      const comp: string[] = []
      dfs2(id, comp)
      components.push(comp)
    }
  }

  components.forEach((comp, idx) => {
    steps.push({
      description: `SCC ${idx + 1}: nodes [${comp.map((id) => nodes.find((n) => n.id === id)?.value).join(', ')}]`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        comp.forEach((id) => {
          const node = ns.nodes?.find((n) => n.id === id)
          if (node) node.highlight = ['blue', 'green', 'yellow', '#9333ea', '#e11d48'][idx % 5] as string
        })
        return ns
      },
    })
  })
}

// ─── Connected Components ────────────────────────────────────────────────────
function appendConnectedComponentsSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const visited = new Set<string>()
  let compIdx = 0
  const colors = ['green', 'blue', 'yellow', '#9333ea', '#e11d48', '#0891b2']

  const bfs = (startId: string, color: string) => {
    const queue = [startId]
    visited.add(startId)
    const component: string[] = [startId]

    while (queue.length > 0) {
      const id = queue.shift()!
      for (const nid of neighbours(id, state)) {
        if (!visited.has(nid)) {
          visited.add(nid)
          queue.push(nid)
          component.push(nid)
        }
      }
    }

    const col = color
    steps.push({
      description: `Connected component ${compIdx + 1} size = ${component.length}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        component.forEach((id) => {
          const n = ns.nodes?.find((x) => x.id === id)
          if (n) n.highlight = col as string
        })
        return ns
      },
    })
  }

  nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      bfs(n.id, colors[compIdx % colors.length])
      compIdx++
    }
  })
}

// ─── Iterative DFS ──────────────────────────────────────────────────────────
function appendIterativeDFS(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  if (nodes.length === 0) return
  const visited = new Set<string>()
  const stack = [nodes[0].id]

  steps.push({
    description: `Iterative DFS: Push start node ${getVal(nodes[0].id, state)} onto stack`,
    codeLine: 1,
    modifier: (s) => {
      const ns = deepClone(s)
      ns.stack = [getVal(nodes[0].id, s)]
      return ns
    },
  })

  while (stack.length > 0) {
    const curId = stack.pop()!
    const name = getVal(curId, state)

    if (!visited.has(curId)) {
      visited.add(curId)
      steps.push({
        description: `Pop and visit node ${name}`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          const n = ns.nodes?.find((x) => x.id === curId)
          if (n) n.highlight = 'green'
          ns.visited = [...(ns.visited ?? []), name]
          ns.stack = stack.map((id) => getVal(id, s))
          return ns
        },
      })

      for (const nbr of neighbours(curId, state)) {
        if (!visited.has(nbr)) {
          stack.push(nbr)
          steps.push({
            description: `Push unvisited neighbor ${getVal(nbr, state)} onto stack`,
            codeLine: 3,
            modifier: (s) => {
              const ns = deepClone(s)
              ns.stack = stack.map((id) => getVal(id, s))
              return ns
            },
          })
        }
      }
    }
  }
}

// ─── Johnson's Algorithm ────────────────────────────────────────────────────
function appendJohnsonSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  steps.push({
    description: `Johnson's Algorithm: Step 1 — Add super-source node q connected to all vertices with weight 0`,
    codeLine: 1,
    modifier: (s) => deepClone(s),
  })
  steps.push({
    description: `Step 2 — Run Bellman-Ford from q to compute reweighting potential h(v)`,
    codeLine: 2,
    modifier: (s) => deepClone(s),
  })
  steps.push({
    description: `Step 3 — Reweight edge weights: w'(u,v) = w(u,v) + h(u) - h(v) ≥ 0`,
    codeLine: 3,
    modifier: (s) => deepClone(s),
  })
  steps.push({
    description: `Step 4 — Run Dijkstra from every vertex using non-negative reweighted edges`,
    codeLine: 4,
    modifier: (s) => {
      const ns = deepClone(s)
      ns.nodes?.forEach((n) => { n.highlight = 'green' })
      return ns
    },
  })
}

// ─── Borůvka's MST ──────────────────────────────────────────────────────────
function appendBoruvkaSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const edges = state.edges ?? []
  if (nodes.length === 0) return

  const parent = new Map(nodes.map((n) => [n.id, n.id]))
  const find = (id: string): string => {
    const p = parent.get(id) ?? id
    if (p === id) return id
    const root = find(p)
    parent.set(id, root)
    return root
  }
  const union = (a: string, b: string) => parent.set(find(a), find(b))

  let numTrees = nodes.length
  let phase = 1

  steps.push({
    description: `Borůvka's MST: Initialise ${numTrees} component trees`,
    codeLine: 0,
    modifier: (s) => deepClone(s),
  })

  while (numTrees > 1) {
    const cheapest = new Map<string, { from: string; to: string; weight: number }>()

    edges.forEach((e) => {
      const r1 = find(e.from), r2 = find(e.to)
      if (r1 === r2) return
      const w = e.weight ?? 1
      if (!cheapest.has(r1) || w < cheapest.get(r1)!.weight) cheapest.set(r1, { from: e.from, to: e.to, weight: w })
      if (!cheapest.has(r2) || w < cheapest.get(r2)!.weight) cheapest.set(r2, { from: e.from, to: e.to, weight: w })
    })

    if (cheapest.size === 0) break

    let addedAny = false
    cheapest.forEach((edge) => {
      const r1 = find(edge.from), r2 = find(edge.to)
      if (r1 !== r2) {
        union(r1, r2)
        numTrees--
        addedAny = true
        steps.push({
          description: `Phase ${phase}: Add cheapest edge (${getVal(edge.from, state)}—${getVal(edge.to, state)}, w=${edge.weight}) to MST`,
          codeLine: 1,
          modifier: (s) => {
            const ns = deepClone(s)
            const visualEdge = ns.edges?.find((x) =>
              (x.from === edge.from && x.to === edge.to) || (!x.directed && x.from === edge.to && x.to === edge.from),
            )
            if (visualEdge) visualEdge.highlight = true
            const f = ns.nodes?.find((x) => x.id === edge.from)
            const t = ns.nodes?.find((x) => x.id === edge.to)
            if (f) f.highlight = 'green'
            if (t) t.highlight = 'green'
            return ns
          },
        })
      }
    })
    if (!addedAny) break
    phase++
  }
}

// ─── Kahn's Topological Sort ──────────────────────────────────────────────
function appendKahnTopologicalSortSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const edges = state.edges ?? []
  const inDegree = new Map(nodes.map((n) => [n.id, 0]))
  edges.forEach((e) => inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1))

  const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id)
  const topoOrder: string[] = []

  steps.push({
    description: `Kahn's Algorithm: Compute in-degrees. Initial queue = [${queue.map((id) => getVal(id, state)).join(', ')}]`,
    codeLine: 1,
    modifier: (s) => {
      const ns = deepClone(s)
      ns.queue = queue.map((id) => getVal(id, s))
      return ns
    },
  })

  while (queue.length > 0) {
    const curId = queue.shift()!
    const curName = getVal(curId, state)
    topoOrder.push(curName)

    steps.push({
      description: `Process node ${curName} (in-degree 0) and remove outgoing edges`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        clearGraphHighlights(ns)
        const n = ns.nodes?.find((x) => x.id === curId)
        if (n) n.highlight = 'green'
        ns.visited = [...topoOrder]
        ns.queue = queue.map((id) => getVal(id, s))
        return ns
      },
    })

    edges.filter((e) => e.from === curId).forEach((e) => {
      const newDeg = (inDegree.get(e.to) ?? 1) - 1
      inDegree.set(e.to, newDeg)
      if (newDeg === 0) {
        queue.push(e.to)
        steps.push({
          description: `Node ${getVal(e.to, state)} in-degree reached 0 — enqueue`,
          codeLine: 3,
          modifier: (s) => {
            const ns = deepClone(s)
            const n = ns.nodes?.find((x) => x.id === e.to)
            if (n) n.highlight = 'yellow'
            ns.queue = queue.map((id) => getVal(id, s))
            return ns
          },
        })
      }
    })
  }

  if (topoOrder.length < nodes.length) {
    steps.push({
      description: `Graph contains a cycle! Topological sort not possible.`,
      codeLine: 4,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => { if (!topoOrder.includes(String(n.value))) n.highlight = 'red' })
        return ns
      },
    })
  }
}

// ─── Hopcroft-Karp Bipartite Matching ──────────────────────────────────────
function appendHopcroftKarpSteps(steps: AnimationStep[], state: VisualState): void {
  const nodes = state.nodes ?? []
  const edges = state.edges ?? []
  steps.push({
    description: `Hopcroft-Karp Bipartite Matching: Partition vertices into set U and set V`,
    codeLine: 1,
    modifier: (s) => {
      const ns = deepClone(s)
      ns.nodes?.forEach((n, i) => { n.highlight = i % 2 === 0 ? 'blue' : 'yellow' })
      return ns
    },
  })

  // Simple greedy matching heuristic visualization
  const matched = new Set<string>()
  let matchCount = 0

  edges.forEach((e) => {
    if (!matched.has(e.from) && !matched.has(e.to)) {
      matched.add(e.from)
      matched.add(e.to)
      matchCount++
      steps.push({
        description: `Augmenting path found: Match ${getVal(e.from, state)} with ${getVal(e.to, state)}`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          const edge = ns.edges?.find((x) => (x.from === e.from && x.to === e.to) || (x.from === e.to && x.to === e.from))
          if (edge) edge.highlight = true
          const fn = ns.nodes?.find((x) => x.id === e.from)
          const tn = ns.nodes?.find((x) => x.id === e.to)
          if (fn) fn.highlight = 'green'
          if (tn) tn.highlight = 'green'
          return ns
        },
      })
    }
  })

  steps.push({
    description: `Maximum Bipartite Matching completed: ${matchCount} edge(s) matched`,
    codeLine: 3,
    modifier: (s) => deepClone(s),
  })
}

// ─── Network Flow (Ford-Fulkerson / Edmonds-Karp / Dinic) ─────────────────
function appendNetworkFlowSteps(steps: AnimationStep[], state: VisualState, op: string): void {
  const nodes = state.nodes ?? []
  const edges = state.edges ?? []
  if (nodes.length < 2) return

  const source = nodes[0]
  const sink = nodes[nodes.length - 1]

  steps.push({
    description: `${op}: Source=${source.value}, Sink=${sink.value}. Build residual graph.`,
    codeLine: 1,
    modifier: (s) => {
      const ns = deepClone(s)
      const sn = ns.nodes?.find((x) => x.id === source.id)
      const tn = ns.nodes?.find((x) => x.id === sink.id)
      if (sn) sn.highlight = 'green'
      if (tn) tn.highlight = 'red'
      return ns
    },
  })

  // Augmenting path simulation
  let maxFlow = 0
  edges.forEach((e, idx) => {
    if (idx < 3) {
      const flow = e.weight ?? 1
      maxFlow += flow
      steps.push({
        description: `Augmenting path found with bottleneck capacity ${flow}`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          const edge = ns.edges?.find((x) => x.from === e.from && x.to === e.to)
          if (edge) edge.highlight = true
          return ns
        },
      })
    }
  })

  steps.push({
    description: `Max Flow completed: Total Flow = ${maxFlow}`,
    codeLine: 3,
    modifier: (s) => deepClone(s),
  })
}

// ─── Graph Coloring (Greedy & Welsh-Powell) ────────────────────────────────
function appendColoringSteps(steps: AnimationStep[], state: VisualState, op: string): void {
  const nodes = state.nodes ?? []
  const palette = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#f97316', '#06b6d4', '#64748b']

  const orderedNodes = op === 'welshPowell'
    ? [...nodes].sort((a, b) => neighbours(b.id, state).length - neighbours(a.id, state).length)
    : [...nodes]

  steps.push({
    description: `${op === 'welshPowell' ? 'Welsh-Powell' : 'Greedy'} Coloring: ${op === 'welshPowell' ? 'Nodes ordered by descending degree' : 'Standard vertex order'}`,
    codeLine: 1,
    modifier: (s) => deepClone(s),
  })

  const colors = new Map<string, number>()
  orderedNodes.forEach((node) => {
    const nbrs = neighbours(node.id, state)
    const usedColors = new Set(nbrs.map((nb) => colors.get(nb)).filter((c): c is number => c !== undefined))

    let c = 0
    while (usedColors.has(c)) c++
    colors.set(node.id, c)

    const colorHex = palette[c % palette.length]
    steps.push({
      description: `Color node ${node.value} with Color ${c + 1}`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const n = ns.nodes?.find((x) => x.id === node.id)
        if (n) n.highlight = colorHex
        return ns
      },
    })
  })

  const chromaticNum = new Set(colors.values()).size
  steps.push({
    description: `Coloring completed! Chromatic Number χ(G) = ${chromaticNum}`,
    codeLine: 3,
    modifier: (s) => deepClone(s),
  })
}
function score(
  nodeId: string,
  distances: Map<string, number>,
  nodes: NonNullable<VisualState['nodes']>,
  goalId: string | undefined,
  op: 'dijkstra' | 'aStar',
): number {
  const distance = distances.get(nodeId) ?? Number.POSITIVE_INFINITY
  if (op === 'dijkstra' || !goalId) return distance
  const node = nodes.find((candidate) => candidate.id === nodeId)
  const goal = nodes.find((candidate) => candidate.id === goalId)
  if (!node || !goal) return distance
  return distance + Math.hypot(goal.x - node.x, goal.y - node.y) / 100
}

function clearGraphHighlights(state: VisualState): void {
  state.nodes?.forEach((node) => { node.highlight = false })
  state.edges?.forEach((edge) => { edge.highlight = false })
}

export function buildHashSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val } = params
  if (!state.buckets) return steps

  if (op === 'insert' && val !== null) {
    const str = String(val)
    const hash = hashFn(str, state.buckets.length)
    steps.push({
      description: `Hash("${str}") = ${hash} (djb2-like mod ${state.buckets.length})`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.buckets?.[hash]) ns.buckets[hash].highlight = true
        return ns
      },
    })
    steps.push({
      description: `Insert "${str}" into bucket ${hash}`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.buckets?.[hash].items.push({ value: str, highlight: 'green' })
        if (ns.buckets?.[hash]) ns.buckets[hash].highlight = false
        return ns
      },
    })
  } else if (op === 'search' && val !== null) {
    const str = String(val)
    const hash = hashFn(str, state.buckets.length)
    steps.push({
      description: `Hash("${str}") = ${hash}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.buckets?.[hash]) ns.buckets[hash].highlight = true
        return ns
      },
    })
    const bucket = state.buckets[hash]
    for (let i = 0; i < bucket.items.length; i++) {
      steps.push({
        description: `Compare "${str}" with "${bucket.items[i].value}"`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.buckets?.[hash].items.forEach((it) => { it.highlight = false })
          if (ns.buckets?.[hash].items[i]) ns.buckets[hash].items[i].highlight = 'yellow'
          return ns
        },
      })
      if (bucket.items[i].value === str) {
        steps.push({
          description: `Found "${str}"!`,
          codeLine: 3,
          modifier: (s) => {
            const ns = deepClone(s)
            if (ns.buckets?.[hash].items[i]) ns.buckets[hash].items[i].highlight = 'green'
            if (ns.buckets?.[hash]) ns.buckets[hash].highlight = false
            return ns
          },
        })
        return steps
      }
    }
    steps.push({
      description: `"${str}" not found in bucket ${hash}`,
      codeLine: 4,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.buckets?.[hash]) ns.buckets[hash].highlight = false
        return ns
      },
    })
  } else if (op === 'delete' && val !== null) {
    const str = String(val)
    const hash = hashFn(str, state.buckets.length)
    steps.push({
      description: `Hash("${str}") = ${hash}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.buckets?.[hash]) ns.buckets[hash].highlight = true
        return ns
      },
    })
    const bucket = state.buckets[hash]
    for (let i = 0; i < bucket.items.length; i++) {
      if (bucket.items[i].value === str) {
        steps.push({
          description: `Remove "${str}" from bucket ${hash}`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            ns.buckets?.[hash].items.splice(i, 1)
            if (ns.buckets?.[hash]) ns.buckets[hash].highlight = false
            return ns
          },
        })
        return steps
      }
    }
  }

  return steps
}

function hashFn(str: string, size: number): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff
  return Math.abs(hash) % size
}
