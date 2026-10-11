'use client'

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { LocateFixed, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import type { LayoutNode } from '@/core/rendering/btreeLayout'
import { computeBTreeLayout, KEY_HEIGHT, KEY_WIDTH, LEVEL_GAP } from '@/core/rendering/btreeLayout'
import type { BTreeNode } from '@/core/btree/types'
import { useCamera, type ViewportSize } from '@/hooks/useCamera'

interface BTreeCanvasProps {
  root: BTreeNode<number> | null
  leafHead?: BTreeNode<number> | null
  highlightNodeId?: string
  highlightKey?: number
  highlightRange?: [number, number]
  showLeafLinks?: boolean
  treeType?: 'btree' | 'bplus'
}

const DEFAULT_VIEWPORT: ViewportSize = { width: 900, height: 500 }
const NODE_PADDING_X = 8
const KEY_GAP = 2

const COLORS = {
  bg: '#020617',
  nodeBg: '#0f172a',
  nodeBorder: '#334155',
  keyBg: '#1e293b',
  keyBorder: '#475569',
  keyText: '#f1f5f9',
  highlightNodeBorder: '#38bdf8',
  highlightKeyBg: '#0369a1',
  highlightKeyBorder: '#38bdf8',
  highlightKeyText: '#bae6fd',
  rangeKeyBg: '#16a34a',
  rangeKeyBorder: '#22c55e',
  rangeKeyText: '#dcfce7',
  leafBg: '#0c1a2e',
  leafBorder: '#1d4ed8',
  leafLink: '#3b82f6',
  edge: '#475569',
  splitHighlight: '#f59e0b',
  mergeHighlight: '#a855f7',
}

export const BTreeCanvas = memo(function BTreeCanvas({
  root,
  leafHead,
  highlightNodeId,
  highlightKey,
  highlightRange,
  showLeafLinks = true,
  treeType = 'btree',
}: BTreeCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewportSize, setViewportSize] = useState<ViewportSize>(DEFAULT_VIEWPORT)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const prevPinchDistRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const lastPanRef = useRef({ x: 0, y: 0 })

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
  } = useCamera({ minScale: 0.05, maxScale: 6.0, defaultPadding: 60 })

  // Compute layout
  const layout = useMemo(() => computeBTreeLayout(root, leafHead ?? null), [root, leafHead])

  // Content bounds for camera fit/center
  const bounds = useMemo(
    () => ({
      minX: 0,
      minY: 0,
      maxX: layout.totalWidth,
      maxY: layout.totalHeight,
      width: Math.max(1, layout.totalWidth),
      height: Math.max(1, layout.totalHeight),
    }),
    [layout],
  )

  // Resize observer
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      setViewportSize({
        width: Math.max(300, entry.contentRect.width),
        height: Math.max(200, entry.contentRect.height),
      })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fitContent = useCallback(() => {
    if (layout.totalWidth === 0) return
    executeFit(bounds, viewportSize, 60)
  }, [bounds, viewportSize, layout.totalWidth, executeFit])

  const centerContent = useCallback(() => {
    if (layout.totalWidth === 0) return
    executeCenter(bounds, viewportSize)
  }, [bounds, viewportSize, layout.totalWidth, executeCenter])

  const resetCamera = useCallback(() => {
    executeReset({ x: 40, y: 40, scale: 1 })
  }, [executeReset])

  // Fit once on mount — NOT on every layout/bounds change, which would reset the camera
  // every time the tree structure changes during user interaction.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fitContent() }, [])

  const rectGetter = useCallback(() => viewportRef.current?.getBoundingClientRect() ?? null, [])

  const handleWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      e.preventDefault()
      zoomAt(e.clientX, e.clientY, camera.scale * Math.exp(-e.deltaY * 0.0011), rectGetter())
    },
    [camera.scale, zoomAt, rectGetter],
  )

  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    // Guard: do not steal pointer from interactive children (buttons, inputs, etc.)
    const target = e.target as Element
    if (target.closest('button, input, select, a, [role="button"]')) return

    e.currentTarget.setPointerCapture(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    isDraggingRef.current = true
    lastPanRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      // Pinch zoom
      if (pointersRef.current.size === 2) {
        const [a, b] = [...pointersRef.current.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        if (prevPinchDistRef.current !== null) {
          const factor = dist / prevPinchDistRef.current
          const midX = (a.x + b.x) / 2
          const midY = (a.y + b.y) / 2
          zoomAt(midX, midY, camera.scale * factor, rectGetter())
        }
        prevPinchDistRef.current = dist
        return
      }

      prevPinchDistRef.current = null
      if (!isDraggingRef.current) return
      const dx = e.clientX - lastPanRef.current.x
      const dy = e.clientY - lastPanRef.current.y
      lastPanRef.current = { x: e.clientX, y: e.clientY }
      panBy(dx, dy)
    },
    [camera.scale, panBy, rectGetter, zoomAt],
  )

  const handlePointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId)
    isDraggingRef.current = pointersRef.current.size > 0
    prevPinchDistRef.current = null
  }, [])

  // ── Rendering helpers ─────────────────────────────────────────────────────

  const nodeMap = useMemo(() => {
    const m = new Map<string, LayoutNode>()
    layout.nodes.forEach((n) => m.set(n.id, n))
    return m
  }, [layout.nodes])

  const renderNode = (lNode: LayoutNode) => {
    const isHL = lNode.id === highlightNodeId
    const nodeColor = isHL ? COLORS.highlightNodeBorder : lNode.isLeaf ? COLORS.leafBorder : COLORS.nodeBorder
    const nodeFill = lNode.isLeaf ? COLORS.leafBg : COLORS.nodeBg

    const totalKeyW = lNode.keys.length * KEY_WIDTH + (lNode.keys.length - 1) * KEY_GAP
    const nodeW = totalKeyW + NODE_PADDING_X * 2

    return (
      <g key={lNode.id} transform={`translate(${lNode.x} ${lNode.y})`}>
        {/* Node outer rect */}
        <rect
          x={0}
          y={0}
          width={nodeW}
          height={KEY_HEIGHT}
          rx={8}
          fill={nodeFill}
          stroke={nodeColor}
          strokeWidth={isHL ? 3 : 1.5}
          style={{ filter: isHL ? 'drop-shadow(0 0 8px #38bdf8)' : undefined }}
        />

        {/* Key boxes */}
        {lNode.keys.map((key, ki) => {
          const isKeyHL = key === highlightKey && isHL
          const isRangeHL = highlightRange && key >= highlightRange[0] && key <= highlightRange[1]
          const kx = NODE_PADDING_X + ki * (KEY_WIDTH + KEY_GAP)

          return (
            <g key={ki}>
              {ki > 0 && (
                <line
                  x1={kx - KEY_GAP / 2}
                  y1={2}
                  x2={kx - KEY_GAP / 2}
                  y2={KEY_HEIGHT - 2}
                  stroke={COLORS.nodeBorder}
                  strokeWidth={1}
                />
              )}

              <rect
                x={kx}
                y={3}
                width={KEY_WIDTH}
                height={KEY_HEIGHT - 6}
                rx={5}
                fill={isKeyHL ? COLORS.highlightKeyBg : isRangeHL ? COLORS.rangeKeyBg : COLORS.keyBg}
                stroke={isKeyHL ? COLORS.highlightKeyBorder : isRangeHL ? COLORS.rangeKeyBorder : COLORS.keyBorder}
                strokeWidth={isKeyHL || isRangeHL ? 2 : 1}
              />
              <text
                x={kx + KEY_WIDTH / 2}
                y={KEY_HEIGHT / 2 + 4}
                fill={isKeyHL ? COLORS.highlightKeyText : isRangeHL ? COLORS.rangeKeyText : COLORS.keyText}
                fontSize={key >= 100 ? 10 : 12}
                fontWeight="bold"
                textAnchor="middle"
                style={{ userSelect: 'none', pointerEvents: 'none', fontFamily: 'monospace' }}
              >
                {key}
              </text>
            </g>
          )
        })}

        {lNode.isLeaf && <circle cx={nodeW - 6} cy={6} r={3} fill={COLORS.leafLink} opacity={0.8} />}
      </g>
    )
  }

  const renderEdge = (fromId: string, fromSlot: number, toId: string) => {
    const from = nodeMap.get(fromId)
    const to = nodeMap.get(toId)
    if (!from || !to) return null

    const totalKeyW = from.keys.length * KEY_WIDTH + (from.keys.length - 1) * KEY_GAP
    const nodeW = totalKeyW + NODE_PADDING_X * 2
    const slotFraction = from.keys.length > 0 ? fromSlot / from.keys.length : 0.5
    const fromX = from.x + NODE_PADDING_X + slotFraction * (nodeW - 2 * NODE_PADDING_X)
    const fromY = from.y + KEY_HEIGHT
    const toX = to.x + (to.width ?? KEY_WIDTH) / 2
    const toY = to.y

    const cy = fromY + (toY - fromY) * 0.45

    return (
      <path
        key={`${fromId}-${fromSlot}-${toId}`}
        d={`M${fromX},${fromY} C${fromX},${cy} ${toX},${cy} ${toX},${toY}`}
        fill="none"
        stroke={COLORS.edge}
        strokeWidth={1.5}
        opacity={0.7}
      />
    )
  }

  const renderLeafLink = (fromId: string, toId: string) => {
    const from = nodeMap.get(fromId)
    const to = nodeMap.get(toId)
    if (!from || !to) return null

    const fromX = from.x + (from.width ?? KEY_WIDTH)
    const fromY = from.y + KEY_HEIGHT / 2
    const toX = to.x
    const toY = to.y + KEY_HEIGHT / 2
    const midY = fromY + LEVEL_GAP * 0.3

    return (
      <g key={`ll-${fromId}-${toId}`}>
        <defs>
          <marker id={`arrow-${fromId}`} markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" fill={COLORS.leafLink} />
          </marker>
        </defs>
        <path
          d={`M${fromX},${fromY} Q${(fromX + toX) / 2},${midY} ${toX},${toY}`}
          fill="none"
          stroke={COLORS.leafLink}
          strokeWidth={1.5}
          strokeDasharray="5,3"
          markerEnd={`url(#arrow-${fromId})`}
          opacity={0.7}
        />
      </g>
    )
  }

  const nodeStats = `${layout.nodes.length} nodes | ${layout.nodes.filter((n) => n.isLeaf).length} leaves`

  return (
    <div
      ref={viewportRef}
      className="relative h-full min-h-[400px] w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950 touch-none select-none cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {!root && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🌳</div>
            <div className="text-sm font-semibold">Tree is empty</div>
            <div className="text-xs text-slate-600 mt-1">Insert keys or generate a random tree</div>
          </div>
        </div>
      )}

      <svg viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`} className="h-full w-full">
        <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}>
          {layout.edges.map((e) => renderEdge(e.fromId, e.fromSlot, e.toId))}
          {showLeafLinks && treeType === 'bplus' && layout.leafLinks.map((ll) => renderLeafLink(ll.fromId, ll.toId))}
          {layout.nodes.map((n) => renderNode(n))}
        </g>
      </svg>

      {/* Camera Controls */}
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/90 p-1 shadow-xl backdrop-blur">
        <button
          onClick={() => zoomOut(rectGetter())}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Zoom Out (-)"
          aria-label="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={() => zoomIn(rectGetter())}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Zoom In (+)"
          aria-label="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={fitContent}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Fit to Screen (0)"
          aria-label="Fit to Screen"
        >
          <Maximize2 size={16} />
        </button>
        <button
          onClick={centerContent}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Center view"
          aria-label="Center view"
        >
          <LocateFixed size={16} />
        </button>
        <button
          onClick={resetCamera}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Reset View (R)"
          aria-label="Reset View"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => toggleFullscreen(viewportRef.current)}
          className="p-1.5 rounded hover:bg-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Stats badge */}
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <div className="rounded-md border border-white/10 bg-slate-900/80 px-2 py-1 text-[10px] font-mono font-bold text-slate-300">
          {Math.round(camera.scale * 100)}%
        </div>
        {root && (
          <div className="rounded-md border border-white/10 bg-slate-900/80 px-2 py-1 text-[10px] font-mono text-slate-400">
            {nodeStats}
          </div>
        )}
      </div>
    </div>
  )
})
