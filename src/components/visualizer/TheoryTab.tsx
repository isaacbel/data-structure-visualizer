'use client'

import { useState, useRef, useCallback } from 'react'
import type { Language, TheoryContent, CategorizedResource } from '@/types'
import { useTranslation } from '@/constants/translations'
import { defaultTheory, THEORY } from '@/constants/theory'
import { getExpandedTheory } from '@/constants/theoryExpanded'
import { getDedicatedResources } from '@/constants/dedicatedResources'
import { ComparisonModal } from './ComparisonModal'
import {
  BookOpen, Clock, ChevronDown, ChevronRight,
  Zap, BarChart2, Star, AlertTriangle, Lightbulb,
  Link2, Search, Hash, Code2, ListOrdered, Compass, GraduationCap,
  ExternalLink, PlayCircle, FileText, Beaker, GitBranch, Database, ShieldCheck, Scale
} from 'lucide-react'

interface TheoryTabProps {
  ds: string
  lang: Language
}

/* ── Section ID constants (for TOC navigation) ─────────────────────────── */
const SECTIONS = [
  { id: 'intro',        label: 'Introduction',     icon: <BookOpen       className="h-3.5 w-3.5" /> },
  { id: 'concepts',     label: 'Core Concepts',    icon: <Lightbulb      className="h-3.5 w-3.5" /> },
  { id: 'pseudocode',   label: 'Pseudocode',       icon: <Code2          className="h-3.5 w-3.5" /> },
  { id: 'walkthrough',  label: 'Step-by-Step',     icon: <ListOrdered    className="h-3.5 w-3.5" /> },
  { id: 'complexity',   label: 'Complexity',       icon: <BarChart2      className="h-3.5 w-3.5" /> },
  { id: 'procons',      label: 'Pros & Cons',      icon: <Zap            className="h-3.5 w-3.5" /> },
  { id: 'applications', label: 'Applications',     icon: <Hash           className="h-3.5 w-3.5" /> },
  { id: 'comparisons',  label: 'Comparisons',      icon: <BarChart2      className="h-3.5 w-3.5" /> },
  { id: 'interview',    label: 'Interview Prep',   icon: <Star           className="h-3.5 w-3.5" /> },
  { id: 'mistakes',     label: 'Common Mistakes',  icon: <AlertTriangle  className="h-3.5 w-3.5" /> },
  { id: 'related',      label: 'Related Topics',   icon: <Compass        className="h-3.5 w-3.5" /> },
  { id: 'resources',    label: 'Resources',        icon: <GraduationCap  className="h-3.5 w-3.5" /> },
  { id: 'references',   label: 'References',       icon: <Link2          className="h-3.5 w-3.5" /> },
]

/* ── Resource type icon ─────────────────────────────────────────────────── */
const RESOURCE_ICONS = {
  book:     <BookOpen   className="h-3 w-3" />,
  video:    <PlayCircle className="h-3 w-3" />,
  article:  <FileText   className="h-3 w-3" />,
  practice: <Beaker     className="h-3 w-3" />,
  paper:    <GraduationCap className="h-3 w-3" />,
  repo:     <GitBranch  className="h-3 w-3" />,
} as const

const RESOURCE_COLORS = {
  book:     'text-amber-400 bg-amber-400/10',
  video:    'text-red-400 bg-red-400/10',
  article:  'text-blue-400 bg-blue-400/10',
  practice: 'text-emerald-400 bg-emerald-400/10',
  paper:    'text-violet-400 bg-violet-400/10',
  repo:     'text-slate-300 bg-slate-700/40',
} as const

/* ── Complexity badge color ─────────────────────────────────────────────── */
function complexityBadgeColor(val: string): string {
  if (!val) return 'text-slate-400'
  const v = val.toLowerCase()
  if (v === 'o(1)') return 'text-emerald-400 bg-emerald-400/10'
  if (v.includes('log')) return 'text-cyan-400 bg-cyan-400/10'
  if (v === 'o(n)') return 'text-yellow-400 bg-yellow-400/10'
  if (v.includes('n²') || v.includes('n^2')) return 'text-red-400 bg-red-400/10'
  return 'text-slate-300 bg-slate-700/40'
}

/* ── Accordion Item ─────────────────────────────────────────────────────── */
function Accordion({
  title, level = 'beginner', children,
}: { title: string; level?: 'beginner' | 'intermediate' | 'advanced'; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const LEVEL_COLORS = {
    beginner:     'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
    intermediate: 'bg-yellow-500/15 text-yellow-400 ring-yellow-500/30',
    advanced:     'bg-red-500/15 text-red-400 ring-red-500/30',
  }
  return (
    <div className="rounded-lg border border-white/8 bg-slate-900/40 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ${LEVEL_COLORS[level]}`}>
          {level}
        </span>
        <span className="flex-1 text-sm font-medium text-slate-200">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
      </button>
      {open && (
        <div className="border-t border-white/8 bg-slate-950/30 px-4 py-3 text-sm text-slate-300 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Section wrapper ────────────────────────────────────────────────────── */
function Section({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={`theory-${id}`} className="space-y-4 scroll-mt-4">
      <div className="flex items-center gap-2.5 border-b border-white/8 pb-3">
        <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-violet-500/15 text-violet-400">
          {icon}
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  )
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export function TheoryTab({ ds: activeDs, lang }: TheoryTabProps) {
  const [activeSection, setActiveSection] = useState<string>('intro')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isCompModalOpen, setIsCompModalOpen] = useState<boolean>(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const rawData = THEORY[activeDs] || defaultTheory(activeDs)
  const data = getExpandedTheory(activeDs, rawData[lang] ?? rawData.en)
  const dedicatedRes = getDedicatedResources(activeDs)

  const scrollTo = useCallback((id: string) => {
    document.getElementById(`theory-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const OPS = ['access', 'search', 'insert', 'delete'] as const

  return (
    <div className="flex gap-6 max-w-6xl mx-auto">

      {/* ═══ Sticky TOC sidebar ════════════════════════════════════════ */}
      <aside className="hidden xl:flex flex-col gap-1 w-44 shrink-0 sticky top-0 self-start max-h-screen py-1">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">
          Contents
        </span>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 hover:bg-white/8 hover:text-slate-200 transition-colors text-left"
          >
            <span className="text-violet-400">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </aside>

      {/* ═══ Main content ══════════════════════════════════════════════ */}
      <div ref={contentRef} className="flex-1 min-w-0 space-y-8">

        {/* Mobile TOC strip */}
        <div className="xl:hidden flex gap-1.5 flex-wrap">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400 hover:bg-white/10"
            >
              {s.icon}{s.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search theory content…"
            className="w-full rounded-lg border border-white/10 bg-slate-800/60 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
        </div>

        {/* ── Header badges ──────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300 ring-1 ring-violet-500/30">
            <BookOpen className="h-3 w-3" />{activeDs.replace(/-/g,' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-slate-700/60 px-3 py-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" /> ~8 min read
          </span>
        </div>

        {/* ── SECTION: Introduction ──────────────────────────────────── */}
        <Section id="intro" title="Introduction & Motivation" icon={<BookOpen className="h-3.5 w-3.5" />}>
          <div className="glass-card p-5 space-y-4">
            <p className="text-slate-200 leading-relaxed text-sm">{data.definition}</p>
            {data.history && (
              <div className="border-t border-white/5 pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 mb-2">Historical Background</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{data.history}</p>
              </div>
            )}
          </div>
        </Section>

        {/* ── SECTION: Core Concepts ─────────────────────────────────── */}
        {(data.intuition || data.mathematicalFoundation) && (
          <Section id="concepts" title="Core Concepts & Mathematical Foundation" icon={<Lightbulb className="h-3.5 w-3.5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.intuition && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-bold text-white mb-3">Visual Intuition</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{data.intuition}</p>
                </div>
              )}
              {data.mathematicalFoundation && (
                <div className="glass-card p-5 bg-slate-900/50">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3">Mathematical Foundation</h3>
                  <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                    {data.mathematicalFoundation}
                  </pre>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── SECTION: Complexity ───────────────────────────────────── */}
        <Section id="complexity" title="Complexity Analysis" icon={<BarChart2 className="h-3.5 w-3.5" />}>
          <div className="glass-card p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Operation', 'Best Case', 'Average Case', 'Worst Case'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OPS.map((op) => (
                    <tr key={op} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-slate-300 capitalize">{op}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-mono font-semibold ${complexityBadgeColor(data.complexity[op])}`}>
                          {data.complexity[op] || '–'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-mono font-semibold ${complexityBadgeColor(data.complexity[op])}`}>
                          {data.complexity[op] || '–'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-mono font-semibold ${complexityBadgeColor(data.complexity[op])}`}>
                          {data.complexity[op] || '–'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/8 bg-slate-900/50 px-3 py-2.5">
              <span className="text-xs text-slate-500 font-medium">Space Complexity</span>
              <span className={`rounded px-2 py-0.5 text-xs font-mono font-semibold ${complexityBadgeColor(data.complexity.space)}`}>
                {data.complexity.space}
              </span>
            </div>
            {/* Complexity key */}
            <div className="mt-3 flex flex-wrap gap-3 text-[10px]">
              {[
                { label:'O(1) Constant',  cls:'text-emerald-400' },
                { label:'O(log n) Logarithmic', cls:'text-cyan-400' },
                { label:'O(n) Linear',    cls:'text-yellow-400' },
                { label:'O(n²) Quadratic',cls:'text-red-400' },
              ].map(b => (
                <span key={b.label} className={`${b.cls} font-medium`}>● {b.label}</span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── SECTION: Pros & Cons ──────────────────────────────────── */}
        <Section id="procons" title="Advantages & Disadvantages" icon={<Zap className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 border-l-2 border-emerald-500/50">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-400">
                <span className="text-base">✅</span> Advantages
              </h3>
              <ul className="space-y-2">
                {data.advantages.split('.').filter(Boolean).map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/70" />
                    {adv.trim()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-5 border-l-2 border-red-500/50">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-400">
                <span className="text-base">❌</span> Disadvantages
              </h3>
              <ul className="space-y-2">
                {data.disadvantages.split('.').filter(Boolean).map((dis, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" />
                    {dis.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── SECTION: Real-World Applications ──────────────────────── */}
        <Section id="applications" title="Real-World Applications" icon={<Hash className="h-3.5 w-3.5" />}>
          <div className="glass-card p-5">
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{data.applications}</p>
            {/* Application domain tags */}
            <div className="flex flex-wrap gap-2">
              {[
                '🗄️ Databases','🖥️ Operating Systems','🔍 Search Engines',
                '🤖 Machine Learning','🎮 Game Development','⚙️ Compilers',
                '🌐 Web Browsers','☁️ Cloud Systems',
              ].map(tag => (
                <span key={tag} className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-400 border border-white/8">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── SECTION: Comparisons ─────────────────────────────────── */}
        {data.comparisons && (
          <Section id="comparisons" title="Structural Comparisons" icon={<BarChart2 className="h-3.5 w-3.5" />}>
            <div className="glass-card p-5">
              <p className="text-sm text-slate-300 leading-relaxed">{data.comparisons}</p>
            </div>
          </Section>
        )}

        {/* ── SECTION: Interview Questions ──────────────────────────── */}
        {data.interviewQuestions && data.interviewQuestions.length > 0 && (
          <Section id="interview" title="Interview Preparation" icon={<Star className="h-3.5 w-3.5" />}>
            <div className="space-y-2">
              {data.interviewQuestions.map((q, i) => {
                const level: 'beginner' | 'intermediate' | 'advanced' =
                  i < 2 ? 'beginner' : i < 4 ? 'intermediate' : 'advanced'
                return (
                  <Accordion key={i} title={q} level={level}>
                    <p className="text-slate-400 italic text-xs">
                      💡 Think step-by-step. Consider time complexity, edge cases (empty structure, single element,
                      duplicates), and whether an in-place or auxiliary-space solution is required.
                    </p>
                  </Accordion>
                )
              })}
            </div>
            <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/8 p-3 text-xs text-violet-300">
              <strong>Pro Tip:</strong> Practice whiteboarding these problems, then verify with the visualizer above.
            </div>
          </Section>
        )}

        {/* ── SECTION: Common Mistakes ─────────────────────────────── */}
        {data.commonMistakes && data.commonMistakes.length > 0 && (
          <Section id="mistakes" title="Common Mistakes & Pitfalls" icon={<AlertTriangle className="h-3.5 w-3.5" />}>
            <div className="glass-card p-5 border-l-2 border-amber-500/40">
              <ul className="space-y-3">
                {data.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-300 leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}

        {/* ── SECTION: Optimizations ───────────────────────────────── */}
        {data.optimizations && data.optimizations.length > 0 && (
          <Section id="optimizations" title="Advanced Optimization Techniques" icon={<Zap className="h-3.5 w-3.5" />}>
            <div className="glass-card p-5">
              <ul className="space-y-2">
                {data.optimizations.map((opt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="shrink-0 text-violet-400 font-bold">›</span>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}

        {/* ── SECTION: Pseudocode ──────────────────────────────────── */}
        {data.pseudocode && (
          <Section id="pseudocode" title="Pseudocode" icon={<Code2 className="h-3.5 w-3.5" />}>
            <div className="glass-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/8 bg-slate-800/60 px-4 py-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pseudocode</span>
                <span className="ml-auto text-[10px] text-slate-600">Language-agnostic algorithm description</span>
              </div>
              <pre className="overflow-x-auto p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre">
                {data.pseudocode}
              </pre>
            </div>
          </Section>
        )}

        {/* ── SECTION: Step-by-Step Walkthrough ─────────────────────── */}
        {data.stepByStep && data.stepByStep.length > 0 && (
          <Section id="walkthrough" title="Step-by-Step Walkthrough" icon={<ListOrdered className="h-3.5 w-3.5" />}>
            <div className="glass-card p-5">
              <ol className="space-y-3">
                {data.stepByStep.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 text-[11px] font-bold border border-violet-500/30">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-200 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Section>
        )}

        {/* ── SECTION: References ──────────────────────────────────── */}
        <Section id="references" title="References & Further Reading" icon={<Link2 className="h-3.5 w-3.5" />}>
          <div className="glass-card p-5">
            <div className="space-y-2">
              {[
                { label: 'CLRS — Introduction to Algorithms (4th ed.)', href: 'https://mitpress.mit.edu/9780262046305/' },
                { label: 'Sedgewick — Algorithms (4th ed.)', href: 'https://algs4.cs.princeton.edu/home/' },
                { label: 'Knuth — The Art of Computer Programming', href: 'https://www-cs-faculty.stanford.edu/~knuth/taocp.html' },
                { label: 'Skiena — The Algorithm Design Manual', href: 'https://www.algorist.com/' },
                { label: 'Visualgo — Interactive Algorithm Visualizer', href: 'https://visualgo.net/' },
                { label: 'Big-O Cheat Sheet', href: 'https://www.bigocheatsheet.com/' },
                { label: 'CP-Algorithms — Competitive Programming Algorithms', href: 'https://cp-algorithms.com/' },
                { label: 'CSES Problem Set — Practice Problems', href: 'https://cses.fi/problemset/' },
                { label: 'LeetCode — Coding Interview Practice', href: 'https://leetcode.com/explore/' },
              ].map((ref, i) => (
                <a key={i} href={ref.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/8 bg-slate-900/40 px-3 py-2 text-xs text-cyan-400 hover:bg-white/5 hover:text-cyan-300 transition-colors group"
                >
                  <Link2 className="h-3 w-3 shrink-0" />
                  {ref.label}
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </a>
              ))}
              {data.references?.map((ref, i) => (
                <a key={`c-${i}`} href={ref} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/8 bg-slate-900/40 px-3 py-2 text-xs text-cyan-400 hover:bg-white/5 hover:text-cyan-300 transition-colors"
                >
                  <Link2 className="h-3 w-3 shrink-0" />{ref}
                </a>
              ))}
            </div>
          </div>
        </Section>

        {/* ── SECTION: Related Topics ───────────────────────────────── */}
        {data.relatedTopics && data.relatedTopics.length > 0 && (
          <Section id="related" title="Related Topics" icon={<Compass className="h-3.5 w-3.5" />}>
            <div className="flex flex-wrap gap-2">
              {data.relatedTopics.map((topic) => (
                <span key={topic}
                  className="flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/8 px-3 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-500/15 transition-colors cursor-default"
                >
                  <Compass className="h-3 w-3" />
                  {topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* ── SECTION: Learning Resources ────────────────────────────── */}
        <Section id="resources" title="Learning Resources" icon={<GraduationCap className="h-3.5 w-3.5" />}>
          <div className="space-y-4">
            {/* Top action: Compare Side-by-Side */}
            <div className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
              <div>
                <h4 className="text-xs font-bold text-violet-300">Side-by-Side Comparison Mode</h4>
                <p className="text-[11px] text-slate-400">Evaluate structural & performance trade-offs against alternative data structures</p>
              </div>
              <button
                onClick={() => setIsCompModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-violet-500 transition-colors"
              >
                <Scale className="h-3.5 w-3.5" /> Compare Architecture
              </button>
            </div>

            {/* Dedicated Topic-Specific Resources */}
            {dedicatedRes.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Topic-Specific References</span>
                {dedicatedRes.map((r, i) => (
                  <a
                    key={i}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {r.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          r.difficulty === 'beginner' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          r.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {r.difficulty}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Author: <strong className="text-slate-200">{r.author}</strong></span>
                      {r.pubYear && <span>Year: <strong className="text-slate-200">{r.pubYear}</strong></span>}
                      <span>Read Time: <strong className="text-slate-200">{r.estimatedReadTime}</strong></span>
                    </div>
                    <div className="mt-1 rounded-lg bg-cyan-950/30 border border-cyan-500/20 p-2 text-[11px] text-cyan-300">
                      💡 <strong>Why Recommended:</strong> {r.whyRecommended}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Side-by-Side Comparison Modal */}
        <ComparisonModal
          isOpen={isCompModalOpen}
          onClose={() => setIsCompModalOpen(false)}
          currentDsId={activeDs}
        />
      </div>
    </div>
  )
}
