import type { GraphData, GraphEdge } from './types'

export function buildAdjacency(edges: GraphEdge[], directed: boolean): Map<string, string[]> {
  const adj = new Map<string, string[]>()
  const add = (from: string, to: string) => {
    adj.set(from, [...(adj.get(from) ?? []), to])
  }
  for (const edge of edges) {
    add(edge.from, edge.to)
    if (!directed) add(edge.to, edge.from)
  }
  return adj
}

export function edgeKey(from: string, to: string, directed: boolean): string {
  return directed ? `${from}->${to}` : [from, to].sort().join('--')
}

export function hasEdge(edges: GraphEdge[], from: string, to: string, directed: boolean): boolean {
  return edges.some((e) =>
    directed
      ? e.from === from && e.to === to
      : (e.from === from && e.to === to) || (e.from === to && e.to === from),
  )
}

export function addEdgeUnique(
  edges: GraphEdge[],
  edge: GraphEdge,
  directed: boolean,
  allowMulti: boolean,
): boolean {
  if (edge.from === edge.to) return false
  if (!allowMulti && hasEdge(edges, edge.from, edge.to, directed)) return false
  edges.push(edge)
  return true
}

export function isConnected(data: GraphData): boolean {
  if (data.nodes.length === 0) return true
  const directed = data.metadata?.directed ?? false
  const adj = buildAdjacency(data.edges, !directed)
  const visited = new Set<string>()
  const stack = [data.nodes[0]]
  while (stack.length > 0) {
    const id = stack.pop()!
    if (visited.has(id)) continue
    visited.add(id)
    for (const nb of adj.get(id) ?? []) {
      if (!visited.has(nb)) stack.push(nb)
    }
  }
  return visited.size === data.nodes.length
}

export function topologicalOrder(data: GraphData): string[] | null {
  const inDeg = new Map(data.nodes.map((id) => [id, 0]))
  for (const e of data.edges) inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1)
  const queue = data.nodes.filter((id) => (inDeg.get(id) ?? 0) === 0)
  const order: string[] = []
  while (queue.length > 0) {
    const id = queue.shift()!
    order.push(id)
    for (const e of data.edges.filter((x) => x.from === id)) {
      inDeg.set(e.to, (inDeg.get(e.to) ?? 1) - 1)
      if (inDeg.get(e.to) === 0) queue.push(e.to)
    }
  }
  return order.length === data.nodes.length ? order : null
}
