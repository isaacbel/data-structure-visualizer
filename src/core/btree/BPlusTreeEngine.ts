import type { BTreeConfig, BTreeNode, BTreeStep, BTreeValidationReport } from './types'

let idCounter = 0
function nextId(): string {
  return `bp-${++idCounter}`
}

export class BPlusTreeEngine {
  public root: BTreeNode<number> | null = null
  public leafHead: BTreeNode<number> | null = null
  public t: number // minimum degree t

  constructor(config: BTreeConfig = { t: 2 }) {
    this.t = Math.max(2, config.t)
  }

  public cloneTree(node: BTreeNode<number> | null): BTreeNode<number> | null {
    if (!node) return null
    const nodeMap = new Map<string, BTreeNode<number>>()

    const cloneDeep = (cur: BTreeNode<number>): BTreeNode<number> => {
      const cloned: BTreeNode<number> = {
        id: cur.id,
        keys: [...cur.keys],
        isLeaf: cur.isLeaf,
        children: [],
        next: null,
        prev: null,
      }
      nodeMap.set(cur.id, cloned)
      cloned.children = cur.children.map((child) => {
        const childCloned = cloneDeep(child)
        childCloned.parent = cloned
        return childCloned
      })
      return cloned
    }

    const clonedRoot = cloneDeep(node)

    // Re-link leaf next/prev pointers
    let curLeaf = this.leafHead
    let prevClonedLeaf: BTreeNode<number> | null = null

    while (curLeaf) {
      const clonedLeaf = nodeMap.get(curLeaf.id)
      if (clonedLeaf) {
        if (prevClonedLeaf) {
          prevClonedLeaf.next = clonedLeaf
          clonedLeaf.prev = prevClonedLeaf
        }
        prevClonedLeaf = clonedLeaf
      }
      curLeaf = curLeaf.next ?? null
    }

    return clonedRoot
  }

  // ── Search ──────────────────────────────────────────────────────────────────

  public searchSteps(key: number): BTreeStep[] {
    const steps: BTreeStep[] = []
    if (!this.root) {
      steps.push({ description: 'B+ Tree is empty.', codeLine: 1, treeSnapshot: { id: 'empty', keys: [], children: [], isLeaf: true } })
      return steps
    }

    let cur: BTreeNode<number> | null = this.root
    while (cur) {
      const curId = cur.id
      const snapshot = this.cloneTree(this.root)!

      if (cur.isLeaf) {
        const idx = cur.keys.indexOf(key)
        if (idx !== -1) {
          steps.push({
            description: `Key ${key} FOUND in leaf node [${cur.keys.join(', ')}]`,
            codeLine: 2,
            action: 'search',
            highlightNodeId: curId,
            highlightKey: key,
            treeSnapshot: snapshot,
          })
        } else {
          steps.push({
            description: `Key ${key} NOT FOUND in leaf node [${cur.keys.join(', ')}]`,
            codeLine: 3,
            action: 'search',
            highlightNodeId: curId,
            treeSnapshot: snapshot,
          })
        }
        return steps
      }

      // Internal index search
      let i = 0
      while (i < cur.keys.length && key >= cur.keys[i]) i++

      steps.push({
        description: `Index search in internal node [${cur.keys.join(', ')}]: follow child ${i}`,
        codeLine: 4,
        action: 'search',
        highlightNodeId: curId,
        treeSnapshot: snapshot,
      })

      cur = cur.children[i] ?? null
    }

    return steps
  }

  // ── Range Query ─────────────────────────────────────────────────────────────

  public rangeSearchSteps(minKey: number, maxKey: number): BTreeStep[] {
    const steps: BTreeStep[] = []
    if (!this.root) return steps

    // 1. Find start leaf
    let cur: BTreeNode<number> | null = this.root
    while (cur && !cur.isLeaf) {
      let i = 0
      while (i < cur.keys.length && minKey >= cur.keys[i]) i++
      cur = cur.children[i]
    }

    if (!cur) return steps

    const matchedKeys: number[] = []
    let leaf: BTreeNode<number> | null = cur

    steps.push({
      description: `Range Search [${minKey}, ${maxKey}]: Found starting leaf node [${leaf.keys.join(', ')}]`,
      codeLine: 1,
      action: 'link_traverse',
      highlightNodeId: leaf.id,
      highlightRange: [minKey, maxKey],
      treeSnapshot: this.cloneTree(this.root)!,
    })

    while (leaf) {
      for (const k of leaf.keys) {
        if (k >= minKey && k <= maxKey) {
          matchedKeys.push(k)
        }
      }

      steps.push({
        description: `Inspecting leaf [${leaf.keys.join(', ')}] → Matched keys so far: [${matchedKeys.join(', ')}]`,
        codeLine: 2,
        action: 'link_traverse',
        highlightNodeId: leaf.id,
        highlightRange: [minKey, maxKey],
        treeSnapshot: this.cloneTree(this.root)!,
      })

      if (leaf.keys[leaf.keys.length - 1] > maxKey) break
      leaf = leaf.next ?? null
    }

    steps.push({
      description: `Range Search completed: [${matchedKeys.join(', ')}]`,
      codeLine: 3,
      action: 'link_traverse',
      highlightRange: [minKey, maxKey],
      treeSnapshot: this.cloneTree(this.root)!,
    })

    return steps
  }

  // ── Insertion ───────────────────────────────────────────────────────────────

  public insert(key: number): BTreeStep[] {
    const steps: BTreeStep[] = []

    if (!this.root) {
      const leaf: BTreeNode<number> = { id: nextId(), keys: [key], children: [], isLeaf: true }
      this.root = leaf
      this.leafHead = leaf
      steps.push({
        description: `Tree empty. Insert key ${key} into new root leaf [${key}]`,
        codeLine: 1,
        action: 'insert',
        highlightNodeId: leaf.id,
        highlightKey: key,
        treeSnapshot: this.cloneTree(this.root)!,
      })
      return steps
    }

    // Split root if full
    if (this.root.keys.length === 2 * this.t - 1) {
      const oldRoot = this.root
      const newRoot: BTreeNode<number> = { id: nextId(), keys: [], children: [oldRoot], isLeaf: false }
      oldRoot.parent = newRoot
      this.root = newRoot
      this.splitChild(newRoot, 0, steps)
    }

    this.insertNonFull(this.root, key, steps)
    return steps
  }

  private insertNonFull(node: BTreeNode<number>, key: number, steps: BTreeStep[]): void {
    if (node.isLeaf) {
      node.keys.push(key)
      node.keys.sort((a, b) => a - b)
      steps.push({
        description: `Insert key ${key} into B+ Tree leaf [${node.keys.join(', ')}]`,
        codeLine: 2,
        action: 'insert',
        highlightNodeId: node.id,
        highlightKey: key,
        treeSnapshot: this.cloneTree(this.root)!,
      })
    } else {
      let i = 0
      while (i < node.keys.length && key >= node.keys[i]) i++

      let child = node.children[i]
      if (child.keys.length === 2 * this.t - 1) {
        this.splitChild(node, i, steps)
        if (key >= node.keys[i]) i++
        child = node.children[i]
      }

      this.insertNonFull(child, key, steps)
    }
  }

  private splitChild(parent: BTreeNode<number>, i: number, steps: BTreeStep[]): void {
    const fullChild = parent.children[i]
    const isLeaf = fullChild.isLeaf

    if (isLeaf) {
      // Leaf split: COPY median key up, and keep median in right leaf
      const splitIdx = Math.floor(fullChild.keys.length / 2)
      const promotedKey = fullChild.keys[splitIdx]

      const newLeaf: BTreeNode<number> = {
        id: nextId(),
        keys: fullChild.keys.slice(splitIdx),
        children: [],
        isLeaf: true,
        parent,
        next: fullChild.next,
        prev: fullChild,
      }

      if (fullChild.next) fullChild.next.prev = newLeaf
      fullChild.next = newLeaf

      fullChild.keys = fullChild.keys.slice(0, splitIdx)

      parent.children.splice(i + 1, 0, newLeaf)
      parent.keys.splice(i, 0, promotedKey)

      steps.push({
        description: `B+ Leaf Overflow: Split leaf into [${fullChild.keys.join(', ')}] and [${newLeaf.keys.join(', ')}]. COPY UP median ${promotedKey} to parent.`,
        codeLine: 3,
        action: 'split',
        highlightNodeId: parent.id,
        highlightKey: promotedKey,
        treeSnapshot: this.cloneTree(this.root)!,
      })
    } else {
      // Internal split: PUSH median key up
      const medianIdx = this.t - 1
      const promotedKey = fullChild.keys[medianIdx]

      const newInternal: BTreeNode<number> = {
        id: nextId(),
        keys: fullChild.keys.slice(medianIdx + 1),
        children: fullChild.children.slice(medianIdx + 1),
        isLeaf: false,
        parent,
      }

      newInternal.children.forEach((c) => { c.parent = newInternal })

      fullChild.keys = fullChild.keys.slice(0, medianIdx)
      fullChild.children = fullChild.children.slice(0, medianIdx + 1)

      parent.children.splice(i + 1, 0, newInternal)
      parent.keys.splice(i, 0, promotedKey)

      steps.push({
        description: `B+ Internal Overflow: Split node. PUSH UP median ${promotedKey} to parent [${parent.keys.join(', ')}]`,
        codeLine: 4,
        action: 'split',
        highlightNodeId: parent.id,
        highlightKey: promotedKey,
        treeSnapshot: this.cloneTree(this.root)!,
      })
    }
  }

  // ── Deletion ────────────────────────────────────────────────────────────────

  public delete(key: number): BTreeStep[] {
    const steps: BTreeStep[] = []
    if (!this.root) {
      steps.push({ description: `Tree is empty, cannot delete ${key}`, codeLine: 1, treeSnapshot: { id: 'empty', keys: [], children: [], isLeaf: true } })
      return steps
    }

    // Find the leaf containing the key
    let cur: BTreeNode<number> | null = this.root
    while (cur && !cur.isLeaf) {
      let i = 0
      while (i < cur.keys.length && key >= cur.keys[i]) i++
      cur = cur.children[i] ?? null
    }

    if (!cur) {
      steps.push({ description: `Key ${key} NOT FOUND in tree`, codeLine: 1, treeSnapshot: this.cloneTree(this.root)! })
      return steps
    }

    const idx = cur.keys.indexOf(key)
    if (idx === -1) {
      steps.push({ description: `Key ${key} NOT FOUND in tree`, codeLine: 1, treeSnapshot: this.cloneTree(this.root)! })
      return steps
    }

    steps.push({
      description: `Delete key ${key}: Found in leaf [${cur.keys.join(', ')}]`,
      codeLine: 2,
      action: 'search',
      highlightNodeId: cur.id,
      highlightKey: key,
      treeSnapshot: this.cloneTree(this.root)!,
    })

    // Remove from leaf
    cur.keys.splice(idx, 1)

    // Update the separator key in internal nodes if it was the first key of this leaf
    this.updateSeparators(this.root, key, cur.keys[0] ?? null)

    steps.push({
      description: `Key ${key} removed from leaf. Leaf now: [${cur.keys.join(', ')}]`,
      codeLine: 3,
      action: 'insert',
      highlightNodeId: cur.id,
      treeSnapshot: this.cloneTree(this.root)!,
    })

    // Handle underflow (leaf has < t-1 keys, except root)
    if (cur !== this.root && cur.keys.length < this.t - 1) {
      this.fixLeafUnderflow(cur, steps)
    }

    // Collapse root if needed
    if (this.root && !this.root.isLeaf && this.root.keys.length === 0) {
      this.root = this.root.children[0]
      if (this.root) this.root.parent = undefined
      steps.push({
        description: 'Root collapsed — tree height decreased',
        codeLine: 4,
        action: 'root_collapse',
        treeSnapshot: this.cloneTree(this.root)!,
      })
    }

    return steps
  }

  private updateSeparators(node: BTreeNode<number> | null, oldKey: number, newKey: number | null): void {
    if (!node || node.isLeaf) return
    for (let i = 0; i < node.keys.length; i++) {
      if (node.keys[i] === oldKey) {
        if (newKey !== null) node.keys[i] = newKey
        else node.keys.splice(i, 1)
      }
    }
    node.children.forEach((c) => this.updateSeparators(c, oldKey, newKey))
  }

  private fixLeafUnderflow(leaf: BTreeNode<number>, steps: BTreeStep[]): void {
    const parent = leaf.parent
    if (!parent) return

    const leafIdx = parent.children.indexOf(leaf)
    const leftSibling = leafIdx > 0 ? parent.children[leafIdx - 1] : null
    const rightSibling = leafIdx < parent.children.length - 1 ? parent.children[leafIdx + 1] : null

    // Borrow from left
    if (leftSibling && leftSibling.keys.length > this.t - 1) {
      const borrowed = leftSibling.keys.pop()!
      leaf.keys.unshift(borrowed)
      parent.keys[leafIdx - 1] = leaf.keys[0]
      steps.push({
        description: `Underflow: Borrow ${borrowed} from left sibling [${leftSibling.keys.join(', ')}]`,
        codeLine: 5,
        action: 'borrow',
        highlightNodeId: leaf.id,
        treeSnapshot: this.cloneTree(this.root)!,
      })
      return
    }

    // Borrow from right
    if (rightSibling && rightSibling.keys.length > this.t - 1) {
      const borrowed = rightSibling.keys.shift()!
      leaf.keys.push(borrowed)
      parent.keys[leafIdx] = rightSibling.keys[0]
      steps.push({
        description: `Underflow: Borrow ${borrowed} from right sibling [${rightSibling.keys.join(', ')}]`,
        codeLine: 5,
        action: 'borrow',
        highlightNodeId: leaf.id,
        treeSnapshot: this.cloneTree(this.root)!,
      })
      return
    }

    // Merge with left sibling
    if (leftSibling) {
      const merged = [...leftSibling.keys, ...leaf.keys]
      leftSibling.keys = merged
      // Unlink leaf from list
      if (leaf.prev) leaf.prev.next = leaf.next ?? null
      if (leaf.next) leaf.next.prev = leaf.prev ?? null
      // Remove from parent
      parent.children.splice(leafIdx, 1)
      parent.keys.splice(leafIdx - 1, 1)
      steps.push({
        description: `Underflow: Merge leaf [${leaf.keys.join(', ')}] into left sibling → [${merged.join(', ')}]`,
        codeLine: 6,
        action: 'merge',
        highlightNodeId: leftSibling.id,
        treeSnapshot: this.cloneTree(this.root)!,
      })
      if (parent !== this.root && parent.keys.length < this.t - 1) {
        this.fixInternalUnderflow(parent, steps)
      }
      return
    }

    // Merge with right sibling
    if (rightSibling) {
      const merged = [...leaf.keys, ...rightSibling.keys]
      leaf.keys = merged
      if (leaf.next) leaf.next.prev = leaf.prev ?? null
      if (leaf.prev) leaf.prev.next = rightSibling.next ?? null
      leaf.next = rightSibling.next ?? null
      parent.children.splice(leafIdx + 1, 1)
      parent.keys.splice(leafIdx, 1)
      steps.push({
        description: `Underflow: Merge right sibling [${rightSibling.keys.join(', ')}] into leaf → [${merged.join(', ')}]`,
        codeLine: 6,
        action: 'merge',
        highlightNodeId: leaf.id,
        treeSnapshot: this.cloneTree(this.root)!,
      })
      if (parent !== this.root && parent.keys.length < this.t - 1) {
        this.fixInternalUnderflow(parent, steps)
      }
    }
  }

  private fixInternalUnderflow(node: BTreeNode<number>, steps: BTreeStep[]): void {
    const parent = node.parent
    if (!parent) return

    const nodeIdx = parent.children.indexOf(node)
    const leftSibling = nodeIdx > 0 ? parent.children[nodeIdx - 1] : null
    const rightSibling = nodeIdx < parent.children.length - 1 ? parent.children[nodeIdx + 1] : null

    if (leftSibling && leftSibling.keys.length > this.t - 1) {
      node.keys.unshift(parent.keys[nodeIdx - 1])
      parent.keys[nodeIdx - 1] = leftSibling.keys.pop()!
      const movedChild = leftSibling.children.pop()
      if (movedChild) { movedChild.parent = node; node.children.unshift(movedChild) }
      steps.push({ description: `Internal underflow: Borrow from left sibling`, codeLine: 5, action: 'borrow', highlightNodeId: node.id, treeSnapshot: this.cloneTree(this.root)! })
      return
    }

    if (rightSibling && rightSibling.keys.length > this.t - 1) {
      node.keys.push(parent.keys[nodeIdx])
      parent.keys[nodeIdx] = rightSibling.keys.shift()!
      const movedChild = rightSibling.children.shift()
      if (movedChild) { movedChild.parent = node; node.children.push(movedChild) }
      steps.push({ description: `Internal underflow: Borrow from right sibling`, codeLine: 5, action: 'borrow', highlightNodeId: node.id, treeSnapshot: this.cloneTree(this.root)! })
      return
    }

    if (leftSibling) {
      leftSibling.keys.push(parent.keys[nodeIdx - 1], ...node.keys)
      leftSibling.children.push(...node.children)
      node.children.forEach((c) => { c.parent = leftSibling })
      parent.children.splice(nodeIdx, 1)
      parent.keys.splice(nodeIdx - 1, 1)
      steps.push({ description: `Internal merge with left sibling`, codeLine: 6, action: 'merge', highlightNodeId: leftSibling.id, treeSnapshot: this.cloneTree(this.root)! })
      if (parent !== this.root && parent.keys.length < this.t - 1) this.fixInternalUnderflow(parent, steps)
      return
    }

    if (rightSibling) {
      node.keys.push(parent.keys[nodeIdx], ...rightSibling.keys)
      node.children.push(...rightSibling.children)
      rightSibling.children.forEach((c) => { c.parent = node })
      parent.children.splice(nodeIdx + 1, 1)
      parent.keys.splice(nodeIdx, 1)
      steps.push({ description: `Internal merge with right sibling`, codeLine: 6, action: 'merge', highlightNodeId: node.id, treeSnapshot: this.cloneTree(this.root)! })
      if (parent !== this.root && parent.keys.length < this.t - 1) this.fixInternalUnderflow(parent, steps)
    }
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  public validate(): BTreeValidationReport {
    const errors: string[] = []
    if (!this.root) {
      return {
        isValid: true, heightUniform: true, keysSorted: true, keyCountsValid: true,
        rootValid: true, leafLinksValid: true, errors: [], height: 0, nodeCount: 0,
        leafCount: 0, totalKeys: 0, minKeysPerNode: 0, maxKeysPerNode: 0, avgBranchingFactor: 0,
      }
    }

    let nodeCount = 0, leafCount = 0, totalKeys = 0, totalChildren = 0, nonLeafCount = 0
    let minKeys = Number.POSITIVE_INFINITY, maxKeys = 0
    const leafDepths = new Set<number>()

    const traverse = (node: BTreeNode<number>, depth: number) => {
      nodeCount++
      totalKeys += node.keys.length
      minKeys = Math.min(minKeys, node.keys.length)
      maxKeys = Math.max(maxKeys, node.keys.length)

      // Keys sorted check
      for (let i = 1; i < node.keys.length; i++) {
        if (node.keys[i] < node.keys[i - 1]) {
          errors.push(`Keys out of order in node ${node.id}: ${node.keys.join(', ')}`)
        }
      }

      if (node.isLeaf) {
        leafCount++
        leafDepths.add(depth)
      } else {
        nonLeafCount++
        totalChildren += node.children.length
        if (node.children.length !== node.keys.length + 1) {
          errors.push(`Node ${node.id} children count (${node.children.length}) != keys + 1 (${node.keys.length + 1})`)
        }
        node.children.forEach((c) => traverse(c, depth + 1))
      }

      // Key count bound check (skip root)
      if (node !== this.root) {
        if (node.keys.length < this.t - 1) {
          errors.push(`Node ${node.id} underflow: has ${node.keys.length} keys (min ${this.t - 1})`)
        }
      }
      if (node.keys.length > 2 * this.t - 1) {
        errors.push(`Node ${node.id} overflow: has ${node.keys.length} keys (max ${2 * this.t - 1})`)
      }
    }

    traverse(this.root, 1)

    // Check leaf links continuity
    let countLeaves = 0
    let curLeaf = this.leafHead
    while (curLeaf) {
      countLeaves++
      if (curLeaf.next && curLeaf.next.prev !== curLeaf) {
        errors.push(`Broken doubly-linked list link between leaf ${curLeaf.id} and ${curLeaf.next.id}`)
      }
      curLeaf = curLeaf.next ?? null
    }

    if (countLeaves !== leafCount) {
      errors.push(`Leaf list count (${countLeaves}) != tree leaf count (${leafCount})`)
    }

    const heightUniform = leafDepths.size <= 1
    if (!heightUniform) errors.push(`Leaves exist at multiple depths: [${[...leafDepths].join(', ')}]`)

    const height = leafDepths.size > 0 ? Math.max(...leafDepths) : 0
    const avgBranchingFactor = nonLeafCount > 0 ? totalChildren / nonLeafCount : 0

    return {
      isValid: errors.length === 0,
      heightUniform,
      keysSorted: !errors.some((e) => e.includes('out of order')),
      keyCountsValid: !errors.some((e) => e.includes('underflow') || e.includes('overflow')),
      rootValid: this.root.keys.length >= 1,
      leafLinksValid: countLeaves === leafCount && !errors.some((e) => e.includes('link')),
      errors,
      height,
      nodeCount,
      leafCount,
      totalKeys,
      minKeysPerNode: minKeys === Number.POSITIVE_INFINITY ? 0 : minKeys,
      maxKeysPerNode: maxKeys,
      avgBranchingFactor,
    }
  }
}
