import type { AnimationStep, VisualState } from '@/types'
import { deepClone } from '@/utils/clone'
import { layoutLinear, layoutLinkedList } from '@/core/rendering/layout'

interface OpParams {
  value: string | number | null
  index: number | null
}

export function buildArraySteps(
  op: string,
  params: OpParams,
  state: VisualState,
): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val, index: idx } = params

  if (op === 'insert' && val !== null && idx !== null) {
    steps.push({
      description: `Prepare to insert ${val} at index ${idx}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n, i) => {
          if (i >= idx) n.highlight = 'yellow'
        })
        return ns
      },
    })
    steps.push({
      description: `Insert ${val} at index ${idx}. Elements shift right.`,
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const newNode = {
          id: `a-${Date.now()}`,
          value: val,
          index: idx,
          x: 50 + idx * 80,
          y: 200,
          highlight: 'green' as const,
          opacity: 0,
        }
        ns.nodes?.splice(idx, 0, newNode)
        ns.nodes?.forEach((n, i) => {
          n.index = i
        })
        if (ns.nodes) layoutLinear(ns.nodes)
        const inserted = ns.nodes?.[idx]
        if (inserted) inserted.opacity = 1
        return ns
      },
    })
    steps.push({
      description: 'Insert complete',
      codeLine: 3,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.forEach((n) => {
          n.highlight = false
        })
        return ns
      },
    })
  } else if (op === 'delete' && idx !== null) {
    steps.push({
      description: `Delete element at index ${idx}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.nodes?.[idx]) ns.nodes[idx].highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: 'Remove and shift left',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.splice(idx, 1)
        ns.nodes?.forEach((n, i) => {
          n.index = i
        })
        if (ns.nodes) layoutLinear(ns.nodes)
        return ns
      },
    })
  } else if (op === 'search' && val !== null) {
    for (let i = 0; i < (state.nodes?.length ?? 0); i++) {
      const nodeVal = state.nodes![i].value
      steps.push({
        description: `Check index ${i}: ${nodeVal} == ${val}?`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => {
            n.highlight = false
          })
          if (ns.nodes?.[i]) ns.nodes[i].highlight = 'yellow'
          return ns
        },
      })
      if (nodeVal == val) {
        steps.push({
          description: `Found ${val} at index ${i}!`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            if (ns.nodes?.[i]) ns.nodes[i].highlight = 'green'
            return ns
          },
        })
        break
      }
    }
  } else if (op === 'traverse') {
    state.nodes?.forEach((node, i) => {
      steps.push({
        description: `Visit element at index ${i}: ${node.value}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => {
            n.highlight = false
          })
          if (ns.nodes?.[i]) ns.nodes[i].highlight = 'blue'
          ns.visited = [...(ns.visited ?? []), node.value]
          return ns
        },
      })
    })
  } else if (op === 'access' && idx !== null) {
    steps.push({
      description: `Access element at index ${idx}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        if (ns.nodes?.[idx]) ns.nodes[idx].highlight = 'green'
        return ns
      },
    })
  } else if (op === 'push_back' && val !== null) {
    steps.push({
      description: `Push ${val} to back`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.push({
          id: `a-${Date.now()}`,
          value: val,
          index: ns.nodes.length,
          x: 0,
          y: 200,
          highlight: 'green',
          opacity: 0,
        })
        if (ns.nodes) layoutLinear(ns.nodes)
        const last = ns.nodes?.[ns.nodes.length - 1]
        if (last) last.opacity = 1
        return ns
      },
    })
  } else if (op === 'pop_back' && (state.nodes?.length ?? 0) > 0) {
    steps.push({
      description: 'Pop last element',
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        const last = ns.nodes?.[ns.nodes.length - 1]
        if (last) last.highlight = 'red'
        return ns
      },
    })
    steps.push({
      description: 'Remove element',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.pop()
        if (ns.nodes) layoutLinear(ns.nodes)
        return ns
      },
    })
  }

  return steps
}

export function buildLinkedListSteps(
  op: string,
  params: OpParams,
  state: VisualState,
): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { value: val } = params
  if (op === 'insert' && val !== null) {
    const newId = `n-${Date.now()}`
    const isCircular = Boolean(state.head && state.nodes?.some((node) => node.next === state.head))
    const tail = findTail(state)

    steps.push({
      description: `Create new node with value ${val}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.push({ id: newId, value: val, next: isCircular ? (ns.head ?? null) : null, x: 0, y: 0, opacity: 0, highlight: 'green' })
        return ns
      },
    })
    steps.push({
      description: isCircular ? 'Link tail to the new node and close the ring' : 'Append node at the tail',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        if (!ns.head) ns.head = newId
        const headId = ns.head
        const tailNode = ns.nodes?.find((node) => node.id === tail?.id)
        if (tailNode) tailNode.next = newId
        const newNode = ns.nodes?.find((node) => node.id === newId)
        if (newNode) {
          newNode.next = isCircular ? headId : null
          newNode.opacity = 1
        }
        ns.tail = newId
        ns.pointers = [{ name: 'head', targetId: headId }, { name: 'tail', targetId: newId }]
        if (ns.nodes) layoutLinkedList({ nodes: ns.nodes, edges: ns.edges ?? [], head: headId })
        return ns
      },
    })
  } else if (op === 'insertHead' && val !== null) {
    const newId = `n-${Date.now()}`
    steps.push({
      description: `Create new node with value ${val}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.push({ id: newId, value: val, next: null, x: 60, y: 200, opacity: 0 })
        return ns
      },
    })
    steps.push({
      description: 'Link new node to current head',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const node = ns.nodes?.find((n) => n.id === newId)
        if (node) {
          node.next = ns.head ?? null
          node.opacity = 1
        }
        if (ns.head) ns.edges?.push({ from: newId, to: ns.head })
        return ns
      },
    })
    steps.push({
      description: 'Update head pointer',
      codeLine: 3,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.head = newId
        ns.pointers = [{ name: 'head', targetId: newId }]
        if (ns.nodes) layoutLinkedList({ nodes: ns.nodes, edges: ns.edges ?? [], head: ns.head })
        return ns
      },
    })
  } else if (op === 'insertTail' && val !== null) {
    const newId = `n-${Date.now()}`
    steps.push({
      description: `Create new node with value ${val}`,
      codeLine: 1,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.nodes?.push({ id: newId, value: val, next: null, x: 0, y: 0, opacity: 0 })
        return ns
      },
    })
    steps.push({
      description: 'Link current tail to new node',
      codeLine: 2,
      modifier: (s) => {
        const ns = deepClone(s)
        const tailNode = ns.nodes?.find((n) => n.id === ns.tail)
        if (tailNode) {
          tailNode.next = newId
          ns.edges?.push({ from: ns.tail!, to: newId })
        }
        const newNode = ns.nodes?.find((n) => n.id === newId)
        if (newNode) newNode.opacity = 1
        return ns
      },
    })
    steps.push({
      description: 'Update tail pointer',
      codeLine: 3,
      modifier: (s) => {
        const ns = deepClone(s)
        ns.tail = newId
        ns.pointers = [...(ns.pointers ?? []), { name: 'tail', targetId: newId }]
        if (ns.nodes) layoutLinkedList({ nodes: ns.nodes, edges: ns.edges ?? [], head: ns.head })
        return ns
      },
    })
  } else if (op === 'delete' && val !== null) {
    let current = state.head
    let prev: string | null = null
    const visited = new Set<string>()
    while (current && !visited.has(current)) {
      visited.add(current)
      const node = state.nodes?.find((n) => n.id === current)
      if (!node) break
      const curId = current
      steps.push({
        description: `Check node ${node.value}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => {
            n.highlight = false
          })
          const n = ns.nodes?.find((x) => x.id === curId)
          if (n) n.highlight = 'yellow'
          return ns
        },
      })
      if (node.value == val) {
        steps.push({
          description: `Found ${val}. Remove node.`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            if (prev) {
              const p = ns.nodes?.find((x) => x.id === prev)
              if (p) p.next = node.next
            } else {
              const deletingOnlyNode = node.next === curId
              ns.head = deletingOnlyNode ? undefined : (node.next ?? undefined)
              const tail = ns.nodes?.find((x) => x.next === curId)
              if (tail) tail.next = ns.head ?? null
            }
            ns.nodes = ns.nodes?.filter((x) => x.id !== curId)
            ns.tail = findTail(ns)?.id
            ns.pointers = ns.head
              ? [{ name: 'head', targetId: ns.head }, ...(ns.tail ? [{ name: 'tail', targetId: ns.tail }] : [])]
              : []
            if (ns.nodes) layoutLinkedList({ nodes: ns.nodes, edges: ns.edges ?? [], head: ns.head })
            return ns
          },
        })
        break
      }
      prev = current
      current = node.next ?? undefined
    }
  } else if (op === 'search' && val !== null) {
    let current = state.head
    const visited = new Set<string>()
    while (current && !visited.has(current)) {
      visited.add(current)
      const node = state.nodes?.find((n) => n.id === current)
      if (!node) break
      const curId = current
      steps.push({
        description: `Check node ${node.value}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => {
            n.highlight = false
          })
          const n = ns.nodes?.find((x) => x.id === curId)
          if (n) n.highlight = 'yellow'
          return ns
        },
      })
      if (node.value == val) {
        steps.push({
          description: `Found ${val}!`,
          codeLine: 2,
          modifier: (s) => {
            const ns = deepClone(s)
            const n = ns.nodes?.find((x) => x.id === curId)
            if (n) n.highlight = 'green'
            return ns
          },
        })
        break
      }
      current = node.next ?? undefined
    }
  } else if (op === 'traverse') {
    let current = state.head
    const visited = new Set<string>()
    while (current && !visited.has(current)) {
      visited.add(current)
      const node = state.nodes?.find((n) => n.id === current)
      if (!node) break
      const curId = current
      steps.push({
        description: `Visit node ${node.value}`,
        codeLine: 1,
        modifier: (s) => {
          const ns = deepClone(s)
          ns.nodes?.forEach((n) => {
            n.highlight = false
          })
          const n = ns.nodes?.find((x) => x.id === curId)
          if (n) n.highlight = 'blue'
          ns.visited = [...(ns.visited ?? []), node.value]
          return ns
        },
      })
      current = node.next ?? undefined
    }
  }

  return steps
}

function findTail(state: VisualState) {
  if (!state.nodes || !state.head) return null
  let current = state.head
  const visited = new Set<string>()
  let tail = state.nodes.find((node) => node.id === current) ?? null

  while (current && !visited.has(current)) {
    visited.add(current)
    const node = state.nodes.find((candidate) => candidate.id === current)
    if (!node) break
    tail = node
    if (!node.next || node.next === state.head) break
    current = node.next
  }

  return tail
}
