'use client'

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent, MouseEvent as ReactMouseEvent } from 'react'
import { LocateFixed, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import type { StructureType, VisualEdge, VisualNode, VisualState } from '@/types'
import { useCamera, computeContentBounds, type Bounds, type ViewportSize } from '@/hooks/useCamera'
import { EdgeElement } from './EdgeElement'
import { HashRenderer } from './HashRenderer'
import { NodeElement } from './NodeElement'
import { PointerElement } from './PointerElement'

interface VisualizerCanvasProps {
  state: VisualState
  type: StructureType
  onStateChange?: (state: VisualState | ((prev: VisualState) => VisualState)) => void
  editMode?: boolean
  snapToGrid?: boolean
}

const DEFAULT_VIEWPORT: ViewportSize = { width: 800, height: 420 }
const NODE_RADIUS = 36

function getPinch(pts: { x: number; y: number }[]) {
  const [a, b] = pts
  return {
    distance: Math.hypot(b.x - a.x, b.y - a.y),
    centerX: (a.x + b.x) / 2,
    centerY: (a.y + b.y) / 2,
  }
}

// ---------------------------------------------------------------------------
// Minimap component
// ---------------------------------------------------------------------------

const MiniMap = memo(function MiniMap({
  nodes, edges, nodeById, bounds, worldViewport,
}: {
  nodes: VisualNode[]
  edges: VisualEdge[]
  nodeById: Map<string, VisualNode>
  bounds: Bounds
  worldViewport: { x: number; y: number; width: number; height: number }
}) {
  const pad = 80
  const vb = `${bounds.minX - pad} ${bounds.minY - pad} ${bounds.width + pad * 2} ${bounds.height + pad * 2}`
  return (
    <div className="pointer-events-none absolute bottom-3 right-3 hidden h-28 w-44 overflow-hidden rounded-lg border border-white/10 bg-slate-950/85 p-1.5 shadow-xl backdrop-blur sm:block">
      <svg viewBox={vb} className="h-full w-full">
        {edges.map((e, i) => {
          const f = nodeById.get(e.from), t = nodeById.get(e.to)
          if (!f || !t) return null
          return (
            <line
              key={i}
              x1={f.x}
              y1={f.y}
              x2={t.x}
              y2={t.y}
              stroke={e.highlight ? '#38bdf8' : '#475569'}
              strokeWidth={10}
              strokeLinecap="round"
            />
          )
        })}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={16}
            fill={n.highlight ? '#38bdf8' : '#94a3b8'}
            opacity={n.highlight ? 1 : 0.65}
          />
        ))}
        <rect
          x={worldViewport.x}
          y={worldViewport.y}
          width={worldViewport.width}
          height={worldViewport.height}
          fill="rgba(34,211,238,0.10)"
          stroke="#22d3ee"
          strokeWidth={8}
          rx={14}
        />
      </svg>
    </div>
  )
})

// ---------------------------------------------------------------------------
// Main canvas
// ---------------------------------------------------------------------------

function VisualizerCanvasComponent({
  state,
  type,
  onStateChange,
  editMode = false,
  snapToGrid = false,
}: VisualizerCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const dragRef = useRef<{ x: number; y: number } | null>(null)
  const pinchRef = useRef<{ distance: number; centerX: number; centerY: number } | null>(null)

  const [viewportSize, setViewportSize] = useState<ViewportSize>(DEFAULT_VIEWPORT)

  const {
    camera,
    isFullscreen,
    zoomIn,
    zoomOut,
    zoomAt,
    panBy,
    fitToScreen: executeFit,
    centerView: executeCenter,
    resetView: executeReset,
    toggleFullscreen,
  } = useCamera({ minScale: 0.05, maxScale: 6.0, defaultPadding: 80 })

  // Edit states
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [linkingNodeId, setLinkingNodeId] = useState<string | null>(null)
  const [linkingPos, setLinkingPos] = useState<{ x: number; y: number } | null>(null)

  const nodes = useMemo(() => state.nodes ?? [], [state.nodes])
  const edges = useMemo(() => state.edges ?? [], [state.edges])
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  const bounds = useMemo(() => {
    if (type === 'hash' && state.buckets && state.buckets.length > 0) {
      const bucketCount = state.buckets.length
      const w = Math.max(800, bucketCount * 120)
      return { minX: 0, minY: 0, maxX: w, maxY: 400, width: w, height: 400 }
    }
    return computeContentBounds(nodes)
  }, [nodes, type, state.buckets])

  const showMinimap = type !== 'hash' && nodes.length > 6

  // Viewport culling
  const visibleNodes = useMemo(() => {
    if (nodes.length < 80) return nodes
    const margin = NODE_RADIUS * 2
    const left = -camera.x / camera.scale - margin
    const top = -camera.y / camera.scale - margin
    const right = left + viewportSize.width / camera.scale + margin * 2
    const bottom = top + viewportSize.height / camera.scale + margin * 2
    return nodes.filter((n) => n.x >= left && n.x <= right && n.y >= top && n.y <= bottom)
  }, [nodes, camera, viewportSize])

  const visibleNodeSet = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes])

  const visibleEdges = useMemo(
    () => (nodes.length < 80 ? edges : edges.filter((e) => visibleNodeSet.has(e.from) || visibleNodeSet.has(e.to))),
    [edges, visibleNodeSet, nodes.length],
  )

  const showLabels = useMemo(() => camera.scale > 0.35, [camera.scale])

  // Observe resize
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      setViewportSize({
        width: Math.max(320, entry.contentRect.width),
        height: Math.max(280, entry.contentRect.height),
      })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fitContent = useCallback(() => {
    executeFit(bounds, viewportSize)
  }, [bounds, viewportSize, executeFit])

  const centerContent = useCallback(() => {
    executeCenter(bounds, viewportSize)
  }, [bounds, viewportSize, executeCenter])

  const resetCamera = useCallback(() => {
    executeReset({ x: 0, y: 0, scale: 1 })
  }, [executeReset])

  // Fit to content once on mount only — NOT on every state change.
  // If fitContent is in deps, it fires on every node update and resets the camera
  // while the user is zooming/panning, which is the primary reason controls appear broken.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fitContent() }, [])

  // Screen to world converter
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = viewportRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      const px = clientX - rect.left
      const py = clientY - rect.top
      return {
        x: (px - camera.x) / camera.scale,
        y: (py - camera.y) / camera.scale,
      }
    },
    [camera],
  )

  const handleWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      e.preventDefault()
      const factor = Math.exp(-e.deltaY * 0.0011)
      const rect = viewportRef.current?.getBoundingClientRect() ?? null
      zoomAt(e.clientX, e.clientY, camera.scale * factor, rect)
    },
    [camera.scale, zoomAt],
  )

  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    // CRITICAL: Do NOT capture pointer / initiate drag when the pointer originates
    // from an interactive child element (buttons, inputs, selects, links).
    // Without this guard, setPointerCapture on the outer div steals the pointer from
    // button onClick handlers on touch/pointer devices, making buttons appear broken.
    const target = e.target as Element
    if (target.closest('button, input, select, a, [role="button"]')) return

    e.currentTarget.setPointerCapture(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 1) {
      dragRef.current = { x: e.clientX, y: e.clientY }
    } else if (pointersRef.current.size === 2) {
      dragRef.current = null
      pinchRef.current = getPinch(Array.from(pointersRef.current.values()))
    }
  }, [])

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      const pts = Array.from(pointersRef.current.values())

      if (pts.length >= 2) {
        const pinch = getPinch(pts)
        const prev = pinchRef.current
        pinchRef.current = pinch
        if (!prev || prev.distance === 0) return
        const rect = viewportRef.current?.getBoundingClientRect() ?? null
        zoomAt(pinch.centerX, pinch.centerY, camera.scale * (pinch.distance / prev.distance), rect)
        return
      }

      const worldPos = screenToWorld(e.clientX, e.clientY)

      if (linkingNodeId) {
        setLinkingPos(worldPos)
        return
      }

      if (draggedNodeId && onStateChange) {
        const nextX = snapToGrid ? Math.round(worldPos.x / 20) * 20 : worldPos.x
        const nextY = snapToGrid ? Math.round(worldPos.y / 20) * 20 : worldPos.y
        onStateChange((prev) => ({
          ...prev,
          nodes: prev.nodes?.map((n) => (n.id === draggedNodeId ? { ...n, x: nextX, y: nextY } : n)),
        }))
        return
      }

      const last = dragRef.current
      if (!last) return
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      dragRef.current = { x: e.clientX, y: e.clientY }
      panBy(dx, dy)
    },
    [camera.scale, zoomAt, draggedNodeId, linkingNodeId, snapToGrid, onStateChange, screenToWorld, panBy],
  )

  const endPointer = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      pointersRef.current.delete(e.pointerId)
      dragRef.current = null
      pinchRef.current = null
      setDraggedNodeId(null)

      if (linkingNodeId && onStateChange) {
        const worldPos = screenToWorld(e.clientX, e.clientY)
        const targetRadius = 28
        const target = nodes.find(
          (n) =>
            n.id !== linkingNodeId &&
            Math.hypot((n.x ?? 0) - worldPos.x, (n.y ?? 0) - worldPos.y) < targetRadius,
        )
        if (target) {
          onStateChange((prev) => {
            const exists = prev.edges?.some((edge) => edge.from === linkingNodeId && edge.to === target.id)
            if (exists) return prev
            return {
              ...prev,
              edges: [...(prev.edges ?? []), { from: linkingNodeId, to: target.id, weight: 1, directed: true }],
            }
          })
        }
      }

      setLinkingNodeId(null)
      setLinkingPos(null)
      if (pointersRef.current.size === 1) {
        dragRef.current = Array.from(pointersRef.current.values())[0]
      }
    },
    [linkingNodeId, nodes, onStateChange, screenToWorld],
  )

  // Node editing handlers
  const handleNodePointerDown = useCallback(
    (e: ReactPointerEvent<SVGGElement>, nodeId: string) => {
      e.stopPropagation()
      if (!editMode) return

      if (e.shiftKey) {
        setLinkingNodeId(nodeId)
        setLinkingPos(screenToWorld(e.clientX, e.clientY))
      } else {
        setDraggedNodeId(nodeId)
      }
    },
    [editMode, screenToWorld],
  )

  const handleNodeDoubleClick = useCallback(
    (e: ReactMouseEvent<SVGGElement>, nodeId: string) => {
      e.stopPropagation()
      if (!editMode || !onStateChange) return
      const current = nodeById.get(nodeId)
      const nextVal = prompt('Enter new node value:', String(current?.value ?? ''))
      if (nextVal !== null) {
        onStateChange((prev) => ({
          ...prev,
          nodes: prev.nodes?.map((n) => (n.id === nodeId ? { ...n, value: nextVal } : n)),
        }))
      }
    },
    [editMode, nodeById, onStateChange],
  )

  const handleNodeContextMenu = useCallback(
    (e: ReactMouseEvent<SVGGElement>, nodeId: string) => {
      e.preventDefault()
      e.stopPropagation()
      if (!editMode || !onStateChange) return

      onStateChange((prev) => ({
        ...prev,
        nodes: prev.nodes?.filter((n) => n.id !== nodeId),
        edges: prev.edges?.filter((edge) => edge.from !== nodeId && edge.to !== nodeId),
      }))
    },
    [editMode, onStateChange],
  )

  const handleCanvasDoubleClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!editMode || !onStateChange) return
      const worldPos = screenToWorld(e.clientX, e.clientY)

      const id = `node-${Date.now()}`
      const value = String(nodes.length + 1)

      onStateChange((prev) => ({
        ...prev,
        nodes: [...(prev.nodes ?? []), { id, value, x: worldPos.x, y: worldPos.y, highlight: false }],
      }))
    },
    [editMode, nodes.length, onStateChange, screenToWorld],
  )

  const handleEdgeClick = useCallback(
    (e: ReactMouseEvent, fromId: string, toId: string) => {
      if (!editMode || !onStateChange) return
      e.stopPropagation()
      const currentEdge = edges.find((x) => x.from === fromId && x.to === toId)
      const weightStr = prompt(
        'Enter edge weight (leave empty to remove weight):',
        String(currentEdge?.weight ?? ''),
      )
      if (weightStr === null) return

      if (weightStr === '' || weightStr === 'delete') {
        onStateChange((prev) => ({
          ...prev,
          edges: prev.edges?.map((x) => (x.from === fromId && x.to === toId ? { ...x, weight: undefined } : x)),
        }))
      } else {
        const weightNum = Number(weightStr)
        onStateChange((prev) => ({
          ...prev,
          edges: prev.edges?.map((x) =>
            x.from === fromId && x.to === toId ? { ...x, weight: Number.isNaN(weightNum) ? 1 : weightNum } : x,
          ),
        }))
      }
    },
    [editMode, edges, onStateChange],
  )

  const worldViewport = useMemo(
    () => ({
      x: -camera.x / camera.scale,
      y: -camera.y / camera.scale,
      width: viewportSize.width / camera.scale,
      height: viewportSize.height / camera.scale,
    }),
    [camera, viewportSize],
  )

  const rectGetter = useCallback(() => viewportRef.current?.getBoundingClientRect() ?? null, [])

  return (
    <div
      ref={viewportRef}
      className={`relative h-full min-h-[320px] w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 touch-none ${
        editMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
      style={{ contain: 'layout paint' }}
      onPointerCancel={endPointer}
      onPointerDown={handlePointerDown}
      onPointerLeave={endPointer}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onWheel={handleWheel}
      onDoubleClick={handleCanvasDoubleClick}
    >
      <svg
        viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
        className="h-full w-full select-none overflow-hidden"
        role="img"
        aria-label="Data structure visualization canvas"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <marker id="arrowhead-highlight" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#059669" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}>
          {type === 'hash' && state.buckets && state.buckets.length > 0 ? (
            <HashRenderer state={state} />
          ) : (
            <>
              {visibleEdges.map((edge, i) => (
                <g
                  key={`${edge.from}-${edge.to}-${edge.type ?? 'e'}-${i}`}
                  onClick={(e) => handleEdgeClick(e, edge.from, edge.to)}
                  className={editMode ? 'cursor-pointer hover:opacity-80' : ''}
                >
                  <EdgeElement
                    edge={edge}
                    fromNode={nodeById.get(edge.from)}
                    toNode={nodeById.get(edge.to)}
                    showLabels={showLabels}
                  />
                </g>
              ))}

              {/* Connecting line preview helper */}
              {linkingNodeId && linkingPos && (
                <line
                  x1={nodeById.get(linkingNodeId)?.x ?? 0}
                  y1={nodeById.get(linkingNodeId)?.y ?? 0}
                  x2={linkingPos.x}
                  y2={linkingPos.y}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              )}

              {visibleNodes.map((node) => (
                <NodeElement
                  key={node.id}
                  node={node}
                  type={type}
                  showLabel={showLabels}
                  onPointerDown={handleNodePointerDown}
                  onDoubleClick={handleNodeDoubleClick}
                  onContextMenu={handleNodeContextMenu}
                />
              ))}

              {state.pointers?.map((ptr, i) => (
                <PointerElement
                  key={`${ptr.name}-${ptr.targetId}-${i}`}
                  pointer={ptr}
                  target={nodeById.get(ptr.targetId)}
                />
              ))}
            </>
          )}
        </g>
      </svg>

      {/* Viewport controls */}
      <CanvasControls
        onZoomOut={() => zoomOut(rectGetter())}
        onZoomIn={() => zoomIn(rectGetter())}
        onFit={fitContent}
        onCenter={centerContent}
        onResetView={resetCamera}
        onToggleFullscreen={() => toggleFullscreen(viewportRef.current)}
        isFullscreen={isFullscreen}
      />

      {/* Zoom indicator badge */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-white/10 bg-slate-950/80 px-2 py-1 text-[11px] font-semibold text-slate-300">
        {Math.round(camera.scale * 100)}%
      </div>

      {/* Node count badge */}
      {nodes.length > 0 && (
        <div className="pointer-events-none absolute left-3 top-10 mt-1 rounded-md border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-400">
          {nodes.length} nodes
        </div>
      )}

      {/* Minimap */}
      {showMinimap && (
        <MiniMap
          bounds={bounds}
          worldViewport={worldViewport}
          edges={edges}
          nodeById={nodeById}
          nodes={nodes}
        />
      )}

      {/* Visited order trail */}
      {(state.visited?.length ?? 0) > 0 && (
        <div className="absolute bottom-2 left-2 right-2 flex max-h-20 flex-wrap items-center gap-1 overflow-y-auto rounded bg-slate-950/85 p-2 shadow-xl backdrop-blur">
          <span className="mr-1 text-[10px] text-slate-400">Order:</span>
          {state.visited!.map((v, i) => (
            <div
              key={i}
              className="flex h-6 min-w-[1.5rem] items-center justify-center rounded bg-blue-600 px-1 text-[10px] font-bold text-white"
            >
              {v}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const VisualizerCanvas = memo(VisualizerCanvasComponent)

// ---------------------------------------------------------------------------
// Canvas controls panel with accessible buttons
// ---------------------------------------------------------------------------

function CanvasControls({
  onZoomOut,
  onZoomIn,
  onFit,
  onCenter,
  onResetView,
  onToggleFullscreen,
  isFullscreen,
}: {
  onZoomOut: () => void
  onZoomIn: () => void
  onFit: () => void
  onCenter: () => void
  onResetView: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
}) {
  const fsLabel = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'

  return (
    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-white/10 bg-slate-950/85 p-1 shadow-xl backdrop-blur">
      <VBtn label="Zoom out (-)" onClick={onZoomOut}>
        <ZoomOut size={16} />
      </VBtn>
      <VBtn label="Zoom in (+)" onClick={onZoomIn}>
        <ZoomIn size={16} />
      </VBtn>
      <VBtn label="Fit to screen (0)" onClick={onFit}>
        <Maximize2 size={16} />
      </VBtn>
      <VBtn label="Center view" onClick={onCenter}>
        <LocateFixed size={16} />
      </VBtn>
      <VBtn label="Reset view (R)" onClick={onResetView}>
        <RotateCcw size={16} />
      </VBtn>
      <VBtn label={`${fsLabel} (F)`} onClick={onToggleFullscreen}>
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </VBtn>
    </div>
  )
}

function VBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-md text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
