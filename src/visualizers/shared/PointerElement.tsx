'use client'

import { memo } from 'react'
import type { VisualNode, VisualPointer } from '@/types'

interface PointerElementProps {
  pointer: VisualPointer
  target?: VisualNode
}

function PointerElementComponent({ pointer, target }: PointerElementProps) {
  if (!target) return null

  return (
    <g transform={`translate(${target.x}, ${target.y - 45})`} style={{ transition: 'all 0.5s ease' }}>
      <title>{`${pointer.name} points to ${target.value}`}</title>
      <text textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">
        {pointer.name}
      </text>
      <path d="M0,5 L-6,18 L6,18 Z" fill="#fbbf24" />
    </g>
  )
}

export const PointerElement = memo(PointerElementComponent)
