'use client'

import { Download, Edit3, Eye, Image as ImageIcon, LayoutGrid, Redo2, Search, Sparkles, Undo2, Upload } from 'lucide-react'

interface GraphToolbarProps {
  editMode: boolean
  setEditMode: (mode: boolean | ((prev: boolean) => boolean)) => void
  snapToGrid: boolean
  setSnapToGrid: (snap: boolean | ((prev: boolean) => boolean)) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onAutoLayout: (type: string) => void
  onOpenGenerator: () => void
  onOpenImportExport: () => void
  onExportSVG: () => void
  onExportPNG: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const LAYOUT_OPTIONS = [
  { id: 'circular', label: 'Circular' },
  { id: 'grid', label: 'Grid Mesh' },
  { id: 'hierarchical', label: 'Hierarchical Tree' },
  { id: 'force', label: 'Force-Directed' },
  { id: 'radial', label: 'Radial Layers' },
  { id: 'bipartite', label: 'Bipartite Two-Column' },
  { id: 'organic', label: 'Organic Fruchterman-Reingold' },
  { id: 'kamada', label: 'Kamada–Kawai Stress' },
  { id: 'layered', label: 'Sugiyama DAG Layered' },
  { id: 'spring', label: 'Spring Embedder' },
]

export function GraphToolbar({
  editMode,
  setEditMode,
  snapToGrid,
  setSnapToGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAutoLayout,
  onOpenGenerator,
  onOpenImportExport,
  onExportSVG,
  onExportPNG,
  searchQuery,
  setSearchQuery,
}: GraphToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-900/90 p-2.5 shadow-xl backdrop-blur">
      {/* Left Group */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Generator Button */}
        <button
          onClick={onOpenGenerator}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-cyan-500 px-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Open Random Graph Generator"
          title="Open Random Graph Generator"
        >
          <Sparkles size={14} /> Random Generator
        </button>

        {/* Edit mode toggle */}
        <button
          onClick={() => setEditMode((m) => !m)}
          className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
            editMode
              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
              : 'border-white/10 text-slate-300 hover:bg-white/5'
          }`}
          aria-label={editMode ? 'Switch to View mode' : 'Switch to Edit mode'}
          title={editMode ? 'Switch to View mode' : 'Switch to Edit mode'}
        >
          {editMode ? <Edit3 size={14} /> : <Eye size={14} />}
          {editMode ? 'Editing' : 'Viewer'}
        </button>

        {/* Snap to grid */}
        <button
          onClick={() => setSnapToGrid((s) => !s)}
          className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
            snapToGrid
              ? 'border-purple-500 bg-purple-500/10 text-purple-400'
              : 'border-white/10 text-slate-300 hover:bg-white/5'
          }`}
          aria-label="Toggle snap to grid"
          title="Toggle snap to grid"
        >
          <LayoutGrid size={14} /> Grid
        </button>

        {/* Auto layout dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              onAutoLayout(e.target.value)
              e.target.value = ''
            }
          }}
          defaultValue=""
          className="h-9 rounded-lg border border-white/10 bg-slate-950 px-2.5 text-xs font-semibold text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Auto Layout option"
          title="Auto Layout option"
        >
          <option value="" disabled>Auto Layout…</option>
          {LAYOUT_OPTIONS.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>

        {/* Undo / Redo */}
        <div className="flex gap-1 border-l border-white/10 pl-1.5">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            disabled={!canRedo}
            onClick={onRedo}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* Right Group */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search node..."
            className="h-9 w-32 rounded-lg border border-white/10 bg-slate-950 pl-8 pr-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Search node in graph"
            title="Search node in graph"
          />
        </div>

        {/* Import/Export Modal trigger */}
        <button
          onClick={onOpenImportExport}
          className="flex h-9 items-center gap-1 rounded-lg border border-white/10 px-2.5 text-xs text-slate-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Import / Export Data"
          aria-label="Import / Export Data"
        >
          <Upload size={14} /> Import/Export
        </button>

        {/* SVG/PNG Export */}
        <button
          onClick={onExportSVG}
          className="flex h-9 items-center gap-1 rounded-lg border border-white/10 px-2.5 text-xs text-slate-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Export SVG"
          aria-label="Export SVG"
        >
          <Download size={14} /> SVG
        </button>
        <button
          onClick={onExportPNG}
          className="flex h-9 items-center gap-1 rounded-lg border border-white/10 px-2.5 text-xs text-slate-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Export PNG"
          aria-label="Export PNG"
        >
          <ImageIcon size={14} /> PNG
        </button>
      </div>
    </div>
  )
}
