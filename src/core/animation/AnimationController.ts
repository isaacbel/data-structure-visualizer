import type { AnimationStatus, AnimationStep, VisualState } from '@/types'
import { cloneState } from '@/utils/stateClone'

export type StateSetter = (state: VisualState | ((prev: VisualState) => VisualState)) => void

export class AnimationController {
  private steps: AnimationStep[] = []
  private stepIndex = 0
  private status: AnimationStatus = 'idle'
  private initialState: VisualState = {}
  private currentState: VisualState = {}
  private cancelDelay: (() => void) | null = null
  private playbackId = 0
  private stateCache = new Map<number, VisualState>()

  constructor(
    private setState: StateSetter,
    private getSpeed: () => number,
    private onStatusChange?: (status: AnimationStatus) => void,
  ) {}

  setInitialState(state: VisualState): void {
    this.stopPlayback()
    this.initialState = cloneState(state)
    this.currentState = cloneState(state)
    this.stepIndex = 0
    this.stateCache.clear()
    this.setStatus('idle')
  }

  addStep(description: string, codeLine: number, modifier: AnimationStep['modifier']): void {
    this.addSteps([{ description, codeLine, modifier }])
  }

  addSteps(steps: AnimationStep[]): void {
    this.pause()
    this.steps.push(...steps)
    if (this.stepIndex < this.steps.length && this.status === 'finished') this.setStatus('paused')
  }

  getStatus(): AnimationStatus { return this.status }
  getStepIndex(): number { return this.stepIndex }
  getTotalSteps(): number { return this.steps.length }

  getExecutionStates(): VisualState[] {
    return Array.from({ length: this.steps.length + 1 }, (_, index) => this.getStateAt(index))
  }

  play(): void {
    if (this.status === 'playing' || this.steps.length === 0) return
    if (this.stepIndex >= this.steps.length) this.reset()
    this.setStatus('playing')
    const runId = ++this.playbackId
    void this.run(runId)
  }

  private async run(runId: number): Promise<void> {
    while (runId === this.playbackId && this.status === 'playing' && this.stepIndex < this.steps.length) {
      this.stepIndex++
      this.publishState()
      if (this.stepIndex === this.steps.length) {
        this.setStatus('finished')
        return
      }
      await this.delay()
    }
  }

  private getStateAt(target: number): VisualState {
    let index = target
    while (index > 0 && !this.stateCache.has(index)) index--
    let state = cloneState(this.stateCache.get(index) ?? this.initialState)
    while (index < target) {
      const step = this.steps[index]
      state = cloneState(step.modifier(cloneState(state)))
      index++
      this.stateCache.set(index, cloneState(state))
    }
    const step = this.steps[target - 1]
    return {
      ...state,
      description: step?.description ?? '',
      highlightedCodeLine: step?.codeLine ?? -1,
      stepNumber: target,
      totalSteps: this.steps.length,
    }
  }

  private publishState(): void {
    this.currentState = this.getStateAt(this.stepIndex)
    this.setState(cloneState(this.currentState))
  }

  private stopPlayback(): void {
    this.playbackId++
    this.cancelDelay?.()
    this.cancelDelay = null
  }

  pause(): void {
    this.stopPlayback()
    if (this.status === 'playing') this.setStatus('paused')
  }

  stepForward(): void {
    this.scrubTo(this.stepIndex + 1)
  }

  stepBackward(): void {
    this.scrubTo(this.stepIndex - 1)
  }

  reset(): void {
    this.stopPlayback()
    this.stepIndex = 0
    this.setStatus('idle')
    this.publishState()
  }

  clearSteps(): void {
    this.stopPlayback()
    this.steps = []
    this.stepIndex = 0
    this.stateCache.clear()
    this.setStatus('idle')
  }

  scrubTo(step: number): void {
    if (!Number.isFinite(step)) return
    this.stopPlayback()
    this.stepIndex = Math.max(0, Math.min(Math.trunc(step), this.steps.length))
    this.setStatus(this.steps.length === 0 ? 'idle' : this.stepIndex === this.steps.length ? 'finished' : 'paused')
    this.publishState()
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => {
      let resolved = false
      let elapsed = 0
      let previous = performance.now()
      let frameId: number | undefined
      let timeoutId: ReturnType<typeof setTimeout> | undefined
      const useFrames = typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
      const finish = () => {
        if (resolved) return
        resolved = true
        if (frameId !== undefined) window.cancelAnimationFrame(frameId)
        if (timeoutId !== undefined) clearTimeout(timeoutId)
        this.cancelDelay = null
        resolve()
      }
      const schedule = () => {
        if (useFrames) frameId = window.requestAnimationFrame(tick)
        else timeoutId = setTimeout(() => tick(performance.now()), 16)
      }
      const tick = (now: number) => {
        const speed = this.getSpeed()
        elapsed += (now - previous) * (Number.isFinite(speed) && speed > 0 ? speed : 1)
        previous = now
        if (elapsed >= 1000) finish()
        else schedule()
      }
      this.cancelDelay = finish
      schedule()
    })
  }

  private setStatus(status: AnimationStatus): void {
    if (this.status === status) return
    this.status = status
    this.onStatusChange?.(status)
  }
}
