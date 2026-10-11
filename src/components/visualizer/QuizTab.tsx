'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  Award, CheckCircle, XCircle, SkipForward, RefreshCw, HelpCircle,
  Flame, Star, Zap, Brain, Target, BookOpen, Timer, Trophy,
  ChevronRight, ChevronLeft, Eye, EyeOff, Lightbulb, Crown,
  BarChart2, Shield, Swords, Layers, TrendingUp, Coffee
} from 'lucide-react'
import type { Language } from '@/types'
import type { QuizQuestion, QuizDifficulty, StudyMode } from '@/types/quiz'
import { useQuizStore } from '@/store/useQuizStore'
import { getQuestionsForStructure, getAdaptiveQuestions, QUIZ_BADGES } from '@/constants/quizBank'

// ── Props ────────────────────────────────────────────────────────────────────
interface QuizTabProps {
  ds: string
  lang: Language
}

// ── Constants ─────────────────────────────────────────────────────────────────
const DIFFICULTIES: QuizDifficulty[] = ['beginner', 'intermediate', 'advanced', 'expert']

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
  intermediate: 'text-sky-400 border-sky-500/40 bg-sky-950/30',
  advanced: 'text-amber-400 border-amber-500/40 bg-amber-950/30',
  expert: 'text-rose-400 border-rose-500/40 bg-rose-950/30',
  interview: 'text-purple-400 border-purple-500/40 bg-purple-950/30',
  cp: 'text-orange-400 border-orange-500/40 bg-orange-950/30',
}

const STUDY_MODES: { id: StudyMode; icon: React.ReactNode; label: Record<Language, string>; desc: Record<Language, string> }[] = [
  {
    id: 'practice',
    icon: <BookOpen size={18} />,
    label: { en: 'Practice', fr: 'Pratique' },
    desc: { en: 'Learn at your own pace with hints', fr: 'Apprenez à votre rythme avec des indices' },
  },
  {
    id: 'exam',
    icon: <Swords size={18} />,
    label: { en: 'Exam', fr: 'Examen' },
    desc: { en: 'Timed, no hints — test yourself', fr: 'Chronométré, sans indices — testez-vous' },
  },
  {
    id: 'flashcards',
    icon: <Layers size={18} />,
    label: { en: 'Flashcards', fr: 'Cartes mémoire' },
    desc: { en: 'Flip cards to memorize concepts', fr: 'Retournez les cartes pour mémoriser' },
  },
  {
    id: 'speed_quiz',
    icon: <Timer size={18} />,
    label: { en: 'Speed Quiz', fr: 'Quiz rapide' },
    desc: { en: '30s per question — fast paced!', fr: '30s par question — rythme rapide !' },
  },
  {
    id: 'weak_review',
    icon: <TrendingUp size={18} />,
    label: { en: 'Weak Review', fr: 'Révision faible' },
    desc: { en: 'Focus on questions you got wrong', fr: 'Concentrez-vous sur vos erreurs' },
  },
  {
    id: 'challenge',
    icon: <Crown size={18} />,
    label: { en: 'Challenge', fr: 'Défi' },
    desc: { en: 'Expert difficulty, no time limit', fr: 'Difficulté expert, sans limite de temps' },
  },
]

const XP_FOR_CORRECT = 20
const XP_PER_LEVEL = 100

// ── Helper: XP Bar ────────────────────────────────────────────────────────────
function XPBar({ xp, level, lang }: { xp: number; level: number; lang: Language }) {
  const xpInLevel = xp % XP_PER_LEVEL
  const pct = Math.min((xpInLevel / XP_PER_LEVEL) * 100, 100)
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="font-bold text-cyan-300 whitespace-nowrap">Lv.{level}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-slate-400 whitespace-nowrap">{xp} XP</span>
    </div>
  )
}

// ── Helper: Gamification Header ────────────────────────────────────────────────
function GamificationHeader({ lang }: { lang: Language }) {
  const { progress } = useQuizStore()
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1.5 rounded-lg bg-orange-950/40 border border-orange-500/20 px-2.5 py-1">
          <Flame size={14} className="text-orange-400" />
          <span className="text-xs font-bold text-orange-300">{progress.streak}</span>
          <span className="text-[10px] text-orange-400/60">{lang === 'fr' ? 'jours' : 'days'}</span>
        </div>
        {/* Coins */}
        <div className="flex items-center gap-1.5 rounded-lg bg-yellow-950/40 border border-yellow-500/20 px-2.5 py-1">
          <Star size={14} className="text-yellow-400" />
          <span className="text-xs font-bold text-yellow-300">{progress.coins}</span>
        </div>
        {/* Badges */}
        <div className="flex items-center gap-1.5 rounded-lg bg-purple-950/40 border border-purple-500/20 px-2.5 py-1">
          <Award size={14} className="text-purple-400" />
          <span className="text-xs font-bold text-purple-300">{progress.badges.length}</span>
        </div>
      </div>
      {/* XP Bar */}
      <div className="flex-1 min-w-[160px]">
        <XPBar xp={progress.xp} level={progress.level} lang={lang} />
      </div>
    </div>
  )
}

// ── Helper: Badge Toast ────────────────────────────────────────────────────────
function BadgeToast({ badgeId, lang, onClose }: { badgeId: string; lang: Language; onClose: () => void }) {
  const badge = QUIZ_BADGES.find((b) => b.id === badgeId)
  if (!badge) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideInRight">
      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-950 to-violet-950 border border-cyan-400/30 p-4 shadow-2xl shadow-cyan-500/20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
          <Award size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest">
            {lang === 'fr' ? 'Badge Débloqué !' : 'Badge Unlocked!'}
          </p>
          <p className="text-sm font-bold text-white">{badge.name[lang]}</p>
        </div>
        <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition">
          <XCircle size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Helper: Mode Selector ──────────────────────────────────────────────────────
function ModeSelector({ selected, onSelect, lang }: { selected: StudyMode; onSelect: (m: StudyMode) => void; lang: Language }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
      {STUDY_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
            selected === mode.id
              ? 'border-cyan-400/60 bg-cyan-950/30 shadow-lg shadow-cyan-500/10'
              : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15'
          }`}
        >
          <span className={selected === mode.id ? 'text-cyan-400' : 'text-slate-400'}>{mode.icon}</span>
          <span className={`text-xs font-bold ${selected === mode.id ? 'text-white' : 'text-slate-300'}`}>
            {mode.label[lang]}
          </span>
          <span className="text-[10px] text-slate-500 leading-tight">{mode.desc[lang]}</span>
        </button>
      ))}
    </div>
  )
}

// ── Helper: Difficulty Selector ────────────────────────────────────────────────
function DifficultySelector({ selected, onSelect, lang }: { selected: QuizDifficulty; onSelect: (d: QuizDifficulty) => void; lang: Language }) {
  const labels: Record<string, Record<Language, string>> = {
    beginner: { en: 'Beginner', fr: 'Débutant' },
    intermediate: { en: 'Intermediate', fr: 'Intermédiaire' },
    advanced: { en: 'Advanced', fr: 'Avancé' },
    expert: { en: 'Expert', fr: 'Expert' },
  }
  return (
    <div className="flex gap-1.5 flex-wrap">
      {DIFFICULTIES.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition border ${
            selected === d
              ? DIFFICULTY_COLORS[d]
              : 'border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15'
          }`}
        >
          {labels[d]?.[lang] ?? d}
        </button>
      ))}
    </div>
  )
}

// ── Helper: Progress Ring ──────────────────────────────────────────────────────
function ProgressRing({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  const r = 18
  const circ = 2 * Math.PI * r
  const dash = circ - (pct / 100) * circ
  return (
    <svg width="48" height="48" className="-rotate-90">
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke="url(#quizGrad)" strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={dash}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
      <defs>
        <linearGradient id="quizGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <text x="24" y="24" className="rotate-90" textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="10" fontWeight="bold" transform="rotate(90,24,24)">
        {current}
      </text>
    </svg>
  )
}

// ── Helper: Flashcard ──────────────────────────────────────────────────────────
function FlashCard({ question, lang, onNext, onPrev, current, total }: {
  question: QuizQuestion
  lang: Language
  onNext: () => void
  onPrev: () => void
  current: number
  total: number
}) {
  const [flipped, setFlipped] = useState(false)
  useEffect(() => setFlipped(false), [question.id])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{lang === 'fr' ? 'Carte' : 'Card'} {current + 1} / {total}</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          {lang === 'fr' ? 'Cliquez pour retourner' : 'Click to flip'}
        </span>
      </div>
      {/* Card */}
      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative cursor-pointer rounded-2xl min-h-[220px] flex items-center justify-center p-6"
        style={{ perspective: 1000 }}
      >
        <div
          className="w-full h-full transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Brain size={24} className="text-cyan-400 mb-3 opacity-60" />
            <p className="text-base font-semibold text-white leading-relaxed">{question.q[lang] ?? question.q.en}</p>
            <span className={`mt-4 text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[question.difficulty]}`}>
              {question.difficulty}
            </span>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-violet-950/40 p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <CheckCircle size={24} className="text-emerald-400 mb-3 opacity-60" />
            <p className="text-sm font-semibold text-emerald-300 mb-3">
              {(question.options[lang] ?? question.options.en)[typeof question.correct === 'number' ? question.correct : question.correct[0]]}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">{question.explanation[lang] ?? question.explanation.en}</p>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex justify-between gap-3">
        <button onClick={onPrev} disabled={current === 0} className="btn-ghost flex items-center gap-1 text-xs disabled:opacity-40">
          <ChevronLeft size={14} /> {lang === 'fr' ? 'Précédent' : 'Previous'}
        </button>
        <button onClick={onNext} className="btn-primary flex items-center gap-1 text-xs">
          {current + 1 < total ? (lang === 'fr' ? 'Suivant' : 'Next') : (lang === 'fr' ? 'Terminer' : 'Finish')}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Helper: Score Screen ───────────────────────────────────────────────────────
function ScoreScreen({
  score, total, ds, difficulty, mode, newBadges, lang, onRetry, onChangeMode
}: {
  score: number; total: number; ds: string; difficulty: QuizDifficulty
  mode: StudyMode; newBadges: string[]; lang: Language
  onRetry: () => void; onChangeMode: () => void
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const { progress } = useQuizStore()

  const grade = pct >= 90 ? { label: 'S', color: 'text-cyan-400' }
    : pct >= 80 ? { label: 'A', color: 'text-emerald-400' }
    : pct >= 65 ? { label: 'B', color: 'text-sky-400' }
    : pct >= 50 ? { label: 'C', color: 'text-amber-400' }
    : { label: 'D', color: 'text-rose-400' }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/20 mb-3">
          <Trophy size={36} className="text-cyan-400" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          {lang === 'fr' ? 'Quiz Terminé !' : 'Quiz Complete!'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {ds.replace(/-/g, ' ').toUpperCase()} — {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </p>
      </div>

      {/* Score Card */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4 text-center">
          <div className={`text-3xl font-black ${grade.color}`}>{grade.label}</div>
          <div className="text-[10px] text-slate-500 uppercase mt-1">{lang === 'fr' ? 'Note' : 'Grade'}</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4 text-center">
          <div className="text-3xl font-black text-white">{score}<span className="text-sm text-slate-400">/{total}</span></div>
          <div className="text-[10px] text-slate-500 uppercase mt-1">{lang === 'fr' ? 'Réponses' : 'Correct'}</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4 text-center">
          <div className="text-3xl font-black text-cyan-400">{pct}%</div>
          <div className="text-[10px] text-slate-500 uppercase mt-1">{lang === 'fr' ? 'Précision' : 'Accuracy'}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl bg-white/[0.02] border border-white/8 p-3 flex items-center justify-around text-xs">
        <div className="flex items-center gap-1.5 text-orange-300">
          <Flame size={14} /> {progress.streak} {lang === 'fr' ? 'jours' : 'day streak'}
        </div>
        <div className="flex items-center gap-1.5 text-yellow-300">
          <Star size={14} /> {progress.coins} {lang === 'fr' ? 'pièces' : 'coins'}
        </div>
        <div className="flex items-center gap-1.5 text-violet-300">
          <Zap size={14} /> {score * XP_FOR_CORRECT + (pct === 100 ? 50 : 0)} XP {lang === 'fr' ? 'gagnés' : 'earned'}
        </div>
      </div>

      {/* New badges */}
      {newBadges.length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-cyan-950/30 to-violet-950/30 border border-cyan-500/20 p-3">
          <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">
            🏅 {lang === 'fr' ? 'Nouveaux Badges' : 'New Badges Unlocked'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {newBadges.map((bid) => {
              const badge = QUIZ_BADGES.find((b) => b.id === bid)
              if (!badge) return null
              return (
                <span key={bid} className="flex items-center gap-1.5 rounded-full bg-cyan-950/50 border border-cyan-400/30 px-2.5 py-1 text-xs text-cyan-300">
                  <Award size={11} /> {badge.name[lang]}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRetry} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
          <RefreshCw size={15} /> {lang === 'fr' ? 'Recommencer' : 'Try Again'}
        </button>
        <button onClick={onChangeMode} className="btn-ghost flex-1 flex items-center justify-center gap-2 text-sm">
          <Layers size={15} /> {lang === 'fr' ? 'Changer de mode' : 'Change Mode'}
        </button>
      </div>
    </div>
  )
}

// ── Main: QuizTab ──────────────────────────────────────────────────────────────
export function QuizTab({ ds, lang }: QuizTabProps) {
  // Phase: 'select' | 'quiz' | 'score'
  const [phase, setPhase] = useState<'select' | 'quiz' | 'score'>('select')
  const [studyMode, setStudyMode] = useState<StudyMode>('practice')
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('beginner')

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [newBadges, setNewBadges] = useState<string[]>([])
  const [toastBadge, setToastBadge] = useState<string | null>(null)

  // Timer for speed/exam modes
  const [timeLeft, setTimeLeft] = useState(30)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Answered questions for store
  const answeredRef = useRef<Array<{ qId: string; isCorrect: boolean }>>([])

  const { progress, recordQuizResult } = useQuizStore()
  const startTimeRef = useRef<number>(Date.now())

  const isTimedMode = studyMode === 'speed_quiz' || studyMode === 'exam'
  const hintsAllowed = studyMode === 'practice' || studyMode === 'weak_review'

  // ── Start quiz ──────────────────────────────────────────────────────────────
  const startQuiz = useCallback(() => {
    let pool: QuizQuestion[]
    if (studyMode === 'weak_review') {
      pool = getAdaptiveQuestions(ds, progress, 10)
    } else if (studyMode === 'challenge') {
      pool = getQuestionsForStructure(ds, 'expert')
    } else {
      pool = getQuestionsForStructure(ds, difficulty)
    }

    // Shuffle pool for variety
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(studyMode === 'exam' ? 10 : 8, shuffled.length))

    setQuestions(selected)
    setCurrent(0)
    setSelectedAnswer(null)
    setHasSubmitted(false)
    setScore(0)
    setShowHint(false)
    setNewBadges([])
    answeredRef.current = []
    startTimeRef.current = Date.now()
    setPhase(studyMode === 'flashcards' ? 'quiz' : 'quiz')
  }, [ds, difficulty, studyMode, progress])

  // ── Timer ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'quiz' && isTimedMode && !hasSubmitted) {
      setTimeLeft(30)
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!)
            // Auto-submit as wrong
            handleAnswerSubmit(-1)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase, isTimedMode, hasSubmitted])

  // ── Reset on ds change ──────────────────────────────────────────────────────
  useEffect(() => {
    setPhase('select')
    setNewBadges([])
  }, [ds])

  // ── Answer submit ───────────────────────────────────────────────────────────
  const handleAnswerSubmit = useCallback((idx: number) => {
    if (hasSubmitted) return
    if (timerRef.current) clearInterval(timerRef.current)
    setSelectedAnswer(idx)
    setHasSubmitted(true)
    const q = questions[current]
    if (!q) return
    const correctIdx = typeof q.correct === 'number' ? q.correct : q.correct[0]
    const isCorrect = idx === correctIdx
    if (isCorrect) setScore((s) => s + 1)
    answeredRef.current.push({ qId: q.id, isCorrect })
  }, [hasSubmitted, questions, current])

  // ── Next ────────────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1)
      setSelectedAnswer(null)
      setHasSubmitted(false)
      setShowHint(false)
    } else {
      finishQuiz()
    }
  }, [current, questions.length])

  // ── Finish ──────────────────────────────────────────────────────────────────
  const finishQuiz = useCallback(() => {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    const finalScore = score + (hasSubmitted && selectedAnswer !== null && questions[current] &&
      (typeof questions[current].correct === 'number'
        ? selectedAnswer === questions[current].correct
        : (questions[current].correct as number[]).includes(selectedAnswer)) ? 0 : 0)

    recordQuizResult(ds, score, questions.length, difficulty, timeSpent, answeredRef.current)

    // Detect newly earned badges
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
    const earned: string[] = []
    if (!progress.badges.includes('first_quiz')) earned.push('first_quiz')
    if (pct === 100 && !progress.badges.includes('perfect_score')) earned.push('perfect_score')
    if (difficulty === 'expert' && !progress.badges.includes('expert_conqueror')) earned.push('expert_conqueror')
    if (progress.streak >= 6 && !progress.badges.includes('week_streak')) earned.push('week_streak')

    setNewBadges(earned)
    if (earned.length > 0) {
      setToastBadge(earned[0])
      setTimeout(() => setToastBadge(null), 4000)
    }

    setPhase('score')
  }, [score, questions, current, hasSubmitted, selectedAnswer, difficulty, ds, recordQuizResult, progress.badges, progress.streak])

  // ── Flashcard navigation ────────────────────────────────────────────────────
  const handleFlashNext = () => {
    if (current + 1 < questions.length) setCurrent((c) => c + 1)
    else finishQuiz()
  }
  const handleFlashPrev = () => { if (current > 0) setCurrent((c) => c - 1) }

  // ── Render: Select Phase ────────────────────────────────────────────────────
  if (phase === 'select') {
    const dsScore = progress.scores[`${ds}_${difficulty}`]
    return (
      <div className="space-y-5">
        <GamificationHeader lang={lang} />

        <div>
          <h2 className="text-base font-extrabold text-white mb-0.5">
            {lang === 'fr' ? 'Mode de Révision' : 'Study Mode'}
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            {lang === 'fr' ? 'Choisissez comment vous souhaitez apprendre' : 'Choose how you want to learn'}
          </p>
          <ModeSelector selected={studyMode} onSelect={setStudyMode} lang={lang} />
        </div>

        {studyMode !== 'challenge' && studyMode !== 'weak_review' && (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              {lang === 'fr' ? 'Difficulté' : 'Difficulty'}
            </h3>
            <DifficultySelector selected={difficulty} onSelect={setDifficulty} lang={lang} />
          </div>
        )}

        {/* Previous best */}
        {dsScore && (
          <div className="rounded-xl bg-white/[0.02] border border-white/8 p-3 flex items-center gap-3">
            <BarChart2 size={18} className="text-violet-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400">{lang === 'fr' ? 'Meilleur score : ' : 'Personal best: '}</span>
              <span className="font-bold text-white">{dsScore.score}/{dsScore.total}</span>
              <span className="text-slate-500"> ({dsScore.accuracy}%)</span>
            </div>
          </div>
        )}

        <button onClick={startQuiz} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm font-bold">
          <Zap size={16} />
          {lang === 'fr' ? 'Commencer le Quiz' : 'Start Quiz'}
        </button>

        {/* Badges showcase */}
        {progress.badges.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              {lang === 'fr' ? 'Vos Badges' : 'Your Badges'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {QUIZ_BADGES.filter((b) => progress.badges.includes(b.id)).map((badge) => (
                <div
                  key={badge.id}
                  title={badge.desc[lang]}
                  className="flex items-center gap-1.5 rounded-full bg-white/[0.03] border border-white/10 px-2.5 py-1 text-[11px] text-slate-300"
                >
                  <Award size={11} className="text-cyan-400" />
                  {badge.name[lang]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Render: Score Phase ─────────────────────────────────────────────────────
  if (phase === 'score') {
    return (
      <>
        <ScoreScreen
          score={score} total={questions.length}
          ds={ds} difficulty={difficulty} mode={studyMode}
          newBadges={newBadges} lang={lang}
          onRetry={() => { startQuiz(); }}
          onChangeMode={() => setPhase('select')}
        />
        {toastBadge && <BadgeToast badgeId={toastBadge} lang={lang} onClose={() => setToastBadge(null)} />}
      </>
    )
  }

  // ── Render: Quiz Phase ──────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
        <HelpCircle size={40} className="text-slate-500" />
        <div>
          <p className="font-semibold text-slate-300">
            {lang === 'fr' ? 'Aucune question disponible pour ce niveau.' : 'No questions available for this difficulty.'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'fr' ? 'Essayez un autre niveau ou mode.' : 'Try a different difficulty or mode.'}
          </p>
        </div>
        <button onClick={() => setPhase('select')} className="btn-ghost text-sm">
          {lang === 'fr' ? '← Retour' : '← Back'}
        </button>
      </div>
    )
  }

  // Flashcard mode
  if (studyMode === 'flashcards') {
    return (
      <div className="space-y-4">
        <GamificationHeader lang={lang} />
        <FlashCard
          question={questions[current]} lang={lang}
          onNext={handleFlashNext} onPrev={handleFlashPrev}
          current={current} total={questions.length}
        />
      </div>
    )
  }

  const quiz = questions[current]
  const correctIdx = typeof quiz.correct === 'number' ? quiz.correct : quiz.correct[0]

  return (
    <div className="space-y-4">
      <GamificationHeader lang={lang} />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ProgressRing current={current + 1} total={questions.length} />
          <div>
            <div className="text-xs text-slate-400">
              {lang === 'fr' ? 'Question' : 'Question'} {current + 1} / {questions.length}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${DIFFICULTY_COLORS[quiz.difficulty]}`}>
                {quiz.difficulty}
              </span>
              {quiz.category && (
                <span className="text-[10px] text-slate-500 capitalize">{quiz.category}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          {isTimedMode && (
            <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold border ${
              timeLeft <= 10
                ? 'text-rose-400 border-rose-500/30 bg-rose-950/30 animate-pulse'
                : 'text-amber-400 border-amber-500/20 bg-amber-950/20'
            }`}>
              <Timer size={13} />
              {timeLeft}s
            </div>
          )}
          {/* Score chip */}
          <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
            <CheckCircle size={13} /> {score}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-5 space-y-4">
        {/* Learning objective */}
        {quiz.learningObjective && (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Target size={11} />
            {quiz.learningObjective[lang] ?? quiz.learningObjective.en}
          </div>
        )}

        <h3 className="text-[15px] font-bold text-white leading-relaxed">
          {quiz.q[lang] ?? quiz.q.en}
        </h3>

        {/* Code snippet */}
        {quiz.codeSnippet && (
          <pre className="text-xs text-emerald-300 bg-black/40 rounded-lg p-3 overflow-x-auto border border-white/5 font-mono leading-relaxed">
            {quiz.codeSnippet}
          </pre>
        )}

        {/* Options */}
        <div className="space-y-2">
          {(quiz.options[lang] ?? quiz.options.en).map((opt, i) => {
            let cls = 'border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5'
            if (hasSubmitted) {
              if (i === correctIdx) cls = 'border-emerald-500/60 bg-emerald-950/25 text-emerald-300'
              else if (selectedAnswer === i) cls = 'border-rose-500/60 bg-rose-950/25 text-rose-300'
              else cls = 'border-white/5 opacity-40 text-slate-500'
            }
            return (
              <button
                key={i}
                disabled={hasSubmitted}
                onClick={() => handleAnswerSubmit(i)}
                className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm transition-all ${cls}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    hasSubmitted && i === correctIdx ? 'border-emerald-400 text-emerald-400'
                    : hasSubmitted && selectedAnswer === i ? 'border-rose-400 text-rose-400'
                    : 'border-white/20 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </div>
                {hasSubmitted && i === correctIdx && <CheckCircle size={16} className="text-emerald-400 shrink-0" />}
                {hasSubmitted && selectedAnswer === i && i !== correctIdx && <XCircle size={16} className="text-rose-400 shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Hint */}
        {hintsAllowed && quiz.hint && !hasSubmitted && (
          <button
            onClick={() => setShowHint((h) => !h)}
            className="flex items-center gap-1.5 text-xs text-amber-400/70 hover:text-amber-400 transition mt-1"
          >
            <Lightbulb size={12} />
            {showHint
              ? (lang === 'fr' ? 'Masquer l\'indice' : 'Hide hint')
              : (lang === 'fr' ? 'Afficher l\'indice' : 'Show hint')}
          </button>
        )}
        {showHint && quiz.hint && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-amber-300 leading-relaxed">
            💡 {quiz.hint[lang] ?? quiz.hint.en}
          </div>
        )}
      </div>

      {/* Explanation after submit */}
      {hasSubmitted && (
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-3 animate-fadeIn">
          <div className="flex items-start gap-2">
            <div className={`mt-0.5 shrink-0 ${selectedAnswer === correctIdx ? 'text-emerald-400' : 'text-rose-400'}`}>
              {selectedAnswer === correctIdx ? <CheckCircle size={16} /> : <XCircle size={16} />}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                {selectedAnswer === correctIdx
                  ? (lang === 'fr' ? 'Correct !' : 'Correct!')
                  : (lang === 'fr' ? 'Pas tout à fait…' : 'Not quite…')}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedAnswer === correctIdx
                  ? (quiz.explanation[lang] ?? quiz.explanation.en)
                  : (quiz.incorrectExplanations?.[lang]?.[selectedAnswer ?? 0]
                      || quiz.explanation[lang]
                      || quiz.explanation.en)}
              </p>
            </div>
          </div>

          {/* References */}
          {quiz.references && quiz.references.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 border-t border-white/5 pt-2">
              <BookOpen size={10} />
              {quiz.references.join(' · ')}
            </div>
          )}

          <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5">
            {current + 1 < questions.length
              ? (lang === 'fr' ? 'Question suivante' : 'Next Question')
              : (lang === 'fr' ? 'Terminer le Quiz' : 'Finish Quiz')}
            <SkipForward size={14} />
          </button>
        </div>
      )}

      {/* Toast */}
      {toastBadge && <BadgeToast badgeId={toastBadge} lang={lang} onClose={() => setToastBadge(null)} />}
    </div>
  )
}
