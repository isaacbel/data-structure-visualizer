'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent, MouseEvent as ReactMouseEvent } from 'react'
import { LocateFixed, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import type { VisualNode, VisualState } from '@/types'
import { useCamera, computeContentBounds, type ViewportSize } from '@/hooks/useCamera'

export type NodeShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'hexagon'

interface GraphCanvasProps {
  state: VisualState
  onStateChange?: (state: VisualState | ((prev: VisualState) => VisualState)) => void
  editMode?: boolean
  snapToGrid?: boolean
  searchQuery?: string
  nodeShape?: NodeShape
}

const DEFAULT_VIEWPORT: ViewportSize = { width: 800, height: 420 }
const NODE_RADIUS = 30

export function GraphCanvasComponent({
  state,
  onStateChange,
  editMode = false,
  snapToGrid = false,
  searchQuery = '',
  nodeShape = 'circle',
}: GraphCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const dragRef = useRef<{ x: number; y: number } | null>(null)

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

  // Interactive editing states
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [linkingNodeId, setLinkingNodeId] = useState<string | null>(null)
  const [linkingPos, setLinkingPos] = useState<{ x: number; y: number } | null>(null)

  const nodes = useMemo(() => state.nodes ?? [], [state.nodes])
  const edges = useMemo(() => state.edges ?? [], [state.edges])
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  const bounds = useMemo(() => computeContentBounds(nodes), [nodes])

  // Screen to world coordinates
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = viewportRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      return {
        x: (clientX - rect.left - camera.x) / camera.scale,
        y: (clientY - rect.top - camera.y) / camera.scale,
      }
    },
    [camera],
  )

  const fitContent = useCallback(() => {
    executeFit(bounds, viewportSize)
  }, [bounds, viewportSize, executeFit])

  const centerContent = useCallback(() => {
    executeCenter(bounds, viewportSize)
  }, [bounds, viewportSize, executeCenter])

  const resetCamera = useCallback(() => {
    executeReset({ x: 0, y: 0, scale: 1 })
  }, [executeReset])

  // Fit once on mount — NOT on every bounds change, which would reset the camera
  // every time a node is added/removed during user interaction.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fitContent() }, [])

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
    // Guard: do not steal pointer from interactive children (buttons, inputs, etc.)
    const target = e.target as Element
    if (target.closest('button, input, select, a, [role="button"]')) return

    e.currentTarget.setPointerCapture(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 1) {
      dragRef.current = { x: e.clientX, y: e.clientY }
    }
  }, [])

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
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
    [draggedNodeId, linkingNodeId, onStateChange, panBy, screenToWorld, snapToGrid],
  )

  const endPointer = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      pointersRef.current.delete(e.pointerId)
      dragRef.current = null
      setDraggedNodeId(null)

      if (linkingNodeId && onStateChange) {
        const worldPos = screenToWorld(e.clientX, e.clientY)
        const target = nodes.find(
          (n) => n.id !== linkingNodeId && Math.hypot(n.x - worldPos.x, n.y - worldPos.y) < NODE_RADIUS * 1.2,
        )
        if (target) {
          onStateChange((prev) => {
            const exists = prev.edges?.some((x) => x.from === linkingNodeId && x.to === target.id)
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
    },
    [linkingNodeId, nodes, onStateChange, screenToWorld],
  )

  const handleCanvasDoubleClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!editMode || !onStateChange) return
      const worldPos = screenToWorld(e.clientX, e.clientY)
      const id = `v${nodes.length}`
      const value = String(nodes.length)
      onStateChange((prev) => ({
        ...prev,
        nodes: [...(prev.nodes ?? []), { id, value, x: worldPos.x, y: worldPos.y, highlight: false }],
      }))
    },
    [editMode, nodes.length, onStateChange, screenToWorld],
  )

  const renderShape = (n: VisualNode, isMatched: boolean) => {
    const fill = isMatched
      ? '#38bdf8'
      : n.highlight
        ? typeof n.highlight === 'string'
          ? n.highlight
          : '#3b82f6'
        : '#1e293b'

    const stroke = isMatched ? '#f59e0b' : n.highlight ? '#60a5fa' : '#475569'

    switch (nodeShape) {
      case 'square':
        return (
          <rect
            x={n.x - NODE_RADIUS}
            y={n.y - NODE_RADIUS}
            width={NODE_RADIUS * 2}
            height={NODE_RADIUS * 2}
            rx={6}
            fill={fill}
            stroke={stroke}
            strokeWidth={3}
          />
        )
      case 'diamond':
        return (
          <polygon
            points={`${n.x},${n.y - NODE_RADIUS} ${n.x + NODE_RADIUS},${n.y} ${n.x},${n.y + NODE_RADIUS} ${n.x - NODE_RADIUS},${n.y}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={3}
          />
        )
      case 'hexagon':
        return (
          <polygon
            points={`${n.x - 20},${n.y - 30} ${n.x + 20},${n.y - 30} ${n.x + 30},${n.y} ${n.x + 20},${n.y + 30} ${n.x - 20},${n.y + 30} ${n.x - 30},${n.y}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={3}
          />
        )
      default:
        return (
          <circle
            cx={n.x}
            cy={n.y}
            r={NODE_RADIUS}
            fill={fill}
            stroke={stroke}
            strokeWidth={3}
          />
        )
    }
  }

  const rectGetter = useCallback(() => viewportRef.current?.getBoundingClientRect() ?? null, [])

  return (
    <div
      ref={viewportRef}
      className={`relative h-full min-h-[400px] w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950 touch-none select-none ${
        editMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onWheel={handleWheel}
      onDoubleClick={handleCanvasDoubleClick}
    >
      <svg
        viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
        className="h-full w-full select-none"
        role="img"
        aria-label="Graph visualization canvas"
      >
        <defs>
          <marker id="graph-arrow" markerWidth="8" markerHeight="6" refX="18" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
          </marker>
          <marker id="graph-arrow-hl" markerWidth="8" markerHeight="6" refX="18" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
        </defs>

        <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}>
          {snapToGrid && (
            <pattern id="canvas-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
          )}

          {edges.map((e, i) => {
            const f = nodeById.get(e.from)
            const t = nodeById.get(e.to)
            if (!f || !t) return null
            const isHL = e.highlight
            const isSelf = e.from === e.to

            if (isSelf) {
              return (
                <path
                  key={i}
                  d={`M ${f.x} ${f.y - NODE_RADIUS} C ${f.x - 40} ${f.y - 80}, ${f.x + 40} ${f.y - 80}, ${f.x} ${f.y - NODE_RADIUS}`}
                  fill="none"
                  stroke={isHL ? '#3b82f6' : '#475569'}
                  strokeWidth={isHL ? 3 : 2}
                />
              )
            }

            return (
              <g key={i}>
                <line
                  x1={f.x}
                  y1={f.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={isHL ? '#3b82f6' : '#475569'}
                  strokeWidth={isHL ? 3 : 2}
                  markerEnd={e.directed ? (isHL ? 'url(#graph-arrow-hl)' : 'url(#graph-arrow)') : undefined}
                />
                {e.weight !== undefined && (
                  <text
                    x={(f.x + t.x) / 2}
                    y={(f.y + t.y) / 2 - 6}
                    fill="#38bdf8"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {e.weight}
                  </text>
                )}
              </g>
            )
          })}

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

          {nodes.map((n) => {
            const isMatched = searchQuery !== '' && String(n.value).toLowerCase().includes(searchQuery.toLowerCase())
            return (
              <g
                key={n.id}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  if (!editMode) return
                  if (e.shiftKey) {
                    setLinkingNodeId(n.id)
                    setLinkingPos(screenToWorld(e.clientX, e.clientY))
                  } else {
                    setDraggedNodeId(n.id)
                  }
                }}
                className="cursor-pointer"
              >
                {renderShape(n, isMatched)}
                <text
                  x={n.x}
                  y={n.y + 4}
                  fill="#f8fafc"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="select-none pointer-events-none"
                >
                  {n.value}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Camera controls */}
      <GraphCanvasControls
        onZoomOut={() => zoomOut(rectGetter())}
        onZoomIn={() => zoomIn(rectGetter())}
        onFit={fitContent}
        onCenter={centerContent}
        onReset={resetCamera}
        onToggleFullscreen={() => toggleFullscreen(viewportRef.current)}
        isFullscreen={isFullscreen}
      />

      {/* Scale Badge */}
      <div className="absolute left-3 top-3 rounded bg-slate-900/80 px-2 py-1 text-[10px] font-mono font-bold text-slate-300 border border-white/10">
        {Math.round(camera.scale * 100)}% | {nodes.length} nodes | {edges.length} edges
      </div>
    </div>
  )
}

export const GraphCanvas = memo(GraphCanvasComponent)

function GraphCanvasControls({
  onZoomOut,
  onZoomIn,
  onFit,
  onCenter,
  onReset,
  onToggleFullscreen,
  isFullscreen,
}: {
  onZoomOut: () => void
  onZoomIn: () => void
  onFit: () => void
  onCenter: () => void
  onReset: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
}) {
  const fsLabel = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'

  const btn = (label: string, onClick: () => void, child: React.ReactNode) => (
    <button
      onClick={onClick}
      className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      title={label}
      aria-label={label}
    >
      {child}
    </button>
  )

  return (
    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/90 p-1 shadow-xl backdrop-blur">
      {btn('Zoom out (-)', onZoomOut, <ZoomOut size={16} />)}
      {btn('Zoom in (+)', onZoomIn, <ZoomIn size={16} />)}
      {btn('Fit to screen (0)', onFit, <Maximize2 size={16} />)}
      {btn('Center view', onCenter, <LocateFixed size={16} />)}
      {btn('Reset view (R)', onReset, <RotateCcw size={16} />)}
      {btn(`${fsLabel} (F)`, onToggleFullscreen, isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />)}
    </div>
  )
}
