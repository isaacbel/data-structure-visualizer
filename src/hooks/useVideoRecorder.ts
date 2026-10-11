'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { findPrimarySvg, serializeSvgElement } from '@/lib/visualizer/export/serializeSvg'
import { buildExportFilename } from '@/lib/visualizer/export/filename'

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped'
export type VideoResolution = '720p' | '1080p' | '4k'
export type VideoFps = 30 | 60

export const RESOLUTION_PRESETS: Record<
  VideoResolution,
  { name: string; width: number; height: number; bps: number }
> = {
  '720p': { name: '720p HD', width: 1280, height: 720, bps: 3_000_000 },
  '1080p': { name: '1080p Full HD', width: 1920, height: 1080, bps: 7_000_000 },
  '4k': { name: '4K Ultra HD', width: 3840, height: 2160, bps: 16_000_000 },
}

export interface VideoRecorderState {
  status: RecordingStatus
  elapsedMs: number
  recordedFrames: number
  videoBlob: Blob | null
  videoUrl: string | null
  errorMessage: string | null
  isSupported: boolean
  resolution: VideoResolution
  fps: VideoFps
  watermark: boolean
}

export interface VideoRecorderControls {
  setResolution: (res: VideoResolution) => void
  setFps: (fps: VideoFps) => void
  setWatermark: (wm: boolean) => void
  startRecording: (watermarkLabel?: string) => void
  pauseRecording: () => void
  resumeRecording: () => void
  stopRecording: () => void
  downloadVideo: (dsId: string, operation?: string) => void
  clearVideo: () => void
}

interface UseVideoRecorderOptions {
  /** Ref to container element that holds SVG visualization */
  containerRef: React.RefObject<HTMLElement | null>
  /** Initial resolution (default: '1080p') */
  initialResolution?: VideoResolution
  /** Initial frame rate (default: 60) */
  initialFps?: VideoFps
  /** Initial watermark setting (default: true) */
  initialWatermark?: boolean
}

/**
 * Advanced Video Recording Engine:
 *   SVG → serialize → Data URL → Canvas (with watermark overlay) → captureStream → MediaRecorder → WebM
 *
 * Supports 720p/1080p/4K presets, 30/60 FPS, high-bitrate encoding, watermark overlay,
 * live frame counter, and preview.
 */
export function useVideoRecorder({
  containerRef,
  initialResolution = '1080p',
  initialFps = 60,
  initialWatermark = true,
}: UseVideoRecorderOptions): VideoRecorderState & VideoRecorderControls {
  const [status, setStatus] = useState<RecordingStatus>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [recordedFrames, setRecordedFrames] = useState(0)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [resolution, setResolution] = useState<VideoResolution>(initialResolution)
  const [fps, setFps] = useState<VideoFps>(initialFps)
  const [watermark, setWatermark] = useState<boolean>(initialWatermark)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const elapsedAtPauseRef = useRef<number>(0)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameCountRef = useRef(0)
  const watermarkLabelRef = useRef('')

  // Check browser support
  const isSupported =
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof (HTMLCanvasElement.prototype as any).captureStream === 'function'

  const getMimeType = (): string => {
    const types = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ]
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t
    }
    return ''
  }

  // Draw SVG frame & optional watermark onto offscreen canvas
  const drawFrame = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const container = containerRef.current
      const canvas = offscreenCanvasRef.current
      if (!container || !canvas) { resolve(); return }

      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(); return }

      const svg = findPrimarySvg(container as HTMLElement)
      if (!svg) { resolve(); return }

      try {
        const svgStr = serializeSvgElement(svg)
        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr)
        const img = new Image()

        img.onload = () => {
          // Fill crisp dark background
          ctx.fillStyle = '#020617'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Draw main visualization
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Draw watermark overlay if enabled
          if (watermark) {
            const pad = Math.round(canvas.height * 0.025)
            const fontSize = Math.max(12, Math.round(canvas.height * 0.022))

            ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`
            const text = watermarkLabelRef.current || 'Data Structure Visualizer'
            const textMetrics = ctx.measureText(text)

            const badgeW = textMetrics.width + pad * 2
            const badgeH = fontSize + pad
            const badgeX = pad
            const badgeY = canvas.height - pad - badgeH

            // Badge background
            ctx.fillStyle = 'rgba(2, 6, 23, 0.85)'
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)'
            ctx.lineWidth = 1.5

            ctx.beginPath()
            ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8)
            ctx.fill()
            ctx.stroke()

            // Badge cyan dot
            ctx.fillStyle = '#22d3ee'
            ctx.beginPath()
            ctx.arc(badgeX + pad * 0.75, badgeY + badgeH / 2, fontSize * 0.25, 0, Math.PI * 2)
            ctx.fill()

            // Badge text
            ctx.fillStyle = '#f8fafc'
            ctx.fillText(text, badgeX + pad * 1.3, badgeY + badgeH / 2 + fontSize * 0.35)
          }

          frameCountRef.current++
          setRecordedFrames(frameCountRef.current)
          resolve()
        }
        img.onerror = () => { resolve() }
        img.src = dataUrl
      } catch {
        resolve()
      }
    })
  }, [containerRef, watermark])

  // Render loop
  const renderLoop = useCallback(() => {
    if (!recorderRef.current || recorderRef.current.state === 'inactive') return
    drawFrame().then(() => {
      rafRef.current = requestAnimationFrame(renderLoop)
    })
  }, [drawFrame])

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  const startTimer = () => {
    stopTimer()
    startTimeRef.current = performance.now()
    timerIntervalRef.current = setInterval(() => {
      setElapsedMs(elapsedAtPauseRef.current + (performance.now() - startTimeRef.current))
    }, 100)
  }

  const startRecording = useCallback(
    (watermarkLabel?: string) => {
      if (!isSupported) {
        setErrorMessage('Video recording is not supported by this browser.')
        return
      }

      watermarkLabelRef.current = watermarkLabel ?? ''
      setErrorMessage(null)
      chunksRef.current = []
      frameCountRef.current = 0
      setRecordedFrames(0)
      setVideoBlob(null)
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
        setVideoUrl(null)
      }

      const preset = RESOLUTION_PRESETS[resolution]
      const canvas = document.createElement('canvas')
      canvas.width = preset.width
      canvas.height = preset.height
      offscreenCanvasRef.current = canvas

      const stream = (canvas as any).captureStream(fps) as MediaStream
      const mimeType = getMimeType()

      if (!mimeType) {
        setErrorMessage('No supported video codec found in this browser.')
        return
      }

      try {
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: preset.bps,
        })
        recorderRef.current = recorder

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data)
          }
        }

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mimeType })
          const url = URL.createObjectURL(blob)
          setVideoBlob(blob)
          setVideoUrl(url)
          setStatus('stopped')
          stopTimer()
        }

        recorder.onerror = (e) => {
          console.error('[VideoRecorder] error:', e)
          setErrorMessage('Recording error occurred.')
          setStatus('idle')
          stopTimer()
        }

        recorder.start(100)
        setStatus('recording')
        elapsedAtPauseRef.current = 0
        setElapsedMs(0)
        startTimer()

        rafRef.current = requestAnimationFrame(renderLoop)
      } catch (err) {
        console.error('[VideoRecorder] start error:', err)
        setErrorMessage('Could not initialize recording.')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSupported, resolution, fps, videoUrl, renderLoop],
  )

  const pauseRecording = useCallback(() => {
    if (!recorderRef.current || recorderRef.current.state !== 'recording') return
    recorderRef.current.pause()
    setStatus('paused')
    elapsedAtPauseRef.current += performance.now() - startTimeRef.current
    stopTimer()
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const resumeRecording = useCallback(() => {
    if (!recorderRef.current || recorderRef.current.state !== 'paused') return
    recorderRef.current.resume()
    setStatus('recording')
    startTimer()
    rafRef.current = requestAnimationFrame(renderLoop)
  }, [renderLoop])

  const stopRecording = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    stopTimer()
  }, [])

  const downloadVideo = useCallback(
    (dsId: string, operation?: string) => {
      if (!videoUrl || !videoBlob) return
      const filename = buildExportFilename(dsId, 'webm', operation)
      const link = document.createElement('a')
      link.href = videoUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    [videoUrl, videoBlob],
  )

  const clearVideo = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    setVideoBlob(null)
    setStatus('idle')
    setElapsedMs(0)
    setRecordedFrames(0)
    setErrorMessage(null)
    chunksRef.current = []
    offscreenCanvasRef.current = null
  }, [videoUrl])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      stopTimer()
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop()
      }
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [])

  return {
    status,
    elapsedMs,
    recordedFrames,
    videoBlob,
    videoUrl,
    errorMessage,
    isSupported,
    resolution,
    fps,
    watermark,
    setResolution,
    setFps,
    setWatermark,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadVideo,
    clearVideo,
  }
}

/** Format elapsed milliseconds as MM:SS */
export function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60).toString().padStart(2, '0')
  const s = (total % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/** Format bytes into human-readable MB */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 MB'
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}
