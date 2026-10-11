'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Download, Image as ImageIcon, Pause, Play, RotateCcw,
  SkipBack, SkipForward, Sparkles, Video,
} from 'lucide-react'
import type { VisualState } from '@/types'
import { AnimationController } from '@/core/animation/AnimationController'
import { buildGraphSteps } from '@/core/simulation/builders/graphHashBuilders'
import { generateGraph } from '@/core/graph/generators'
import { GraphCanvas, type NodeShape } from '@/components/graph/GraphCanvas'
import { GraphToolbar } from '@/components/graph/GraphToolbar'
import { AlgorithmPanel } from '@/components/graph/AlgorithmPanel'
import { GraphValidation } from '@/components/graph/GraphValidation'
import { GraphGeneratorPanel } from '@/components/graph/GraphGeneratorPanel'
import { GraphImportExport } from '@/components/graph/GraphImportExport'
import { VideoRecorderUI } from '@/components/visualizer/VideoRecorderUI'
import { exportPng } from '@/lib/visualizer/export/exportRaster'
import { exportSvg } from '@/lib/visualizer/export/exportSvg'
import {
  layoutFruchtermanReingold, layoutGraph, layoutGraphBipartite, layoutGraphGrid,
  layoutGraphHierarchical, layoutGraphRadial, layoutKamadaKawai, layoutLayered, layoutSpring,
} from '@/core/rendering/layout'

export function GraphVisualizerPage() {
  const canvasRef = useRef<HTMLDivElement>(null)

  // Initial default graph state
  const [visualState, setVisualState] = useState<VisualState>(() => {
    const defaultData = generateGraph({ model: 'erdos-renyi', vertexCount: 8, density: 0.35, weighted: true })
    const radius = 140, cx = 400, cy = 210
    const nodes = defaultData.nodes.map((id, i) => {
      const angle = (2 * Math.PI * i) / defaultData.nodes.length - Math.PI / 2
      return {
        id,
        value: id.replace('v', ''),
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        highlight: false,
      }
    })
    const edges = defaultData.edges.map((e) => ({
      from: e.from,
      to: e.to,
      weight: e.weight,
      directed: e.directed,
      highlight: false,
    }))
    return { nodes, edges, description: 'Default Erdős–Rényi graph ready.' }
  })

  // Control & UI states
  const [activeAlgorithm, setActiveAlgorithm] = useState('bfs')
  const [animStatus, setAnimStatus] = useState<'idle' | 'playing' | 'paused' | 'finished'>('idle')
  const [animationSpeed, setAnimationSpeed] = useState(1.0)
  const [scrubValue, setScrubValue] = useState(0)

  const [editMode, setEditMode] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [nodeShape, setNodeShape] = useState<NodeShape>('circle')

  // Modals
  const [showGeneratorModal, setShowGeneratorModal] = useState(false)
  const [showImportExportModal, setShowImportExportModal] = useState(false)

  // Undo/Redo history
  const historyRef = useRef<VisualState[]>([visualState])
  const historyIdxRef = useRef(0)
  const [, setHistoryVersion] = useState(0)

  const pushHistory = useCallback((next: VisualState) => {
    const sliced = historyRef.current.slice(0, historyIdxRef.current + 1)
    sliced.push(next)
    if (sliced.length > 50) sliced.shift()
    historyRef.current = sliced
    historyIdxRef.current = sliced.length - 1
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

  // Controller
  const speedRef = useRef(animationSpeed)
  useEffect(() => { speedRef.current = animationSpeed }, [animationSpeed])

  const controllerRef = useRef<AnimationController | null>(null)
  if (!controllerRef.current) {
    controllerRef.current = new AnimationController(
      (s) => {
        setVisualState(s as VisualState)
        setScrubValue(controllerRef.current?.getStepIndex() ?? 0)
      },
      () => speedRef.current,
      (status) => setAnimStatus(status),
    )
  }

  // Operation runner
  const handleRun = useCallback(() => {
    const controller = controllerRef.current!
    controller.clearSteps()
    controller.setInitialState(visualState)
    const steps = buildGraphSteps(activeAlgorithm, visualState)
    if (steps.length === 0) return
    controller.addSteps(steps)
    setScrubValue(0)
    controller.play()
  }, [activeAlgorithm, visualState])

  const handlePlayPause = useCallback(() => {
    const controller = controllerRef.current!
    if (animStatus === 'playing') controller.pause()
    else if (animStatus === 'paused') controller.play()
    else handleRun()
  }, [animStatus, handleRun])

  // Layout handlers
  const handleAutoLayout = useCallback((layoutType: string) => {
    setVisualStateWithHistory((prev) => {
      if (!prev.nodes || prev.nodes.length === 0) return prev
      const ns = { ...prev, nodes: prev.nodes.map((n) => ({ ...n })) }
      const edges = ns.edges ?? []

      if (layoutType === 'circular') layoutGraph(ns.nodes)
      else if (layoutType === 'grid') layoutGraphGrid(ns.nodes)
      else if (layoutType === 'hierarchical') layoutGraphHierarchical(ns.nodes, edges)
      else if (layoutType === 'force') layoutFruchtermanReingold(ns.nodes, edges)
      else if (layoutType === 'radial') layoutGraphRadial(ns.nodes, edges)
      else if (layoutType === 'bipartite') layoutGraphBipartite(ns.nodes, edges)
      else if (layoutType === 'organic') layoutFruchtermanReingold(ns.nodes, edges, 800, 420, 150)
      else if (layoutType === 'kamada') layoutKamadaKawai(ns.nodes, edges)
      else if (layoutType === 'layered') layoutLayered(ns.nodes, edges)
      else if (layoutType === 'spring') layoutSpring(ns.nodes, edges)

      return ns
    })
  }, [setVisualStateWithHistory])

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (historyIdxRef.current > 0) {
      historyIdxRef.current--
      setVisualState(historyRef.current[historyIdxRef.current])
      setHistoryVersion((v) => v + 1)
    }
  }, [])

  const handleRedo = useCallback(() => {
    if (historyIdxRef.current < historyRef.current.length - 1) {
      historyIdxRef.current++
      setVisualState(historyRef.current[historyIdxRef.current])
      setHistoryVersion((v) => v + 1)
    }
  }, [])

  // Export handlers
  const handleExportSVG = useCallback(async () => {
    if (!canvasRef.current) return
    await exportSvg({ container: canvasRef.current, dsId: 'graph', operation: activeAlgorithm })
  }, [activeAlgorithm])

  const handleExportPNG = useCallback(async () => {
    if (!canvasRef.current) return
    await exportPng({ container: canvasRef.current, dsId: 'graph', operation: activeAlgorithm })
  }, [activeAlgorithm])

  const totalSteps = visualState.totalSteps ?? 0
  const stepNumber = visualState.stepNumber ?? 0
  const progressPct = totalSteps > 0 ? (stepNumber / totalSteps) * 100 : 0

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-3 p-4 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Toolbar */}
      <GraphToolbar
        editMode={editMode}
        setEditMode={setEditMode}
        snapToGrid={snapToGrid}
        setSnapToGrid={setSnapToGrid}
        canUndo={historyIdxRef.current > 0}
        canRedo={historyIdxRef.current < historyRef.current.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAutoLayout={handleAutoLayout}
        onOpenGenerator={() => setShowGeneratorModal(true)}
        onOpenImportExport={() => setShowImportExportModal(true)}
        onExportSVG={handleExportSVG}
        onExportPNG={handleExportPNG}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Workspace Layout */}
      <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-4">
        {/* Main Canvas Area */}
        <div className="flex flex-col gap-3 lg:col-span-3 overflow-hidden">
          <div ref={canvasRef} className="flex-1 min-h-[350px]">
            <GraphCanvas
              state={visualState}
              onStateChange={setVisualStateWithHistory}
              editMode={editMode}
              snapToGrid={snapToGrid}
              searchQuery={searchQuery}
              nodeShape={nodeShape}
            />
          </div>

          {/* Animation Scrubber & Controls */}
          <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur">
            {totalSteps > 0 && (
              <div className="mb-2 flex items-center gap-3">
                <span className="min-w-[3rem] text-right font-mono text-xs text-slate-400">{stepNumber}/{totalSteps}</span>
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-cyan-500" style={{ width: `${progressPct}%` }} />
                  <input
                    type="range"
                    min={0}
                    max={totalSteps}
                    value={scrubValue}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setScrubValue(val)
                      controllerRef.current?.scrubTo(val)
                    }}
                    className="relative h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-500 focus:outline-none"
                    aria-label="Graph animation timeline scrubber"
                    title="Graph animation timeline scrubber"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => controllerRef.current?.stepBackward()}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  title="Step Back"
                  aria-label="Step Back"
                >
                  <SkipBack size={18} />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  title={animStatus === 'playing' ? 'Pause' : 'Play'}
                  aria-label={animStatus === 'playing' ? 'Pause' : 'Play'}
                >
                  {animStatus === 'playing' ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  onClick={() => controllerRef.current?.stepForward()}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  title="Step Forward"
                  aria-label="Step Forward"
                >
                  <SkipForward size={18} />
                </button>
                <button
                  onClick={() => { controllerRef.current?.reset(); setAnimStatus('idle') }}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  title="Restart"
                  aria-label="Restart"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Speed:</span>
                <input
                  type="range"
                  min="0.25"
                  max="4"
                  step="0.25"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="h-1.5 w-24 cursor-pointer accent-cyan-500 focus:outline-none"
                  aria-label="Animation speed"
                  title="Animation speed"
                />
                <span className="font-mono text-cyan-400 font-bold w-8">{animationSpeed}x</span>
              </div>

              {/* Node Shape Picker */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Shape:</span>
                <select
                  value={nodeShape}
                  onChange={(e) => setNodeShape(e.target.value as NodeShape)}
                  className="rounded border border-white/10 bg-slate-950 px-2 py-1 text-xs text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Node shape picker"
                  title="Node shape picker"
                >
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                  <option value="diamond">Diamond</option>
                  <option value="hexagon">Hexagon</option>
                </select>
              </div>

              {/* Video Recorder */}
              <div className="ml-2">
                <VideoRecorderUI
                  containerRef={canvasRef as React.RefObject<HTMLElement | null>}
                  dsId="graph"
                  operation={activeAlgorithm}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar — Algorithm Educational Panel & Validation */}
        <div className="flex flex-col gap-3 lg:col-span-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <AlgorithmPanel
              state={visualState}
              activeAlgorithm={activeAlgorithm}
              onSelectAlgorithm={(algo) => {
                setActiveAlgorithm(algo)
                controllerRef.current?.reset()
                setAnimStatus('idle')
              }}
            />
          </div>

          {/* Validation Box */}
          <GraphValidation
            nodes={visualState.nodes ?? []}
            edges={visualState.edges ?? []}
            directed={visualState.edges?.[0]?.directed}
          />
        </div>
      </div>

      {/* Modals */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <GraphGeneratorPanel
              onGenerate={(newState) => {
                setVisualStateWithHistory(newState)
                setShowGeneratorModal(false)
              }}
              onClose={() => setShowGeneratorModal(false)}
            />
          </div>
        </div>
      )}

      {showImportExportModal && (
        <GraphImportExport
          state={visualState}
          onImport={(imported) => setVisualStateWithHistory(imported)}
          onClose={() => setShowImportExportModal(false)}
        />
      )}
    </div>
  )
}
