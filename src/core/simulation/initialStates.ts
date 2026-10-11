import type { VisualEdge, VisualNode, VisualState } from '@/types'
import { layoutTree } from '@/core/rendering/layout'

/** Hard cap for random tree generation — keeps layout + render responsive. */
export const RANDOM_NODE_MAX = 500
export const RANDOM_NODE_DEFAULT = 7
export const RANDOM_VALUE_MIN = 1
export const RANDOM_VALUE_MAX = 999

export interface RandomStateOptions {
  nodeCount?: number
  min?: number
  max?: number
  mode?: 'balanced' | 'complete' | 'sparse' | 'skewed-left' | 'skewed-right' | 'random'
  allowDuplicates?: boolean
  /** Optional seed for reproducible random structures. */
  seed?: number
}

export interface RandomGenerationResult {
  state: VisualState
  elapsedMs: number
  nodeCount: number
}

type Rng = () => number

function createRng(seed?: number): Rng {
  if (seed === undefined) return Math.random
  let state = seed >>> 0 || 1
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x1_0000_0000
  }
}

function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

export function getInitialState(ds: string): VisualState {
  switch (ds) {
    case 'array':
    case 'vector':
      return {
        nodes: [5, 3, 8, 1, 2].map((v, i) => ({
          id: `a${i}`,
          value: v,
          index: i,
          x: 50 + i * 80,
          y: 200,
          highlight: false,
          opacity: 1,
        })),
        edges: [],
        pointers: [],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'linked-list-singly':
      return {
        nodes: [
          { id: 'n0', value: 10, next: 'n1', x: 60, y: 200, highlight: false },
          { id: 'n1', value: 20, next: 'n2', x: 170, y: 200, highlight: false },
          { id: 'n2', value: 30, next: null, x: 280, y: 200, highlight: false },
        ],
        edges: [
          { from: 'n0', to: 'n1' },
          { from: 'n1', to: 'n2' },
        ],
        head: 'n0',
        tail: 'n2',
        pointers: [{ name: 'head', targetId: 'n0' }],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'linked-list-doubly':
      return {
        nodes: [
          { id: 'n0', value: 10, next: 'n1', prev: null, x: 60, y: 200, highlight: false },
          { id: 'n1', value: 20, next: 'n2', prev: 'n0', x: 170, y: 200, highlight: false },
          { id: 'n2', value: 30, next: null, prev: 'n1', x: 280, y: 200, highlight: false },
        ],
        edges: [
          { from: 'n0', to: 'n1' },
          { from: 'n1', to: 'n2' },
          { from: 'n1', to: 'n0', type: 'back' },
          { from: 'n2', to: 'n1', type: 'back' },
        ],
        head: 'n0',
        tail: 'n2',
        pointers: [
          { name: 'head', targetId: 'n0' },
          { name: 'tail', targetId: 'n2' },
        ],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'linked-list-circular':
      return {
        nodes: [
          { id: 'n0', value: 10, next: 'n1', x: 60, y: 200, highlight: false },
          { id: 'n1', value: 20, next: 'n2', x: 170, y: 200, highlight: false },
          { id: 'n2', value: 30, next: 'n0', x: 280, y: 200, highlight: false },
        ],
        edges: [
          { from: 'n0', to: 'n1' },
          { from: 'n1', to: 'n2' },
          { from: 'n2', to: 'n0', type: 'loop' },
        ],
        head: 'n0',
        pointers: [{ name: 'head', targetId: 'n0' }],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'stack':
      return {
        nodes: [
          { id: 's0', value: 10, x: 400, y: 320, highlight: false },
          { id: 's1', value: 20, x: 400, y: 260, highlight: false },
        ],
        edges: [],
        pointers: [{ name: 'top', targetId: 's1' }],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'queue':
    case 'circular-queue':
      return {
        nodes: [
          { id: 'q0', value: 'A', x: 60, y: 200, highlight: false },
          { id: 'q1', value: 'B', x: 140, y: 200, highlight: false },
        ],
        edges: [],
        pointers: [
          { name: 'head', targetId: 'q0' },
          { name: 'tail', targetId: 'q1' },
        ],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'deque':
      return {
        nodes: [
          { id: 'd0', value: 'X', x: 60, y: 200, highlight: false },
          { id: 'd1', value: 'Y', x: 140, y: 200, highlight: false },
        ],
        edges: [],
        pointers: [
          { name: 'front', targetId: 'd0' },
          { name: 'back', targetId: 'd1' },
        ],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'priority-queue':
      return {
        nodes: [
          { id: 'pq0', value: 'Deploy', priority: 1, x: 60, y: 200, highlight: false },
          { id: 'pq1', value: 'Index', priority: 3, x: 170, y: 200, highlight: false },
          { id: 'pq2', value: 'Backup', priority: 5, x: 280, y: 200, highlight: false },
        ],
        edges: [],
        pointers: [
          { name: 'front', targetId: 'pq0' },
          { name: 'rear', targetId: 'pq2' },
        ],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'bst':
    case 'binary-tree':
      return createBinaryTreeState([50, 30, 70, 20, 40], { balanced: false, prefix: 'b' })

    case 'avl':
      return createBinaryTreeState([10, 20, 30, 40, 50, 25], { balanced: true, prefix: 'avl', avl: true })

    case 'red-black-tree':
      return createBinaryTreeState([38, 19, 55, 8, 31, 43, 72], {
        balanced: true,
        prefix: 'rb',
        redBlack: true,
      })


    case 'segment-tree':
      return createSegmentTreeState([2, 1, 5, 3])

    case 'fenwick-tree':
      return createFenwickTreeState([3, 2, -1, 6, 5])

    case 'trie':
      return createTrieState(['to', 'tea', 'ten'])

    case 'min-heap':
    case 'max-heap':
      return createHeapState(ds === 'min-heap' ? [10, 20, 30, 40, 50] : [90, 70, 80, 40, 50], ds)

    case 'directed-graph':
    case 'undirected-graph':
    case 'weighted-graph':
    case 'dag':
      {
        const directed = ds !== 'undirected-graph'
        const weighted = ds === 'weighted-graph' || ds === 'undirected-graph'
        const dag = ds === 'dag'
        const edges: VisualEdge[] = dag
          ? [
              { from: 'g0', to: 'g1', weight: 5, directed, highlight: false },
              { from: 'g0', to: 'g3', weight: 3, directed, highlight: false },
              { from: 'g1', to: 'g2', weight: 2, directed, highlight: false },
              { from: 'g3', to: 'g2', weight: 4, directed, highlight: false },
            ]
          : [
              { from: 'g0', to: 'g1', weight: weighted ? 5 : undefined, directed, highlight: false },
              { from: 'g0', to: 'g3', weight: weighted ? 3 : undefined, directed, highlight: false },
              { from: 'g1', to: 'g2', weight: weighted ? 2 : undefined, directed, highlight: false },
              { from: 'g3', to: 'g2', weight: weighted ? 4 : undefined, directed, highlight: false },
              { from: 'g1', to: 'g3', weight: weighted ? 6 : undefined, directed, highlight: false },
            ]

      return {
        nodes: [
          { id: 'g0', value: 'A', x: 400, y: 80, highlight: false },
          { id: 'g1', value: 'B', x: 600, y: 200, highlight: false },
          { id: 'g2', value: 'C', x: 400, y: 320, highlight: false },
          { id: 'g3', value: 'D', x: 200, y: 200, highlight: false },
        ],
        edges,
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }
      }

    case 'hash-table':
    case 'hash-map':
    case 'hash-set':
      return {
        buckets: [
          { index: 0, items: [], highlight: false },
          { index: 1, items: [], highlight: false },
          { index: 2, items: [{ value: 'apple', highlight: false }], highlight: false },
          { index: 3, items: [], highlight: false },
          {
            index: 4,
            items: [
              { value: 'banana', highlight: false },
              { value: 'cherry', highlight: false },
            ],
            highlight: false,
          },
        ],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }

    case 'skip-list':
      return createBaseState({
        nodes: [
          { id: 'sl0', value: '-∞', index: 0, x: 50, y: 200, highlight: false },
          { id: 'sl1', value: 10, index: 1, x: 160, y: 200, highlight: false },
          { id: 'sl2', value: 25, index: 2, x: 270, y: 200, highlight: false },
          { id: 'sl3', value: 47, index: 3, x: 380, y: 200, highlight: false },
          { id: 'sl4', value: 68, index: 4, x: 490, y: 200, highlight: false },
          { id: 'sl5', value: '+∞', index: 5, x: 600, y: 200, highlight: false },
          { id: 'sl1h', value: 10, index: 1, x: 160, y: 140, highlight: false },
          { id: 'sl3h', value: 47, index: 3, x: 380, y: 140, highlight: false },
          { id: 'sl5h', value: '+∞', index: 5, x: 600, y: 140, highlight: false },
          { id: 'sl0h', value: '-∞', index: 0, x: 50, y: 140, highlight: false },
        ],
        edges: [
          { from: 'sl0', to: 'sl1' }, { from: 'sl1', to: 'sl2' }, { from: 'sl2', to: 'sl3' },
          { from: 'sl3', to: 'sl4' }, { from: 'sl4', to: 'sl5' },
          { from: 'sl0h', to: 'sl1h' }, { from: 'sl1h', to: 'sl3h' }, { from: 'sl3h', to: 'sl5h' },
        ],
        description: 'Skip list with 2 levels. Bottom level: all nodes; upper levels: express lanes.',
      })

    case 'union-find':
      return createBaseState({
        nodes: [
          { id: 'uf0', value: 0, index: 0, x: 80, y: 300, highlight: false },
          { id: 'uf1', value: 1, index: 1, x: 200, y: 300, highlight: false },
          { id: 'uf2', value: 2, index: 2, x: 320, y: 300, highlight: false },
          { id: 'uf3', value: 3, index: 3, x: 440, y: 300, highlight: false },
          { id: 'uf4', value: 4, index: 4, x: 560, y: 300, highlight: false },
          { id: 'uf5', value: 5, index: 5, x: 200, y: 180, highlight: false },
          { id: 'uf6', value: 6, index: 6, x: 440, y: 180, highlight: false },
        ],
        edges: [
          { from: 'uf0', to: 'uf5' }, { from: 'uf1', to: 'uf5' },
          { from: 'uf2', to: 'uf6' }, { from: 'uf3', to: 'uf6' }, { from: 'uf4', to: 'uf6' },
        ],
        description: 'Union-Find (Disjoint Sets): two components rooted at 5 and 6.',
      })

    case 'lru-cache': {
      const lruNodes = [
        { id: 'lru0', value: 'key:A', x: 80, y: 200, highlight: false },
        { id: 'lru1', value: 'key:B', x: 200, y: 200, highlight: false },
        { id: 'lru2', value: 'key:C', x: 320, y: 200, highlight: false },
        { id: 'lru3', value: 'key:D', x: 440, y: 200, highlight: false },
      ]
      return createBaseState({
        nodes: lruNodes,
        edges: [
          { from: 'lru0', to: 'lru1', directed: true },
          { from: 'lru1', to: 'lru2', directed: true },
          { from: 'lru2', to: 'lru3', directed: true },
          { from: 'lru1', to: 'lru0', type: 'back', directed: true },
          { from: 'lru2', to: 'lru1', type: 'back', directed: true },
          { from: 'lru3', to: 'lru2', type: 'back', directed: true },
        ],
        head: 'lru0',
        tail: 'lru3',
        pointers: [
          { name: 'MRU', targetId: 'lru0' },
          { name: 'LRU', targetId: 'lru3' },
        ],
        description: 'LRU Cache (capacity=4). Left=Most Recently Used. Right=Least Recently Used.',
      })
    }

    case 'bloom-filter':
      return createBaseState({
        nodes: Array.from({ length: 12 }, (_, i) => ({
          id: `bf${i}`,
          value: i < 4 ? '1' : '0',
          index: i,
          x: 50 + i * 55,
          y: 200,
          highlight: i < 4,
        })),
        edges: [],
        description: 'Bloom filter (12 bits, 3 hash functions). Bit array: set bits shown highlighted.',
      })

    case 'adjacency-list':
    case 'adjacency-matrix': {
      const adjNodes = [
        { id: 'a0', value: 'A', x: 200, y: 120, highlight: false },
        { id: 'a1', value: 'B', x: 400, y: 80, highlight: false },
        { id: 'a2', value: 'C', x: 560, y: 220, highlight: false },
        { id: 'a3', value: 'D', x: 380, y: 340, highlight: false },
        { id: 'a4', value: 'E', x: 150, y: 280, highlight: false },
      ]
      return createBaseState({
        nodes: adjNodes,
        edges: [
          { from: 'a0', to: 'a1', directed: false },
          { from: 'a1', to: 'a2', directed: false },
          { from: 'a2', to: 'a3', directed: false },
          { from: 'a3', to: 'a4', directed: false },
          { from: 'a4', to: 'a0', directed: false },
          { from: 'a0', to: 'a3', directed: false },
        ],
        description: ds === 'adjacency-matrix' ? 'Graph as adjacency matrix (5×5).' : 'Graph as adjacency list.',
      })
    }

    case 'xor-linked-list':
      return createBaseState({
        nodes: [
          { id: 'xl0', value: 'A', x: 60, y: 200, highlight: false },
          { id: 'xl1', value: 'B', x: 180, y: 200, highlight: false },
          { id: 'xl2', value: 'C', x: 300, y: 200, highlight: false },
          { id: 'xl3', value: 'D', x: 420, y: 200, highlight: false },
        ],
        edges: [
          { from: 'xl0', to: 'xl1' },
          { from: 'xl1', to: 'xl2' },
          { from: 'xl2', to: 'xl3' },
        ],
        head: 'xl0',
        pointers: [{ name: 'head', targetId: 'xl0' }],
        description: 'XOR Linked List: each node stores prev XOR next pointer.',
      })

    case 'treap': {
      const treapValues = [50, 30, 70, 20, 40, 60, 80]
      const priorities = [9, 5, 8, 3, 4, 7, 6]
      const tState = createBinaryTreeState(treapValues, { balanced: true, prefix: 'tp' })
      tState.nodes?.forEach((n, i) => { if (priorities[i] !== undefined) n.priority = priorities[i] })
      tState.description = 'Treap: BST by key, max-heap by priority.'
      return tState
    }

    case 'splay-tree':
      return createBinaryTreeState([10, 20, 30, 40, 50], { balanced: false, prefix: 'sp' })

    case 'gap-buffer':
      return createBaseState({
        nodes: [
          { id: 'gb0', value: 'H', index: 0, x: 50, y: 200, highlight: false },
          { id: 'gb1', value: 'e', index: 1, x: 110, y: 200, highlight: false },
          { id: 'gb2', value: 'l', index: 2, x: 170, y: 200, highlight: false },
          { id: 'gb3', value: '─', index: 3, x: 230, y: 200, highlight: 'yellow' },
          { id: 'gb4', value: '─', index: 4, x: 290, y: 200, highlight: 'yellow' },
          { id: 'gb5', value: '─', index: 5, x: 350, y: 200, highlight: 'yellow' },
          { id: 'gb6', value: 'l', index: 6, x: 410, y: 200, highlight: false },
          { id: 'gb7', value: 'o', index: 7, x: 470, y: 200, highlight: false },
        ],
        edges: [],
        pointers: [{ name: 'cursor', targetId: 'gb3' }],
        description: 'Gap Buffer: text with a movable gap (─) at cursor position for O(1) local edits.',
      })

    case 'rope':
      return createBaseState({
        nodes: [
          { id: 'rp0', value: '"Hello "', left: 'rp1', right: 'rp2', x: 400, y: 70, highlight: false },
          { id: 'rp1', value: 'Hel', left: 'rp3', right: 'rp4', x: 220, y: 170, highlight: false },
          { id: 'rp2', value: 'lo ', x: 580, y: 170, highlight: false },
          { id: 'rp3', value: 'H', x: 130, y: 280, highlight: false },
          { id: 'rp4', value: 'el', x: 310, y: 280, highlight: false },
        ],
        edges: [
          { from: 'rp0', to: 'rp1' }, { from: 'rp0', to: 'rp2' },
          { from: 'rp1', to: 'rp3' }, { from: 'rp1', to: 'rp4' },
        ],
        rootId: 'rp0',
        description: 'Rope: binary tree of string fragments for O(log n) concat/split.',
      })

    case 'suffix-tree':
      return createBaseState({
        nodes: [
          { id: 'sfx0', value: 'root', x: 400, y: 50, highlight: false },
          { id: 'sfx1', value: 'a', x: 160, y: 150, highlight: false },
          { id: 'sfx2', value: 'na', x: 380, y: 150, highlight: false },
          { id: 'sfx3', value: 'banana$', x: 600, y: 150, highlight: false },
          { id: 'sfx4', value: 'na$', x: 100, y: 280, highlight: false },
          { id: 'sfx5', value: 'banana$', x: 220, y: 280, highlight: false },
          { id: 'sfx6', value: 'na$', x: 320, y: 280, highlight: false },
          { id: 'sfx7', value: 'banana$', x: 440, y: 280, highlight: false },
        ],
        edges: [
          { from: 'sfx0', to: 'sfx1' }, { from: 'sfx0', to: 'sfx2' }, { from: 'sfx0', to: 'sfx3' },
          { from: 'sfx1', to: 'sfx4' }, { from: 'sfx1', to: 'sfx5' },
          { from: 'sfx2', to: 'sfx6' }, { from: 'sfx2', to: 'sfx7' },
        ],
        rootId: 'sfx0',
        description: 'Suffix Tree for "banana". Leaf labels are suffix positions.',
      })

    case 'suffix-array':
      return createBaseState({
        nodes: [
          { id: 'sa0', value: '$', index: 6, x: 80, y: 200, highlight: false },
          { id: 'sa1', value: 'a$', index: 5, x: 180, y: 200, highlight: false },
          { id: 'sa2', value: 'ana$', index: 3, x: 280, y: 200, highlight: false },
          { id: 'sa3', value: 'anana$', index: 1, x: 380, y: 200, highlight: false },
          { id: 'sa4', value: 'banana$', index: 0, x: 480, y: 200, highlight: false },
          { id: 'sa5', value: 'na$', index: 4, x: 580, y: 200, highlight: false },
          { id: 'sa6', value: 'nana$', index: 2, x: 680, y: 200, highlight: false },
        ],
        edges: [],
        description: 'Suffix Array for "banana": sorted array of all suffixes with their start indices.',
      })

    default:
      return {
        nodes: [],
        edges: [],
        description: '',
        highlightedCodeLine: -1,
        stepNumber: 0,
        totalSteps: 0,
      }
  }
}

function createBaseState(state: VisualState): VisualState {
  return {
    description: '',
    highlightedCodeLine: -1,
    stepNumber: 0,
    totalSteps: 0,
    ...state,
  }
}

function createBinaryTreeState(
  values: number[],
  options: { balanced?: boolean; prefix?: string; avl?: boolean; redBlack?: boolean } = {},
): VisualState {
  const prefix = options.prefix ?? 'b'
  const nodes: VisualNode[] = []
  let rootId: string | null = null

  const createNode = (value: number, parent: string | null, depth: number): VisualNode => {
    const node: VisualNode = {
      id: `${prefix}${nodes.length}`,
      value,
      left: null,
      right: null,
      parent,
      x: 0,
      y: 0,
      highlight: false,
    }
    if (options.redBlack) node.color = depth % 2 === 0 ? 'black' : 'red'
    nodes.push(node)
    return node
  }

  if (options.balanced) {
    const buildBalanced = (items: number[], parent: string | null, depth: number): string | null => {
      if (items.length === 0) return null
      const mid = Math.floor(items.length / 2)
      const node = createNode(items[mid], parent, depth)
      node.left = buildBalanced(items.slice(0, mid), node.id, depth + 1)
      node.right = buildBalanced(items.slice(mid + 1), node.id, depth + 1)
      return node.id
    }
    rootId = buildBalanced([...values].sort((a, b) => a - b), null, 0)
  } else {
    const byId = new Map<string, VisualNode>()
    for (const value of values) {
      if (!rootId) {
        const node = createNode(value, null, 0)
        rootId = node.id
        byId.set(node.id, node)
        continue
      }

      let current = byId.get(rootId)
      let depth = 0
      while (current) {
        depth++
        const direction = value < Number(current.value) ? 'left' : 'right'
        const childId = current[direction]
        if (!childId) {
          const child = createNode(value, current.id, depth)
          current[direction] = child.id
          byId.set(child.id, child)
          break
        }
        current = byId.get(childId)
      }
    }
  }

  if (rootId) layoutTree(rootId, nodes)
  if (options.avl && rootId) decorateAvlMetrics(rootId, nodes)
  const edges = createTreeEdges(nodes)
  return createBaseState({ nodes, edges, rootId: rootId ?? undefined })
}

function createTreeEdges(nodes: VisualNode[]): VisualEdge[] {
  const edges: VisualEdge[] = []
  nodes.forEach((node) => {
    if (node.left) edges.push({ from: node.id, to: node.left })
    if (node.right) edges.push({ from: node.id, to: node.right })
  })
  return edges
}

function decorateAvlMetrics(rootId: string, nodes: VisualNode[]): number {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const measure = (nodeId: string | null | undefined): number => {
    if (!nodeId) return 0
    const node = byId.get(nodeId)
    if (!node) return 0
    const leftHeight = measure(node.left)
    const rightHeight = measure(node.right)
    node.height = Math.max(leftHeight, rightHeight) + 1
    node.balanceFactor = leftHeight - rightHeight
    return node.height
  }
  return measure(rootId)
}

function createHeapState(values: number[], ds: string): VisualState {
  const nodes = values.map<VisualNode>((value, index) => ({
    id: `h${index}`,
    value,
    left: 2 * index + 1 < values.length ? `h${2 * index + 1}` : null,
    right: 2 * index + 2 < values.length ? `h${2 * index + 2}` : null,
    parent: index > 0 ? `h${Math.floor((index - 1) / 2)}` : null,
    x: 0,
    y: 0,
    highlight: false,
  }))
  if (nodes[0]) layoutTree(nodes[0].id, nodes)
  return createBaseState({
    nodes,
    edges: createTreeEdges(nodes),
    rootId: nodes[0]?.id,
    description: ds === 'min-heap' ? 'Min heap ordered by smallest parent.' : 'Max heap ordered by largest parent.',
  })
}


function createSegmentTreeState(values: number[]): VisualState {
  const nodes: VisualNode[] = []
  const build = (left: number, right: number, id: string): string => {
    const sum = values.slice(left, right + 1).reduce((total, value) => total + value, 0)
    const node: VisualNode = {
      id,
      value: `[${left},${right}] ${sum}`,
      left: null,
      right: null,
      x: 0,
      y: 0,
      highlight: false,
    }
    nodes.push(node)
    if (left !== right) {
      const mid = Math.floor((left + right) / 2)
      node.left = build(left, mid, `${id}L`)
      node.right = build(mid + 1, right, `${id}R`)
    }
    return id
  }
  const rootId = build(0, values.length - 1, 'st0')
  layoutTree(rootId, nodes, 0, [40, 760], 45, 78)
  return createBaseState({ nodes, edges: createTreeEdges(nodes), rootId })
}

function createFenwickTreeState(values: number[]): VisualState {
  const tree = values.map((_, i) => values.slice(i + 1 - ((i + 1) & -(i + 1)), i + 1).reduce((sum, value) => sum + value, 0))
  const nodes = tree.map<VisualNode>((value, index) => ({
    id: `fw${index + 1}`,
    value: `${index + 1}:${value}`,
    index: index + 1,
    x: 80 + index * 120,
    y: 210,
    highlight: false,
  }))
  const edges: VisualEdge[] = nodes.flatMap((node, index) => {
    const next = index + 1 + ((index + 1) & -(index + 1))
    return next <= nodes.length ? [{ from: node.id, to: `fw${next}`, directed: true }] : []
  })

  return createBaseState({ nodes, edges, rootId: nodes[0]?.id })
}

function createTrieState(words: string[]): VisualState {
  const nodes: VisualNode[] = [{ id: 'tr0', value: 'root', x: 400, y: 45, highlight: false }]
  const edges: VisualEdge[] = []
  const childMap = new Map<string, Map<string, string>>()
  childMap.set('tr0', new Map())

  words.forEach((word) => {
    let parentId = 'tr0'
    for (const letter of word) {
      const children = childMap.get(parentId) ?? new Map<string, string>()
      childMap.set(parentId, children)
      let childId = children.get(letter)
      if (!childId) {
        childId = `tr${nodes.length}`
        children.set(letter, childId)
        childMap.set(childId, new Map())
        nodes.push({ id: childId, value: letter, x: 0, y: 0, highlight: false })
        edges.push({ from: parentId, to: childId, directed: true })
      }
      parentId = childId
    }
    const terminal = nodes.find((node) => node.id === parentId)
    if (terminal) terminal.value = `${terminal.value}*`
  })

  layoutTrie(nodes, edges)
  return createBaseState({ nodes, edges, rootId: 'tr0' })
}

function layoutTrie(nodes: VisualNode[], edges: VisualEdge[]): void {
  const childrenByParent = new Map<string, string[]>()
  edges.forEach((edge) => {
    childrenByParent.set(edge.from, [...(childrenByParent.get(edge.from) ?? []), edge.to])
  })

  const levels: string[][] = []
  const visit = (nodeId: string, depth: number) => {
    levels[depth] = [...(levels[depth] ?? []), nodeId]
    childrenByParent.get(nodeId)?.forEach((childId) => visit(childId, depth + 1))
  }
  visit('tr0', 0)

  const byId = new Map(nodes.map((node) => [node.id, node]))
  levels.forEach((ids, depth) => {
    ids.forEach((id, index) => {
      const node = byId.get(id)
      if (!node) return
      node.x = ((index + 1) * 800) / (ids.length + 1)
      node.y = 45 + depth * 72
    })
  })
}

function randomValues(options: RandomStateOptions, rng: Rng = Math.random): number[] {
  const min = options.min ?? RANDOM_VALUE_MIN
  const max = options.max ?? RANDOM_VALUE_MAX
  const poolSize = Math.max(1, max - min + 1)
  const requested = Math.max(1, options.nodeCount ?? RANDOM_NODE_DEFAULT)
  const count = Math.min(requested, RANDOM_NODE_MAX)

  if (!options.allowDuplicates && count <= poolSize) {
    const pool = Array.from({ length: poolSize }, (_, i) => min + i)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool.slice(0, count)
  }

  const values: number[] = []
  for (let i = 0; i < count; i++) values.push(randInt(rng, min, max))

  if (options.mode === 'skewed-left') return [...values].sort((a, b) => b - a)
  if (options.mode === 'skewed-right') return [...values].sort((a, b) => a - b)
  return values
}

function applyRandomMode(values: number[], mode: RandomStateOptions['mode']): number[] {
  if (mode === 'skewed-left') return [...values].sort((a, b) => b - a)
  if (mode === 'skewed-right') return [...values].sort((a, b) => a - b)
  return values
}

export function generateRandomState(ds: string, options: RandomStateOptions = {}): VisualState {
  const rng = createRng(options.seed)
  return buildRandomState(ds, options, rng)
}

/** Yields to the browser between heavy phases so the UI stays responsive. */
export async function generateRandomStateAsync(
  ds: string,
  options: RandomStateOptions = {},
  signal?: AbortSignal,
): Promise<RandomGenerationResult> {
  const start = performance.now()
  if (signal?.aborted) throw new DOMException('Random generation cancelled', 'AbortError')

  await new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve())
    else setTimeout(resolve, 0)
  })

  if (signal?.aborted) throw new DOMException('Random generation cancelled', 'AbortError')

  const rng = createRng(options.seed)
  const state = buildRandomState(ds, options, rng)
  return {
    state,
    elapsedMs: performance.now() - start,
    nodeCount: state.nodes?.length ?? state.buckets?.length ?? 0,
  }
}

function buildRandomState(ds: string, options: RandomStateOptions, rng: Rng): VisualState {
  const state = getInitialState(ds)
  const rawValues = randomValues(options, rng)
  const values = applyRandomMode(rawValues, options.mode)

  if (['binary-tree', 'bst', 'avl', 'red-black-tree', 'treap', 'splay-tree'].includes(ds)) {
    return createBinaryTreeState(values, {
      balanced: options.mode === 'balanced' || options.mode === 'complete' || ds === 'avl' || ds === 'red-black-tree',
      prefix: ds === 'red-black-tree' ? 'rb' : ds === 'avl' ? 'avl' : ds === 'treap' ? 'tp' : ds === 'splay-tree' ? 'sp' : 'b',
      avl: ds === 'avl',
      redBlack: ds === 'red-black-tree',
    })
  }

  if (ds === 'min-heap') {
    return createHeapState([...values].sort((a, b) => a - b), ds)
  }

  if (ds === 'max-heap') {
    return createHeapState([...values].sort((a, b) => b - a), ds)
  }

  if (ds === 'segment-tree') {
    return createSegmentTreeState(values.slice(0, Math.min(values.length, 16)))
  }

  if (ds === 'fenwick-tree') {
    return createFenwickTreeState(values.slice(0, Math.min(values.length, 16)))
  }

  if (ds === 'trie') {
    const words = ['tree', 'trie', 'algo', 'data', 'stack', 'queue', 'graph', 'heap']
      .sort(() => rng() - 0.5)
    return createTrieState(words.slice(0, Math.min(options.nodeCount ?? 3, 6)))
  }

  if (state.nodes) {
    state.nodes.forEach((n) => {
      if (typeof n.value === 'number') n.value = randInt(rng, RANDOM_VALUE_MIN, RANDOM_VALUE_MAX)
      else if (typeof n.value === 'string' && n.value.length === 1)
        n.value = String.fromCharCode(65 + randInt(rng, 0, 25))
    })
  }
  if (state.buckets) {
    const fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry']
    state.buckets.forEach((b) => {
      b.items = []
      if (rng() > 0.5) b.items.push({ value: fruits[randInt(rng, 0, 4)], highlight: false })
    })
  }
  return state
}
