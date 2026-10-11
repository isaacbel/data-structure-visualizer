'use client'

import { memo } from 'react'
import type { VisualState } from '@/types'

interface TrackerPanelProps {
  state: VisualState
  visible: boolean
}

export const TrackerPanel = memo(function TrackerPanel({ state, visible }: TrackerPanelProps) {
  if (!visible) return null

  const queue = state.queue ?? []
  const stack = state.stack ?? []
  const pq = state.priorityQueue ?? []
  const distance = state.distanceTable ?? {}
  const parent = state.parentTable ?? {}

  const hasDistance = Object.keys(distance).length > 0
  const hasParent = Object.keys(parent).length > 0

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-900/50 p-4 text-slate-200 backdrop-blur-sm">
      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Execution Tracker</h3>

      {/* Queue frame */}
      {queue.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Queue (FIFO):</span>
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-950/60 p-2 border border-white/5 min-h-[2.5rem]">
            {queue.map((item, i) => (
              <div key={i} className="flex h-7 min-w-[1.75rem] items-center justify-center rounded bg-cyan-600 px-1.5 text-xs font-bold text-white shadow">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stack frame */}
      {stack.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Stack (LIFO):</span>
          <div className="flex flex-col-reverse gap-1 rounded-lg bg-slate-950/60 p-2 border border-white/5 min-h-[3rem]">
            {stack.map((item, i) => (
              <div key={i} className="flex h-7 items-center justify-center rounded bg-violet-600 px-2 text-xs font-bold text-white shadow">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Queue */}
      {pq.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Priority Queue:</span>
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-950/60 p-2 border border-white/5">
            {pq.map((item, i) => (
              <div key={i} className="flex h-7 items-center gap-1 rounded bg-amber-600 px-2 text-xs font-bold text-white shadow">
                <span>{item.value}</span>
                <span className="rounded bg-black/30 px-1 text-[10px]">P:{item.priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distance Table */}
      {hasDistance && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Distance Table:</span>
          <div className="overflow-hidden rounded-lg border border-white/5 bg-slate-950/60 text-xs">
            <div className="grid grid-cols-2 border-b border-white/5 bg-slate-900/60 p-1.5 font-semibold text-slate-400">
              <span>Vertex</span>
              <span>Distance</span>
            </div>
            <div className="max-h-40 overflow-y-auto p-1.5 space-y-1 font-mono">
              {Object.entries(distance).map(([node, val]) => (
                <div key={node} className="grid grid-cols-2">
                  <span className="text-slate-300 font-bold">{node}</span>
                  <span className="text-cyan-400">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Parent Table */}
      {hasParent && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Parent Pointers:</span>
          <div className="overflow-hidden rounded-lg border border-white/5 bg-slate-950/60 text-xs">
            <div className="grid grid-cols-2 border-b border-white/5 bg-slate-900/60 p-1.5 font-semibold text-slate-400">
              <span>Vertex</span>
              <span>Parent</span>
            </div>
            <div className="max-h-40 overflow-y-auto p-1.5 space-y-1 font-mono">
              {Object.entries(parent).map(([node, par]) => (
                <div key={node} className="grid grid-cols-2">
                  <span className="text-slate-300 font-bold">{node}</span>
                  <span className="text-purple-400">{par}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-[11px] text-slate-400">
        <div className="flex flex-col">
          <span>Comparisons</span>
          <span className="text-sm font-bold text-slate-200">{state.comparisons ?? 0}</span>
        </div>
        <div className="flex flex-col">
          <span>Estimated Space</span>
          <span className="text-sm font-bold text-slate-200">{state.memoryUsage ?? 'O(V + E)'}</span>
        </div>
      </div>
    </div>
  )
})
