import { describe, expect, it } from 'vitest'
import { generateGraph } from '@/core/graph/generators'
import type { GraphModel } from '@/core/graph/types'

describe('Graph Generators Unit Tests', () => {
  const models: GraphModel[] = [
    'erdos-renyi',
    'barabasi-albert',
    'watts-strogatz',
    'random-tree',
    'random-dag',
    'random-grid',
    'random-bipartite',
    'complete',
    'star',
    'ring',
    'wheel',
    'path',
    'petersen',
    'random-sparse',
    'random-dense',
  ]

  it('generates valid non-empty graph structures for all models', () => {
    for (const model of models) {
      const data = generateGraph({ model, vertexCount: 10, weighted: true, seed: 12345 })
      expect(data.nodes.length, `model ${model} should generate nodes`).toBeGreaterThan(0)
      expect(data.edges, `model ${model} should generate edges`).toBeDefined()
    }
  })

  it('generates deterministic graphs when seed is provided', () => {
    const g1 = generateGraph({ model: 'erdos-renyi', vertexCount: 12, seed: 999 })
    const g2 = generateGraph({ model: 'erdos-renyi', vertexCount: 12, seed: 999 })

    expect(g1.nodes).toEqual(g2.nodes)
    expect(g1.edges).toEqual(g2.edges)
  })

  it('generates trees with exactly n-1 edges', () => {
    const n = 15
    const data = generateGraph({ model: 'random-tree', vertexCount: n, seed: 42 })
    expect(data.nodes.length).toBe(n)
    expect(data.edges.length).toBe(n - 1)
  })

  it('generates complete graph with n*(n-1)/2 edges when undirected', () => {
    const n = 6
    const data = generateGraph({ model: 'complete', vertexCount: n, directed: false })
    expect(data.nodes.length).toBe(n)
    expect(data.edges.length).toBe((n * (n - 1)) / 2)
  })
})
