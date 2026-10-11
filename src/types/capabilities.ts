import type { DataStructureConfig } from './index'

/**
 * Describes what controls and features a given visualizer supports.
 * Used by toolbars and canvases to show/hide controls contextually.
 */
export interface VisualizerCapabilities {
  zoom: boolean
  pan: boolean
  fullscreen: boolean

  exportPNG: boolean
  exportJPEG: boolean
  exportSVG: boolean
  exportVideo: boolean

  playback: boolean
  timeline: boolean
  stepControl: boolean

  undo: boolean
  redo: boolean

  randomGeneration: boolean
  /** Show tree-specific generation modes (balanced/sparse/skewed/etc.) — TREE ONLY */
  treeGenerationModes: boolean

  /** Show graph-specific editing controls — GRAPH ONLY */
  graphControls: boolean

  /** Show B-Tree / B+ Tree type toggle — BTree page ONLY */
  treeTypeSelector: boolean
  /** Show Min Heap / Max Heap toggle — Heap visualizers ONLY */
  heapTypeSelector: boolean

  memoryInspector: boolean
}

/** Non-tree data structure types */
const NON_TREE_TYPES = ['linear', 'linked', 'stack', 'queue', 'hash', 'graph', 'sorting', 'searching', 'dp']

/** Structures that use dedicated custom pages rather than generic visualizer */
const CUSTOM_DEDICATED_PAGES = ['b-tree', 'b-plus-tree']

/**
 * Derive capabilities from the data structure ID and its config.
 * This is the single source of truth — no scattered UI conditions.
 */
export function getVisualizerCapabilities(
  ds: string,
  config: DataStructureConfig,
): VisualizerCapabilities {
  const dsId = ds.toLowerCase()
  const isTree = config.type === 'tree'
  const isGraph = config.type === 'graph'
  const isHash = config.type === 'hash'
  const isLinear = ['linear', 'linked', 'stack', 'queue'].includes(config.type)

  // Structures that genuinely support tree-generation modes (balanced, sparse, skewed)
  // MUST NEVER be true for non-tree structures!
  const treeGenerationModes =
    isTree &&
    !NON_TREE_TYPES.includes(config.type) &&
    !['segment-tree', 'fenwick-tree', 'suffix-tree', 'rope', 'b-tree', 'b-plus-tree'].includes(dsId)

  // B-Tree / B+ Tree selector — ONLY for B-Tree pages
  const treeTypeSelector = dsId === 'b-tree' || dsId === 'b-plus-tree'

  // Min / Max Heap selector — ONLY for Heap visualizers
  const heapTypeSelector = dsId === 'min-heap' || dsId === 'max-heap' || dsId === 'heap' || dsId === 'priority-queue'

  return {
    zoom: true,
    pan: true,
    fullscreen: true,

    exportPNG: true,
    exportJPEG: true,
    exportSVG: true,
    exportVideo: true,

    playback: true,
    timeline: true,
    stepControl: true,

    undo: isGraph || isTree,
    redo: isGraph || isTree,

    randomGeneration: true,
    treeGenerationModes,

    graphControls: isGraph,
    treeTypeSelector,
    heapTypeSelector,

    memoryInspector: isHash || isLinear,
  }
}
