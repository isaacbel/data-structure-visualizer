'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center text-white">
      <div className="glass-card mx-auto max-w-md p-8 border border-red-500/20 bg-red-950/10">
        <h2 className="mb-4 text-2xl font-bold text-red-400">Dashboard Error</h2>
        <p className="mb-6 text-sm text-slate-400">
          Something went wrong while loading your dashboard. Your progress data is safe.
        </p>
        <button onClick={() => reset()} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  )
}
