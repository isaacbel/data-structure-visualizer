import { describe, expect, it } from 'vitest'
import { BTreeEngine } from '@/core/btree/BTreeEngine'
import { BPlusTreeEngine } from '@/core/btree/BPlusTreeEngine'
import { generateBTree, generateBPlusTree } from '@/core/btree/generators'

// ─── B-Tree Tests ────────────────────────────────────────────────────────────

describe('BTreeEngine — Invariant Maintenance', () => {
  it('starts empty with valid empty tree', () => {
    const engine = new BTreeEngine({ t: 2 })
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.nodeCount).toBe(0)
  })

  it('inserts a single key correctly', () => {
    const engine = new BTreeEngine({ t: 2 })
    engine.insert(10)
    expect(engine.root?.keys).toEqual([10])
    expect(engine.root?.isLeaf).toBe(true)
    const report = engine.validate()
    expect(report.isValid).toBe(true)
  })

  it('inserts sequential keys and maintains sorted order', () => {
    const engine = new BTreeEngine({ t: 2 })
    for (let i = 1; i <= 10; i++) engine.insert(i)
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.keysSorted).toBe(true)
    expect(report.heightUniform).toBe(true)
  })

  it('root splits when exceeding 2t-1 keys (t=2: 3 max keys)', () => {
    const engine = new BTreeEngine({ t: 2 })
    // After inserting 4 keys, root should split
    for (const k of [10, 20, 30, 40]) engine.insert(k)
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    // After split, root should have fewer keys
    expect(engine.root!.keys.length).toBeLessThan(4)
  })

  it('maintains invariants for 100 random insertions', () => {
    const engine = new BTreeEngine({ t: 3 })
    for (let i = 0; i < 100; i++) engine.insert(Math.floor(Math.random() * 1000))
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.heightUniform).toBe(true)
  })

  it('search finds existing key', () => {
    const engine = new BTreeEngine({ t: 2 })
    for (const k of [5, 10, 15, 20, 25, 30]) engine.insert(k)
    const steps = engine.searchSteps(15)
    const lastStep = steps[steps.length - 1]
    expect(lastStep.description).toMatch(/FOUND/)
    expect(lastStep.highlightKey).toBe(15)
  })

  it('search reports not found for missing key', () => {
    const engine = new BTreeEngine({ t: 2 })
    for (const k of [5, 10, 20]) engine.insert(k)
    const steps = engine.searchSteps(99)
    const lastStep = steps[steps.length - 1]
    expect(lastStep.description).toMatch(/NOT FOUND/)
  })

  it('delete removes a key and maintains invariants', () => {
    const engine = new BTreeEngine({ t: 2 })
    for (const k of [10, 20, 30, 40, 50, 60]) engine.insert(k)
    engine.delete(30)
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    // Key should not be in root path
    const searchSteps = engine.searchSteps(30)
    expect(searchSteps[searchSteps.length - 1].description).toMatch(/NOT FOUND/)
  })

  it('deletion generates steps for borrow/merge operations', () => {
    const engine = new BTreeEngine({ t: 2 })
    for (const k of [1, 2, 3, 4, 5, 6, 7, 8]) engine.insert(k)
    const steps = engine.delete(4)
    expect(steps.length).toBeGreaterThan(0)
    const report = engine.validate()
    expect(report.isValid).toBe(true)
  })

  it('handles higher degree t=4 correctly', () => {
    const engine = new BTreeEngine({ t: 4 })
    for (let i = 1; i <= 50; i++) engine.insert(i * 3)
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.maxKeysPerNode).toBeLessThanOrEqual(7) // 2*4-1
  })
})

// ─── B+ Tree Tests ───────────────────────────────────────────────────────────

describe('BPlusTreeEngine — Invariant Maintenance', () => {
  it('starts empty with valid state', () => {
    const engine = new BPlusTreeEngine({ t: 2 })
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.leafLinksValid).toBe(true)
  })

  it('inserts single key as leaf root', () => {
    const engine = new BPlusTreeEngine({ t: 2 })
    engine.insert(42)
    expect(engine.root?.isLeaf).toBe(true)
    expect(engine.root?.keys).toEqual([42])
  })

  it('leaf split produces valid leaf-linked list', () => {
    const engine = new BPlusTreeEngine({ t: 2 })
    for (const k of [10, 20, 30, 40]) engine.insert(k)
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.leafLinksValid).toBe(true)
  })

  it('all keys reside in leaf nodes (B+ Tree property)', () => {
    const engine = new BPlusTreeEngine({ t: 2 })
    const inserted = [5, 15, 25, 35, 45, 55, 65, 75]
    for (const k of inserted) engine.insert(k)

    // Collect all leaf keys by walking leaf list
    const leafKeys: number[] = []
    let cur = engine.leafHead
    while (cur) { leafKeys.push(...cur.keys); cur = cur.next ?? null }

    // All inserted keys should appear in leaves
    for (const k of inserted) expect(leafKeys).toContain(k)
  })

  it('range search finds correct keys', () => {
    const engine = new BPlusTreeEngine({ t: 2 })
    for (let i = 1; i <= 30; i++) engine.insert(i * 5)
    const steps = engine.rangeSearchSteps(20, 70)
    expect(steps.length).toBeGreaterThan(0)
    const lastStep = steps[steps.length - 1]
    expect(lastStep.description).toMatch(/Range Search completed/)
  })

  it('search finds key in leaf', () => {
    const engine = new BPlusTreeEngine({ t: 2 })
    for (const k of [10, 20, 30, 40]) engine.insert(k)
    const steps = engine.searchSteps(20)
    const lastStep = steps[steps.length - 1]
    expect(lastStep.description).toMatch(/FOUND/)
  })

  it('search reports not found for absent key', () => {
    const engine = new BPlusTreeEngine({ t: 2 })
    for (const k of [10, 20, 30]) engine.insert(k)
    const steps = engine.searchSteps(99)
    const lastStep = steps[steps.length - 1]
    expect(lastStep.description).toMatch(/NOT FOUND/)
  })

  it('maintains leaf order (leaves sorted ascending)', () => {
    const engine = new BPlusTreeEngine({ t: 3 })
    for (let i = 0; i < 50; i++) engine.insert(Math.floor(Math.random() * 500))
    let prevMax = -Infinity
    let cur = engine.leafHead
    while (cur) {
      expect(cur.keys[0]).toBeGreaterThanOrEqual(prevMax)
      prevMax = cur.keys[cur.keys.length - 1]
      cur = cur.next ?? null
    }
  })
})

// ─── Generator Tests ─────────────────────────────────────────────────────────

describe('B-Tree Generator', () => {
  it('generates valid B-Tree with correct key count', () => {
    const { engine } = generateBTree({ type: 'btree', t: 2, keyCount: 30, seed: 42 })
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.totalKeys).toBeLessThanOrEqual(30) // some may be deduped
  })

  it('generates deterministic trees from same seed', () => {
    const { keysInserted: k1 } = generateBTree({ type: 'btree', t: 2, keyCount: 20, seed: 12345 })
    const { keysInserted: k2 } = generateBTree({ type: 'btree', t: 2, keyCount: 20, seed: 12345 })
    expect(k1).toEqual(k2)
  })

  it('generates valid B+ Tree with leaf links intact', () => {
    const { engine } = generateBPlusTree({ type: 'bplus', t: 3, keyCount: 40, seed: 999 })
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.leafLinksValid).toBe(true)
  })

  it('sequential insertion produces valid B-Tree', () => {
    const { engine } = generateBTree({ type: 'btree', t: 2, keyCount: 25, seed: 1, insertionOrder: 'sequential' })
    const report = engine.validate()
    expect(report.isValid).toBe(true)
  })

  it('reverse insertion produces valid B+ Tree', () => {
    const { engine } = generateBPlusTree({ type: 'bplus', t: 2, keyCount: 20, seed: 77, insertionOrder: 'reverse' })
    const report = engine.validate()
    expect(report.isValid).toBe(true)
    expect(report.leafLinksValid).toBe(true)
  })
})
