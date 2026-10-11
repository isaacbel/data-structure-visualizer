import { describe, expect, it } from 'vitest'
import { buildExportFilename } from '../lib/visualizer/export/filename'

describe('Export Utility Helpers', () => {
  it('generates descriptive sanitized filenames matching specification', () => {
    const today = new Date().toISOString().slice(0, 10)

    const fn1 = buildExportFilename('avl-tree', 'png', 'insert')
    expect(fn1).toBe(`dsv-avl-tree-insert-${today}.png`)

    const fn2 = buildExportFilename('Binary Search Tree!', 'jpeg', 'Search Node')
    expect(fn2).toBe(`dsv-binary-search-tree-search-node-${today}.jpeg`)

    const fn3 = buildExportFilename('graph', 'svg')
    expect(fn3).toBe(`dsv-graph-${today}.svg`)

    const fn4 = buildExportFilename('b-tree', 'webm', 'split')
    expect(fn4).toBe(`dsv-b-tree-split-${today}.webm`)
  })
})
