import { describe, expect, it } from 'vitest'
import { buildSteps } from '../core/simulation/buildSteps'
import { getInitialState } from '../core/simulation/initialStates'

describe('Bloom Filter Invariant & Interaction Tests', () => {
  it('correctly reports DEFINITELY NOT PRESENT when any bit is 0', () => {
    const initialState = getInitialState('bloom-filter')
    const searchSteps = buildSteps('bloom-filter', 'search', { value: 'nonExistentKey999' }, initialState)

    expect(searchSteps.length).toBeGreaterThan(0)
    const finalStep = searchSteps[searchSteps.length - 1]
    expect(finalStep.description).toContain('DEFINITELY NOT PRESENT')
  })

  it('correctly reports PROBABLY PRESENT when all computed bits are set', () => {
    const initialState = getInitialState('bloom-filter')
    const insertSteps = buildSteps('bloom-filter', 'insert', { value: 'apple' }, initialState)
    const afterInsertState = insertSteps[insertSteps.length - 1].modifier(initialState)

    const searchSteps = buildSteps('bloom-filter', 'search', { value: 'apple' }, afterInsertState)
    expect(searchSteps.length).toBeGreaterThan(0)
    const finalStep = searchSteps[searchSteps.length - 1]
    expect(finalStep.description).toContain('PROBABLY PRESENT')
  })

  it('clears or resets bit array on clear operation', () => {
    const initialState = getInitialState('bloom-filter')
    const clearSteps = buildSteps('bloom-filter', 'clear', {}, initialState)
    expect(clearSteps.length).toBe(1)
    const clearedState = clearSteps[0].modifier(initialState)
    expect(clearedState.nodes?.every((n) => n.value === '0')).toBe(true)
  })
})
