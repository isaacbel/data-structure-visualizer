import type { AnimationStep, VisualState } from '@/types'
import { buildArraySteps, buildLinkedListSteps } from './builders/linearBuilders'
import {
  buildDequeSteps,
  buildHeapSteps,
  buildPriorityQueueSteps,
  buildQueueSteps,
  buildRangeTreeSteps,
  buildStackSteps,
  buildTreeSteps,
  buildTrieSteps,
} from './builders/treeBuilders'
import { buildGraphSteps, buildHashSteps } from './builders/graphHashBuilders'
import { deepClone } from '@/utils/clone'

interface OpParams {
  value: string | number | null
  index: number | null
}

function parseParams(params: { value?: string; index?: string }): OpParams {
  const val =
    params.value !== undefined && params.value !== ''
      ? isNaN(Number(params.value))
        ? params.value
        : parseInt(params.value, 10)
      : null
  const idx = params.index !== undefined && params.index !== '' ? parseInt(params.index, 10) : null
  return { value: val, index: idx }
}

export function buildSteps(
  ds: string,
  op: string,
  params: { value?: string; index?: string },
  state: VisualState,
): AnimationStep[] {
  const parsed = parseParams(params)

  if (ds === 'array' || ds === 'vector') {
    return buildArraySteps(op, parsed, state)
  }
  if (ds.startsWith('linked-list') || ds === 'xor-linked-list' || ds === 'lru-cache') {
    return buildLinkedListSteps(op, parsed, state)
  }
  if (ds === 'stack') {
    return buildStackSteps(op, parsed, state)
  }
  if (ds === 'queue' || ds === 'circular-queue') {
    return buildQueueSteps(op, parsed, state)
  }
  if (ds === 'deque') {
    return buildDequeSteps(op, parsed, state)
  }
  if (ds === 'priority-queue') {
    return buildPriorityQueueSteps(op, parsed, state)
  }
  if (ds === 'min-heap' || ds === 'max-heap') {
    return buildHeapSteps(ds, op, parsed, state)
  }
  if (['bst', 'binary-tree', 'avl', 'red-black-tree', 'treap', 'splay-tree'].includes(ds)) {
    return buildTreeSteps(ds, op, parsed, state)
  }
  if (ds === 'trie') {
    return buildTrieSteps(op, parsed, state)
  }
  if (ds === 'segment-tree' || ds === 'fenwick-tree') {
    return buildRangeTreeSteps(ds, op, parsed, state)
  }
  if (['directed-graph', 'undirected-graph', 'weighted-graph', 'dag', 'adjacency-list', 'adjacency-matrix'].includes(ds)) {
    return buildGraphSteps(op, state)
  }
  if (['hash-table', 'hash-map', 'hash-set'].includes(ds)) {
    return buildHashSteps(op, parsed, state)
  }
  if (ds === 'bloom-filter') {
    return buildBloomFilterSteps(op, parsed, state)
  }
  if (ds === 'union-find') {
    return buildUnionFindSteps(op, parsed, state)
  }
  if (ds === 'skip-list') {
    return buildSkipListSteps(op, parsed, state)
  }
  if (ds === 'gap-buffer') {
    return buildGapBufferSteps(op, parsed, state)
  }
  if (ds === 'rope') {
    return buildRopeSteps(op, parsed, state)
  }
  if (ds === 'suffix-tree' || ds === 'suffix-array') {
    return buildSuffixSteps(ds, op, parsed, state)
  }

  return []
}

// ─── Bloom Filter ──────────────────────────────────────────────────────────
function bfHash1(str: string, size: number): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff
  return hash % size
}

function bfHash2(str: string, size: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff
  return hash % size
}

function bfHash3(str: string, size: number): number {
  let hash = 7
  for (let i = 0; i < str.length; i++) hash = (hash * 101 + str.charCodeAt(i)) & 0x7fffffff
  return hash % size
}

function buildBloomFilterSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const val = params.value === null || params.value === undefined || params.value === '' ? 'key' : String(params.value)
  const size = state.nodes?.length ?? 12

  if (op === 'clear' || op === 'reset') {
    steps.push({
      description: 'Clear Bloom Filter: All bits reset to 0',
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => {
          n.value = '0'
          n.highlight = false
        })
        return ns
      },
    })
    return steps
  }

  const idx1 = bfHash1(val, size)
  const idx2 = bfHash2(val, size)
  const idx3 = bfHash3(val, size)
  const targetIndices = Array.from(new Set([idx1, idx2, idx3]))

  if (op === 'insert') {
    steps.push({
      description: `Insert "${val}": Hash functions compute bit indices [${targetIndices.join(', ')}]`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n, i) => {
          if (targetIndices.includes(i)) n.highlight = 'yellow'
        })
        return ns
      },
    })
    steps.push({
      description: `Set bits at indices [${targetIndices.join(', ')}] to 1`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n, i) => {
          if (targetIndices.includes(i)) {
            n.value = '1'
            n.highlight = 'green'
          }
        })
        return ns
      },
    })
  } else if (op === 'search') {
    steps.push({
      description: `Search "${val}": Hash functions compute bit indices [${targetIndices.join(', ')}]`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n, i) => {
          if (targetIndices.includes(i)) n.highlight = 'yellow'
        })
        return ns
      },
    })

    const allPresent = targetIndices.every((idx) => state.nodes?.[idx]?.value === '1')

    if (allPresent) {
      steps.push({
        description: `Bits at [${targetIndices.join(', ')}] are all 1 -> "${val}" is PROBABLY PRESENT (may be false positive)`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n, i) => {
            if (targetIndices.includes(i)) n.highlight = 'green'
          })
          return ns
        },
      })
    } else {
      const missing = targetIndices.filter((idx) => state.nodes?.[idx]?.value !== '1')
      steps.push({
        description: `Bit(s) at index ${missing.join(', ')} is 0 -> "${val}" is DEFINITELY NOT PRESENT`,
        codeLine: 3,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n, i) => {
            if (missing.includes(i)) n.highlight = 'red'
            else if (targetIndices.includes(i)) n.highlight = 'green'
          })
          return ns
        },
      })
    }
  }

  return steps
}

// ─── Union-Find ────────────────────────────────────────────────────────────
function findRootNode(startId: string, state: VisualState): { rootId: string; path: string[] } {
  let cur = startId
  const path: string[] = [cur]
  const visited = new Set<string>()
  while (!visited.has(cur)) {
    visited.add(cur)
    const parentEdge = state.edges?.find((e) => e.from === cur)
    if (!parentEdge || parentEdge.to === cur) break
    cur = parentEdge.to
    path.push(cur)
  }
  return { rootId: cur, path }
}

function buildUnionFindSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const val = params.value === null || params.value === undefined ? '' : String(params.value).trim()

  if (op === 'find' && val !== '') {
    const targetNode = state.nodes?.find((n) => String(n.value) === val || n.id === val)
    if (!targetNode) return steps

    const { rootId, path } = findRootNode(targetNode.id, state)
    const rootNode = state.nodes?.find((n) => n.id === rootId)
    const rootVal = rootNode ? rootNode.value : rootId

    steps.push({
      description: `Find(${val}): Traverse parent pointers from node ${val}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => {
          if (path.includes(n.id)) n.highlight = 'yellow'
        })
        return ns
      },
    })

    steps.push({
      description: `Find(${val}): Root of component is ${rootVal}`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => {
          if (n.id === rootId) n.highlight = 'green'
          else if (path.includes(n.id)) n.highlight = 'blue'
        })
        return ns
      },
    })
  } else if (op === 'union') {
    const parts = val.split(/[,\s]+/).filter(Boolean)
    let aVal = parts[0]
    let bVal = parts[1]

    if (!aVal && state.nodes && state.nodes.length >= 2) {
      aVal = String(state.nodes[0].value)
      bVal = String(state.nodes[1].value)
    } else if (aVal && !bVal) {
      const otherNode = state.nodes?.find((n) => String(n.value) !== aVal)
      bVal = otherNode ? String(otherNode.value) : '0'
    }

    if (!aVal || !bVal) return steps

    const nodeA = state.nodes?.find((n) => String(n.value) === aVal || n.id === aVal)
    const nodeB = state.nodes?.find((n) => String(n.value) === bVal || n.id === bVal)

    if (!nodeA || !nodeB) return steps

    const { rootId: rootAId, path: pathA } = findRootNode(nodeA.id, state)
    const { rootId: rootBId, path: pathB } = findRootNode(nodeB.id, state)

    const rootA = state.nodes?.find((n) => n.id === rootAId)!
    const rootB = state.nodes?.find((n) => n.id === rootBId)!

    steps.push({
      description: `Union(${aVal}, ${bVal}): Find roots -> root(${nodeA.value})=${rootA.value}, root(${nodeB.value})=${rootB.value}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => {
          if (n.id === rootAId || n.id === rootBId) n.highlight = 'yellow'
          else if (pathA.includes(n.id) || pathB.includes(n.id)) n.highlight = 'blue'
        })
        return ns
      },
    })

    if (rootAId === rootBId) {
      steps.push({
        description: `Nodes ${nodeA.value} and ${nodeB.value} are already in the same set (root: ${rootA.value})`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => {
            if (pathA.includes(n.id) || pathB.includes(n.id)) n.highlight = 'green'
          })
          return ns
        },
      })
    } else {
      steps.push({
        description: `Union(${aVal}, ${bVal}): Attach root ${rootA.value} under root ${rootB.value}`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          if (!ns.edges) ns.edges = []
          ns.edges.push({ from: rootAId, to: rootBId, directed: true, highlight: true })
          
          const deltaX = rootB.x - rootA.x
          const deltaY = (rootB.y + 100) - rootA.y
          ns.nodes?.forEach((n) => {
            const { path: nPath } = findRootNode(n.id, s)
            if (nPath.includes(rootAId)) {
              n.x += deltaX
              n.y += deltaY
            }
          })

          ns.nodes?.forEach((n) => {
            if (n.id === rootAId || n.id === rootBId) n.highlight = 'green'
          })
          return ns
        },
      })
    }
  } else if (op === 'makeSet' && val !== '') {
    const newId = `uf-${Date.now()}`
    steps.push({
      description: `makeSet(${val}): Create new singleton set element ${val}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const count = ns.nodes?.length ?? 0
        if (!ns.nodes) ns.nodes = []
        const newX = 80 + (count % 6) * 120
        const newY = 320 + Math.floor(count / 6) * 100
        ns.nodes.push({ id: newId, value: val, index: count, x: newX, y: newY, highlight: 'green' })
        return ns
      },
    })
  }

  return steps
}

// ─── Skip List ─────────────────────────────────────────────────────────────
function buildSkipListSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const val = params.value

  if ((op === 'search' || op === 'delete') && val !== null) {
    const nodes = state.nodes ?? []
    // Walk the top level first
    const topNodes = nodes.filter((n) => n.y < 180)
    const bottomNodes = nodes.filter((n) => n.y >= 180)

    for (const n of topNodes) {
      const nId = n.id
      steps.push({
        description: `Check express lane node ${n.value}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          const node = ns.nodes?.find((x) => x.id === nId)
          if (node) node.highlight = 'yellow'
          return ns
        },
      })
      if (Number(n.value) >= Number(val)) break
    }

    for (const n of bottomNodes) {
      const nId = n.id
      steps.push({
        description: `Check base level node ${n.value}`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          const node = ns.nodes?.find((x) => x.id === nId)
          if (node) node.highlight = String(n.value) === String(val) ? 'green' : 'yellow'
          return ns
        },
      })
      if (String(n.value) === String(val)) {
        if (op === 'delete') {
          steps.push({
            description: `Delete ${val}: remove from all levels`,
            codeLine: 3,
            modifier: (s) => {
              const ns = deepClone(s)
              ns.nodes = ns.nodes?.filter((x) => String(x.value) !== String(val))
              ns.edges = ns.edges?.filter((e) => {
                const from = ns.nodes?.find((n) => n.id === e.from)
                const to = ns.nodes?.find((n) => n.id === e.to)
                return from && to
              })
              return ns
            },
          })
        }
        break
      }
      if (Number(n.value) > Number(val)) break
    }
  } else if (op === 'insert' && val !== null) {
    const newId = `sl-${Date.now()}`
    steps.push({
      description: `Insert ${val}: find insertion point in base level`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const baseNodes = ns.nodes?.filter((n) => n.y >= 180).sort((a, b) => Number(a.value) - Number(b.value)) ?? []
        const insertAfter = baseNodes.filter((n) => Number(n.value) <= Number(val)).pop()
        const x = insertAfter ? insertAfter.x + 110 : 160
        ns.nodes?.push({ id: newId, value: val, x, y: 200, highlight: 'green' })
        return ns
      },
    })
    steps.push({
      description: `Coin flip: promote to upper levels with 50% probability`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const n = ns.nodes?.find((x) => x.id === newId)
        if (n) n.highlight = 'blue'
        return ns
      },
    })
  }
  return steps
}

// ─── Gap Buffer ─────────────────────────────────────────────────────────────
function buildGapBufferSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const val = params.value

  if (op === 'insert' && val !== null) {
    const str = String(val)
    const gapStart = state.nodes?.find((n) => String(n.value) === '─' || String(n.value) === '_gap_')
    steps.push({
      description: `Insert '${str}' at cursor (gap start)`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const gapNode = ns.nodes?.find((n) => String(n.value) === '─' || String(n.value) === '_gap_')
        if (gapNode) {
          gapNode.value = str
          gapNode.highlight = 'green'
        }
        return ns
      },
    })
    if (gapStart) {
      steps.push({
        description: 'Gap shrinks by one position after insertion',
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => { n.highlight = false })
          return ns
        },
      })
    }
  } else if (op === 'delete') {
    steps.push({
      description: 'Delete character before cursor: gap expands left',
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const gapIdx = ns.nodes?.findIndex((n) => String(n.value) === '─') ?? -1
        if (gapIdx > 0 && ns.nodes) {
          ns.nodes[gapIdx - 1].highlight = 'red'
        }
        return ns
      },
    })
    steps.push({
      description: 'Character removed, gap grows to fill the slot',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const gapIdx = ns.nodes?.findIndex((n) => String(n.value) === '─') ?? -1
        if (gapIdx > 0 && ns.nodes) {
          ns.nodes[gapIdx - 1].value = '─'
          ns.nodes[gapIdx - 1].highlight = 'yellow'
        }
        return ns
      },
    })
  } else if (op === 'moveGap' && val !== null) {
    steps.push({
      description: `Move gap/cursor ${Number(val) > 0 ? 'right' : 'left'} by ${Math.abs(Number(val))} positions`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => {
          if (n.highlight) n.highlight = false
        })
        const gapNode = ns.nodes?.find((n) => String(n.value) === '─')
        if (gapNode) gapNode.highlight = 'blue'
        return ns
      },
    })
  }
  return steps
}

// ─── Rope ───────────────────────────────────────────────────────────────────
function buildRopeSteps(op: string, params: OpParams, _state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []

  if (op === 'split' && params.value !== null) {
    const idx = Number(params.value)
    steps.push({
      description: `Split rope at index ${idx}: traverse to find the split point`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n, i) => { if (i <= 1) n.highlight = 'yellow' })
        return ns
      },
    })
    steps.push({
      description: 'Create two new root nodes for left and right halves',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => { n.highlight = 'green' })
        return ns
      },
    })
  } else if (op === 'concat') {
    steps.push({
      description: 'Concatenate two ropes: create a new root node',
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const newRoot = { id: `rp-${Date.now()}`, value: 'concat', x: 400, y: 20, highlight: 'green' as const }
        ns.nodes?.unshift(newRoot)
        ns.rootId = newRoot.id
        return ns
      },
    })
  } else if (op === 'index' && params.value !== null) {
    const idx = Number(params.value)
    steps.push({
      description: `Index(${idx}): traverse the rope tree to find character`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.[0] && (ns.nodes[0].highlight = 'yellow')
        return ns
      },
    })
    steps.push({
      description: `Found character at index ${idx}`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const leaf = ns.nodes?.filter((n) => !n.left && !n.right).pop()
        if (leaf) leaf.highlight = 'green'
        return ns
      },
    })
  }
  return steps
}

// ─── Suffix Tree / Array ────────────────────────────────────────────────────
function buildSuffixSteps(ds: string, op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const val = params.value === null ? '' : String(params.value)

  if (op === 'build') {
    steps.push({
      description: `Build ${ds === 'suffix-tree' ? 'suffix tree' : 'suffix array'} using Ukkonen/SA-IS algorithm`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => { n.highlight = 'green' })
        return ns
      },
    })
  } else if (op === 'search' && val) {
    const matches = state.nodes?.filter((n) =>
      String(n.value).toLowerCase().includes(val.toLowerCase()),
    ) ?? []
    for (const m of matches) {
      const mId = m.id
      steps.push({
        description: `Pattern "${val}" matches suffix at node ${m.value}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => { n.highlight = false })
          const node = ns.nodes?.find((x) => x.id === mId)
          if (node) node.highlight = 'green'
          return ns
        },
      })
    }
    if (matches.length === 0) {
      steps.push({
        description: `Pattern "${val}" not found`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => { n.highlight = 'red' })
          return ns
        },
      })
    }
  }
  return steps
}
