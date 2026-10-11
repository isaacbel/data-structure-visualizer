'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LearnError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Visualizer error:', error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center text-white">
      <div className="glass-card max-w-md p-8 border border-red-500/20 bg-red-950/10">
        <h2 className="mb-4 text-2xl font-bold text-red-400">Visualizer Error</h2>
        <p className="mb-6 text-sm text-slate-400">
          This visualizer encountered an error. Other parts of the application are unaffected.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => reset()} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
