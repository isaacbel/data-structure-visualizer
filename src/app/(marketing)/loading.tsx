export default function HomeLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Hero skeleton */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="text-center">
          <div className="mx-auto mb-6 h-8 w-64 animate-pulse rounded-full bg-slate-800" />
          <div className="mx-auto mb-4 h-16 w-3/4 animate-pulse rounded-2xl bg-slate-800" />
          <div className="mx-auto mb-2 h-10 w-1/2 animate-pulse rounded-2xl bg-slate-800" />
          <div className="mx-auto mb-10 h-6 w-96 animate-pulse rounded-xl bg-slate-800" />
          <div className="flex flex-wrap justify-center gap-4">
            <div className="h-12 w-40 animate-pulse rounded-xl bg-slate-700" />
            <div className="h-12 w-40 animate-pulse rounded-xl bg-slate-800" />
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-2 h-10 w-20 animate-pulse rounded-xl bg-slate-800" />
              <div className="mx-auto h-4 w-24 animate-pulse rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards skeleton */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto mb-12 h-8 w-48 animate-pulse rounded-xl bg-slate-800" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="mb-4 h-10 w-10 animate-pulse rounded-xl bg-slate-700" />
              <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-slate-700" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
