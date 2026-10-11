import { BTreeEngine } from './BTreeEngine'
import { BPlusTreeEngine } from './BPlusTreeEngine'
import type { BTreeNode } from './types'

export interface BTreeGeneratorOptions {
  type: 'btree' | 'bplus'
  t?: number
  keyCount: number
  keyMin?: number
  keyMax?: number
  seed?: number
  allowDuplicates?: boolean
  insertionOrder?: 'random' | 'sequential' | 'reverse' | 'nearly-sorted'
}

// Deterministic seeded PRNG (mulberry32)
function createRng(seed: number): () => number {
  let s = seed | 0
  return function () {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff
  }
}

function generateKeys(opts: BTreeGeneratorOptions): number[] {
  const rng = createRng(opts.seed ?? Date.now())
  const min = opts.keyMin ?? 1
  const max = opts.keyMax ?? 200
  const count = opts.keyCount
  const order = opts.insertionOrder ?? 'random'

  const keysSet = new Set<number>()
  while (keysSet.size < count) {
    keysSet.add(Math.floor(rng() * (max - min + 1)) + min)
    if (opts.allowDuplicates && keysSet.size >= count) break
  }

  let keys = Array.from(keysSet)

  switch (order) {
    case 'sequential':
      keys.sort((a, b) => a - b)
      break
    case 'reverse':
      keys.sort((a, b) => b - a)
      break
    case 'nearly-sorted': {
      keys.sort((a, b) => a - b)
      // Swap adjacent pairs occasionally (small perturbation)
      for (let i = 0; i < keys.length - 1; i += 5) {
        const tmp = keys[i]
        keys[i] = keys[i + 1]
        keys[i + 1] = tmp
      }
      break
    }
    case 'random':
    default:
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[keys[i], keys[j]] = [keys[j], keys[i]]
      }
  }

  return keys
}

export function generateBTree(opts: BTreeGeneratorOptions): { engine: BTreeEngine; keysInserted: number[] } {
  const engine = new BTreeEngine({ t: opts.t ?? 2 })
  const keys = generateKeys(opts)
  keys.forEach((k) => engine.insert(k))
  return { engine, keysInserted: keys }
}

export function generateBPlusTree(opts: BTreeGeneratorOptions): { engine: BPlusTreeEngine; keysInserted: number[] } {
  const engine = new BPlusTreeEngine({ t: opts.t ?? 2 })
  const keys = generateKeys(opts)
  keys.forEach((k) => engine.insert(k))
  return { engine, keysInserted: keys }
}

export function getTreeStats(root: BTreeNode<number> | null): {
  height: number
  nodeCount: number
  leafCount: number
  totalKeys: number
} {
  if (!root) return { height: 0, nodeCount: 0, leafCount: 0, totalKeys: 0 }

  let nodeCount = 0, leafCount = 0, totalKeys = 0, maxDepth = 0

  const dfs = (node: BTreeNode<number>, depth: number) => {
    nodeCount++
    totalKeys += node.keys.length
    maxDepth = Math.max(maxDepth, depth)
    if (node.isLeaf) {
      leafCount++
    } else {
      node.children.forEach((c) => dfs(c, depth + 1))
    }
  }
  dfs(root, 1)
  return { height: maxDepth, nodeCount, leafCount, totalKeys }
}
