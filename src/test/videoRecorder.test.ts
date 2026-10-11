import { describe, expect, it } from 'vitest'
import { formatDuration } from '../hooks/useVideoRecorder'

describe('Video Recorder Helpers', () => {
  it('formats duration correctly as MM:SS', () => {
    expect(formatDuration(0)).toBe('00:00')
    expect(formatDuration(5000)).toBe('00:05')
    expect(formatDuration(65000)).toBe('01:05')
    expect(formatDuration(3605000)).toBe('60:05')
  })
})
