export interface BTreeNode<T = number> {
  id: string
  keys: T[]
  children: BTreeNode<T>[]
  isLeaf: boolean
  next?: BTreeNode<T> | null // Doubly linked list for B+ Tree leaves
  prev?: BTreeNode<T> | null
  parent?: BTreeNode<T> | null
  x?: number
  y?: number
  width?: number
}

export interface BTreeConfig {
  /** Minimum degree t (order m = 2t). Default t = 2 (Order 4: min keys 1, max keys 3). */
  t: number
  allowDuplicates?: boolean
  isBPlusTree?: boolean
  comparator?: (a: number, b: number) => number
}

export interface BTreeValidationReport {
  isValid: boolean
  heightUniform: boolean
  keysSorted: boolean
  keyCountsValid: boolean
  rootValid: boolean
  leafLinksValid: boolean
  errors: string[]
  height: number
  nodeCount: number
  leafCount: number
  totalKeys: number
  minKeysPerNode: number
  maxKeysPerNode: number
  avgBranchingFactor: number
}

export type BTreeOpType =
  | 'insert'
  | 'delete'
  | 'search'
  | 'rangeSearch'
  | 'inorder'
  | 'preorder'
  | 'postorder'
  | 'levelorder'
  | 'leafTraversal'

export interface BTreeStep {
  description: string
  codeLine: number
  action?: 'insert' | 'delete' | 'search' | 'overflow' | 'split' | 'underflow' | 'borrow' | 'merge' | 'root_split' | 'root_collapse' | 'link_traverse'
  highlightNodeId?: string
  highlightKey?: number
  highlightRange?: [number, number]
  treeSnapshot: BTreeNode<number>
}
