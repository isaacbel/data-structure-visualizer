'use client'

import {
  Delete,
  GitMerge,
  Link,
  Link2Off,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  SkipBack,
  SkipForward,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'

interface BTreeToolbarProps {
  treeType: 'btree' | 'bplus'
  onSetTreeType: (type: 'btree' | 'bplus') => void
  degreeT: number
  onSetDegreeT: (t: number) => void
  showLeafLinks: boolean
  onToggleLeafLinks: () => void
  insertValue: string
  onInsertValueChange: (v: string) => void
  onInsert: () => void
  onDelete: () => void
  onSearch: () => void
  onRangeSearch: (min: number, max: number) => void
  onClear: () => void
  onReset: () => void
  onOpenGenerator: () => void
  onOpenImportExport: () => void

  // Animation controls
  animStatus: 'idle' | 'playing' | 'paused' | 'finished'
  onPlayPause: () => void
  onStepBack: () => void
  onStepForward: () => void
  onRestartAnim: () => void
  animSpeed: number
  onSetAnimSpeed: (s: number) => void
  stepInfo: string
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

export function BTreeToolbar({
  treeType, onSetTreeType,
  degreeT, onSetDegreeT,
  showLeafLinks, onToggleLeafLinks,
  insertValue, onInsertValueChange,
  onInsert, onDelete, onSearch,
  onRangeSearch, onClear, onReset,
  onOpenGenerator, onOpenImportExport,
  animStatus, onPlayPause, onStepBack, onStepForward, onRestartAnim,
  animSpeed, onSetAnimSpeed, stepInfo,
  canUndo, canRedo, onUndo, onRedo,
}: BTreeToolbarProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur">
      {/* Row 1: Tree type + degree + links */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tree type toggle */}
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => onSetTreeType('btree')}
            className={`px-3 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${treeType === 'btree' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}
            aria-label="Select B-Tree type"
            title="Select B-Tree type"
          >
            B-Tree
          </button>
          <button
            onClick={() => onSetTreeType('bplus')}
            className={`px-3 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${treeType === 'bplus' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}
            aria-label="Select B+ Tree type"
            title="Select B+ Tree type"
          >
            B+ Tree
          </button>
        </div>

        {/* Degree selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <span className="whitespace-nowrap font-medium">Min Degree <span className="font-mono text-cyan-400">t =</span></span>
          <select
            value={degreeT}
            onChange={(e) => onSetDegreeT(Number(e.target.value))}
            className="rounded border border-white/10 bg-slate-950 px-2 py-1.5 text-xs text-cyan-400 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Minimum Degree t"
            title="Minimum Degree t"
          >
            {[2, 3, 4, 5, 6, 8, 10].map((v) => (
              <option key={v} value={v}>t={v} (max {2 * v - 1} keys)</option>
            ))}
          </select>
        </div>

        {/* Leaf links toggle (B+ only) */}
        {treeType === 'bplus' && (
          <button
            onClick={onToggleLeafLinks}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              showLeafLinks ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 text-slate-400 hover:bg-white/5'
            }`}
            aria-label="Toggle leaf node links"
            title="Toggle leaf node links"
          >
            {showLeafLinks ? <Link size={13} /> : <Link2Off size={13} />}
            Leaf Links
          </button>
        )}

        {/* Undo / Redo */}
        <div className="flex gap-1 border-l border-white/10 pl-2">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 disabled:opacity-30 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Undo"
            title="Undo"
          >
            ↩ Undo
          </button>
          <button
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1.5 rounded hover:bg-white/10 text-slate-200 disabled:opacity-30 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Redo"
            title="Redo"
          >
            ↪ Redo
          </button>
        </div>

        <div className="ml-auto flex gap-1.5">
          <button
            onClick={onOpenGenerator}
            className="flex h-8 items-center gap-1 rounded-lg bg-cyan-500 px-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Open B-Tree Generator"
            title="Open B-Tree Generator"
          >
            <Sparkles size={13} /> Generate
          </button>
          <button
            onClick={onOpenImportExport}
            className="flex h-8 items-center gap-1 rounded-lg border border-white/10 px-2.5 text-xs text-slate-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Open Import/Export Modal"
            title="Open Import/Export Modal"
          >
            <Upload size={13} /> Import/Export
          </button>
        </div>
      </div>

      {/* Row 2: Operation controls */}
      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-2">
        {/* Key input */}
        <input
          type="text"
          value={insertValue}
          onChange={(e) => onInsertValueChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onInsert() }}
          placeholder="Key(s): e.g. 42 or 10,20,30"
          className="h-8 w-52 rounded-lg border border-white/10 bg-slate-950 px-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
          aria-label="B-Tree key input"
          title="B-Tree key input"
        />

        <button
          onClick={onInsert}
          className="flex h-8 items-center gap-1 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Insert key into B-Tree"
          title="Insert key into B-Tree"
        >
          <Plus size={14} /> Insert
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 items-center gap-1 rounded-lg border border-red-500/50 bg-red-500/10 px-3 text-xs font-bold text-red-300 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Delete key from B-Tree"
          title="Delete key from B-Tree"
        >
          <Delete size={14} /> Delete
        </button>
        <button
          onClick={onSearch}
          className="flex h-8 items-center gap-1 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-3 text-xs font-bold text-yellow-300 hover:bg-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Search key in B-Tree"
          title="Search key in B-Tree"
        >
          <Search size={14} /> Search
        </button>

        {treeType === 'bplus' && (
          <button
            onClick={() => {
              const parts = insertValue.split(',').map(Number).filter((n) => !isNaN(n))
              if (parts.length >= 2) onRangeSearch(Math.min(...parts), Math.max(...parts))
              else if (parts.length === 1) onRangeSearch(parts[0], parts[0] + 20)
            }}
            className="flex h-8 items-center gap-1 rounded-lg border border-blue-500/50 bg-blue-500/10 px-3 text-xs font-bold text-blue-300 hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Perform B+ Tree range query"
            title="Perform B+ Tree range query"
          >
            <GitMerge size={14} /> Range Query
          </button>
        )}

        <div className="border-l border-white/10 pl-2 flex gap-1">
          <button
            onClick={onClear}
            className="flex h-8 items-center gap-1 rounded-lg border border-white/10 px-2.5 text-xs text-slate-400 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Clear B-Tree"
            title="Clear B-Tree"
          >
            <Trash2 size={13} /> Clear
          </button>
          <button
            onClick={onReset}
            className="flex h-8 items-center gap-1 rounded-lg border border-white/10 px-2.5 text-xs text-slate-400 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Reset B-Tree"
            title="Reset B-Tree"
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Row 3: Animation timeline */}
      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-2">
        <button
          onClick={onRestartAnim}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Restart animation"
          title="Restart animation"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={onStepBack}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Step Backward"
          title="Step Backward"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={onPlayPause}
          className="p-1.5 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-bold"
          aria-label={animStatus === 'playing' ? 'Pause animation' : 'Play animation'}
          title={animStatus === 'playing' ? 'Pause' : 'Play'}
        >
          {animStatus === 'playing' ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={onStepForward}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Step Forward"
          title="Step Forward"
        >
          <SkipForward size={16} />
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2 text-xs text-slate-400 ml-1">
          <span>Speed:</span>
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={animSpeed}
            onChange={(e) => onSetAnimSpeed(Number(e.target.value))}
            className="h-1.5 w-20 cursor-pointer accent-cyan-500 focus:outline-none"
            aria-label="Animation Speed"
            title="Animation Speed"
          />
          <span className="font-mono text-cyan-400 font-bold w-8">{animSpeed}x</span>
        </div>

        {/* Step info */}
        {stepInfo && (
          <div className="ml-2 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-1 text-xs text-slate-300 italic max-w-xs truncate">
            {stepInfo}
          </div>
        )}
      </div>
    </div>
  )
}
