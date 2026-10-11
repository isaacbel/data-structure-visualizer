import { describe, expect, it } from 'vitest'
import {
  calculateCenterCamera,
  calculateFitCamera,
  clamp,
  computeContentBounds,
} from '../hooks/useCamera'

describe('useCamera Math Helpers', () => {
  it('clamps values correctly between min and max', () => {
    expect(clamp(0.01, 0.05, 6.0)).toBe(0.05)
    expect(clamp(10, 0.05, 6.0)).toBe(6.0)
    expect(clamp(2.5, 0.05, 6.0)).toBe(2.5)
  })

  it('computes content bounds for nodes', () => {
    const items = [
      { x: 100, y: 100, radius: 20 },
      { x: 300, y: 400, radius: 20 },
    ]
    const bounds = computeContentBounds(items)
    expect(bounds.minX).toBe(80)
    expect(bounds.maxX).toBe(320)
    expect(bounds.minY).toBe(80)
    expect(bounds.maxY).toBe(420)
    expect(bounds.width).toBe(240)
    expect(bounds.height).toBe(340)
  })

  it('calculates fit-to-screen camera correctly', () => {
    const bounds = { minX: 0, minY: 0, maxX: 400, maxY: 300, width: 400, height: 300 }
    const viewport = { width: 800, height: 600 }
    const cam = calculateFitCamera(bounds, viewport, 50, 0.05, 6.0, 2.0)

    // Avail width: 800 - 100 = 700. ScaleX = 700 / 400 = 1.75
    // Avail height: 600 - 100 = 500. ScaleY = 500 / 300 = 1.6667
    // Expected scale = 1.6667
    expect(cam.scale).toBeCloseTo(1.6667, 3)

    // CenterX = 200, CenterY = 150
    // x = 400 - 200 * 1.6667 = 66.66
    // y = 300 - 150 * 1.6667 = 50
    expect(cam.x).toBeCloseTo(66.666, 1)
    expect(cam.y).toBeCloseTo(50.0, 1)
  })

  it('calculates center camera keeping current scale', () => {
    const bounds = { minX: 100, minY: 100, maxX: 300, maxY: 300, width: 200, height: 200 }
    const viewport = { width: 800, height: 600 }
    const cam = calculateCenterCamera(bounds, viewport, 2.0)

    expect(cam.scale).toBe(2.0)
    // Center = (200, 200)
    // x = 400 - 200 * 2 = 0
    // y = 300 - 200 * 2 = -100
    expect(cam.x).toBe(0)
    expect(cam.y).toBe(-100)
  })
})
