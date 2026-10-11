export default function LearnLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header skeleton */}
      <div className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 h-7 w-64 animate-pulse rounded-xl bg-slate-800" />
            <div className="h-4 w-80 animate-pulse rounded bg-slate-800" />
          </div>
          <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-800" />
        </div>
        <div className="mt-4 flex gap-1">
          {['Visualize', 'Theory', 'Code', 'Quiz'].map((tab) => (
            <div key={tab} className="h-11 w-24 animate-pulse rounded-t-lg bg-slate-800" />
          ))}
        </div>
      </div>

      {/* Canvas/visualizer skeleton */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main canvas */}
          <div className="lg:col-span-2">
            <div className="glass-card h-96 animate-pulse rounded-2xl bg-slate-800/50">
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500" />
                  <div className="text-slate-500 text-sm">Loading visualizer…</div>
                </div>
              </div>
            </div>
            {/* Controls skeleton */}
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-10 animate-pulse rounded-xl bg-slate-800" />
              ))}
            </div>
          </div>

          {/* Side panel skeleton */}
          <div className="space-y-4">
            <div className="glass-card p-4">
              <div className="mb-3 h-5 w-24 animate-pulse rounded bg-slate-700" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-2 h-4 animate-pulse rounded bg-slate-800" style={{ width: `${70 + i * 5}%` }} />
              ))}
            </div>
            <div className="glass-card p-4">
              <div className="mb-3 h-5 w-32 animate-pulse rounded bg-slate-700" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-800" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
