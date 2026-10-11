import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { AnimationController } from '@/core/animation/AnimationController'
import type { VisualState } from '@/types'

function setup() {
  let current: VisualState = { nodes: [{ id: 'n', value: 0, x: 0, y: 0 }] }
  let speed = 1
  const indices: number[] = []
  const controller = new AnimationController((state) => {
    current = typeof state === 'function' ? state(current) : state
    indices.push(controller.getStepIndex())
  }, () => speed)
  controller.setInitialState(current)
  for (let index = 1; index <= 3; index++) {
    controller.addStep(`Value is ${index}`, index, (state) => {
      state.nodes![0].value = Number(state.nodes![0].value) + 1
      return state
    })
  }
  return { controller, indices, state: () => current, setSpeed: (value: number) => { speed = value } }
}

describe('AnimationController', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame'] }))
  afterEach(() => vi.useRealTimers())

  it('publishes the current step index and preserves the final explanation', async () => {
    const { controller, state, indices } = setup()
    controller.play()
    expect(indices).toEqual([1])
    await vi.advanceTimersByTimeAsync(2200)
    expect(controller.getStatus()).toBe('finished')
    expect(state()).toMatchObject({ description: 'Value is 3', highlightedCodeLine: 3, stepNumber: 3, totalSteps: 3 })
  })

  it('replays the same recorded steps without reapplying mutations', async () => {
    const { controller, state } = setup()
    controller.play()
    await vi.advanceTimersByTimeAsync(2200)
    controller.play()
    expect(state().nodes![0].value).toBe(1)
    await vi.advanceTimersByTimeAsync(2200)
    expect(state().nodes![0].value).toBe(3)
    expect(controller.getTotalSteps()).toBe(3)
  })

  it('allows next and resume after stepping back from completion', async () => {
    const { controller, state } = setup()
    controller.scrubTo(3)
    controller.stepBackward()
    expect(controller.getStatus()).toBe('paused')
    expect(state().nodes![0].value).toBe(2)
    controller.stepForward()
    expect(state().nodes![0].value).toBe(3)
    controller.scrubTo(1)
    controller.play()
    await vi.advanceTimersByTimeAsync(1200)
    expect(controller.getStatus()).toBe('finished')
    expect(state().nodes![0].value).toBe(3)
  })

  it('does not start overlapping playback loops', async () => {
    const { controller, state } = setup()
    controller.play()
    controller.play()
    controller.play()
    expect(state().stepNumber).toBe(1)
    await vi.advanceTimersByTimeAsync(1050)
    expect(state().stepNumber).toBe(2)
  })

  it('pauses immediately and cancels obsolete operations', async () => {
    const { controller, state } = setup()
    controller.play()
    controller.pause()
    await vi.advanceTimersByTimeAsync(3000)
    expect(state().stepNumber).toBe(1)
    controller.play()
    controller.clearSteps()
    controller.setInitialState({ nodes: [{ id: 'replacement', value: 10, x: 0, y: 0 }] })
    controller.addStep('Replacement result', 1, (s) => ({ ...s, visited: ['replacement'] }))
    controller.play()
    await vi.advanceTimersByTimeAsync(3000)
    expect(state().nodes![0].value).toBe(10)
    expect(state().description).toBe('Replacement result')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('resets to step zero without discarding the trace', () => {
    const { controller, state } = setup()
    controller.scrubTo(3)
    controller.reset()
    expect(controller.getStatus()).toBe('idle')
    expect(state().nodes![0].value).toBe(0)
    expect(state().stepNumber).toBe(0)
    expect(controller.getTotalSteps()).toBe(3)
    controller.stepForward()
    expect(state().nodes![0].value).toBe(1)
  })

  it('responds to speed changes during the current delay', async () => {
    const { controller, state, setSpeed } = setup()
    controller.play()
    await vi.advanceTimersByTimeAsync(400)
    setSpeed(5)
    await vi.advanceTimersByTimeAsync(150)
    expect(state().stepNumber).toBe(2)
    controller.pause()
  })

  it('isolates snapshots from mutating modifiers, renderers and exported states', () => {
    const { controller, state } = setup()
    controller.scrubTo(3)
    state().nodes![0].value = 999
    controller.scrubTo(1)
    expect(state().nodes![0].value).toBe(1)
    const trace = controller.getExecutionStates()
    trace[1].nodes![0].value = -1
    controller.scrubTo(1)
    expect(state().nodes![0].value).toBe(1)
    expect(trace.map((s) => s.highlightedCodeLine)).toEqual([-1, 1, 2, 3])
  })

  it('isolates hash buckets and auxiliary state across seek and reset', () => {
    let state: VisualState = {}
    const initial = { buckets: [{ index: 0, items: [{ value: 'a' }] }], visited: ['a'] }
    const controller = new AnimationController((s) => { state = typeof s === 'function' ? s(state) : s }, () => 1)
    controller.setInitialState(initial)
    controller.addStep('Insert b', 1, (s) => {
      s.buckets![0].items.push({ value: 'b' })
      s.visited!.push('b')
      return s
    })
    controller.stepForward()
    controller.reset()
    expect(state.buckets).toEqual(initial.buckets)
    expect(state.visited).toEqual(['a'])
    expect(initial.buckets[0].items).toHaveLength(1)
  })

  it('clamps seeking and ignores invalid positions and empty playback', () => {
    const { controller } = setup()
    controller.scrubTo(1.9)
    expect(controller.getStepIndex()).toBe(1)
    controller.scrubTo(NaN)
    expect(controller.getStepIndex()).toBe(1)
    controller.scrubTo(100)
    expect(controller.getStepIndex()).toBe(3)
    controller.clearSteps()
    controller.play()
    expect(controller.getStatus()).toBe('idle')
  })
})
