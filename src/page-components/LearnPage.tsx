'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Bookmark } from 'lucide-react'
import { DATA_STRUCTURES } from '@/constants/registry'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/constants/translations'
import { cn } from '@/utils/cn'

type TabId = 'visual' | 'theory' | 'code' | 'quiz'

const tabFallback = (
  <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-slate-300 animate-pulse">
    Loading…
  </div>
)

// Dynamic imports with ssr:false to prevent hydration errors on canvas/animation components
const VisualizerTab = dynamic(
  () => import('@/components/visualizer/VisualizerTab').then((m) => m.VisualizerTab),
  { ssr: false, loading: () => tabFallback },
)
const TheoryTab = dynamic(
  () => import('@/components/visualizer/TheoryTab').then((m) => m.TheoryTab),
  { ssr: false, loading: () => tabFallback },
)
const CodeTab = dynamic(
  () => import('@/components/visualizer/CodeTab').then((m) => m.CodeTab),
  { ssr: false, loading: () => tabFallback },
)
const QuizTab = dynamic(
  () => import('@/components/visualizer/QuizTab').then((m) => m.QuizTab),
  { ssr: false, loading: () => tabFallback },
)

const TABS: { id: TabId }[] = [
  { id: 'visual' },
  { id: 'theory' },
  { id: 'code' },
  { id: 'quiz' },
]

interface LearnPageProps {
  dsId: string
}

export function LearnPage({ dsId }: LearnPageProps) {
  const router = useRouter()
  const language = useAppStore((s) => s.language)
  const bookmarks = useAppStore((s) => s.bookmarks)
  const markVisited = useAppStore((s) => s.markVisited)
  const toggleBookmark = useAppStore((s) => s.toggleBookmark)
  const t = useTranslation(language)
  const [activeTab, setActiveTab] = useState<TabId>('visual')
  // Track which tabs have been visited so we only mount them after first view
  const [mounted, setMounted] = useState<Set<TabId>>(new Set(['visual']))

  const config = dsId ? DATA_STRUCTURES[dsId] : null
  const tabs: { id: TabId; label: string }[] = useMemo(
    () => [
      { id: 'visual', label: t.visualize },
      { id: 'theory', label: t.theory },
      { id: 'code', label: t.code },
      { id: 'quiz', label: t.quiz },
    ],
    [t.code, t.quiz, t.theory, t.visualize],
  )

  useEffect(() => {
    if (dsId) markVisited(dsId)
  }, [dsId, markVisited])

  const handleTabClick = (id: TabId) => {
    setActiveTab(id)
    // Mark tab as mounted so it renders for the first time
    setMounted((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  if (!dsId || !config) {
    router.replace('/learn/array')
    return null
  }

  const isBookmarked = bookmarks.includes(dsId)

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-xl font-bold sm:text-2xl">{config.name[language]}</h1>
              {!config.implemented && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                  {t.comingSoon}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">{config.description[language]}</p>
          </div>
          <button
            onClick={() => toggleBookmark(dsId)}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-lg transition-colors',
              isBookmarked ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400',
            )}
            aria-label={t.bookmarks}
          >
            <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
          </button>
        </div>
        <div className="custom-scrollbar mt-4 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'min-h-11 shrink-0 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-t-2 border-cyan-500 bg-white/5 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-auto p-4 sm:p-6">
        <Suspense fallback={tabFallback}>
          {/*
           * IMPORTANT: Use CSS visibility + display instead of conditional rendering.
           * Tabs stay mounted once first visited — this prevents the VisualizerTab
           * from losing animation state, controller refs, and layout on every tab switch.
           */}
          {TABS.map(({ id }) => {
            if (!mounted.has(id)) return null
            return (
              <div key={id} style={{ display: activeTab === id ? 'block' : 'none' }}>
                {id === 'visual' && <VisualizerTab ds={dsId} config={config} lang={language} />}
                {id === 'theory' && <TheoryTab ds={dsId} lang={language} />}
                {id === 'code' && <CodeTab ds={dsId} config={config} lang={language} />}
                {id === 'quiz' && <QuizTab ds={dsId} lang={language} />}
              </div>
            )
          })}
        </Suspense>
      </div>
    </div>
  )
}
