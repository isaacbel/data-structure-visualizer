import { describe, expect, it } from 'vitest'
import { getVisualizerCapabilities } from '../types/capabilities'
import type { DataStructureConfig } from '../types'

function mockConfig(type: DataStructureConfig['type']): DataStructureConfig {
  return {
    id: 'test',
    name: { en: 'Test Structure', fr: 'Test Structure' },
    type,
    category: 'linear',
    description: { en: 'Test', fr: 'Test' },
    difficulty: 'beginner',
    ops: ['insert', 'delete', 'search'],
    implemented: true,
  }
}

describe('Visualizer Capabilities System', () => {
  it('disables tree controls for linear structures (Array, Stack, Queue, Linked List)', () => {
    const arrayCaps = getVisualizerCapabilities('array', mockConfig('linear'))
    expect(arrayCaps.treeGenerationModes).toBe(false)
    expect(arrayCaps.treeTypeSelector).toBe(false)
    expect(arrayCaps.heapTypeSelector).toBe(false)
    expect(arrayCaps.graphControls).toBe(false)

    const stackCaps = getVisualizerCapabilities('stack', mockConfig('stack'))
    expect(stackCaps.treeGenerationModes).toBe(false)
    expect(stackCaps.treeTypeSelector).toBe(false)

    const queueCaps = getVisualizerCapabilities('queue', mockConfig('queue'))
    expect(queueCaps.treeGenerationModes).toBe(false)
    expect(queueCaps.treeTypeSelector).toBe(false)
  })

  it('disables tree controls for Hash structures and Graphs', () => {
    const hashCaps = getVisualizerCapabilities('hash-table', mockConfig('hash'))
    expect(hashCaps.treeGenerationModes).toBe(false)
    expect(hashCaps.treeTypeSelector).toBe(false)

    const graphCaps = getVisualizerCapabilities('graph', mockConfig('graph'))
    expect(graphCaps.treeGenerationModes).toBe(false)
    expect(graphCaps.graphControls).toBe(true)
    expect(graphCaps.treeTypeSelector).toBe(false)
  })

  it('enables treeGenerationModes ONLY for valid tree visualizers (BST, AVL, Red-Black)', () => {
    const bstCaps = getVisualizerCapabilities('bst', mockConfig('tree'))
    expect(bstCaps.treeGenerationModes).toBe(true)
    expect(bstCaps.treeTypeSelector).toBe(false)

    const avlCaps = getVisualizerCapabilities('avl', mockConfig('tree'))
    expect(avlCaps.treeGenerationModes).toBe(true)
  })

  it('enables treeTypeSelector ONLY for B-Tree / B+ Tree', () => {
    const btreeCaps = getVisualizerCapabilities('b-tree', mockConfig('tree'))
    expect(btreeCaps.treeTypeSelector).toBe(true)

    const arrayCaps = getVisualizerCapabilities('array', mockConfig('linear'))
    expect(arrayCaps.treeTypeSelector).toBe(false)
  })

  it('enables heapTypeSelector ONLY for Heap visualizers', () => {
    const minHeapCaps = getVisualizerCapabilities('min-heap', mockConfig('tree'))
    expect(minHeapCaps.heapTypeSelector).toBe(true)

    const bstCaps = getVisualizerCapabilities('bst', mockConfig('tree'))
    expect(bstCaps.heapTypeSelector).toBe(false)
  })
})
