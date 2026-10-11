'use client'

import { memo } from 'react'
import type { HighlightColor, StructureType, VisualNode } from '@/types'

interface NodeElementProps {
  node: VisualNode
  type: StructureType
  showLabel?: boolean
  onPointerDown?: (e: React.PointerEvent<SVGGElement>, nodeId: string) => void
  onDoubleClick?: (e: React.MouseEvent<SVGGElement>, nodeId: string) => void
  onContextMenu?: (e: React.MouseEvent<SVGGElement>, nodeId: string) => void
}

function getHighlightFill(highlight: HighlightColor): string {
  if (typeof highlight === 'string' && (highlight.startsWith('#') || highlight.startsWith('rgb'))) return highlight
  const map: Record<string, string> = {
    yellow: '#b45309', green: '#047857', red: '#b91c1c', blue: '#1d4ed8', black: '#020617',
  }
  return typeof highlight === 'string' ? (map[highlight] ?? '#1d4ed8') : '#1d4ed8'
}

function getBaseFill(node: VisualNode): string {
  if (node.color === 'red') return '#7f1d1d'
  if (node.color === 'black') return '#020617'
  if (typeof node.color === 'string') return node.color
  return '#1e293b'
}

function NodeElementComponent({
  node,
  type,
  showLabel = true,
  onPointerDown,
  onDoubleClick,
  onContextMenu,
}: NodeElementProps) {
  const isHL = node.highlight === true || typeof node.highlight === 'string'
  const fill = isHL ? getHighlightFill(node.highlight!) : getBaseFill(node)
  const stroke = isHL ? '#60a5fa' : node.color === 'red' ? '#ef4444' : '#475569'
  const strokeW = isHL ? 2.5 : node.color === 'red' ? 2 : 1.5

  const label = String(node.value)
  const isLongLabel = label.length > 4
  const fontSize = isLongLabel ? Math.max(8, 13 - (label.length - 4)) : 13

  // Linear / array / queue cells
  if (type === 'linear' || type === 'stack' || type === 'queue') {
    return (
      <g transform={`translate(${node.x},${node.y})`}
        style={{ opacity: node.opacity ?? 1 }}
        onPointerDown={(e) => onPointerDown?.(e, node.id)}
        onDoubleClick={(e) => onDoubleClick?.(e, node.id)}
        onContextMenu={(e) => onContextMenu?.(e, node.id)}>
        <title>{`cell ${node.value}`}</title>
        <rect x="-32" y="-24" width="64" height="48" rx="6"
          fill={fill} stroke={stroke} strokeWidth={strokeW}
          filter={isHL ? 'url(#glow)' : undefined}
          style={{ transition: 'fill 0.3s ease' }} />
        {showLabel && (
          <text textAnchor="middle" dy="5" fill="white" fontSize={fontSize} fontWeight="bold">{node.value}</text>
        )}
        {showLabel && node.index !== undefined && (
          <text textAnchor="middle" dy="42" fill="#94a3b8" fontSize="10">idx {node.index}</text>
        )}
        {showLabel && node.priority !== undefined && (
          <text textAnchor="middle" dy="-32" fill="#fbbf24" fontSize="9">P:{node.priority}</text>
        )}
      </g>
    )
  }

  // Tree / graph / linked nodes (circles)
  const r = 26
  return (
    <g transform={`translate(${node.x},${node.y})`}
      style={{ opacity: node.opacity ?? 1 }}
      onPointerDown={(e) => onPointerDown?.(e, node.id)}
      onDoubleClick={(e) => onDoubleClick?.(e, node.id)}
      onContextMenu={(e) => onContextMenu?.(e, node.id)}>
      <title>{`node ${node.value}`}</title>
      <circle r={r} fill={fill} stroke={stroke} strokeWidth={strokeW}
        filter={isHL ? 'url(#glow)' : undefined}
        style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }} />

      {showLabel && (
        <text textAnchor="middle" dy="5" fill="white" fontSize={fontSize} fontWeight="bold">{node.value}</text>
      )}

      {/* AVL balance factor + height */}
      {showLabel && (node.height !== undefined || node.balanceFactor !== undefined) && (
        <text textAnchor="middle" dy={r + 14} fill="#fbbf24" fontSize="9">
          {node.height !== undefined ? `h:${node.height}` : ''}{node.balanceFactor !== undefined ? ` bf:${node.balanceFactor}` : ''}
        </text>
      )}

      {/* Index / bit display */}
      {showLabel && node.index !== undefined && node.height === undefined && node.priority === undefined && (
        <text textAnchor="middle" dy={r + 14} fill="#94a3b8" fontSize="9">bit {node.index}</text>
      )}

      {/* Priority display */}
      {showLabel && node.priority !== undefined && (
        <text textAnchor="middle" dy={r + 14} fill="#fbbf24" fontSize="9">P:{node.priority}</text>
      )}

      {/* Red-Black color ring */}
      {node.color === 'red' && (
        <circle r={r + 4} fill="none" stroke="#ef444480" strokeWidth="2" />
      )}
    </g>
  )
}

export const NodeElement = memo(NodeElementComponent)
