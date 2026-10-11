'use client'

import { useCallback, useEffect, useState } from 'react'

export interface CameraState {
  x: number
  y: number
  scale: number
}

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
}

export interface ViewportSize {
  width: number
  height: number
}

export interface UseCameraOptions {
  initialCamera?: CameraState
  minScale?: number
  maxScale?: number
  defaultPadding?: number
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

export function computeContentBounds(
  items: Array<{ x: number; y: number; radius?: number; width?: number; height?: number }>,
  defaultBounds: Bounds = { minX: 0, minY: 0, maxX: 800, maxY: 400, width: 800, height: 400 },
): Bounds {
  if (!items || items.length === 0) return defaultBounds

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const item of items) {
    const r = item.radius ?? 30
    const w = item.width ?? r * 2
    const h = item.height ?? r * 2

    const ixMin = item.x - w / 2
    const ixMax = item.x + w / 2
    const iyMin = item.y - h / 2
    const iyMax = item.y + h / 2

    if (ixMin < minX) minX = ixMin
    if (ixMax > maxX) maxX = ixMax
    if (iyMin < minY) minY = iyMin
    if (iyMax > maxY) maxY = iyMax
  }

  const width = Math.max(1, maxX - minX)
  const height = Math.max(1, maxY - minY)

  return { minX, minY, maxX, maxY, width, height }
}

export function calculateFitCamera(
  bounds: Bounds,
  viewport: ViewportSize,
  padding = 60,
  minScale = 0.05,
  maxScale = 6.0,
  maxFitScale = 1.4,
): CameraState {
  if (bounds.width <= 0 || bounds.height <= 0 || viewport.width <= 0 || viewport.height <= 0) {
    return { x: 0, y: 0, scale: 1 }
  }

  const availW = Math.max(10, viewport.width - padding * 2)
  const availH = Math.max(10, viewport.height - padding * 2)

  const scaleX = availW / bounds.width
  const scaleY = availH / bounds.height
  const rawScale = Math.min(scaleX, scaleY, maxFitScale)
  const scale = clamp(rawScale, minScale, maxScale)

  const centerX = bounds.minX + bounds.width / 2
  const centerY = bounds.minY + bounds.height / 2

  const x = viewport.width / 2 - centerX * scale
  const y = viewport.height / 2 - centerY * scale

  return { x, y, scale }
}

export function calculateCenterCamera(
  bounds: Bounds,
  viewport: ViewportSize,
  currentScale: number,
): CameraState {
  const centerX = bounds.minX + bounds.width / 2
  const centerY = bounds.minY + bounds.height / 2

  const x = viewport.width / 2 - centerX * currentScale
  const y = viewport.height / 2 - centerY * currentScale

  return { x, y, scale: currentScale }
}

export function useCamera(options: UseCameraOptions = {}) {
  const {
    initialCamera = { x: 0, y: 0, scale: 1 },
    minScale = 0.05,
    maxScale = 6.0,
    defaultPadding = 60,
  } = options

  const [camera, setCamera] = useState<CameraState>(initialCamera)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const zoomAt = useCallback(
    (clientX: number, clientY: number, targetScale: number, containerRect: DOMRect | null) => {
      setCamera((c) => {
        const nextScale = clamp(targetScale, minScale, maxScale)
        if (nextScale === c.scale) return c

        const px = containerRect ? clientX - containerRect.left : clientX
        const py = containerRect ? clientY - containerRect.top : clientY

        const worldX = (px - c.x) / c.scale
        const worldY = (py - c.y) / c.scale

        return {
          x: px - worldX * nextScale,
          y: py - worldY * nextScale,
          scale: nextScale,
        }
      })
    },
    [minScale, maxScale],
  )

  const zoomBy = useCallback(
    (factor: number, centerScreenPoint?: { x: number; y: number }, containerRect?: DOMRect | null) => {
      setCamera((c) => {
        const nextScale = clamp(c.scale * factor, minScale, maxScale)
        if (nextScale === c.scale) return c

        const px = centerScreenPoint && containerRect ? centerScreenPoint.x - containerRect.left : 400
        const py = centerScreenPoint && containerRect ? centerScreenPoint.y - containerRect.top : 210

        const worldX = (px - c.x) / c.scale
        const worldY = (py - c.y) / c.scale

        return {
          x: px - worldX * nextScale,
          y: py - worldY * nextScale,
          scale: nextScale,
        }
      })
    },
    [minScale, maxScale],
  )

  const zoomIn = useCallback(
    (containerRect?: DOMRect | null) => zoomBy(1.25, undefined, containerRect),
    [zoomBy],
  )

  const zoomOut = useCallback(
    (containerRect?: DOMRect | null) => zoomBy(0.8, undefined, containerRect),
    [zoomBy],
  )

  const panBy = useCallback((dx: number, dy: number) => {
    setCamera((c) => ({ ...c, x: c.x + dx, y: c.y + dy }))
  }, [])

  const fitToScreen = useCallback(
    (bounds: Bounds, viewport: ViewportSize, padding = defaultPadding) => {
      const fit = calculateFitCamera(bounds, viewport, padding, minScale, maxScale)
      setCamera(fit)
    },
    [defaultPadding, minScale, maxScale],
  )

  const centerView = useCallback((bounds: Bounds, viewport: ViewportSize) => {
    setCamera((c) => calculateCenterCamera(bounds, viewport, c.scale))
  }, [])

  const resetView = useCallback(
    (overrideDefault?: CameraState) => {
      setCamera(overrideDefault ?? initialCamera)
    },
    [initialCamera],
  )

  const toggleFullscreen = useCallback((element: HTMLElement | null) => {
    if (!element) return
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.warn('[useCamera] requestFullscreen failed:', err)
      })
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('[useCamera] exitFullscreen failed:', err)
      })
    }
  }, [])

  return {
    camera,
    setCamera,
    isFullscreen,
    zoomIn,
    zoomOut,
    zoomBy,
    zoomAt,
    panBy,
    fitToScreen,
    centerView,
    resetView,
    toggleFullscreen,
  }
}
