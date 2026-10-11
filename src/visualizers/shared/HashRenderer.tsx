'use client'

import { memo } from 'react'
import type { VisualState } from '@/types'

interface HashRendererProps {
  state: VisualState
}

function HashRendererComponent({ state }: HashRendererProps) {
  const bucketWidth = 140
  const itemHeight = 36

  return (
    <g>
      {state.buckets?.map((bucket, i) => (
        <g key={i} transform={`translate(${40 + i * (bucketWidth + 20)}, 40)`}>
          <rect
            width={bucketWidth}
            height="320"
            fill="#1e293b"
            stroke={bucket.highlight ? '#3b82f6' : '#475569'}
            strokeWidth={bucket.highlight ? 2 : 1}
            rx="4"
            style={{ transition: 'all 0.3s ease' }}
          />
          <text
            x={bucketWidth / 2}
            y="22"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="12"
            fontWeight="bold"
          >
            Bucket {bucket.index}
          </text>
          {bucket.items.map((item, j) => (
            <g
              key={j}
              transform={`translate(${bucketWidth / 2}, ${45 + j * itemHeight})`}
              style={{ transition: 'all 0.3s ease' }}
            >
              <rect
                x="-55"
                y="-14"
                width="110"
                height="28"
                fill={
                  item.highlight === 'green'
                    ? '#059669'
                    : item.highlight
                      ? '#3b82f6'
                      : '#334155'
                }
                stroke="#475569"
                rx="2"
              />
              <text textAnchor="middle" dy="5" fill="white" fontSize="12">
                {item.value}
              </text>
            </g>
          ))}
        </g>
      ))}
    </g>
  )
}

export const HashRenderer = memo(HashRendererComponent)
