'use client'

import type { VisualQuestionState } from '@/types/quiz'
import type { Language } from '@/types'

interface VisualQuestionCardProps {
  state: VisualQuestionState
  lang: Language
}

export function VisualQuestionCard({ state, lang }: VisualQuestionCardProps) {
  return (
    <div className="my-3 rounded-xl border border-cyan-500/20 bg-slate-950/80 p-4 shadow-inner">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-cyan-400">
        <span>Interactive Visualization Prompt</span>
        <span className="rounded bg-cyan-950/50 px-2 py-0.5 border border-cyan-500/30">
          {state.diagramType}
        </span>
      </div>

      {state.promptText && (
        <p className="mb-3 text-xs text-slate-300 italic">
          {state.promptText[lang] ?? state.promptText.en}
        </p>
      )}

      {/* Array / Heap Vector Preview */}
      {state.array && (
        <div className="flex flex-wrap gap-2 justify-center my-2">
          {state.array.map((item) => (
            <div
              key={item.index}
              className={`flex flex-col items-center justify-center rounded-lg border px-3 py-2 min-w-[48px] text-center transition-all ${
                item.color === 'highlight'
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                  : 'border-white/10 bg-slate-900 text-slate-200'
              }`}
            >
              <span className="text-xs font-mono">{item.value}</span>
              <span className="text-[9px] text-slate-500 mt-1 font-mono">[{item.index}]</span>
            </div>
          ))}
        </div>
      )}

      {/* Nodes & Diagram Rendering */}
      {state.nodes && (
        <div className="flex flex-wrap gap-3 justify-center items-center my-3">
          {state.nodes.map((node) => (
            <div
              key={node.id}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold shadow-md transition-all ${
                node.highlighted
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 scale-110 shadow-cyan-500/20'
                  : 'border-slate-700 bg-slate-900 text-slate-200'
              }`}
            >
              {node.label}
            </div>
          ))}
        </div>
      )}

      {/* Edges Representation */}
      {state.edges && state.edges.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center text-[11px] font-mono text-slate-400 mt-2 border-t border-white/5 pt-2">
          {state.edges.map((edge, idx) => (
            <span key={idx} className="rounded bg-slate-900 border border-white/5 px-2 py-0.5">
              {edge.from} → {edge.to} {edge.label ? `(${edge.label})` : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
