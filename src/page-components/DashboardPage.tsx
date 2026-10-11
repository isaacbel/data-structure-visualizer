'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Bookmark } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/constants/translations'
import { DATA_STRUCTURES, LEARNING_PATHS } from '@/constants/registry'

export function DashboardPage() {
  const language = useAppStore((s) => s.language)
  const visited = useAppStore((s) => s.visited)
  const bookmarks = useAppStore((s) => s.bookmarks)
  const favorites = useAppStore((s) => s.favorites)
  const lastVisited = useAppStore((s) => s.lastVisited)
  const getProgressPercent = useAppStore((s) => s.getProgressPercent)
  const t = useTranslation(language)

  const allIds = Object.keys(DATA_STRUCTURES)
  const visitedCount = allIds.filter((id) => visited[id]).length
  const progressPercent = Math.round((visitedCount / allIds.length) * 100)

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 text-3xl font-bold">{t.dashboard}</h1>
        <p className="mb-8 text-slate-400">Track your learning progress and continue where you left off.</p>
      </motion.div>

      {/* Progress overview */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="glass-card p-6">
          <div className="text-3xl font-bold text-cyan-400">{progressPercent}%</div>
          <div className="text-sm text-slate-400">{t.progress}</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="text-3xl font-bold text-violet-400">{visitedCount}</div>
          <div className="text-sm text-slate-400">Structures Explored</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-3xl font-bold text-amber-400">{bookmarks.length}</div>
          <div className="text-sm text-slate-400">{t.bookmarks}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-3xl font-bold text-pink-400">{favorites.length}</div>
          <div className="text-sm text-slate-400">{t.favorites}</div>
        </div>
      </div>

      {/* Continue learning */}
      {lastVisited && DATA_STRUCTURES[lastVisited] && (
        <div className="glass-card mb-8 p-6">
          <h2 className="mb-4 text-xl font-bold">{t.continueLearning}</h2>
          <Link
            href={`/learn/${lastVisited}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
          >
            <div>
              <div className="font-semibold">{DATA_STRUCTURES[lastVisited].name[language]}</div>
              <div className="text-sm text-slate-400">
                {DATA_STRUCTURES[lastVisited].description[language]}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-cyan-400" />
          </Link>
        </div>
      )}

      {/* Learning paths progress */}
      <h2 className="mb-4 text-xl font-bold">{t.learningPaths}</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {LEARNING_PATHS.map((path) => {
          const percent = getProgressPercent(path.structures)
          return (
            <div key={path.id} className="glass-card p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{path.name[language]}</h3>
                <span className="text-sm text-cyan-400">{percent}%</span>
              </div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${path.color}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {path.structures.map((s) => (
                  <Link
                    key={s}
                    href={`/learn/${s}`}
                    className={`rounded-lg px-2 py-1 text-xs ${
                      visited[s]
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {DATA_STRUCTURES[s]?.name[language] ?? s}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Bookmark className="h-5 w-5" />
            {t.bookmarks}
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {bookmarks.map((id) => (
              <Link
                key={id}
                href={`/learn/${id}`}
                className="glass-card p-4 transition-transform hover:scale-[1.02]"
              >
                {DATA_STRUCTURES[id]?.name[language] ?? id}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
