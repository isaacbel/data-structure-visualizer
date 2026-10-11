'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Check, Copy, Download, Maximize2, Minimize2,
  EyeOff, Eye, Minus, Plus, WrapText, AlignLeft,
} from 'lucide-react'
import type { CodeLanguage, Language } from '@/types'
import type { DataStructureConfig } from '@/types'
import { getCode } from '@/constants/codeExamples'
import { useTranslation } from '@/constants/translations'
import { useAppStore } from '@/store/useAppStore'
import { SyntaxHighlighter } from './SyntaxHighlighter'

interface CodeTabProps {
  ds: string
  config: DataStructureConfig
  lang: Language
}

/* ── Language metadata ──────────────────────────────────────────────────── */
const LANG_META: {
  id: CodeLanguage; label: string; short: string
  bg: string; text: string; icon: string
}[] = [
  { id: 'python',     label: 'Python',     short: 'PY',  bg: 'bg-yellow-500/15', text: 'text-yellow-400',  icon: '🐍' },
  { id: 'c',         label: 'C',          short: 'C',   bg: 'bg-blue-500/15',   text: 'text-blue-400',    icon: '⚙️' },
  { id: 'cpp',       label: 'C++',        short: 'C++', bg: 'bg-sky-500/15',    text: 'text-sky-400',     icon: '⚙️' },
  { id: 'java',      label: 'Java',       short: 'JV',  bg: 'bg-orange-500/15', text: 'text-orange-400',  icon: '☕' },
  { id: 'javascript',label: 'JavaScript', short: 'JS',  bg: 'bg-yellow-400/15', text: 'text-yellow-300',  icon: '🌐' },
  { id: 'typescript',label: 'TypeScript', short: 'TS',  bg: 'bg-blue-600/15',   text: 'text-blue-400',    icon: '🔷' },
  { id: 'csharp',    label: 'C#',         short: 'C#',  bg: 'bg-purple-500/15', text: 'text-purple-400',  icon: '🎯' },
  { id: 'go',        label: 'Go',         short: 'GO',  bg: 'bg-cyan-500/15',   text: 'text-cyan-400',    icon: '🐹' },
  { id: 'rust',      label: 'Rust',       short: 'RS',  bg: 'bg-orange-700/15', text: 'text-orange-500',  icon: '🦀' },
]

const FILE_EXT: Record<CodeLanguage, string> = {
  python:'py', c:'c', cpp:'cpp', java:'java', javascript:'js',
  typescript:'ts', csharp:'cs', go:'go', rust:'rs',
  kotlin:'kt', swift:'swift', php:'php',
}

const FONT_SIZES = [11, 12, 13, 14, 15, 16, 18]
const MIN_FONT_IDX = 0
const MAX_FONT_IDX = FONT_SIZES.length - 1

/* ── Helpers ────────────────────────────────────────────────────────────── */
function stripComments(code: string, lang: CodeLanguage): string {
  const lines = code.split('\n')
  return lines
    .filter(l => {
      const t = l.trim()
      if (lang === 'python' && t.startsWith('#')) return false
      if (['c','cpp','java','javascript','typescript','csharp','go','rust'].includes(lang)) {
        if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return false
      }
      return true
    })
    .join('\n')
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export function CodeTab({ ds, config, lang }: CodeTabProps) {
  const t = useTranslation(lang)
  const activeCodeLine = useAppStore((s) => s.activeCodeLine)

  const [language, setLanguage]     = useState<CodeLanguage>('python')
  const [operation, setOperation]   = useState(config.ops[0])
  const [copied, setCopied]         = useState(false)
  const [isFullscreen, setFullscreen] = useState(false)
  const [hideComments, setHideComments] = useState(false)
  const [wrapLines, setWrapLines]   = useState(false)
  const [fontSizeIdx, setFontSizeIdx] = useState(2) // default 13px
  const scrollRef = useRef<HTMLDivElement>(null)

  const fontSize = FONT_SIZES[fontSizeIdx]

  const rawCode = useMemo(() => getCode(ds, operation, language), [ds, operation, language])
  const displayCode = useMemo(
    () => hideComments ? stripComments(rawCode, language) : rawCode,
    [rawCode, hideComments, language]
  )
  const lineCount = useMemo(() => displayCode.split('\n').length, [displayCode])

  const currentLangMeta = LANG_META.find(l => l.id === language)!
  const fileName = `${ds}-${operation}.${FILE_EXT[language]}`

  /* copy */
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }, [rawCode])

  /* download */
  const downloadCode = useCallback(() => {
    const blob = new Blob([rawCode], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = fileName; a.click()
    URL.revokeObjectURL(url)
  }, [rawCode, fileName])

  /* keyboard shortcut: Ctrl+C in fullscreen */
  useEffect(() => {
    if (!isFullscreen) return
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection()?.toString()) {
        copyCode()
      }
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFullscreen, copyCode])

  /* auto-scroll active line */
  useEffect(() => {
    if (activeCodeLine > 0 && scrollRef.current) {
      const el = document.getElementById(`code-line-${activeCodeLine}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeCodeLine])

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-[100] flex flex-col bg-[#0d1117] p-4 gap-3'
    : 'flex h-full flex-col gap-3'

  return (
    <div className={containerClass}>

      {/* ═══ Language selector row ══════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-500 select-none mr-1">
          Language
        </span>
        {LANG_META.map((l) => {
          const active = language === l.id
          return (
            <button
              key={l.id}
              id={`code-lang-${l.id}`}
              onClick={() => setLanguage(l.id)}
              aria-pressed={active}
              className={[
                'flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all duration-100 ring-1 select-none',
                active
                  ? `${l.bg} ${l.text} ring-current shadow-sm scale-105`
                  : 'bg-white/5 text-slate-400 ring-transparent hover:bg-white/10 hover:text-slate-200',
              ].join(' ')}
            >
              <span className="text-[10px] leading-none">{l.icon}</span>
              {l.label}
            </button>
          )
        })}

        {/* right-side controls */}
        <div className="ml-auto flex items-center gap-1">
          {/* font size */}
          <div className="flex items-center gap-0.5 rounded-md border border-white/10 bg-slate-800/60 px-1">
            <button
              id="font-decrease-btn"
              onClick={() => setFontSizeIdx(i => Math.max(MIN_FONT_IDX, i - 1))}
              disabled={fontSizeIdx === MIN_FONT_IDX}
              className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
              title="Decrease font size"
            ><Minus className="h-3 w-3" /></button>
            <span className="px-1 text-[10px] text-slate-400 tabular-nums min-w-[24px] text-center">{fontSize}px</span>
            <button
              id="font-increase-btn"
              onClick={() => setFontSizeIdx(i => Math.min(MAX_FONT_IDX, i + 1))}
              disabled={fontSizeIdx === MAX_FONT_IDX}
              className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
              title="Increase font size"
            ><Plus className="h-3 w-3" /></button>
          </div>

          <IconBtn id="wrap-toggle-btn" onClick={() => setWrapLines(v => !v)} title={wrapLines ? 'Unwrap lines' : 'Wrap long lines'} active={wrapLines}>
            {wrapLines ? <AlignLeft className="h-3.5 w-3.5" /> : <WrapText className="h-3.5 w-3.5" />}
          </IconBtn>

          <IconBtn id="comments-toggle-btn" onClick={() => setHideComments(v => !v)} title={hideComments ? 'Show comments' : 'Hide comments'} active={hideComments}>
            {hideComments ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </IconBtn>

          <IconBtn
            id="copy-code-btn"
            onClick={copyCode}
            title="Copy code (Ctrl+C)"
            active={copied}
            activeClass="border-green-500/40 bg-green-500/15 text-green-400"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-[10px]">{copied ? 'Copied!' : 'Copy'}</span>
          </IconBtn>

          <IconBtn id="download-code-btn" onClick={downloadCode} title="Download file">
            <Download className="h-3.5 w-3.5" />
          </IconBtn>

          <IconBtn id="fullscreen-code-btn" onClick={() => setFullscreen(v => !v)} title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}>
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </IconBtn>
        </div>
      </div>

      {/* ═══ Operation selector ══════════════════════════════════════════ */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-500 select-none mr-1">
          Operation
        </span>
        {config.ops.map((op) => (
          <button
            key={op}
            id={`code-op-${op}`}
            onClick={() => setOperation(op)}
            aria-pressed={operation === op}
            className={[
              'rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all duration-100',
              operation === op
                ? 'bg-violet-600/80 text-white ring-1 ring-violet-400/50 shadow-sm scale-105'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200',
            ].join(' ')}
          >
            {op}
          </button>
        ))}
      </div>

      {/* ═══ Active execution banner ══════════════════════════════════════ */}
      {activeCodeLine > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-cyan-500/25 bg-cyan-500/8 px-3 py-1.5 text-xs text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          Executing line <strong className="text-cyan-100 font-mono">{activeCodeLine}</strong>
          <span className="ml-auto text-cyan-600 text-[10px]">synchronized with animation</span>
        </div>
      )}

      {/* ═══ IDE Editor pane ════════════════════════════════════════════ */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-white/10 overflow-hidden shadow-2xl">

        {/* Sticky file header bar */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-slate-800/80 backdrop-blur-sm px-4 py-2 shrink-0">
          {/* Mac-style dots */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>

          {/* File info */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base leading-none">{currentLangMeta.icon}</span>
            <span className={`text-xs font-mono font-semibold ${currentLangMeta.text}`}>
              {fileName}
            </span>
            <span className="hidden sm:flex items-center gap-1 rounded bg-slate-700/60 px-1.5 py-0.5 text-[10px] text-slate-400">
              {operation}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3 text-[10px] text-slate-500 tabular-nums">
            <span>{lineCount} lines</span>
            <span className={`font-semibold ${currentLangMeta.text}`}>{currentLangMeta.label}</span>
          </div>
        </div>

        {/* Scrollable code area */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-auto bg-[#0d1117]"
          tabIndex={0}
          aria-label="Code editor"
          role="region"
        >
          <div className="py-3" style={{ fontFamily: "var(--font-mono,'JetBrains Mono','Fira Code','Cascadia Code',monospace)" }}>
            <SyntaxHighlighter
              code={displayCode}
              lang={language}
              activeLineNumber={activeCodeLine}
              fontSize={fontSize}
              wrapLines={wrapLines}
            />
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 border-t border-white/5 bg-slate-900/60 px-4 py-1 text-[10px] text-slate-600 shrink-0">
          <span>Ln {activeCodeLine > 0 ? activeCodeLine : '–'}</span>
          <span>Spaces: 4</span>
          <span className="ml-auto">{currentLangMeta.label} · UTF-8</span>
        </div>
      </div>
    </div>
  )
}

/* ── Small reusable icon button ─────────────────────────────────────────── */
function IconBtn({
  id, onClick, title, children, active = false,
  activeClass = 'border-violet-500/40 bg-violet-500/15 text-violet-300',
}: {
  id?: string
  onClick: () => void
  title?: string
  children: React.ReactNode
  active?: boolean
  activeClass?: string
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      title={title}
      className={[
        'flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-all duration-100',
        active
          ? activeClass
          : 'border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
