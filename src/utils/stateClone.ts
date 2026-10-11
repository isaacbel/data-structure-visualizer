import type { VisualState } from '@/types'

export function cloneState(state: VisualState): VisualState {
  return structuredClone(state)
}

export const deepClone = cloneState
