'use client'

import { useEffect } from 'react'
import { Command, X } from 'lucide-react'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SHORTCUTS = [
  { key: '+ / =', action: 'Zoom In' },
  { key: '-', action: 'Zoom Out' },
  { key: '0', action: 'Fit Visualization to Screen' },
  { key: 'R', action: 'Reset View / Restart Step' },
  { key: 'F', action: 'Toggle Fullscreen' },
  { key: 'Space', action: 'Play / Pause Animation' },
  { key: '←', action: 'Step Backward' },
  { key: '→', action: 'Step Forward' },
  { key: 'Ctrl + Z', action: 'Undo Editing Change' },
  { key: 'Ctrl + Y', action: 'Redo Editing Change' },
  { key: '?', action: 'Toggle Keyboard Shortcuts' },
  { key: 'Esc', action: 'Close Modal / Exit Fullscreen' },
]

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Command size={18} />
            <h3 id="shortcuts-title" className="text-base font-bold text-slate-100">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-slate-100 transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Close keyboard shortcuts dialog"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-950 px-3 py-2 text-xs"
            >
              <span className="text-slate-300 font-medium">{sc.action}</span>
              <kbd className="rounded border border-white/10 bg-slate-800 px-2 py-1 font-mono font-bold text-cyan-300">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="btn-primary min-h-9 px-5 text-xs"
            aria-label="Close modal"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
