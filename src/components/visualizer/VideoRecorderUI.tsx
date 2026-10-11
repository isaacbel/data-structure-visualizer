'use client'

import { useRef } from 'react'
import { Download, Square, Pause, Play, Trash2, Video } from 'lucide-react'
import { useVideoRecorder, formatDuration } from '@/hooks/useVideoRecorder'

interface VideoRecorderUIProps {
  /** Ref to the container holding the SVG visualization */
  containerRef: React.RefObject<HTMLElement | null>
  /** Data structure ID for the download filename */
  dsId: string
  /** Current operation name (optional, for filename) */
  operation?: string
}

export function VideoRecorderUI({ containerRef, dsId, operation }: VideoRecorderUIProps) {
  const videoPreviewRef = useRef<HTMLVideoElement>(null)

  const {
    status,
    elapsedMs,
    videoUrl,
    errorMessage,
    isSupported,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadVideo,
    clearVideo,
  } = useVideoRecorder({ containerRef })

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
        <Video size={14} />
        Video recording is not supported by this browser.
      </div>
    )
  }

  // ── Stopped / preview state ──────────────────────────────────────────────
  if (status === 'stopped' && videoUrl) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Video size={13} />
            Video Ready
          </span>
          <button
            onClick={clearVideo}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
            title="Delete recording"
            aria-label="Delete recording"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Preview player */}
        <video
          ref={videoPreviewRef}
          src={videoUrl}
          controls
          className="w-full max-h-48 rounded-lg border border-white/10 bg-slate-950"
          aria-label="Recording preview"
        />

        <button
          onClick={() => downloadVideo(dsId, operation)}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
          aria-label="Download video recording"
          title="Download WebM video"
        >
          <Download size={14} />
          Download WebM
        </button>
      </div>
    )
  }

  // ── Idle state ────────────────────────────────────────────────────────────
  if (status === 'idle') {
    return (
      <div className="flex flex-col gap-1.5">
        {errorMessage && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300">
            {errorMessage}
          </p>
        )}
        <button
          onClick={() => startRecording(`${dsId}${operation ? ` · ${operation}` : ''}`)}
          className="flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-xs text-slate-300 hover:bg-white/5 transition"
          aria-label="Start video recording"
          title="Record animation as WebM video"
        >
          <Video size={14} />
          Record
        </button>
      </div>
    )
  }

  // ── Recording / paused state ──────────────────────────────────────────────
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/90 px-3 py-2 shadow-xl backdrop-blur">
      {/* Recording indicator */}
      <div className={`flex items-center gap-1.5 text-xs font-bold ${status === 'recording' ? 'text-red-400' : 'text-amber-400'}`}>
        <span
          className={`h-2 w-2 rounded-full ${status === 'recording' ? 'animate-pulse bg-red-500' : 'bg-amber-500'}`}
          aria-hidden="true"
        />
        {status === 'recording' ? 'REC' : 'PAUSED'}
      </div>

      {/* Timer */}
      <span className="font-mono text-xs text-slate-200 tabular-nums min-w-[2.5rem]">
        {formatDuration(elapsedMs)}
      </span>

      <div className="flex items-center gap-1 ml-auto">
        {/* Pause / Resume */}
        {status === 'recording' ? (
          <button
            onClick={pauseRecording}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 transition"
            title="Pause recording"
            aria-label="Pause recording"
          >
            <Pause size={14} />
          </button>
        ) : (
          <button
            onClick={resumeRecording}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 transition"
            title="Resume recording"
            aria-label="Resume recording"
          >
            <Play size={14} />
          </button>
        )}

        {/* Stop */}
        <button
          onClick={stopRecording}
          className="flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-500/20 transition"
          title="Stop recording"
          aria-label="Stop recording"
        >
          <Square size={14} />
        </button>
      </div>
    </div>
  )
}
