import type { Language } from '@/types'

export type QuizDifficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'interview'
  | 'cp'
  | 'exam'

export type QuizCategory =
  | 'concepts'
  | 'complexity'
  | 'operations'
  | 'visualization'
  | 'debugging'
  | 'applications'
  | 'code'

export type QuestionType =
  | 'mcq'
  | 'multi_select'
  | 'true_false'
  | 'fill_code'
  | 'bug_hunt'
  | 'order_steps'
  | 'visual_predict'

export type StudyMode =
  | 'study'
  | 'practice'
  | 'exam'
  | 'flashcards'
  | 'weak_review'
  | 'speed_quiz'
  | 'challenge'

export interface VisualQuestionState {
  diagramType: 'tree' | 'array' | 'heap' | 'graph' | 'hash' | 'matrix'
  nodes?: Array<{ id: string; label: string; color?: string; highlighted?: boolean }>
  edges?: Array<{ from: string; to: string; label?: string; highlighted?: boolean }>
  array?: Array<{ index: number; value: string | number; color?: string }>
  promptText?: Record<Language, string>
}

export interface QuizQuestion {
  id: string
  dsId: string
  type: QuestionType
  q: Record<Language, string>
  options: Record<Language, string[]>
  correct: number | number[]
  difficulty: QuizDifficulty
  category: QuizCategory
  operation?: string
  explanation: Record<Language, string>
  incorrectExplanations?: Record<Language, string[]>
  hint?: Record<Language, string>
  references?: string[]
  relatedTopic?: string
  learningObjective?: Record<Language, string>
  tags?: string[]
  estimatedTimeSeconds?: number
  visualStateBefore?: VisualQuestionState
  codeSnippet?: string
}

export interface QuestionHistory {
  attempts: number
  correctCount: number
  lastAnsweredCorrect: boolean
  lastAttemptTimestamp: number
}

export interface QuizUserProgress {
  xp: number
  level: number
  streak: number
  coins: number
  lastActiveDate: string
  scores: Record<string, {
    score: number
    total: number
    accuracy: number
    bestTimeSeconds: number
    difficulty: QuizDifficulty
    timestamp: number
  }>
  badges: string[]
  masteredTopics: string[]
  weakTopics: string[]
  questionHistory: Record<string, QuestionHistory>
}

export interface QuizBadge {
  id: string
  name: Record<Language, string>
  desc: Record<Language, string>
  icon: string
  category: string
  requirement: string
}

export interface QuizCertificate {
  id: string
  dsId: string
  dsName: Record<Language, string>
  userName: string
  scorePercent: number
  issueDate: string
  certificateId: string
}
