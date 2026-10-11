export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Title skeleton */}
      <div className="mb-2 h-8 w-48 animate-pulse rounded-xl bg-slate-800" />
      <div className="mb-8 h-4 w-80 animate-pulse rounded bg-slate-800" />

      {/* Stats cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="mb-2 h-9 w-16 animate-pulse rounded-xl bg-slate-700" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Learning paths */}
      <div className="mb-4 h-6 w-36 animate-pulse rounded-xl bg-slate-800" />
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-700" />
              <div className="h-4 w-10 animate-pulse rounded bg-slate-700" />
            </div>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-slate-700" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-6 w-20 animate-pulse rounded-lg bg-slate-800" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
