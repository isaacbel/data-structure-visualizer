'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown, Download, Edit3, Eye, HelpCircle, ImageIcon, LayoutGrid, Pause, Play, Redo2,
  RotateCcw, Shuffle, SkipBack, SkipForward, Undo2, Upload,
} from 'lucide-react'
import type { DataStructureConfig, Language, VisualState } from '@/types'
import { getVisualizerCapabilities } from '@/types/capabilities'
import { AnimationController } from '@/core/animation/AnimationController'
import { buildSteps } from '@/core/simulation/buildSteps'
import { generateRandomStateAsync, getInitialState, RANDOM_NODE_MAX } from '@/core/simulation/initialStates'
import { useTranslation } from '@/constants/translations'
import { useAppStore } from '@/store/useAppStore'
import { VisualizerCanvas } from '@/visualizers/shared/VisualizerCanvas'
import { TrackerPanel } from './TrackerPanel'
import { VideoRecorderUI } from './VideoRecorderUI'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { exportPng, exportJpeg } from '@/lib/visualizer/export/exportRaster'
import { exportSvg } from '@/lib/visualizer/export/exportSvg'
import {
  layoutGraph, layoutGraphForce, layoutGraphGrid, layoutGraphHierarchical,
} from '@/core/rendering/layout'

interface VisualizerTabProps {
  ds: string
  config: DataStructureConfig
  lang: Language
}

const MAX_HISTORY = 50

/** Guard keyboard shortcuts: don't fire when user is typing */
function isTyping(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return ['input', 'textarea', 'select'].includes(tag) || (el as HTMLElement).isContentEditable
}

export function VisualizerTab({ ds, config, lang }: VisualizerTabProps) {
  const t = useTranslation(lang)
  const animationSpeed = useAppStore((s) => s.animationSpeed)
  const [visualState, setVisualState] = useState<VisualState>(() => getInitialState(ds))
  const canvasRef = useRef<HTMLDivElement>(null)
  const randomAbortRef = useRef<AbortController | null>(null)
  const [operation, setOperation] = useState(config.ops[0])
  const [inputValue, setInputValue] = useState('')
  const [inputIndex, setInputIndex] = useState('')
  const [animStatus, setAnimStatus] = useState<'idle' | 'playing' | 'paused' | 'finished'>('idle')
  const [randomNodeCount, setRandomNodeCount] = useState(7)
  const [randomMode, setRandomMode] = useState<
    'balanced' | 'complete' | 'sparse' | 'skewed-left' | 'skewed-right' | 'random'
  >('balanced')
  const [heapType, setHeapType] = useState<'min' | 'max'>('min')
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false)
  const [randomError, setRandomError] = useState<string | null>(null)
  const [scrubValue, setScrubValue] = useState(0)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  // Edit / History States
  const [editMode, setEditMode] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const historyRef = useRef<VisualState[]>([])
  const historyIndexRef = useRef(-1)
  const [historyVersion, setHistoryVersion] = useState(0)

  // Capabilities — single source of truth for what controls to show
  const caps = useMemo(() => getVisualizerCapabilities(ds, config), [ds, config])

  const isPlaying = animStatus === 'playing'
  const isGraph = config.type === 'graph'

  // ── Animation Controller ────────────────────────────────────────────────
  const speedRef = useRef(animationSpeed)
  useEffect(() => { speedRef.current = animationSpeed }, [animationSpeed])

  const controllerRef = useRef<AnimationController | null>(null)
  if (!controllerRef.current) {
    controllerRef.current = new AnimationController(
      (s) => {
        const vs = s as VisualState
        setVisualState(vs)
        setScrubValue(controllerRef.current?.getStepIndex() ?? 0)
        useAppStore.getState().setActiveCodeLine(vs.highlightedCodeLine ?? -1)
      },
      () => speedRef.current,
      (status) => setAnimStatus(status),
    )
  }

  // ── DS change: reset everything ─────────────────────────────────────────
  useEffect(() => {
    randomAbortRef.current?.abort()
    randomAbortRef.current = null
    setIsGeneratingRandom(false)
    setRandomError(null)
    const newState = getInitialState(ds)
    setVisualState(newState)
    historyRef.current = [newState]
    historyIndexRef.current = 0
    setHistoryVersion((v) => v + 1)
    controllerRef.current?.clearSteps()
    controllerRef.current?.setInitialState(newState)
    setAnimStatus('idle')
    setScrubValue(0)
    setOperation(config.ops[0])
    setEditMode(false)
    setExportError(null)
    useAppStore.getState().setActiveCodeLine(-1)
  }, [ds, config.ops])

  // ── History helpers ─────────────────────────────────────────────────────
  const pushHistory = useCallback((next: VisualState) => {
    const hist = historyRef.current
    const idx = historyIndexRef.current
    const sliced = hist.slice(0, idx + 1)
    sliced.push(next)
    if (sliced.length > MAX_HISTORY) sliced.shift()
    historyRef.current = sliced
    historyIndexRef.current = sliced.length - 1
    setHistoryVersion((v) => v + 1)
  }, [])

  const setVisualStateWithHistory = useCallback(
    (next: VisualState | ((prev: VisualState) => VisualState)) => {
      setVisualState((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        pushHistory(resolved)
        return resolved
      })
    },
    [pushHistory],
  )

  // ── Operations ──────────────────────────────────────────────────────────
  const handleRun = useCallback(() => {
    const controller = controllerRef.current!
    controller.clearSteps()
    controller.setInitialState(visualState)
    const steps = buildSteps(ds, operation, { value: inputValue, index: inputIndex }, visualState)
    if (steps.length === 0) {
      setVisualState((prev) => ({
        ...prev,
        description: config.implemented
          ? 'This operation needs a valid input for the current structure.'
          : 'Full animation coming soon.',
      }))
      return
    }
    controller.addSteps(steps)
    setScrubValue(0)
    controller.play()
  }, [visualState, ds, operation, inputValue, inputIndex, config.implemented])

  const handlePlayPause = useCallback(() => {
    const controller = controllerRef.current!
    if (animStatus === 'playing') {
      controller.pause()
    } else if (animStatus === 'paused') {
      controller.play()
    } else {
      handleRun()
    }
  }, [animStatus, handleRun])

  const handleScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const step = Number(e.target.value)
    setScrubValue(step)
    controllerRef.current?.scrubTo(step)
  }, [])

  const handleRandom = useCallback(async () => {
    randomAbortRef.current?.abort()
    const controller = new AbortController()
    randomAbortRef.current = controller
    setIsGeneratingRandom(true)
    setRandomError(null)

    try {
      const { state: newState } = await generateRandomStateAsync(
        ds,
        {
          nodeCount: randomNodeCount,
          mode: randomMode,
          min: 1,
          max: 99,
          allowDuplicates: randomNodeCount > 99,
        },
        controller.signal,
      )

      if (controller.signal.aborted) return

      setVisualState(newState)
      historyRef.current = [newState]
      historyIndexRef.current = 0
      setHistoryVersion((v) => v + 1)
      controllerRef.current?.clearSteps()
      controllerRef.current?.setInitialState(newState)
      setAnimStatus('idle')
      setScrubValue(0)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      console.error('Random generation failed:', err)
      setRandomError('Could not generate a random structure. Try fewer nodes or another mode.')
    } finally {
      if (randomAbortRef.current === controller) {
        randomAbortRef.current = null
        setIsGeneratingRandom(false)
      }
    }
  }, [ds, randomMode, randomNodeCount])

  useEffect(() => () => {
    randomAbortRef.current?.abort()
  }, [])

  // ── Undo / Redo ─────────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    const idx = historyIndexRef.current
    if (idx > 0) {
      historyIndexRef.current = idx - 1
      setVisualState(historyRef.current[idx - 1])
      setHistoryVersion((v) => v + 1)
    }
  }, [])

  const handleRedo = useCallback(() => {
    const idx = historyIndexRef.current
    if (idx < historyRef.current.length - 1) {
      historyIndexRef.current = idx + 1
      setVisualState(historyRef.current[idx + 1])
      setHistoryVersion((v) => v + 1)
    }
  }, [])

  // ── Auto Layout (graph only) ────────────────────────────────────────────
  const handleAutoLayout = useCallback(
    (layoutType: 'circular' | 'grid' | 'hierarchical' | 'force') => {
      setVisualStateWithHistory((prev) => {
        if (!prev.nodes || prev.nodes.length === 0) return prev
        const ns = { ...prev, nodes: prev.nodes.map((n) => ({ ...n })) }
        if (layoutType === 'circular') layoutGraph(ns.nodes)
        else if (layoutType === 'grid') layoutGraphGrid(ns.nodes)
        else if (layoutType === 'hierarchical') layoutGraphHierarchical(ns.nodes, ns.edges ?? [])
        else if (layoutType === 'force') layoutGraphForce(ns.nodes, ns.edges ?? [])
        return ns
      })
    },
    [setVisualStateWithHistory],
  )

  // ── Import / Export (graph JSON) ────────────────────────────────────────
  const handleImportJSON = useCallback(() => {
    const data = prompt('Paste exported Graph JSON:')
    if (!data) return
    try {
      const parsed = JSON.parse(data) as VisualState
      if (parsed.nodes) setVisualStateWithHistory(parsed)
    } catch {
      alert('Invalid JSON structure.')
    }
  }, [setVisualStateWithHistory])

  const handleExportJSON = useCallback(() => {
    const jsonStr = JSON.stringify(visualState, null, 2)
    navigator.clipboard.writeText(jsonStr).then(() => {
      alert('Graph JSON copied to clipboard!')
    }).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = jsonStr
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Graph JSON copied to clipboard!')
    })
  }, [visualState])

  // ── Image exports ────────────────────────────────────────────────────────
  const handleExportPNG = useCallback(async () => {
    setExportError(null)
    setExportMenuOpen(false)
    if (!canvasRef.current) { setExportError('Visualization not ready.'); return }
    const err = await exportPng({ container: canvasRef.current, dsId: ds, operation })
    if (err) setExportError(err)
  }, [ds, operation])

  const handleExportJPEG = useCallback(async () => {
    setExportError(null)
    setExportMenuOpen(false)
    if (!canvasRef.current) { setExportError('Visualization not ready.'); return }
    const err = await exportJpeg({ container: canvasRef.current, dsId: ds, operation })
    if (err) setExportError(err)
  }, [ds, operation])

  const handleExportSVG = useCallback(async () => {
    setExportError(null)
    setExportMenuOpen(false)
    if (!canvasRef.current) { setExportError('Visualization not ready.'); return }
    const err = await exportSvg({ container: canvasRef.current, dsId: ds, operation })
    if (err) setExportError(err)
  }, [ds, operation])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault(); handleUndo(); return
      }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault(); handleRedo(); return
      }
      if (isTyping()) return

      if (e.key === '?') {
        e.preventDefault()
        setShortcutsOpen((o) => !o)
        return
      }

      switch (e.key) {
        case 'r': case 'R':
          e.preventDefault()
          controllerRef.current?.reset()
          setAnimStatus('idle')
          setScrubValue(0)
          break
        case ' ':
          e.preventDefault()
          handlePlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          controllerRef.current?.stepBackward()
          setScrubValue(controllerRef.current?.getStepIndex() ?? 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          controllerRef.current?.stepForward()
          setScrubValue(controllerRef.current?.getStepIndex() ?? 0)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleUndo, handleRedo, handlePlayPause])

  // Close export menu on outside click (bubble phase check on container ref)
  useEffect(() => {
    if (!exportMenuOpen) return
    const closeIfOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', closeIfOutside)
    return () => window.removeEventListener('mousedown', closeIfOutside)
  }, [exportMenuOpen])

  // ── Derived values ──────────────────────────────────────────────────────
  const needsValue = useMemo(() => [
    'insert', 'delete', 'search', 'push', 'pop', 'enqueue', 'dequeue', 'peek',
    'insertHead', 'insertTail', 'access', 'push_back', 'pop_back', 'put', 'get',
    'add', 'contains', 'remove', 'pushFront', 'pushBack', 'query', 'update',
    'union', 'find', 'makeSet', 'split', 'concat', 'index', 'moveGap',
  ].includes(operation), [operation])

  const needsIndex = useMemo(
    () => ['insert', 'delete', 'access'].includes(operation) && (ds === 'array' || ds === 'vector'),
    [operation, ds],
  )

  const valuePlaceholder =
    ds === 'priority-queue' && operation === 'enqueue'
      ? 'item:priority'
      : ds === 'union-find' && operation === 'union'
        ? '0 2'
        : t.value
  const totalSteps = visualState.totalSteps ?? 0
  const stepNumber = visualState.stepNumber ?? 0
  const progressPct = totalSteps > 0 ? (stepNumber / totalSteps) * 100 : 0

  const canUndo = historyVersion >= 0 && historyIndexRef.current > 0
  const canRedo = historyVersion >= 0 && historyIndexRef.current < historyRef.current.length - 1

  const playIcon = isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />
  const playTitle = isPlaying ? t.pause : (animStatus === 'paused' ? 'Resume' : t.play)

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Operation controls & Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="min-h-11 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 sm:text-sm"
          aria-label={t.operation}
        >
          {config.ops.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>

        {needsValue && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRun()}
            placeholder={valuePlaceholder}
            className="min-h-11 w-28 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 sm:text-sm"
            aria-label={t.value}
          />
        )}
        {needsIndex && (
          <input
            type="number"
            value={inputIndex}
            onChange={(e) => setInputIndex(e.target.value)}
            placeholder={t.index}
            className="min-h-11 w-20 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 sm:text-sm"
            aria-label={t.index}
          />
        )}

        <button type="button" onClick={handleRun} className="btn-primary min-h-11 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" aria-label={t.run}>
          {t.run}
        </button>
        <button
          onClick={handleRandom}
          disabled={isGeneratingRandom}
          className="btn-secondary min-h-11 px-4 py-2 text-sm disabled:cursor-wait disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label={isGeneratingRandom ? 'Generating…' : t.random}
          title={t.random}
        >
          <Shuffle className={`h-4 w-4 ${isGeneratingRandom ? 'animate-spin' : ''}`} />
          {isGeneratingRandom ? 'Generating…' : t.random}
        </button>

        {/* Tree generation modes — STRICTLY ONLY for tree-type visualizers */}
        {caps.treeGenerationModes && (
          <>
            <select
              value={randomMode}
              onChange={(e) => setRandomMode(e.target.value as typeof randomMode)}
              className="min-h-11 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 sm:text-sm"
              aria-label="Random tree generation mode"
              title="Random tree generation mode"
            >
              <option value="balanced">balanced</option>
              <option value="complete">complete</option>
              <option value="random">random</option>
              <option value="sparse">sparse</option>
              <option value="skewed-left">skewed left</option>
              <option value="skewed-right">skewed right</option>
            </select>
            <input
              type="number"
              min="1"
              max={RANDOM_NODE_MAX}
              value={randomNodeCount}
              onChange={(e) => setRandomNodeCount(Math.max(1, Math.min(RANDOM_NODE_MAX, Number(e.target.value) || 1)))}
              className="min-h-11 w-20 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 sm:text-sm"
              aria-label="Random node count"
              title="Random node count"
            />
          </>
        )}

        {/* Heap selector — STRICTLY ONLY for heap visualizers */}
        {caps.heapTypeSelector && (
          <div className="flex rounded-lg border border-white/10 overflow-hidden">
            <button
              onClick={() => setHeapType('min')}
              className={`px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${heapType === 'min' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}
              aria-label="Min Heap mode"
              title="Min Heap mode"
            >
              Min Heap
            </button>
            <button
              onClick={() => setHeapType('max')}
              className={`px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${heapType === 'max' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}
              aria-label="Max Heap mode"
              title="Max Heap mode"
            >
              Max Heap
            </button>
          </div>
        )}

        {/* Graph Editor Action Panel — graph only */}
        {isGraph && caps.graphControls && (
          <div className="flex flex-wrap items-center gap-1.5 border-l border-white/10 pl-3">
            <button
              onClick={() => setEditMode((m) => !m)}
              className={`flex h-11 items-center gap-1 rounded-lg border px-3 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                editMode
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-white/10 text-slate-400 hover:bg-white/5'
              }`}
              title={editMode ? 'Switch to View mode' : 'Switch to Edit mode'}
              aria-label={editMode ? 'Switch to View mode' : 'Switch to Edit mode'}
            >
              {editMode ? <Edit3 size={14} /> : <Eye size={14} />}
              {editMode ? 'Editing' : 'Viewer'}
            </button>

            <button
              onClick={() => setSnapToGrid((s) => !s)}
              className={`flex h-11 items-center gap-1 rounded-lg border px-3 text-xs transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                snapToGrid
                  ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                  : 'border-white/10 text-slate-400 hover:bg-white/5'
              }`}
              title="Toggle snap to grid"
              aria-label="Toggle snap to grid"
            >
              <LayoutGrid size={14} />
              Grid
            </button>

            {/* Layout dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAutoLayout(e.target.value as 'circular' | 'grid' | 'hierarchical' | 'force')
                  e.target.value = ''
                }
              }}
              defaultValue=""
              className="min-h-11 rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-xs focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Graph auto layout select"
              title="Graph auto layout select"
            >
              <option value="" disabled>Layout…</option>
              <option value="circular">Circular</option>
              <option value="grid">Grid</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="force">Force-Directed</option>
            </select>

            {caps.undo && (
              <button
                disabled={!canUndo}
                onClick={handleUndo}
                className="flex h-11 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
              >
                <Undo2 size={15} />
              </button>
            )}
            {caps.redo && (
              <button
                disabled={!canRedo}
                onClick={handleRedo}
                className="flex h-11 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                title="Redo (Ctrl+Y)"
                aria-label="Redo"
              >
                <Redo2 size={15} />
              </button>
            )}

            <button
              onClick={handleImportJSON}
              className="flex h-11 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              title="Import Graph JSON"
              aria-label="Import Graph JSON"
            >
              <Upload size={14} />
            </button>
            <button
              onClick={handleExportJSON}
              className="flex h-11 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              title="Export Graph JSON"
              aria-label="Export Graph JSON"
            >
              <Download size={14} />
            </button>
          </div>
        )}

        {/* Shortcuts button */}
        <button
          onClick={() => setShortcutsOpen(true)}
          className="btn-secondary flex min-h-11 items-center justify-center gap-1.5 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard shortcuts"
        >
          <HelpCircle size={15} />
          <span className="hidden sm:inline">Shortcuts</span>
        </button>

        {/* Export dropdown (PNG/JPEG/SVG/Video) */}
        <div ref={exportMenuRef} className="relative ml-auto">
          <button
            onClick={(e) => { e.stopPropagation(); setExportMenuOpen((o) => !o) }}
            className="btn-secondary flex min-h-11 items-center gap-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Export visualization"
            aria-label="Export visualization"
            aria-haspopup="true"
            aria-expanded={exportMenuOpen}
          >
            <ImageIcon className="h-4 w-4" />
            Export
            <ChevronDown className={`h-3 w-3 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {exportMenuOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-xl border border-white/10 bg-slate-900 py-1 shadow-2xl backdrop-blur"
              onClick={(e) => e.stopPropagation()}
            >
              {caps.exportPNG && (
                <button
                  onClick={handleExportPNG}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 focus:outline-none focus:bg-white/10"
                  aria-label="Export as PNG image"
                  title="Export PNG image"
                >
                  <ImageIcon size={14} /> PNG
                </button>
              )}
              {caps.exportJPEG && (
                <button
                  onClick={handleExportJPEG}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 focus:outline-none focus:bg-white/10"
                  aria-label="Export as JPEG image"
                  title="Export JPEG image"
                >
                  <ImageIcon size={14} /> JPEG
                </button>
              )}
              {caps.exportSVG && (
                <button
                  onClick={handleExportSVG}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 focus:outline-none focus:bg-white/10"
                  aria-label="Export as SVG vector"
                  title="Export SVG vector"
                >
                  <Download size={14} /> SVG
                </button>
              )}
              {caps.exportVideo && (
                <div className="border-t border-white/5 pt-1">
                  <div className="px-4 pt-1 pb-2">
                    <VideoRecorderUI
                      containerRef={canvasRef as React.RefObject<HTMLElement | null>}
                      dsId={ds}
                      operation={operation}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export error banner */}
      {exportError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {exportError}
          <button
            className="ml-3 text-xs underline opacity-60 hover:opacity-100 focus:outline-none"
            onClick={() => setExportError(null)}
            aria-label="Dismiss export error"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Canvas & Side Variable Tracker */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div ref={canvasRef} className="min-h-[400px] lg:col-span-3">
          <VisualizerCanvas
            state={visualState}
            type={config.type}
            onStateChange={setVisualStateWithHistory}
            editMode={editMode}
            snapToGrid={snapToGrid}
          />
        </div>
        <div className="lg:col-span-1">
          <TrackerPanel state={visualState} visible={isGraph} />
        </div>
      </div>

      {/* Animation timeline & controls */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        {/* Scrubber */}
        {totalSteps > 0 && (
          <div className="mb-2 flex items-center gap-3">
            <span className="min-w-[3rem] text-right text-xs text-slate-400">{stepNumber}/{totalSteps}</span>
            <div className="relative flex-1">
              <div
                className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-cyan-500"
                style={{ width: `${progressPct}%` }}
              />
              <input
                type="range"
                min={0}
                max={totalSteps}
                value={scrubValue}
                onChange={handleScrub}
                className="relative h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-500 focus:outline-none"
                aria-label="Animation timeline scrubber"
                title="Animation timeline scrubber"
              />
            </div>
          </div>
        )}

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-1">
          <CtrlBtn
            label={t.stepBackward}
            onClick={() => {
              controllerRef.current?.stepBackward()
              setScrubValue(controllerRef.current?.getStepIndex() ?? 0)
            }}
          >
            <SkipBack className="h-5 w-5" />
          </CtrlBtn>

          <CtrlBtn label={playTitle} onClick={handlePlayPause} active={isPlaying}>
            {playIcon}
          </CtrlBtn>

          <CtrlBtn
            label={t.stepForward}
            onClick={() => {
              controllerRef.current?.stepForward()
              setScrubValue(controllerRef.current?.getStepIndex() ?? 0)
            }}
          >
            <SkipForward className="h-5 w-5" />
          </CtrlBtn>

          <CtrlBtn
            label={t.restart}
            onClick={() => {
              controllerRef.current?.reset()
              setAnimStatus('idle')
              setScrubValue(0)
            }}
          >
            <RotateCcw className="h-5 w-5" />
          </CtrlBtn>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-xs text-slate-400">{t.speed}</span>
            <input
              type="range"
              min="0.25"
              max="5"
              step="0.25"
              value={animationSpeed}
              onChange={(e) => useAppStore.getState().setAnimationSpeed(parseFloat(e.target.value))}
              className="h-2 w-28 cursor-pointer accent-cyan-500 focus:outline-none"
              aria-label={t.speed}
              title={t.speed}
            />
            <span className="w-10 text-xs text-slate-400">{animationSpeed}x</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {animStatus !== 'idle' && (
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${
                animStatus === 'playing' ? 'bg-cyan-600/30 text-cyan-300' :
                animStatus === 'paused' ? 'bg-amber-600/30 text-amber-300' :
                'bg-green-600/30 text-green-300'
              }`}>
                {animStatus.toUpperCase()}
              </span>
            )}
            <span className="text-sm text-slate-400">
              {stepNumber > 0 ? `${t.currentStep} ${stepNumber}/${totalSteps}` : t.ready}
            </span>
          </div>
        </div>
      </div>

      {/* Description panel */}
      {(visualState.description || randomError) && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          {randomError && (
            <p className="mb-2 text-sm text-red-300">{randomError}</p>
          )}
          {visualState.description && (
            <p className="text-sm text-slate-300">{visualState.description}</p>
          )}
        </div>
      )}

      {/* Stats row */}
      {(visualState.comparisons !== undefined || visualState.swaps !== undefined) && (
        <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
          {visualState.comparisons !== undefined && (
            <span>Comparisons: <span className="font-bold text-cyan-400">{visualState.comparisons}</span></span>
          )}
          {visualState.swaps !== undefined && (
            <span>Swaps: <span className="font-bold text-purple-400">{visualState.swaps}</span></span>
          )}
        </div>
      )}

      {/* Shortcuts modal */}
      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}

function CtrlBtn({
  children, label, onClick, active,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-lg transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
        active ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}
