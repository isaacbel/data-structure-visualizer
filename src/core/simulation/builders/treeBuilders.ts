import type { AnimationStep, VisualNode, VisualState } from '@/types'
import { deepClone } from '@/utils/clone'
import { layoutQueue, layoutStack, layoutTree } from '@/core/rendering/layout'

interface OpParams {
  value: string | number | null
  index: number | null
}

// ─── Value Comparison Utility ──────────────────────────────────────────────
function compareValues(a: string | number | null, b: string | number | null): number {
  if (a === null && b === null) return 0
  if (a === null) return -1
  if (b === null) return 1
  const numA = Number(a)
  const numB = Number(b)
  if (Number.isFinite(numA) && Number.isFinite(numB)) {
    return numA - numB
  }
  return String(a).localeCompare(String(b))
}

// ─── Highlights Helper ─────────────────────────────────────────────────────
function clearNodeHighlights(state: VisualState): void {
  state.nodes?.forEach((node) => {
    node.highlight = false
  })
  state.edges?.forEach((edge) => {
    edge.highlight = false
  })
}

// ─── Edge & Layout Rebuilders ──────────────────────────────────────────────
function rebuildTreeLinks(state: VisualState): void {
  state.edges = []
  state.nodes?.forEach((node) => {
    if (node.left && state.nodes?.some((n) => n.id === node.left)) {
      state.edges?.push({ from: node.id, to: node.left })
    }
    if (node.right && state.nodes?.some((n) => n.id === node.right)) {
      state.edges?.push({ from: node.id, to: node.right })
    }
  })
  if (state.rootId && state.nodes && state.nodes.length > 0) {
    layoutTree(state.rootId, state.nodes, 0, [50, 750])
  }
}

function rebuildHeapLinks(state: VisualState): void {
  if (!state.nodes || state.nodes.length === 0) return
  state.nodes.forEach((node, index) => {
    node.left = 2 * index + 1 < state.nodes!.length ? state.nodes![2 * index + 1].id : null
    node.right = 2 * index + 2 < state.nodes!.length ? state.nodes![2 * index + 2].id : null
    node.parent = index > 0 ? state.nodes![Math.floor((index - 1) / 2)].id : null
  })
  state.rootId = state.nodes[0]?.id
  rebuildTreeLinks(state)
}

function heapValues(state: VisualState): number[] {
  return (state.nodes ?? []).map((node) => Number(node.value)).filter((value) => Number.isFinite(value))
}

function swapNodeValues(state: VisualState, a: number, b: number): void {
  if (!state.nodes?.[a] || !state.nodes[b]) return
  ;[state.nodes[a].value, state.nodes[b].value] = [state.nodes[b].value, state.nodes[a].value]
}

// ─── Rotation Utilities for AVL, Treap, Splay ──────────────────────────────
function rotateRight(state: VisualState, yId: string): void {
  const nodes = state.nodes ?? []
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const y = byId.get(yId)
  if (!y || !y.left) return
  const x = byId.get(y.left)
  if (!x) return

  y.left = x.right ?? null
  if (x.right) {
    const xRightNode = byId.get(x.right)
    if (xRightNode) xRightNode.parent = y.id
  }

  x.parent = y.parent ?? null
  if (y.parent) {
    const parentNode = byId.get(y.parent)
    if (parentNode) {
      if (parentNode.left === y.id) parentNode.left = x.id
      else if (parentNode.right === y.id) parentNode.right = x.id
    }
  } else {
    state.rootId = x.id
  }

  x.right = y.id
  y.parent = x.id
}

function rotateLeft(state: VisualState, xId: string): void {
  const nodes = state.nodes ?? []
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const x = byId.get(xId)
  if (!x || !x.right) return
  const y = byId.get(x.right)
  if (!y) return

  x.right = y.left ?? null
  if (y.left) {
    const yLeftNode = byId.get(y.left)
    if (yLeftNode) yLeftNode.parent = x.id
  }

  y.parent = x.parent ?? null
  if (x.parent) {
    const parentNode = byId.get(x.parent)
    if (parentNode) {
      if (parentNode.left === x.id) parentNode.left = y.id
      else if (parentNode.right === x.id) parentNode.right = y.id
    }
  } else {
    state.rootId = y.id
  }

  y.left = x.id
  x.parent = y.id
}

// ─── Stack / Queue / Deque / Priority Queue Builders ────────────────────────
export function buildStackSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val } = params

  if (op === 'push' && val !== null) {
    const newId = `s-${Date.now()}`
    steps.push({
      description: `Push ${val} onto stack`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes = ns.nodes ?? []
        ns.nodes.push({ id: newId, value: val, x: 400, y: 320, opacity: 0, highlight: 'green' })
        ns.nodes.forEach((n) => { n.highlight = false })
        layoutStack(ns.nodes)
        const last = ns.nodes[ns.nodes.length - 1]
        if (last) last.opacity = 1
        ns.pointers = [{ name: 'top', targetId: newId }]
        return ns
      },
    })
  } else if (op === 'pop' && (state.nodes?.length ?? 0) > 0) {
    const topNode = state.nodes![state.nodes!.length - 1]
    steps.push({
      description: `Pop top element ${topNode.value}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const last = ns.nodes?.[ns.nodes.length - 1]
        if (last) last.highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: 'Remove top element',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.pop()
        if (ns.nodes) layoutStack(ns.nodes)
        if (ns.nodes && ns.nodes.length > 0)
          ns.pointers = [{ name: 'top', targetId: ns.nodes[ns.nodes.length - 1].id }]
        else ns.pointers = []
        return ns
      },
    })
  } else if (op === 'peek' && (state.nodes?.length ?? 0) > 0) {
    const topNode = state.nodes![state.nodes!.length - 1]
    steps.push({
      description: `Peek at top element: ${topNode.value}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const last = ns.nodes?.[ns.nodes.length - 1]
        if (last) last.highlight = 'blue'
        return ns
      },
    })
  }

  return steps
}

export function buildQueueSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val } = params

  if (op === 'enqueue' && val !== null) {
    const newId = `q-${Date.now()}`
    steps.push({
      description: `Enqueue ${val}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes = ns.nodes ?? []
        const len = ns.nodes.length
        ns.nodes.push({
          id: newId,
          value: val,
          x: 50 + len * 80,
          y: 200,
          opacity: 0,
          highlight: 'green',
        })
        const last = ns.nodes[ns.nodes.length - 1]
        if (last) last.opacity = 1
        if (ns.nodes.length > 0)
          ns.pointers = [
            { name: 'head', targetId: ns.nodes[0].id },
            { name: 'tail', targetId: newId },
          ]
        return ns
      },
    })
  } else if (op === 'dequeue' && (state.nodes?.length ?? 0) > 0) {
    const headVal = state.nodes![0].value
    steps.push({
      description: `Dequeue front element ${headVal}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.nodes?.[0]) ns.nodes[0].highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: 'Remove front element',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.shift()
        if (ns.nodes) layoutQueue(ns.nodes)
        if (ns.nodes && ns.nodes.length > 0)
          ns.pointers = [
            { name: 'head', targetId: ns.nodes[0].id },
            { name: 'tail', targetId: ns.nodes[ns.nodes.length - 1].id },
          ]
        else ns.pointers = []
        return ns
      },
    })
  } else if (op === 'peek' && (state.nodes?.length ?? 0) > 0) {
    steps.push({
      description: `Peek at front: ${state.nodes![0].value}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.nodes?.[0]) ns.nodes[0].highlight = 'blue'
        return ns
      },
    })
  }

  return steps
}

export function buildDequeSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val } = params

  if ((op === 'pushFront' || op === 'pushBack') && val !== null) {
    const newId = `d-${Date.now()}`
    const isFront = op === 'pushFront'
    steps.push({
      description: `${isFront ? 'Push' : 'Append'} ${val} ${isFront ? 'at the front' : 'at the back'} of the deque`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes = ns.nodes ?? []
        const node = { id: newId, value: val, x: 0, y: 200, opacity: 0, highlight: 'green' as const }
        if (isFront) ns.nodes.unshift(node)
        else ns.nodes.push(node)
        layoutQueue(ns.nodes, 60, 200, 90)
        const inserted = ns.nodes.find((candidate) => candidate.id === newId)
        if (inserted) inserted.opacity = 1
        ns.pointers =
          ns.nodes.length > 0
            ? [
                { name: 'front', targetId: ns.nodes[0].id },
                { name: 'back', targetId: ns.nodes[ns.nodes.length - 1].id },
              ]
            : []
        return ns
      },
    })
  } else if ((op === 'popFront' || op === 'popBack') && (state.nodes?.length ?? 0) > 0) {
    const isFront = op === 'popFront'
    const targetIndex = isFront ? 0 : (state.nodes?.length ?? 1) - 1
    steps.push({
      description: `Remove ${isFront ? 'front' : 'back'} value ${state.nodes?.[targetIndex]?.value}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const target = isFront ? ns.nodes?.[0] : ns.nodes?.[ns.nodes.length - 1]
        if (target) target.highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: `Deque ${isFront ? 'front' : 'back'} pointer moves inward`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        if (isFront) ns.nodes?.shift()
        else ns.nodes?.pop()
        if (ns.nodes) layoutQueue(ns.nodes, 60, 200, 90)
        ns.pointers =
          ns.nodes && ns.nodes.length > 0
            ? [
                { name: 'front', targetId: ns.nodes[0].id },
                { name: 'back', targetId: ns.nodes[ns.nodes.length - 1].id },
              ]
            : []
        return ns
      },
    })
  }

  return steps
}

function parsePriorityValue(value: string | number): { label: string; priority: number } {
  if (typeof value === 'number') return { label: String(value), priority: value }
  const [label, priorityText] = value.split(':')
  const priority = Number(priorityText)
  return {
    label: label.trim() || value,
    priority: Number.isFinite(priority) ? priority : Math.max(1, Math.min(value.length, 9)),
  }
}

export function buildPriorityQueueSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val } = params

  if (op === 'enqueue' && val !== null) {
    const { label, priority } = parsePriorityValue(val)
    const newId = `pq-${Date.now()}`
    const insertIndex = (state.nodes ?? []).findIndex((node) => (node.priority ?? Number.MAX_SAFE_INTEGER) > priority)
    const targetIndex = insertIndex === -1 ? state.nodes?.length ?? 0 : insertIndex

    steps.push({
      description: `Calculate priority ${priority} for ${label}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((node, index) => {
          node.highlight = index === targetIndex ? 'yellow' : false
        })
        return ns
      },
    })
    steps.push({
      description: `Insert ${label} before lower-priority items`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes = ns.nodes ?? []
        ns.nodes.splice(targetIndex, 0, {
          id: newId,
          value: label,
          priority,
          x: 0,
          y: 200,
          opacity: 0,
          highlight: 'green',
        })
        layoutQueue(ns.nodes, 60, 200, 110)
        const inserted = ns.nodes.find((node) => node.id === newId)
        if (inserted) inserted.opacity = 1
        ns.pointers =
          ns.nodes.length > 0
            ? [
                { name: 'front', targetId: ns.nodes[0].id },
                { name: 'rear', targetId: ns.nodes[ns.nodes.length - 1].id },
              ]
            : []
        return ns
      },
    })
  } else if (op === 'dequeue' && (state.nodes?.length ?? 0) > 0) {
    steps.push({
      description: `Remove highest-priority item ${state.nodes?.[0]?.value}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.nodes?.[0]) ns.nodes[0].highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: 'Front moves to the next highest priority item',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.shift()
        if (ns.nodes) layoutQueue(ns.nodes, 60, 200, 110)
        ns.pointers =
          ns.nodes && ns.nodes.length > 0
            ? [
                { name: 'front', targetId: ns.nodes[0].id },
                { name: 'rear', targetId: ns.nodes[ns.nodes.length - 1].id },
              ]
            : []
        return ns
      },
    })
  } else if (op === 'peek' && (state.nodes?.length ?? 0) > 0) {
    const firstNode = state.nodes?.[0]
    if (!firstNode) return steps
    steps.push({
      description: `Peek highest priority: ${firstNode.value}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.nodes?.[0]) ns.nodes[0].highlight = 'blue'
        return ns
      },
    })
  }

  return steps
}

// ─── Min / Max Heap Builder ─────────────────────────────────────────────────
export function buildHeapSteps(ds: string, op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val } = params
  const isMinHeap = ds === 'min-heap'
  const compare = (child: number, parent: number) => (isMinHeap ? child < parent : child > parent)

  if (op === 'insert' && val !== null) {
    const numVal = typeof val === 'number' ? val : Number(val) || 0
    const values = heapValues(state)
    values.push(numVal)
    let index = values.length - 1
    const newId = `h${Date.now()}`

    steps.push({
      description: `Insert ${numVal} at the next open heap slot`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes = ns.nodes ?? []
        ns.nodes.push({ id: newId, value: numVal, left: null, right: null, x: 0, y: 0, opacity: 0, highlight: 'green' })
        rebuildHeapLinks(ns)
        const inserted = ns.nodes.find((node) => node.id === newId)
        if (inserted) inserted.opacity = 1
        return ns
      },
    })

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      const childIndex = index
      steps.push({
        description: `Compare child ${values[childIndex]} with parent ${values[parent]}`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          clearNodeHighlights(ns)
          if (ns.nodes?.[childIndex]) ns.nodes[childIndex].highlight = 'yellow'
          if (ns.nodes?.[parent]) ns.nodes[parent].highlight = 'yellow'
          return ns
        },
      })
      if (!compare(values[childIndex], values[parent])) break

      steps.push({
        description: `${values[childIndex]} has higher heap priority than ${values[parent]}. Bubble up.`,
        codeLine: 3,
        modifier: (s) => {
          const ns = deepClone(s)
          swapNodeValues(ns, childIndex, parent)
          clearNodeHighlights(ns)
          if (ns.nodes?.[parent]) ns.nodes[parent].highlight = 'green'
          return ns
        },
      })
      ;[values[childIndex], values[parent]] = [values[parent], values[childIndex]]
      index = parent
    }
  } else if ((op === 'extractMin' || op === 'extractMax') && (state.nodes?.length ?? 0) > 0) {
    const values = heapValues(state)
    steps.push({
      description: `Remove root ${values[0]} from the ${isMinHeap ? 'min' : 'max'} heap`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.nodes?.[0]) ns.nodes[0].highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: 'Move the last item to the root slot',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        if (!ns.nodes || ns.nodes.length === 0) return ns
        const last = ns.nodes.pop()
        if (ns.nodes[0] && last) {
          ns.nodes[0].value = last.value
          ns.nodes[0].highlight = 'yellow'
        }
        rebuildHeapLinks(ns)
        return ns
      },
    })

    if (values.length > 1) {
      values[0] = values[values.length - 1]
      values.pop()
      let index = 0
      while (true) {
        const left = index * 2 + 1
        const right = index * 2 + 2
        let best = index
        if (left < values.length && compare(values[left], values[best])) best = left
        if (right < values.length && compare(values[right], values[best])) best = right
        if (best === index) break
        const currentIndex = index
        const bestIndex = best
        steps.push({
          description: `Bubble down by swapping ${values[currentIndex]} with ${values[bestIndex]}`,
          codeLine: 3,
          modifier: (s) => {
            const ns = deepClone(s)
            swapNodeValues(ns, currentIndex, bestIndex)
            clearNodeHighlights(ns)
            if (ns.nodes?.[bestIndex]) ns.nodes[bestIndex].highlight = 'green'
            return ns
          },
        })
        ;[values[currentIndex], values[bestIndex]] = [values[bestIndex], values[currentIndex]]
        index = best
      }
    }
  } else if (op === 'heapify') {
    const values = heapValues(state)
    const n = values.length
    steps.push({
      description: `Start bottom-up Heapify on ${n} elements`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        clearNodeHighlights(ns)
        return ns
      },
    })

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      let index = i
      while (true) {
        const left = index * 2 + 1
        const right = index * 2 + 2
        let best = index
        if (left < values.length && compare(values[left], values[best])) best = left
        if (right < values.length && compare(values[right], values[best])) best = right
        if (best === index) break
        const curIdx = index
        const bestIdx = best
        steps.push({
          description: `Heapify at index ${curIdx}: swap ${values[curIdx]} with ${values[bestIdx]}`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            swapNodeValues(ns, curIdx, bestIdx)
            clearNodeHighlights(ns)
            if (ns.nodes?.[bestIdx]) ns.nodes[bestIdx].highlight = 'green'
            return ns
          },
        })
        ;[values[curIdx], values[bestIdx]] = [values[bestIdx], values[curIdx]]
        index = best
      }
    }

    steps.push({
      description: `Heapify complete! Valid ${isMinHeap ? 'min' : 'max'} heap structure restored.`,
      codeLine: 3,
      modifier: (s) => {
        const ns = deepClone(s)
        clearNodeHighlights(ns)
        ns.nodes?.forEach((node) => { node.highlight = 'green' })
        rebuildHeapLinks(ns)
        return ns
      },
    })
  }

  return steps
}

// ─── Balanced Tree Maintenance (AVL / Red-Black / Treap / Splay) ─────────────
function decorateAvl(state: VisualState): number {
  const byId = new Map((state.nodes ?? []).map((node) => [node.id, node]))
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
  return measure(state.rootId)
}

function colorRedBlackByDepth(state: VisualState): void {
  const byId = new Map((state.nodes ?? []).map((node) => [node.id, node]))
  const visit = (nodeId: string | null | undefined, depth: number) => {
    if (!nodeId) return
    const node = byId.get(nodeId)
    if (!node) return
    node.color = depth % 2 === 0 ? 'black' : 'red'
    visit(node.left, depth + 1)
    visit(node.right, depth + 1)
  }
  visit(state.rootId, 0)
}

function appendBalancedTreeMaintenance(ds: string, steps: AnimationStep[]): void {
  if (ds === 'avl') {
    steps.push({
      description: 'Calculate AVL heights & balance factors',
      codeLine: 7,
      modifier: (s) => {
        const ns = deepClone(s)
        decorateAvl(ns)
        const unbal = ns.nodes?.find((node) => Math.abs(node.balanceFactor ?? 0) > 1)
        if (unbal) unbal.highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: 'Check for LL, RR, LR, or RL rotations to restore balance',
      codeLine: 8,
      modifier: (s) => {
        const ns = deepClone(s)
        clearNodeHighlights(ns)
        decorateAvl(ns)
        const unbal = ns.nodes?.find((node) => Math.abs(node.balanceFactor ?? 0) > 1)
        if (unbal) {
          const bf = unbal.balanceFactor ?? 0
          if (bf > 1) {
            const leftChild = ns.nodes?.find((n) => n.id === unbal.left)
            if (leftChild && (leftChild.balanceFactor ?? 0) < 0) {
              rotateLeft(ns, leftChild.id)
            }
            rotateRight(ns, unbal.id)
          } else if (bf < -1) {
            const rightChild = ns.nodes?.find((n) => n.id === unbal.right)
            if (rightChild && (rightChild.balanceFactor ?? 0) > 0) {
              rotateRight(ns, rightChild.id)
            }
            rotateLeft(ns, unbal.id)
          }
        }
        rebuildTreeLinks(ns)
        decorateAvl(ns)
        ns.nodes?.forEach((node) => { node.highlight = 'green' })
        return ns
      },
    })
  }

  if (ds === 'red-black-tree') {
    steps.push({
      description: 'Restore Red-Black invariants (root black, no consecutive red nodes)',
      codeLine: 7,
      modifier: (s) => {
        const ns = deepClone(s)
        colorRedBlackByDepth(ns)
        rebuildTreeLinks(ns)
        return ns
      },
    })
  }
}

function appendTreeDeleteSteps(ds: string, steps: AnimationStep[], val: string | number, state: VisualState): void {
  const nodes = state.nodes ?? []
  const byId = new Map(nodes.map((node) => [node.id, node]))
  let currentId: string | null | undefined = state.rootId
  let targetId: string | null = null

  while (currentId) {
    const current = byId.get(currentId)
    if (!current) break
    const curId = currentId
    steps.push({
      description: `Compare ${val} with ${current.value}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        clearNodeHighlights(ns)
        const node = ns.nodes?.find((candidate) => candidate.id === curId)
        if (node) node.highlight = 'yellow'
        return ns
      },
    })

    const cmp = compareValues(val, current.value)
    if (cmp === 0) {
      targetId = curId
      break
    }
    currentId = cmp < 0 ? current.left : current.right
  }

  if (!targetId) {
    steps.push({
      description: `${val} is not present in this tree`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        clearNodeHighlights(ns)
        return ns
      },
    })
    return
  }

  const target = byId.get(targetId)
  if (!target) return

  if (target.left && target.right) {
    let successorId = target.right
    while (byId.get(successorId)?.left) successorId = byId.get(successorId)!.left!
    const successor = byId.get(successorId)
    if (!successor) return

    steps.push({
      description: `Node ${target.value} has two children. Find inorder successor ${successor.value}.`,
      codeLine: 3,
      modifier: (s) => {
        const ns = deepClone(s)
        clearNodeHighlights(ns)
        const node = ns.nodes?.find((candidate) => candidate.id === successorId)
        if (node) node.highlight = 'blue'
        return ns
      },
    })
    steps.push({
      description: `Copy successor value ${successor.value} into node`,
      codeLine: 4,
      modifier: (s) => {
        const ns = deepClone(s)
        const node = ns.nodes?.find((candidate) => candidate.id === targetId)
        const replacement = ns.nodes?.find((candidate) => candidate.id === successorId)
        if (node && replacement) {
          node.value = replacement.value
          node.highlight = 'green'
          replacement.highlight = 'red'
        }
        return ns
      },
    })
    steps.push({
      description: 'Remove original successor leaf node',
      codeLine: 5,
      modifier: (s) => {
        const ns = deepClone(s)
        const succNode = ns.nodes?.find((n) => n.id === successorId)
        relinkAndRemoveNode(ns, successorId, succNode?.right ?? null)
        return ns
      },
    })
  } else {
    const replacementId = target.left ?? target.right ?? null
    const caseName = replacementId ? 'one child' : 'leaf'
    steps.push({
      description: `Delete ${caseName} node ${target.value}`,
      codeLine: 3,
      modifier: (s) => {
        const ns = deepClone(s)
        const node = ns.nodes?.find((candidate) => candidate.id === targetId)
        if (node) node.highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: replacementId ? 'Promote child to node position' : 'Remove leaf node',
      codeLine: 4,
      modifier: (s) => {
        const ns = deepClone(s)
        relinkAndRemoveNode(ns, targetId, replacementId)
        return ns
      },
    })
  }

  appendBalancedTreeMaintenance(ds, steps)
}

function relinkAndRemoveNode(state: VisualState, nodeId: string, replacementId: string | null): void {
  const node = state.nodes?.find((candidate) => candidate.id === nodeId)
  if (!node) return
  const parent = state.nodes?.find((candidate) => candidate.id === node.parent)

  if (parent?.left === nodeId) parent.left = replacementId
  if (parent?.right === nodeId) parent.right = replacementId

  const replacement = state.nodes?.find((candidate) => candidate.id === replacementId)
  if (replacement) replacement.parent = parent?.id ?? null

  if (state.rootId === nodeId) state.rootId = replacementId ?? undefined
  state.nodes = state.nodes?.filter((candidate) => candidate.id !== nodeId)
  rebuildTreeLinks(state)
}

// ─── Main Binary / BST / AVL / Treap / Splay Tree Builder ───────────────────
export function buildTreeSteps(ds: string, op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val } = params

  if (op === 'insert' && val !== null) {
    const newId = `b-${Date.now()}`

    // Special case for plain binary-tree: level-order insertion
    if (ds === 'binary-tree') {
      if (!state.rootId || !state.nodes || state.nodes.length === 0) {
        steps.push({
          description: `Tree empty. Insert ${val} as root.`,
          codeLine: 1,
          modifier: (s) => {
            const ns = deepClone(s)
            ns.nodes = [{ id: newId, value: val, left: null, right: null, parent: null, x: 400, y: 50, opacity: 1, highlight: 'green' }]
            ns.rootId = newId
            ns.edges = []
            return ns
          },
        })
      } else {
        // Find next open slot in level order
        const queue = [state.rootId]
        let parentId: string | null = null
        let dir: 'left' | 'right' = 'left'

        while (queue.length > 0) {
          const currentId = queue.shift()!
          const current = state.nodes?.find((n) => n.id === currentId)
          if (!current) continue
          if (!current.left) {
            parentId = current.id
            dir = 'left'
            break
          }
          queue.push(current.left)
          if (!current.right) {
            parentId = current.id
            dir = 'right'
            break
          }
          queue.push(current.right)
        }

        const pId = parentId!
        steps.push({
          description: `Insert ${val} as ${dir} child of ${state.nodes.find((n) => n.id === pId)?.value}`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            ns.nodes = ns.nodes ?? []
            ns.edges = ns.edges ?? []
            ns.nodes.push({ id: newId, value: val, left: null, right: null, parent: pId, x: 0, y: 0, opacity: 1, highlight: 'green' })
            const p = ns.nodes.find((n) => n.id === pId)
            if (p) p[dir] = newId
            rebuildTreeLinks(ns)
            return ns
          },
        })
      }
      return steps
    }

    // BST / AVL / Red-Black / Treap / Splay insertion
    if (!state.rootId || !state.nodes || state.nodes.length === 0) {
      const priority = ds === 'treap' ? Math.floor(Math.random() * 90) + 10 : undefined
      steps.push({
        description: `Tree empty. Insert ${val} as root.`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes = [{
            id: newId,
            value: val,
            left: null,
            right: null,
            parent: null,
            priority,
            x: 400,
            y: 50,
            opacity: 1,
            highlight: 'green',
          }]
          ns.rootId = newId
          ns.edges = []
          if (ds === 'avl') decorateAvl(ns)
          if (ds === 'red-black-tree') colorRedBlackByDepth(ns)
          return ns
        },
      })
    } else {
      let currentId: string | null | undefined = state.rootId
      let parentId: string | null = null
      let dir: 'left' | 'right' = 'left'

      while (currentId) {
        const current = state.nodes?.find((n) => n.id === currentId)
        if (!current) break
        const curId = currentId
        steps.push({
          description: `Compare ${val} with ${current.value}`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const n = ns.nodes?.find((x) => x.id === curId)
            if (n) n.highlight = 'yellow'
            return ns
          },
        })

        const cmp = compareValues(val, current.value)
        if (cmp < 0) {
          steps.push({
            description: `${val} < ${current.value}, go left`,
            codeLine: 3,
            modifier: (s) => {
              const ns = deepClone(s)
              const edge = ns.edges?.find((e) => e.from === curId && e.to === current.left)
              if (edge) edge.highlight = true
              return ns
            },
          })
          parentId = currentId
          dir = 'left'
          currentId = current.left
        } else if (cmp > 0) {
          steps.push({
            description: `${val} > ${current.value}, go right`,
            codeLine: 4,
            modifier: (s) => {
              const ns = deepClone(s)
              const edge = ns.edges?.find((e) => e.from === curId && e.to === current.right)
              if (edge) edge.highlight = true
              return ns
            },
          })
          parentId = currentId
          dir = 'right'
          currentId = current.right
        } else {
          steps.push({
            description: `Value ${val} already exists in tree!`,
            codeLine: 5,
            modifier: (s) => {
              const ns = deepClone(s)
              const n = ns.nodes?.find((x) => x.id === curId)
              if (n) n.highlight = 'red'
              return ns
            },
          })
          return steps
        }
      }

      const pId = parentId
      const priority = ds === 'treap' ? Math.floor(Math.random() * 90) + 10 : undefined

      steps.push({
        description: `Insert ${val} as ${dir} child of parent`,
        codeLine: 6,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes = ns.nodes ?? []
          ns.edges = ns.edges ?? []
          ns.nodes.push({
            id: newId,
            value: val,
            left: null,
            right: null,
            parent: pId,
            priority,
            x: 0,
            y: 0,
            opacity: 1,
            highlight: 'green',
          })
          const parent = ns.nodes.find((n) => n.id === pId)
          if (parent) parent[dir] = newId
          rebuildTreeLinks(ns)
          return ns
        },
      })

      // Treap sift up
      if (ds === 'treap') {
        steps.push({
          description: `Bubble up ${val} (priority ${priority}) to maintain Treap Max-Heap property`,
          codeLine: 7,
          modifier: (s) => {
            const ns = deepClone(s)
            let curr = ns.nodes?.find((n) => n.id === newId)
            while (curr && curr.parent) {
              const par = ns.nodes?.find((n) => n.id === curr!.parent)
              if (!par || (curr.priority ?? 0) <= (par.priority ?? 0)) break
              if (par.left === curr.id) rotateRight(ns, par.id)
              else rotateLeft(ns, par.id)
              curr = ns.nodes?.find((n) => n.id === newId)
            }
            rebuildTreeLinks(ns)
            return ns
          },
        })
      }

      // Splay tree splay
      if (ds === 'splay-tree') {
        steps.push({
          description: `Splay node ${val} to root via Zig/Zig-Zig/Zig-Zag rotations`,
          codeLine: 7,
          modifier: (s) => {
            const ns = deepClone(s)
            let curr = ns.nodes?.find((n) => n.id === newId)
            while (curr && curr.parent) {
              const par = ns.nodes?.find((n) => n.id === curr!.parent)
              if (!par) break
              if (!par.parent) {
                if (par.left === curr.id) rotateRight(ns, par.id)
                else rotateLeft(ns, par.id)
              } else {
                const g = ns.nodes?.find((n) => n.id === par.parent)
                if (!g) break
                if (g.left === par.id && par.left === curr.id) {
                  rotateRight(ns, g.id)
                  rotateRight(ns, par.id)
                } else if (g.right === par.id && par.right === curr.id) {
                  rotateLeft(ns, g.id)
                  rotateLeft(ns, par.id)
                } else if (g.left === par.id && par.right === curr.id) {
                  rotateLeft(ns, par.id)
                  rotateRight(ns, g.id)
                } else {
                  rotateRight(ns, par.id)
                  rotateLeft(ns, g.id)
                }
              }
              curr = ns.nodes?.find((n) => n.id === newId)
            }
            rebuildTreeLinks(ns)
            return ns
          },
        })
      }

      appendBalancedTreeMaintenance(ds, steps)
    }
  } else if (op === 'delete' && val !== null) {
    appendTreeDeleteSteps(ds, steps, val, state)
  } else if (op === 'search' && val !== null) {
    let currentId: string | null | undefined = state.rootId
    let foundId: string | null = null

    while (currentId) {
      const current = state.nodes?.find((n) => n.id === currentId)
      if (!current) break
      const curId = currentId
      steps.push({
        description: `Check node ${current.value}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          clearNodeHighlights(ns)
          const n = ns.nodes?.find((x) => x.id === curId)
          if (n) n.highlight = 'yellow'
          return ns
        },
      })

      const cmp = compareValues(val, current.value)
      if (cmp === 0) {
        foundId = curId
        steps.push({
          description: `Found value ${val}!`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            const n = ns.nodes?.find((x) => x.id === curId)
            if (n) n.highlight = 'green'
            return ns
          },
        })
        break
      } else if (cmp < 0) {
        steps.push({
          description: 'Go left',
          codeLine: 3,
          modifier: (s) => {
            const ns = deepClone(s)
            const edge = ns.edges?.find((e) => e.from === curId && e.to === current.left)
            if (edge) edge.highlight = true
            return ns
          },
        })
        currentId = current.left
      } else {
        steps.push({
          description: 'Go right',
          codeLine: 4,
          modifier: (s) => {
            const ns = deepClone(s)
            const edge = ns.edges?.find((e) => e.from === curId && e.to === current.right)
            if (edge) edge.highlight = true
            return ns
          },
        })
        currentId = current.right
      }
    }

    if (!foundId) {
      steps.push({
        description: `Value ${val} not found in tree`,
        codeLine: 5,
        modifier: (s) => {
          const ns = deepClone(s)
          clearNodeHighlights(ns)
          return ns
        },
      })
    } else if (ds === 'splay-tree') {
      const targetId = foundId
      steps.push({
        description: `Splay searched node ${val} to root`,
        codeLine: 6,
        modifier: (s) => {
          const ns = deepClone(s)
          let curr = ns.nodes?.find((n) => n.id === targetId)
          while (curr && curr.parent) {
            const par = ns.nodes?.find((n) => n.id === curr!.parent)
            if (!par) break
            if (!par.parent) {
              if (par.left === curr.id) rotateRight(ns, par.id)
              else rotateLeft(ns, par.id)
            } else {
              const g = ns.nodes?.find((n) => n.id === par.parent)
              if (!g) break
              if (g.left === par.id && par.left === curr.id) {
                rotateRight(ns, g.id)
                rotateRight(ns, par.id)
              } else if (g.right === par.id && par.right === curr.id) {
                rotateLeft(ns, g.id)
                rotateLeft(ns, par.id)
              } else if (g.left === par.id && par.right === curr.id) {
                rotateLeft(ns, par.id)
                rotateRight(ns, g.id)
              } else {
                rotateRight(ns, par.id)
                rotateLeft(ns, g.id)
              }
            }
            curr = ns.nodes?.find((n) => n.id === targetId)
          }
          rebuildTreeLinks(ns)
          const n = ns.nodes?.find((x) => x.id === targetId)
          if (n) n.highlight = 'green'
          return ns
        },
      })
    }
  } else if (['inorder', 'preorder', 'postorder'].includes(op)) {
    const order = op as 'inorder' | 'preorder' | 'postorder'
    if (!state.rootId) return steps

    const traverse = (nodeId: string | null | undefined): void => {
      if (!nodeId) return
      const node = state.nodes?.find((n) => n.id === nodeId)
      if (!node) return

      if (order === 'preorder') {
        steps.push({
          description: `Preorder Visit: ${node.value}`,
          codeLine: 1,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const n = ns.nodes?.find((x) => x.id === nodeId)
            if (n) n.highlight = 'green'
            ns.visited = [...(ns.visited ?? []), node.value]
            return ns
          },
        })
      }

      if (node.left) {
        steps.push({
          description: `Go left from ${node.value}`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const n = ns.nodes?.find((x) => x.id === nodeId)
            if (n) n.highlight = 'yellow'
            const edge = ns.edges?.find((e) => e.from === nodeId && e.to === node.left)
            if (edge) edge.highlight = true
            return ns
          },
        })
        traverse(node.left)
      }

      if (order === 'inorder') {
        steps.push({
          description: `Inorder Visit: ${node.value}`,
          codeLine: 3,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const n = ns.nodes?.find((x) => x.id === nodeId)
            if (n) n.highlight = 'green'
            ns.visited = [...(ns.visited ?? []), node.value]
            return ns
          },
        })
      }

      if (node.right) {
        steps.push({
          description: `Go right from ${node.value}`,
          codeLine: 4,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const n = ns.nodes?.find((x) => x.id === nodeId)
            if (n) n.highlight = 'yellow'
            const edge = ns.edges?.find((e) => e.from === nodeId && e.to === node.right)
            if (edge) edge.highlight = true
            return ns
          },
        })
        traverse(node.right)
      }

      if (order === 'postorder') {
        steps.push({
          description: `Postorder Visit: ${node.value}`,
          codeLine: 5,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const n = ns.nodes?.find((x) => x.id === nodeId)
            if (n) n.highlight = 'green'
            ns.visited = [...(ns.visited ?? []), node.value]
            return ns
          },
        })
      }
    }

    traverse(state.rootId)
  } else if (op === 'levelorder') {
    if (!state.rootId) return steps
    const queue = [state.rootId]

    while (queue.length > 0) {
      const nodeId = queue.shift()!
      const node = state.nodes?.find((n) => n.id === nodeId)
      if (!node) continue

      steps.push({
        description: `Level-order Visit: ${node.value}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          clearNodeHighlights(ns)
          const n = ns.nodes?.find((x) => x.id === nodeId)
          if (n) n.highlight = 'green'
          ns.visited = [...(ns.visited ?? []), node.value]
          return ns
        },
      })
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }

  return steps
}


// ─── Trie Builder ───────────────────────────────────────────────────────────
function findTrieChild(state: VisualState, parentId: string, letter: string): VisualNode | undefined {
  const edge = state.edges?.find((candidate) => candidate.from === parentId && trieLetter(state, candidate.to) === letter)
  return state.nodes?.find((node) => node.id === edge?.to)
}

function trieLetter(state: VisualState, nodeId: string): string {
  const node = state.nodes?.find((candidate) => candidate.id === nodeId)
  return String(node?.value ?? '').replace('*', '').toLowerCase()
}

function layoutTrieLike(state: VisualState): void {
  if (!state.nodes || state.nodes.length === 0) return
  const rootId = state.rootId ?? 'tr0'
  const childrenByParent = new Map<string, string[]>()
  state.edges?.forEach((edge) => {
    childrenByParent.set(edge.from, [...(childrenByParent.get(edge.from) ?? []), edge.to])
  })

  const levels: string[][] = []
  const visit = (nodeId: string, depth: number) => {
    levels[depth] = [...(levels[depth] ?? []), nodeId]
    childrenByParent.get(nodeId)?.forEach((childId) => visit(childId, depth + 1))
  }
  visit(rootId, 0)

  const byId = new Map(state.nodes.map((node) => [node.id, node]))
  levels.forEach((ids, depth) => {
    ids.forEach((id, index) => {
      const node = byId.get(id)
      if (!node) return
      node.x = ((index + 1) * 800) / (ids.length + 1)
      node.y = 45 + depth * 72
    })
  })
}

export function buildTrieSteps(op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []
  const word = params.value === null ? '' : String(params.value).toLowerCase()

  if ((op === 'insert' || op === 'search' || op === 'delete') && word) {
    let parentId = state.rootId ?? 'tr0'
    let missing = false

    for (let i = 0; i < word.length; i++) {
      const letter = word[i]
      const child = !missing ? findTrieChild(state, parentId, letter) : null
      if (child) {
        const childId = child.id
        steps.push({
          description: `Follow edge '${letter}'`,
          codeLine: 1,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const node = ns.nodes?.find((candidate) => candidate.id === childId)
            if (node) node.highlight = 'yellow'
            const edge = ns.edges?.find((candidate) => candidate.to === childId)
            if (edge) edge.highlight = true
            return ns
          },
        })
        parentId = child.id
        continue
      }

      if (op !== 'insert') {
        missing = true
        steps.push({
          description: `Missing edge '${letter}'. Word "${word}" is not in the Trie.`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const parent = ns.nodes?.find((candidate) => candidate.id === parentId)
            if (parent) parent.highlight = 'red'
            return ns
          },
        })
        break
      }

      const newId = `tr-${Date.now()}-${i}`
      const fromId = parentId
      steps.push({
        description: `Create trie node for letter '${letter}'`,
        codeLine: 2,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes = ns.nodes ?? []
          ns.edges = ns.edges ?? []
          ns.nodes.push({ id: newId, value: letter, x: 0, y: 0, opacity: 1, highlight: 'green' })
          ns.edges.push({ from: fromId, to: newId, directed: true })
          layoutTrieLike(ns)
          return ns
        },
      })
      parentId = newId
      missing = true
    }

    if (!missing) {
      steps.push({
        description: op === 'delete' ? `Unmark terminal node for word "${word}"` : `Confirm word "${word}" in Trie`,
        codeLine: 3,
        modifier: (s) => {
          const ns = deepClone(s)
          const terminal = ns.nodes?.find((candidate) => candidate.id === parentId)
          if (terminal) {
            terminal.highlight = op === 'delete' ? 'red' : 'green'
            if (op === 'delete') terminal.value = String(terminal.value).replace('*', '')
            if (op === 'insert' && !String(terminal.value).endsWith('*')) terminal.value = `${terminal.value}*`
          }
          return ns
        },
      })
    }
  } else if (op === 'dfs') {
    const visitedSet = new Set<string>()
    const rootId = state.rootId ?? 'tr0'

    const dfsVisit = (nodeId: string): void => {
      if (visitedSet.has(nodeId)) return
      visitedSet.add(nodeId)

      const node = state.nodes?.find((n) => n.id === nodeId)
      if (!node) return

      steps.push({
        description: `Trie DFS visits node '${node.value}'`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          clearNodeHighlights(ns)
          const current = ns.nodes?.find((candidate) => candidate.id === nodeId)
          if (current) current.highlight = 'blue'
          ns.visited = [...(ns.visited ?? []), node.value]
          return ns
        },
      })

      const childEdges = (state.edges ?? []).filter((e) => e.from === nodeId)
      for (const edge of childEdges) {
        dfsVisit(edge.to)
      }
    }

    dfsVisit(rootId)
  }

  return steps
}

// ─── Range Trees (Segment Tree, Fenwick Tree) ──────────────────────────────
function parseSegmentRange(valStr: string): [number, number] {
  const parts = valStr.split(/[:,\-]/).map((s) => parseInt(s.trim(), 10))
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]]
  }
  if (parts.length === 1 && !isNaN(parts[0])) {
    return [parts[0], parts[0]]
  }
  return [0, 3]
}

function parseNodeRange(value: string | number): [number, number] | null {
  const match = String(value).match(/\[(\d+),(\d+)\]/)
  if (!match) return null
  return [Number(match[1]), Number(match[2])]
}

export function buildRangeTreeSteps(ds: string, op: string, params: OpParams, state: VisualState): AnimationStep[] {
  const steps: AnimationStep[] = []

  if (op === 'build') {
    steps.push({
      description: `Build ${ds === 'segment-tree' ? 'Segment Tree bottom-up range sums' : 'Fenwick Tree (BIT) partial sums'}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((node) => { node.highlight = 'green' })
        return ns
      },
    })
  } else if (op === 'query') {
    if (ds === 'fenwick-tree') {
      const inputIdx = params.index ?? (typeof params.value === 'number' ? params.value : parseInt(String(params.value), 10) || 5)
      let index = Math.min(Math.max(1, inputIdx), state.nodes?.length ?? 5)

      while (index > 0) {
        const curIdx = index
        const nodeId = `fw${curIdx}`
        steps.push({
          description: `Add Fenwick node ${curIdx} to prefix sum; next index = ${curIdx} - (${curIdx} & -${curIdx})`,
          codeLine: 1,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const node = ns.nodes?.find((candidate) => candidate.id === nodeId)
            if (node) node.highlight = 'green'
            return ns
          },
        })
        index -= index & -index
      }
    } else {
      // Segment tree query
      const [ql, qr] = parseSegmentRange(params.value === null ? '0:3' : String(params.value))

      for (const node of state.nodes ?? []) {
        const range = parseNodeRange(node.value)
        if (!range) continue
        const [l, r] = range

        if (r < ql || l > qr) {
          // Disjoint
          continue
        }

        const isFullyInside = ql <= l && r <= qr
        steps.push({
          description: isFullyInside
            ? `Segment [${l}, ${r}] is fully inside query range [${ql}, ${qr}]: add sum`
            : `Segment [${l}, ${r}] overlaps query range [${ql}, ${qr}]: split query`,
          codeLine: isFullyInside ? 2 : 1,
          modifier: (s) => {
            const ns = deepClone(s)
            const current = ns.nodes?.find((candidate) => candidate.id === node.id)
            if (current) current.highlight = isFullyInside ? 'green' : 'yellow'
            return ns
          },
        })
      }
    }
  } else if (op === 'update') {
    if (ds === 'fenwick-tree') {
      const idx = params.index ?? 2
      const delta = typeof params.value === 'number' ? params.value : parseInt(String(params.value), 10) || 3
      let index = Math.max(1, idx)
      const maxNodes = state.nodes?.length ?? 5

      while (index <= maxNodes) {
        const curIdx = index
        const nodeId = `fw${curIdx}`
        steps.push({
          description: `Add delta ${delta} to Fenwick node ${curIdx}; next index = ${curIdx} + (${curIdx} & -${curIdx})`,
          codeLine: 1,
          modifier: (s) => {
            const ns = deepClone(s)
            clearNodeHighlights(ns)
            const node = ns.nodes?.find((candidate) => candidate.id === nodeId)
            if (node) {
              const [, curVal = '0'] = String(node.value).split(':')
              node.value = `${curIdx}:${Number(curVal) + delta}`
              node.highlight = 'green'
            }
            return ns
          },
        })
        index += index & -index
      }
    } else {
      // Segment tree update
      const idx = params.index ?? (typeof params.value === 'number' ? params.value : 2)
      const newVal = typeof params.value === 'number' ? params.value : 9

      for (const node of state.nodes ?? []) {
        const range = parseNodeRange(node.value)
        if (!range || idx < range[0] || idx > range[1]) continue
        const isLeaf = range[0] === range[1]

        steps.push({
          description: isLeaf
            ? `Update leaf segment [${idx}, ${idx}] to new value ${newVal}`
            : `Recalculate ancestor segment [${range[0]}, ${range[1]}] sum`,
          codeLine: 1,
          modifier: (s) => {
            const ns = deepClone(s)
            const current = ns.nodes?.find((candidate) => candidate.id === node.id)
            if (current) {
              current.highlight = isLeaf ? 'green' : 'yellow'
              if (isLeaf) current.value = `[${idx},${idx}] ${newVal}`
            }
            return ns
          },
        })
      }
    }
  }

  return steps
}
