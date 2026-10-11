import React from 'react'
import { X, Keyboard, Command } from 'lucide-react'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SHORTCUTS = [
  { key: 'Space', description: 'Play / Pause visualizer animation' },
  { key: '←', description: 'Step backward 1 step' },
  { key: '→', description: 'Step forward 1 step' },
  { key: '↑', description: 'Increase animation speed' },
  { key: '↓', description: 'Decrease animation speed' },
  { key: 'R', description: 'Reset visualization to initial state' },
  { key: 'F', description: 'Toggle Fullscreen canvas mode' },
  { key: '?', description: 'Toggle Keyboard Shortcuts dialog' },
  { key: '/', description: 'Focus search bar in header' },
  { key: 'Esc', description: 'Close modals / exit fullscreen' },
]

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Keyboard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Keyboard Navigation Shortcuts</h2>
            <p className="text-xs text-slate-400">Accessibility & Hotkey Reference</p>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/40 px-3.5 py-2"
            >
              <span className="text-xs text-slate-300">{sc.description}</span>
              <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-slate-700/80 px-2 text-[11px] font-mono font-bold text-cyan-300 border border-white/10 shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <Command className="h-3 w-3" /> Press <kbd className="font-mono text-slate-300">?</kbd> at any time to toggle this modal.
          </p>
        </div>
      </div>
    </div>
  )
}
