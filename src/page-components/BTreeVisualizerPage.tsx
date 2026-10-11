'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BTreeNode, BTreeStep, BTreeValidationReport } from '@/core/btree/types'
import { BTreeEngine } from '@/core/btree/BTreeEngine'
import { BPlusTreeEngine } from '@/core/btree/BPlusTreeEngine'
import { BTreeCanvas } from '@/components/btree/BTreeCanvas'
import { BTreeToolbar } from '@/components/btree/BTreeToolbar'
import { BTreeEducationalPanel } from '@/components/btree/BTreeEducationalPanel'
import { BTreeGeneratorPanel } from '@/components/btree/BTreeGeneratorPanel'
import { BTreeImportExport } from '@/components/btree/BTreeImportExport'
import { VideoRecorderUI } from '@/components/visualizer/VideoRecorderUI'

type TreeState = {
  root: BTreeNode<number> | null
  leafHead: BTreeNode<number> | null
}

interface AnimState {
  steps: BTreeStep[]
  stepIdx: number
  status: 'idle' | 'playing' | 'paused' | 'finished'
}

interface BTreeVisualizerPageProps {
  initialTreeType?: 'btree' | 'bplus'
}

export function BTreeVisualizerPage({ initialTreeType = 'btree' }: BTreeVisualizerPageProps = {}) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [treeType, setTreeType] = useState<'btree' | 'bplus'>(initialTreeType)
  const [degreeT, setDegreeT] = useState(2)

  // Tree state - use engine refs as source of truth
  const btreeEngineRef = useRef<BTreeEngine>(new BTreeEngine({ t: 2 }))
  const bplusEngineRef = useRef<BPlusTreeEngine>(new BPlusTreeEngine({ t: 2 }))

  const [treeState, setTreeState] = useState<TreeState>({ root: null, leafHead: null })

  // Controls
  const [insertValue, setInsertValue] = useState('')
  const [showLeafLinks, setShowLeafLinks] = useState(true)
  const [showGeneratorModal, setShowGeneratorModal] = useState(false)
  const [showImportExportModal, setShowImportExportModal] = useState(false)

  // Animation
  const [anim, setAnim] = useState<AnimState>({ steps: [], stepIdx: 0, status: 'idle' })
  const [animSpeed, setAnimSpeed] = useState(1.0)
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const speedRef = useRef(animSpeed)
  useEffect(() => { speedRef.current = animSpeed }, [animSpeed])

  // Undo/Redo history
  const historyRef = useRef<TreeState[]>([{ root: null, leafHead: null }])
  const histIdx = useRef(0)
  const [, setHistVersion] = useState(0)

  const syncTreeState = useCallback(() => {
    const newState = treeType === 'btree'
      ? { root: btreeEngineRef.current.root, leafHead: null }
      : { root: bplusEngineRef.current.root, leafHead: bplusEngineRef.current.leafHead }
    setTreeState(newState)
    const sliced = historyRef.current.slice(0, histIdx.current + 1)
    sliced.push(newState)
    if (sliced.length > 60) sliced.shift()
    historyRef.current = sliced
    histIdx.current = sliced.length - 1
    setHistVersion((v) => v + 1)
  }, [treeType])

  // Rebuild engine when tree type or degree changes
  useEffect(() => {
    btreeEngineRef.current = new BTreeEngine({ t: degreeT })
    bplusEngineRef.current = new BPlusTreeEngine({ t: degreeT })
    setTreeState({ root: null, leafHead: null })
    historyRef.current = [{ root: null, leafHead: null }]
    histIdx.current = 0
    setAnim({ steps: [], stepIdx: 0, status: 'idle' })
  }, [treeType, degreeT])

  // Animation stepper
  const runStep = useCallback((steps: BTreeStep[], idx: number) => {
    if (idx >= steps.length) {
      setAnim((a) => ({ ...a, status: 'finished' }))
      return
    }
    const step = steps[idx]
    setAnim((a) => ({ ...a, stepIdx: idx }))
    setTreeState({
      root: step.treeSnapshot,
      leafHead: null,
    })
  }, [])

  const scheduleNext = useCallback((steps: BTreeStep[], idx: number) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    const delay = Math.round(1000 / speedRef.current)
    animTimerRef.current = setTimeout(() => {
      const next = idx + 1
      if (next >= steps.length) {
        setAnim((a) => ({ ...a, status: 'finished' }))
      } else {
        runStep(steps, next)
        setAnim((a) => ({ ...a, stepIdx: next }))
        scheduleNext(steps, next)
      }
    }, delay)
  }, [runStep])

  useEffect(() => {
    if (anim.status === 'playing') {
      scheduleNext(anim.steps, anim.stepIdx)
    } else if (animTimerRef.current) {
      clearTimeout(animTimerRef.current)
    }
  }, [anim.status, scheduleNext, anim.steps, anim.stepIdx])

  // --- Operation handlers ---

  const runOp = useCallback((steps: BTreeStep[]) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    if (steps.length === 0) return

    setAnim({ steps, stepIdx: 0, status: 'playing' })
    runStep(steps, 0)
    scheduleNext(steps, 0)
  }, [runStep, scheduleNext])

  const handleInsert = useCallback(() => {
    const keys = insertValue.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
    if (keys.length === 0) return

    let allSteps: BTreeStep[] = []
    for (const k of keys) {
      if (treeType === 'btree') {
        allSteps = [...allSteps, ...btreeEngineRef.current.insert(k)]
      } else {
        allSteps = [...allSteps, ...bplusEngineRef.current.insert(k)]
      }
    }
    syncTreeState()
    runOp(allSteps)
    setInsertValue('')
  }, [insertValue, treeType, syncTreeState, runOp])

  const handleDelete = useCallback(() => {
    const key = parseInt(insertValue.trim(), 10)
    if (isNaN(key)) return
    let steps: BTreeStep[] = []
    if (treeType === 'btree') {
      steps = btreeEngineRef.current.delete(key)
    } else {
      steps = bplusEngineRef.current.delete(key)
    }
    syncTreeState()
    runOp(steps)
    setInsertValue('')
  }, [insertValue, treeType, syncTreeState, runOp])

  const handleSearch = useCallback(() => {
    const key = parseInt(insertValue.trim(), 10)
    if (isNaN(key)) return
    const steps = treeType === 'btree'
      ? btreeEngineRef.current.searchSteps(key)
      : bplusEngineRef.current.searchSteps(key)
    runOp(steps)
  }, [insertValue, treeType, runOp])

  const handleRangeSearch = useCallback((min: number, max: number) => {
    if (treeType !== 'bplus') return
    const steps = bplusEngineRef.current.rangeSearchSteps(min, max)
    runOp(steps)
  }, [treeType, runOp])

  const handleClear = useCallback(() => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    btreeEngineRef.current = new BTreeEngine({ t: degreeT })
    bplusEngineRef.current = new BPlusTreeEngine({ t: degreeT })
    setTreeState({ root: null, leafHead: null })
    setAnim({ steps: [], stepIdx: 0, status: 'idle' })
  }, [degreeT])

  const handleUndo = useCallback(() => {
    if (histIdx.current > 0) {
      histIdx.current--
      setTreeState(historyRef.current[histIdx.current])
      setHistVersion((v) => v + 1)
    }
  }, [])

  const handleRedo = useCallback(() => {
    if (histIdx.current < historyRef.current.length - 1) {
      histIdx.current++
      setTreeState(historyRef.current[histIdx.current])
      setHistVersion((v) => v + 1)
    }
  }, [])

  const handleGenerate = useCallback((root: BTreeNode<number>, leafHead: BTreeNode<number> | null, _keys?: number[]) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    setTreeState({ root, leafHead })
    setAnim({ steps: [], stepIdx: 0, status: 'idle' })
  }, [])

  const handleImportKeys = useCallback((keys: number[]) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    if (treeType === 'btree') {
      btreeEngineRef.current = new BTreeEngine({ t: degreeT })
      keys.forEach((k) => btreeEngineRef.current.insert(k))
    } else {
      bplusEngineRef.current = new BPlusTreeEngine({ t: degreeT })
      keys.forEach((k) => bplusEngineRef.current.insert(k))
    }
    syncTreeState()
    setAnim({ steps: [], stepIdx: 0, status: 'idle' })
  }, [treeType, degreeT, syncTreeState])

  const handlePlayPause = useCallback(() => {
    setAnim((a) => ({
      ...a,
      status: a.status === 'playing' ? 'paused' : a.status === 'paused' ? 'playing' : a.status,
    }))
  }, [])

  const currentStep = anim.steps[anim.stepIdx]
  const validation: BTreeValidationReport | null = useMemo(() => {
    if (!treeState.root) return null
    return treeType === 'btree'
      ? btreeEngineRef.current.validate()
      : bplusEngineRef.current.validate()
  }, [treeState.root, treeType])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-3 p-4 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Toolbar */}
      <BTreeToolbar
        treeType={treeType}
        onSetTreeType={(t) => { handleClear(); setTreeType(t) }}
        degreeT={degreeT}
        onSetDegreeT={(t) => { handleClear(); setDegreeT(t) }}
        showLeafLinks={showLeafLinks}
        onToggleLeafLinks={() => setShowLeafLinks((v) => !v)}
        insertValue={insertValue}
        onInsertValueChange={setInsertValue}
        onInsert={handleInsert}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onRangeSearch={handleRangeSearch}
        onClear={handleClear}
        onReset={handleClear}
        onOpenGenerator={() => setShowGeneratorModal(true)}
        onOpenImportExport={() => setShowImportExportModal(true)}
        animStatus={anim.status}
        onPlayPause={handlePlayPause}
        onStepBack={() => {
          const prev = Math.max(0, anim.stepIdx - 1)
          runStep(anim.steps, prev)
          setAnim((a) => ({ ...a, stepIdx: prev, status: 'paused' }))
        }}
        onStepForward={() => {
          const next = Math.min(anim.steps.length - 1, anim.stepIdx + 1)
          runStep(anim.steps, next)
          setAnim((a) => ({ ...a, stepIdx: next, status: 'paused' }))
        }}
        onRestartAnim={() => {
          runStep(anim.steps, 0)
          setAnim((a) => ({ ...a, stepIdx: 0, status: 'paused' }))
        }}
        animSpeed={animSpeed}
        onSetAnimSpeed={setAnimSpeed}
        stepInfo={currentStep?.description ?? ''}
        canUndo={histIdx.current > 0}
        canRedo={histIdx.current < historyRef.current.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Main workspace */}
      <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-4">
        {/* Canvas */}
        <div className="lg:col-span-3 overflow-hidden flex flex-col">
          <div ref={canvasRef} className="flex-1 min-h-[350px]">
            <BTreeCanvas
              root={treeState.root}
              leafHead={treeState.leafHead}
              highlightNodeId={currentStep?.highlightNodeId}
              highlightKey={currentStep?.highlightKey}
              highlightRange={currentStep?.highlightRange}
              showLeafLinks={showLeafLinks}
              treeType={treeType}
            />
          </div>

          {/* Step progress bar & Video recorder */}
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-400">
            {anim.steps.length > 0 ? (
              <div className="flex-1 flex items-center gap-3">
                <span className="font-mono">Step {anim.stepIdx + 1} / {anim.steps.length}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all duration-200"
                    style={{ width: `${((anim.stepIdx + 1) / anim.steps.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : <div className="flex-1" />}

            <VideoRecorderUI
              containerRef={canvasRef as React.RefObject<HTMLElement | null>}
              dsId={treeType}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 overflow-hidden">
          <BTreeEducationalPanel
            treeType={treeType}
            degreeT={degreeT}
            stepDescription={currentStep?.description ?? (treeState.root ? 'Ready — insert keys or generate a tree' : 'Tree is empty — insert a key to begin')}
            stepAction={currentStep?.action}
            codeLine={currentStep?.codeLine ?? -1}
            validation={validation}
          />
        </div>
      </div>

      {/* Modals */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <BTreeGeneratorPanel
              treeType={treeType}
              onGenerate={(root, leafHead, keys) => {
                handleGenerate(root, leafHead, keys)
                setShowGeneratorModal(false)
              }}
              onClose={() => setShowGeneratorModal(false)}
            />
          </div>
        </div>
      )}

      {showImportExportModal && (
        <BTreeImportExport
          root={treeState.root}
          treeType={treeType}
          onImportKeys={handleImportKeys}
          onClose={() => setShowImportExportModal(false)}
        />
      )}
    </div>
  )
}
