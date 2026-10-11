export type GraphModel =
  | 'erdos-renyi'
  | 'barabasi-albert'
  | 'watts-strogatz'
  | 'random-tree'
  | 'random-dag'
  | 'random-grid'
  | 'random-bipartite'
  | 'complete'
  | 'star'
  | 'ring'
  | 'wheel'
  | 'path'
  | 'grid'
  | 'petersen'
  | 'random-sparse'
  | 'random-dense'

export type GraphTopology =
  | 'undirected'
  | 'directed'
  | 'dag'
  | 'tree'
  | 'bipartite'
  | 'complete'
  | 'mixed'

export interface GraphEdge {
  from: string
  to: string
  weight?: number
  directed?: boolean
}

export interface GraphData {
  nodes: string[]
  edges: GraphEdge[]
  labels?: Record<string, string | number>
  metadata?: {
    model: GraphModel
    directed: boolean
    weighted: boolean
    connected: boolean
    seed?: number
  }
}

export interface GraphGeneratorOptions {
  vertexCount?: number
  edgeCount?: number
  density?: number
  model?: GraphModel
  directed?: boolean
  weighted?: boolean
  connected?: boolean
  allowSelfLoops?: boolean
  allowMultiEdges?: boolean
  allowNegativeWeights?: boolean
  weightMin?: number
  weightMax?: number
  acyclic?: boolean
  bipartite?: boolean
  planar?: boolean
  complete?: boolean
  tree?: boolean
  seed?: number
  /** Barabási-Albert: edges per new vertex */
  preferentialAttachment?: number
  /** Watts-Strogatz: rewiring probability */
  rewireProbability?: number
}

export const GRAPH_VERTEX_MAX = 2000
export const GRAPH_VERTEX_DEFAULT = 12
export const GRAPH_EDGE_MAX = 10_000
