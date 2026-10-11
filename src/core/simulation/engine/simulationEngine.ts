export type SimEventType =
  | 'COMPARE'
  | 'VISIT'
  | 'ROTATE'
  | 'RECOLOR'
  | 'MOVE_KEY'
  | 'SPLIT_NODE'
  | 'MERGE_NODE'
  | 'BORROW_LEFT'
  | 'BORROW_RIGHT'
  | 'DELETE'
  | 'INSERT'
  | 'SEARCH'
  | 'SWAP'
  | 'HIGHLIGHT'
  | 'MESSAGE'

export interface SimEvent {
  type: SimEventType
  targets: string[]
  description: string
  codeLine: number
}

export interface IDataStructure {
  id: string
  name: string
}

export interface IAlgorithm {
  id: string
  name: string
}
