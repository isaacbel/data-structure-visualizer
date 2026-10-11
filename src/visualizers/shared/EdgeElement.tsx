'use client'

import { memo } from 'react'
import type { VisualEdge, VisualNode } from '@/types'

interface EdgeElementProps {
  edge: VisualEdge
  fromNode?: VisualNode
  toNode?: VisualNode
  showLabels?: boolean
}

function EdgeElementComponent({ edge, fromNode, toNode, showLabels = true }: EdgeElementProps) {
  if (!fromNode || !toNode) return null

  const color = edge.highlight ? '#3b82f6' : '#475569'
  const strokeW = edge.highlight ? 2.5 : 1.5
  const directed = edge.directed !== false

  // Self-loop
  if (fromNode.id === toNode.id) {
    const r = 22
    const cx = fromNode.x + r * 1.8
    const cy = fromNode.y - r * 1.8
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW}
          markerEnd={directed ? `url(#arrowhead${edge.highlight ? '-highlight' : ''})` : undefined}
          style={{ transition: 'all 0.3s ease' }} />
        {showLabels && edge.weight !== undefined && (
          <text x={cx + r + 4} y={cy} fill="#fbbf24" fontSize="11" textAnchor="start">{edge.weight}</text>
        )}
      </g>
    )
  }

  const dx = toNode.x - fromNode.x
  const dy = toNode.y - fromNode.y
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = dx / dist, ny = dy / dist
  const nodeR = 24

  const sx = fromNode.x + nx * nodeR
  const sy = fromNode.y + ny * nodeR
  const ex = toNode.x - nx * (nodeR + (directed ? 6 : 0))
  const ey = toNode.y - ny * (nodeR + (directed ? 6 : 0))

  const marker = directed ? `url(#arrowhead${edge.highlight ? '-highlight' : ''})` : undefined

  // Curved edges (back / loop / parallel)
  if (edge.type === 'back' || edge.type === 'loop') {
    const lift = edge.type === 'loop' ? 80 : 42
    const mx = (sx + ex) / 2 - ny * lift
    const my = (sy + ey) / 2 + nx * lift
    const path = `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`
    return (
      <g>
        <path d={path} fill="none" stroke={color} strokeWidth={strokeW} markerEnd={marker}
          style={{ transition: 'all 0.3s ease' }} />
        {showLabels && edge.weight !== undefined && (
          <text x={mx} y={my - 6} fill="#fbbf24" fontSize="11" textAnchor="middle">{edge.weight}</text>
        )}
      </g>
    )
  }

  // Straight edge
  const midX = (sx + ex) / 2
  const midY = (sy + ey) / 2
  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={strokeW} markerEnd={marker}
        style={{ transition: 'all 0.3s ease' }} />
      {showLabels && edge.weight !== undefined && (
        <text x={midX - ny * 12} y={midY + nx * 12} fill="#fbbf24" fontSize="11" textAnchor="middle">{edge.weight}</text>
      )}
    </g>
  )
}

export const EdgeElement = memo(EdgeElementComponent)
