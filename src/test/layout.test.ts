import { describe, it, expect } from 'vitest'
import { layoutTree, MAX_TREE_LAYOUT_DEPTH } from '@/core/rendering/layout'
import type { VisualNode } from '@/types'
import { generateRandomState } from '@/core/simulation/initialStates'

function makeSkewedTree(n: number): VisualNode[] {
  const nodes: VisualNode[] = []
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: `n${i}`,
      value: i,
      left: i < n - 1 ? `n${i + 1}` : null,
      right: null,
      parent: i > 0 ? `n${i - 1}` : null,
      x: 0,
      y: 0,
      highlight: false,
    })
  }
  return nodes
}

describe('layoutTree', () => {
  it('lays out skewed trees without hanging', () => {
    for (const n of [1, 10, 50, 127, 500]) {
      const nodes = makeSkewedTree(n)
      const start = performance.now()
      layoutTree('n0', nodes)
      expect(performance.now() - start).toBeLessThan(500)
      expect(nodes.every((node) => Number.isFinite(node.x) && Number.isFinite(node.y))).toBe(true)
    }
  })

  it('guards against cyclic parent pointers', () => {
    const nodes: VisualNode[] = [
      { id: 'a', value: 1, left: 'b', right: null, parent: 'b', x: 0, y: 0, highlight: false },
      { id: 'b', value: 2, left: 'a', right: null, parent: 'a', x: 0, y: 0, highlight: false },
    ]
    expect(() => layoutTree('a', nodes)).not.toThrow()
  })

  it('respects max depth guard constant', () => {
    expect(MAX_TREE_LAYOUT_DEPTH).toBeGreaterThan(100)
  })
})

describe('generateRandomState', () => {
  const modes = ['balanced', 'complete', 'sparse', 'skewed-left', 'skewed-right', 'random'] as const
  const treeTypes = ['binary-tree', 'bst', 'avl', 'red-black-tree', 'min-heap', 'max-heap']

  for (const ds of treeTypes) {
    for (const mode of modes) {
      it(`generates ${ds} (${mode}) quickly`, () => {
        const start = performance.now()
        const state = generateRandomState(ds, {
          nodeCount: 127,
          mode,
          min: 1,
          max: 99,
          allowDuplicates: true,
        })
        expect(performance.now() - start).toBeLessThan(1000)
        expect(state.nodes?.length).toBeGreaterThan(0)
      })
    }
  }

  it('produces deterministic output with the same seed', () => {
    const a = generateRandomState('bst', { nodeCount: 20, mode: 'random', seed: 42 })
    const b = generateRandomState('bst', { nodeCount: 20, mode: 'random', seed: 42 })
    expect(a.nodes?.map((n) => n.value)).toEqual(b.nodes?.map((n) => n.value))
  })
})
