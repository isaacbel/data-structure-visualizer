import { describe, it, expect } from 'vitest'
import { getInitialState } from '@/core/simulation/initialStates'
import { buildSteps } from '@/core/simulation/buildSteps'

describe('Tree Builders Unit Tests', () => {
  const treeTypes = [
    'binary-tree',
    'bst',
    'avl',
    'red-black-tree',
    'min-heap',
    'max-heap',
    'segment-tree',
    'fenwick-tree',
    'trie',
    'treap',
    'splay-tree',
  ]

  it('initializes valid non-empty initial states for all tree types', () => {
    for (const ds of treeTypes) {
      const state = getInitialState(ds)
      expect(state.nodes, `ds: ${ds} should have nodes`).toBeDefined()
      expect(state.nodes!.length, `ds: ${ds} nodes should be > 0`).toBeGreaterThan(0)
    }
  })

  it('builds insert animation steps for BST', () => {
    const state = getInitialState('bst')
    const steps = buildSteps('bst', 'insert', { value: '25' }, state)
    expect(steps.length).toBeGreaterThan(0)
    
    // Apply all steps to verify no runtime exceptions occur
    let current = state
    for (const step of steps) {
      current = step.modifier(current)
    }
    expect(current.nodes?.some((n) => Number(n.value) === 25)).toBe(true)
  })

  it('builds delete animation steps for BST', () => {
    const state = getInitialState('bst')
    const valToDelete = String(state.nodes![0].value)
    const steps = buildSteps('bst', 'delete', { value: valToDelete }, state)
    expect(steps.length).toBeGreaterThan(0)

    let current = state
    for (const step of steps) {
      current = step.modifier(current)
    }
    expect(current.nodes?.some((n) => String(n.value) === valToDelete)).toBe(false)
  })

  it('builds search animation steps for AVL tree', () => {
    const state = getInitialState('avl')
    const valToSearch = String(state.nodes![0].value)
    const steps = buildSteps('avl', 'search', { value: valToSearch }, state)
    expect(steps.length).toBeGreaterThan(0)
  })

  it('builds traversal animation steps (inorder, preorder, postorder, levelorder)', () => {
    const state = getInitialState('bst')
    for (const op of ['inorder', 'preorder', 'postorder', 'levelorder']) {
      const steps = buildSteps('bst', op, {}, state)
      expect(steps.length, `op ${op} should generate steps`).toBeGreaterThan(0)
      
      let current = state
      for (const step of steps) {
        current = step.modifier(current)
      }
      expect(current.visited?.length).toBe(state.nodes?.length)
    }
  })

  it('builds heapify steps for min-heap and max-heap', () => {
    for (const heap of ['min-heap', 'max-heap']) {
      const state = getInitialState(heap)
      const steps = buildSteps(heap, 'heapify', {}, state)
      expect(steps.length).toBeGreaterThan(0)
    }
  })

  it('builds trie insert, search, and dfs steps', () => {
    const state = getInitialState('trie')
    const insertSteps = buildSteps('trie', 'insert', { value: 'cat' }, state)
    expect(insertSteps.length).toBeGreaterThan(0)

    let current = state
    for (const step of insertSteps) {
      current = step.modifier(current)
    }

    const dfsSteps = buildSteps('trie', 'dfs', {}, current)
    expect(dfsSteps.length).toBeGreaterThan(0)
  })

  it('builds segment tree query & update steps', () => {
    const state = getInitialState('segment-tree')
    const querySteps = buildSteps('segment-tree', 'query', { value: '1,3' }, state)
    expect(querySteps.length).toBeGreaterThan(0)

    const updateSteps = buildSteps('segment-tree', 'update', { index: '2', value: '10' }, state)
    expect(updateSteps.length).toBeGreaterThan(0)
  })

  it('builds fenwick tree query & update steps', () => {
    const state = getInitialState('fenwick-tree')
    const querySteps = buildSteps('fenwick-tree', 'query', { index: '3' }, state)
    expect(querySteps.length).toBeGreaterThan(0)

    const updateSteps = buildSteps('fenwick-tree', 'update', { index: '2', value: '5' }, state)
    expect(updateSteps.length).toBeGreaterThan(0)
  })

  it('handles empty tree insert cleanly without throwing', () => {
    const emptyState = { nodes: [], edges: [], description: '' }
    const steps = buildSteps('bst', 'insert', { value: '42' }, emptyState)
    expect(steps.length).toBeGreaterThan(0)
    const finalState = steps[steps.length - 1].modifier(emptyState)
    expect(finalState.rootId).toBeDefined()
    expect(finalState.nodes?.length).toBe(1)
  })
})
