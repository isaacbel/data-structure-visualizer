'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
      <div className="glass-card max-w-md p-8 border border-red-500/20 bg-red-950/10">
        <h2 className="mb-4 text-2xl font-bold text-red-400">Oops! Something went wrong</h2>
        <p className="mb-6 text-sm text-slate-400">
          An unexpected error occurred in the application shell. We have logged this error.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => reset()} className="btn-primary">
            Try Again
          </button>
          <a href="/" className="btn-secondary">
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
