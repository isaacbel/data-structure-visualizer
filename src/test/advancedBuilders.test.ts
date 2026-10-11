import { describe, expect, it } from 'vitest'
import { buildSteps } from '../core/simulation/buildSteps'
import { getInitialState } from '../core/simulation/initialStates'

describe('Bloom Filter & Union-Find Step Builders', () => {
  it('generates correct insertion and search animation steps for Bloom Filter', () => {
    const state = getInitialState('bloom-filter')
    expect(state.nodes).toBeDefined()
    expect(state.nodes?.length).toBe(12)

    // Insert operation
    const insertSteps = buildSteps('bloom-filter', 'insert', { value: 'testKey' }, state)
    expect(insertSteps.length).toBe(2)
    expect(insertSteps[0].description).toContain('Insert "testKey"')
    expect(insertSteps[1].description).toContain('Set bits')

    // Apply modifier and verify bits set to 1
    const s1 = insertSteps[0].modifier(state)
    const s2 = insertSteps[1].modifier(s1)
    const greenBits = s2.nodes?.filter((n) => n.value === '1' && n.highlight === 'green')
    expect(greenBits?.length).toBeGreaterThan(0)

    // Search operation on updated state
    const searchSteps = buildSteps('bloom-filter', 'search', { value: 'testKey' }, s2)
    expect(searchSteps.length).toBe(2)
    expect(searchSteps[1].description).toContain('PROBABLY PRESENT')
  })

  it('generates correct find, union, and makeSet steps for Union-Find', () => {
    const state = getInitialState('union-find')
    expect(state.nodes).toBeDefined()

    // Find operation
    const findSteps = buildSteps('union-find', 'find', { value: '0' }, state)
    expect(findSteps.length).toBe(2)
    expect(findSteps[0].description).toContain('Find(0)')
    expect(findSteps[1].description).toContain('Root of component is')

    // Union operation merging 0 and 2
    const unionSteps = buildSteps('union-find', 'union', { value: '0 2' }, state)
    expect(unionSteps.length).toBe(2)
    expect(unionSteps[0].description).toContain('Union(0, 2)')
    expect(unionSteps[1].description).toContain('Attach root')

    // Apply union modifier and verify new edge added between roots
    const finalUnionState = unionSteps[1].modifier(state)
    expect(finalUnionState.edges?.length).toBe((state.edges?.length ?? 0) + 1)

    // MakeSet operation
    const makeSetSteps = buildSteps('union-find', 'makeSet', { value: '99' }, state)
    expect(makeSetSteps.length).toBe(1)
    const afterMakeSet = makeSetSteps[0].modifier(state)
    expect(afterMakeSet.nodes?.some((n) => String(n.value) === '99')).toBe(true)
  })
})
