import type { BTreeNode } from '@/core/btree/types'

export interface LayoutNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  keys: number[]
  isLeaf: boolean
  children: LayoutNode[]
  next?: LayoutNode | null
  prev?: LayoutNode | null
}

export interface BTreeLayout {
  nodes: LayoutNode[]
  edges: Array<{ fromId: string; fromSlot: number; toId: string }>
  leafLinks: Array<{ fromId: string; toId: string }>
  totalWidth: number
  totalHeight: number
}

// Layout constants
const KEY_WIDTH = 36
const KEY_HEIGHT = 36
const NODE_PADDING_X = 8
const NODE_PADDING_Y = 0
const NODE_HEIGHT = KEY_HEIGHT
const LEVEL_GAP = 90
const KEY_GAP = 2
const MIN_SIBLING_GAP = 24

function nodeWidth(keyCount: number): number {
  return keyCount * KEY_WIDTH + (keyCount - 1) * KEY_GAP + 2 * NODE_PADDING_X
}

/**
 * Compute subtree widths bottom-up, then assign x positions top-down.
 * Returns a flat list of positioned LayoutNodes.
 */
export function computeBTreeLayout(
  root: BTreeNode<number> | null,
  leafHead: BTreeNode<number> | null = null,
  startY = 60,
): BTreeLayout {
  if (!root) return { nodes: [], edges: [], leafLinks: [], totalWidth: 0, totalHeight: 0 }

  const layoutMap = new Map<string, LayoutNode>()
  const allNodes: LayoutNode[] = []
  const edges: BTreeLayout['edges'] = []

  // ── Pass 1: compute minimum subtree widths bottom-up ──────────────────────
  function buildLayout(node: BTreeNode<number>): LayoutNode {
    const lNode: LayoutNode = {
      id: node.id,
      x: 0,
      y: 0,
      width: nodeWidth(Math.max(1, node.keys.length)),
      height: NODE_HEIGHT,
      keys: [...node.keys],
      isLeaf: node.isLeaf,
      children: [],
    }
    layoutMap.set(node.id, lNode)
    allNodes.push(lNode)

    if (!node.isLeaf) {
      lNode.children = node.children.map((c) => buildLayout(c))
    }

    return lNode
  }

  const layoutRoot = buildLayout(root)

  // ── Pass 2: compute subtree minimum spans bottom-up ───────────────────────
  const subtreeMinSpan = new Map<string, number>()

  function computeSpans(lNode: LayoutNode): number {
    if (lNode.children.length === 0) {
      const span = lNode.width + MIN_SIBLING_GAP
      subtreeMinSpan.set(lNode.id, span)
      return span
    }
    const childrenTotalSpan = lNode.children.reduce((sum, c) => sum + computeSpans(c), 0)
    const span = Math.max(lNode.width + MIN_SIBLING_GAP, childrenTotalSpan)
    subtreeMinSpan.set(lNode.id, span)
    return span
  }

  computeSpans(layoutRoot)

  // ── Pass 3: assign x positions top-down ──────────────────────────────────
  function assignPositions(lNode: LayoutNode, centerX: number, depth: number): void {
    lNode.x = centerX - lNode.width / 2
    lNode.y = startY + depth * LEVEL_GAP

    if (lNode.children.length > 0) {
      const totalChildSpan = lNode.children.reduce((sum, c) => sum + (subtreeMinSpan.get(c.id) ?? c.width + MIN_SIBLING_GAP), 0)
      let curX = centerX - totalChildSpan / 2

      for (const child of lNode.children) {
        const childSpan = subtreeMinSpan.get(child.id) ?? child.width + MIN_SIBLING_GAP
        assignPositions(child, curX + childSpan / 2, depth + 1)
        curX += childSpan
      }
    }
  }

  const rootSpan = subtreeMinSpan.get(layoutRoot.id) ?? layoutRoot.width
  assignPositions(layoutRoot, rootSpan / 2, 0)

  // ── Build edge list ──────────────────────────────────────────────────────
  function collectEdges(lNode: LayoutNode): void {
    lNode.children.forEach((child, slot) => {
      edges.push({ fromId: lNode.id, fromSlot: slot, toId: child.id })
      collectEdges(child)
    })
  }
  collectEdges(layoutRoot)

  // ── Build leaf link list ─────────────────────────────────────────────────
  const leafLinks: BTreeLayout['leafLinks'] = []
  if (leafHead) {
    let curLeaf: BTreeNode<number> | null = leafHead
    while (curLeaf && curLeaf.next) {
      leafLinks.push({ fromId: curLeaf.id, toId: curLeaf.next.id })
      curLeaf = curLeaf.next
    }
  }

  const allX = allNodes.map((n) => n.x + n.width)
  const allY = allNodes.map((n) => n.y + n.height)
  const totalWidth = Math.max(...allX) + MIN_SIBLING_GAP
  const totalHeight = Math.max(...allY) + LEVEL_GAP

  return { nodes: allNodes, edges, leafLinks, totalWidth, totalHeight }
}

/** Get the pixel x position of a key slot's center inside a LayoutNode */
export function keySlotCenterX(lNode: LayoutNode, keyIdx: number): number {
  return lNode.x + NODE_PADDING_X + keyIdx * (KEY_WIDTH + KEY_GAP) + KEY_WIDTH / 2
}

/** Get the pixel x position of a child pointer slot (between keys) */
export function childPointerX(lNode: LayoutNode, slotIdx: number): number {
  if (slotIdx === 0) return lNode.x + NODE_PADDING_X / 2
  if (slotIdx >= lNode.keys.length) return lNode.x + lNode.width - NODE_PADDING_X / 2
  return lNode.x + NODE_PADDING_X + (slotIdx - 0.5) * (KEY_WIDTH + KEY_GAP) + KEY_WIDTH / 2
}

export { KEY_WIDTH, KEY_HEIGHT, NODE_PADDING_X, LEVEL_GAP }
