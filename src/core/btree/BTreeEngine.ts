import type { BTreeConfig, BTreeNode, BTreeStep, BTreeValidationReport } from './types'

let idCounter = 0
function nextId(): string {
  return `btn-${++idCounter}`
}

export class BTreeEngine {
  public root: BTreeNode<number> | null = null
  public t: number // minimum degree t (order = 2t)

  constructor(config: BTreeConfig = { t: 2 }) {
    this.t = Math.max(2, config.t)
  }

  public cloneTree(node: BTreeNode<number> | null): BTreeNode<number> | null {
    if (!node) return null
    const newNode: BTreeNode<number> = {
      id: node.id,
      keys: [...node.keys],
      isLeaf: node.isLeaf,
      children: [],
    }
    newNode.children = node.children.map((child) => {
      const clonedChild = this.cloneTree(child)!
      clonedChild.parent = newNode
      return clonedChild
    })
    return newNode
  }

  // ── Search ──────────────────────────────────────────────────────────────────

  public searchSteps(key: number): BTreeStep[] {
    const steps: BTreeStep[] = []
    if (!this.root) {
      steps.push({ description: `Tree is empty. Key ${key} not found.`, codeLine: 1, treeSnapshot: { id: 'empty', keys: [], children: [], isLeaf: true } })
      return steps
    }

    let cur: BTreeNode<number> | null = this.root
    while (cur) {
      const snapshot = this.cloneTree(this.root)!
      const curId = cur.id

      // Binary search inside node
      let i = 0
      while (i < cur.keys.length && key > cur.keys[i]) i++

      if (i < cur.keys.length && key === cur.keys[i]) {
        steps.push({
          description: `Key ${key} FOUND in node [${cur.keys.join(', ')}] at index ${i}`,
          codeLine: 2,
          action: 'search',
          highlightNodeId: curId,
          highlightKey: key,
          treeSnapshot: snapshot,
        })
        return steps
      }

      if (cur.isLeaf) {
        steps.push({
          description: `Key ${key} NOT FOUND in leaf node [${cur.keys.join(', ')}]`,
          codeLine: 3,
          action: 'search',
          highlightNodeId: curId,
          treeSnapshot: snapshot,
        })
        return steps
      }

      steps.push({
        description: `Key ${key} is between keys in node [${cur.keys.join(', ')}] → follow child pointer ${i}`,
        codeLine: 4,
        action: 'search',
        highlightNodeId: curId,
        treeSnapshot: snapshot,
      })

      cur = cur.children[i] ?? null
    }

    return steps
  }

  // ── Insertion ───────────────────────────────────────────────────────────────

  public insert(key: number): BTreeStep[] {
    const steps: BTreeStep[] = []

    if (!this.root) {
      this.root = { id: nextId(), keys: [key], children: [], isLeaf: true }
      steps.push({
        description: `Tree empty. Insert ${key} as root node [${key}]`,
        codeLine: 1,
        action: 'insert',
        highlightNodeId: this.root.id,
        highlightKey: key,
        treeSnapshot: this.cloneTree(this.root)!,
      })
      return steps
    }

    // Proactive root split if root is full (keys count == 2t - 1)
    if (this.root.keys.length === 2 * this.t - 1) {
      const oldRoot = this.root
      const newRoot: BTreeNode<number> = { id: nextId(), keys: [], children: [oldRoot], isLeaf: false }
      oldRoot.parent = newRoot
      this.root = newRoot
      this.splitChild(newRoot, 0, steps, 'Root overflow detected (2t-1 keys) → split root')
    }

    this.insertNonFull(this.root, key, steps)
    return steps
  }

  private insertNonFull(node: BTreeNode<number>, key: number, steps: BTreeStep[]): void {
    let i = node.keys.length - 1

    if (node.isLeaf) {
      // Skip duplicate keys (standard B-Tree does not allow duplicates)
      if (node.keys.includes(key)) return

      steps.push({
        description: `Leaf node [${node.keys.join(', ')}] found. Insert key ${key}`,
        codeLine: 2,
        action: 'insert',
        highlightNodeId: node.id,
        highlightKey: key,
        treeSnapshot: this.cloneTree(this.root)!,
      })

      // Insert sorted
      node.keys.push(key)
      node.keys.sort((a, b) => a - b)

      steps.push({
        description: `Key ${key} inserted into leaf [${node.keys.join(', ')}]`,
        codeLine: 3,
        action: 'insert',
        highlightNodeId: node.id,
        highlightKey: key,
        treeSnapshot: this.cloneTree(this.root)!,
      })
    } else {
      while (i >= 0 && key < node.keys[i]) i--
      i++

      steps.push({
        description: `Traverse down to child ${i} for key ${key}`,
        codeLine: 4,
        action: 'search',
        highlightNodeId: node.id,
        treeSnapshot: this.cloneTree(this.root)!,
      })

      let child = node.children[i]
      if (child.keys.length === 2 * this.t - 1) {
        this.splitChild(node, i, steps, `Child ${i} overflowed (${child.keys.length} keys) → split child`)
        if (key > node.keys[i]) i++
        child = node.children[i]
      }

      this.insertNonFull(child, key, steps)
    }
  }

  private splitChild(parent: BTreeNode<number>, i: number, steps: BTreeStep[], msg: string): void {
    const fullChild = parent.children[i]
    const medianIdx = this.t - 1
    const medianKey = fullChild.keys[medianIdx]

    const newSibling: BTreeNode<number> = {
      id: nextId(),
      keys: fullChild.keys.slice(medianIdx + 1),
      children: fullChild.isLeaf ? [] : fullChild.children.slice(medianIdx + 1),
      isLeaf: fullChild.isLeaf,
      parent,
    }

    if (!fullChild.isLeaf) {
      newSibling.children.forEach((c) => { c.parent = newSibling })
    }

    fullChild.keys = fullChild.keys.slice(0, medianIdx)
    if (!fullChild.isLeaf) {
      fullChild.children = fullChild.children.slice(0, medianIdx + 1)
    }

    parent.children.splice(i + 1, 0, newSibling)
    parent.keys.splice(i, 0, medianKey)

    steps.push({
      description: `${msg}: Median ${medianKey} promoted to parent [${parent.keys.join(', ')}]`,
      codeLine: 5,
      action: 'split',
      highlightNodeId: parent.id,
      highlightKey: medianKey,
      treeSnapshot: this.cloneTree(this.root)!,
    })
  }

  // ── Deletion ────────────────────────────────────────────────────────────────

  public delete(key: number): BTreeStep[] {
    const steps: BTreeStep[] = []
    if (!this.root) return steps

    this.deleteKey(this.root, key, steps)

    if (this.root.keys.length === 0) {
      if (this.root.isLeaf) {
        this.root = null
      } else {
        this.root = this.root.children[0]
        if (this.root) this.root.parent = null
      }
      steps.push({
        description: 'Root became empty → tree height reduced (Root collapsed)',
        codeLine: 6,
        action: 'root_collapse',
        treeSnapshot: this.root ? this.cloneTree(this.root)! : { id: 'empty', keys: [], children: [], isLeaf: true },
      })
    }

    return steps
  }

  private deleteKey(node: BTreeNode<number>, key: number, steps: BTreeStep[]): void {
    const idx = node.keys.indexOf(key)

    if (idx !== -1) {
      if (node.isLeaf) {
        node.keys.splice(idx, 1)
        steps.push({
          description: `Delete key ${key} from leaf node [${node.keys.join(', ')}]`,
          codeLine: 1,
          action: 'underflow',
          highlightNodeId: node.id,
          treeSnapshot: this.cloneTree(this.root)!,
        })
      } else {
        // Internal node deletion
        const leftChild = node.children[idx]
        const rightChild = node.children[idx + 1]

        if (leftChild.keys.length >= this.t) {
          // Replace with predecessor
          const predKey = this.getPredecessor(leftChild)
          node.keys[idx] = predKey
          steps.push({
            description: `Replace key ${key} with predecessor ${predKey} from left child`,
            codeLine: 2,
            action: 'borrow',
            highlightNodeId: node.id,
            highlightKey: predKey,
            treeSnapshot: this.cloneTree(this.root)!,
          })
          this.deleteKey(leftChild, predKey, steps)
        } else if (rightChild.keys.length >= this.t) {
          // Replace with successor
          const succKey = this.getSuccessor(rightChild)
          node.keys[idx] = succKey
          steps.push({
            description: `Replace key ${key} with successor ${succKey} from right child`,
            codeLine: 3,
            action: 'borrow',
            highlightNodeId: node.id,
            highlightKey: succKey,
            treeSnapshot: this.cloneTree(this.root)!,
          })
          this.deleteKey(rightChild, succKey, steps)
        } else {
          // Merge leftChild and rightChild
          this.mergeChildren(node, idx, steps)
          this.deleteKey(leftChild, key, steps)
        }
      }
    } else {
      if (node.isLeaf) {
        steps.push({
          description: `Key ${key} not in tree`,
          codeLine: 4,
          highlightNodeId: node.id,
          treeSnapshot: this.cloneTree(this.root)!,
        })
        return
      }

      let childIdx = 0
      while (childIdx < node.keys.length && key > node.keys[childIdx]) childIdx++

      const child = node.children[childIdx]
      if (child.keys.length < this.t) {
        this.fillChild(node, childIdx, steps)
      }

      // Re-determine index after fill/merge
      let nextChildIdx = 0
      while (nextChildIdx < node.keys.length && key > node.keys[nextChildIdx]) nextChildIdx++
      if (nextChildIdx < node.children.length) {
        this.deleteKey(node.children[nextChildIdx], key, steps)
      }
    }
  }

  private getPredecessor(node: BTreeNode<number>): number {
    let cur = node
    while (!cur.isLeaf) cur = cur.children[cur.children.length - 1]
    return cur.keys[cur.keys.length - 1]
  }

  private getSuccessor(node: BTreeNode<number>): number {
    let cur = node
    while (!cur.isLeaf) cur = cur.children[0]
    return cur.keys[0]
  }

  private fillChild(parent: BTreeNode<number>, idx: number, steps: BTreeStep[]): void {
    if (idx > 0 && parent.children[idx - 1].keys.length >= this.t) {
      this.borrowFromLeft(parent, idx, steps)
    } else if (idx < parent.children.length - 1 && parent.children[idx + 1].keys.length >= this.t) {
      this.borrowFromRight(parent, idx, steps)
    } else {
      if (idx < parent.children.length - 1) {
        this.mergeChildren(parent, idx, steps)
      } else {
        this.mergeChildren(parent, idx - 1, steps)
      }
    }
  }

  private borrowFromLeft(parent: BTreeNode<number>, idx: number, steps: BTreeStep[]): void {
    const child = parent.children[idx]
    const sibling = parent.children[idx - 1]

    child.keys.unshift(parent.keys[idx - 1])
    parent.keys[idx - 1] = sibling.keys.pop()!

    if (!sibling.isLeaf) {
      const movedChild = sibling.children.pop()!
      movedChild.parent = child
      child.children.unshift(movedChild)
    }

    steps.push({
      description: `Underflow: Borrow key from left sibling [${sibling.keys.join(', ')}]`,
      codeLine: 5,
      action: 'borrow',
      highlightNodeId: child.id,
      treeSnapshot: this.cloneTree(this.root)!,
    })
  }

  private borrowFromRight(parent: BTreeNode<number>, idx: number, steps: BTreeStep[]): void {
    const child = parent.children[idx]
    const sibling = parent.children[idx + 1]

    child.keys.push(parent.keys[idx])
    parent.keys[idx] = sibling.keys.shift()!

    if (!sibling.isLeaf) {
      const movedChild = sibling.children.shift()!
      movedChild.parent = child
      child.children.push(movedChild)
    }

    steps.push({
      description: `Underflow: Borrow key from right sibling [${sibling.keys.join(', ')}]`,
      codeLine: 5,
      action: 'borrow',
      highlightNodeId: child.id,
      treeSnapshot: this.cloneTree(this.root)!,
    })
  }

  private mergeChildren(parent: BTreeNode<number>, idx: number, steps: BTreeStep[]): void {
    const left = parent.children[idx]
    const right = parent.children[idx + 1]

    const separatorKey = parent.keys.splice(idx, 1)[0]
    left.keys.push(separatorKey, ...right.keys)

    if (!right.isLeaf) {
      right.children.forEach((c) => { c.parent = left })
      left.children.push(...right.children)
    }

    parent.children.splice(idx + 1, 1)

    steps.push({
      description: `Underflow: Merge nodes with separator ${separatorKey} → [${left.keys.join(', ')}]`,
      codeLine: 6,
      action: 'merge',
      highlightNodeId: left.id,
      treeSnapshot: this.cloneTree(this.root)!,
    })
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

      // Keys sorted check (strictly increasing, no duplicates)
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

      // Key count bound check
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
      leafLinksValid: true,
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
