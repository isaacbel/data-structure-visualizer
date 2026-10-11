import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QuizUserProgress, QuizDifficulty, QuizQuestion } from '@/types/quiz'

interface QuizState {
  progress: QuizUserProgress
  
  // Actions
  addXP: (amount: number) => void
  recordQuizResult: (
    dsId: string,
    score: number,
    total: number,
    difficulty: QuizDifficulty,
    timeSeconds: number,
    answeredQuestions: Array<{ qId: string; isCorrect: boolean }>
  ) => void
  unlockBadge: (badgeId: string) => void
  resetProgress: () => void
}

const INITIAL_PROGRESS: QuizUserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  coins: 0,
  lastActiveDate: '',
  scores: {},
  badges: [],
  masteredTopics: [],
  weakTopics: [],
  questionHistory: {},
}

function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      progress: INITIAL_PROGRESS,

      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.progress.xp + amount
          const newLevel = calculateLevel(newXP)
          const newCoins = state.progress.coins + Math.floor(amount / 5)
          
          return {
            progress: {
              ...state.progress,
              xp: newXP,
              level: newLevel,
              coins: newCoins,
            },
          }
        })
      },

      recordQuizResult: (dsId, score, total, difficulty, timeSeconds, answeredQuestions) => {
        set((state) => {
          const today = getTodayString()
          let streak = state.progress.streak
          
          // Streak calculation
          if (state.progress.lastActiveDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
            if (state.progress.lastActiveDate === yesterday) {
              streak += 1
            } else {
              streak = 1
            }
          }

          const accuracy = total > 0 ? Math.round((score / total) * 100) : 0
          const xpEarned = score * 20 + (accuracy === 100 ? 50 : 0) + (streak > 3 ? 15 : 0)
          const key = `${dsId}_${difficulty}`
          const prevScore = state.progress.scores[key]

          const updatedScores = {
            ...state.progress.scores,
            [key]: {
              score: Math.max(score, prevScore?.score ?? 0),
              total,
              accuracy: Math.max(accuracy, prevScore?.accuracy ?? 0),
              bestTimeSeconds: Math.min(timeSeconds, prevScore?.bestTimeSeconds ?? 99999),
              difficulty,
              timestamp: Date.now(),
            },
          }

          // Update question history
          const updatedHistory = { ...state.progress.questionHistory }
          answeredQuestions.forEach(({ qId, isCorrect }) => {
            const current = updatedHistory[qId] ?? {
              attempts: 0,
              correctCount: 0,
              lastAnsweredCorrect: false,
              lastAttemptTimestamp: 0,
            }
            updatedHistory[qId] = {
              attempts: current.attempts + 1,
              correctCount: current.correctCount + (isCorrect ? 1 : 0),
              lastAnsweredCorrect: isCorrect,
              lastAttemptTimestamp: Date.now(),
            }
          })

          // Calculate weak vs mastered topics
          const masteredSet = new Set(state.progress.masteredTopics)
          const weakSet = new Set(state.progress.weakTopics)

          if (accuracy >= 80) {
            masteredSet.add(dsId)
            weakSet.delete(dsId)
          } else if (accuracy < 50) {
            weakSet.add(dsId)
            masteredSet.delete(dsId)
          }

          // Badges evaluation
          const newBadges = new Set(state.progress.badges)
          newBadges.add('first_quiz')
          if (accuracy === 100) newBadges.add('perfect_score')
          if (difficulty === 'expert') newBadges.add('expert_conqueror')
          if (streak >= 7) newBadges.add('week_streak')
          if (masteredSet.size >= 10) newBadges.add('ds_master')

          const newXP = state.progress.xp + xpEarned
          const newLevel = calculateLevel(newXP)

          return {
            progress: {
              ...state.progress,
              xp: newXP,
              level: newLevel,
              streak,
              coins: state.progress.coins + Math.floor(xpEarned / 5),
              lastActiveDate: today,
              scores: updatedScores,
              badges: Array.from(newBadges),
              masteredTopics: Array.from(masteredSet),
              weakTopics: Array.from(weakSet),
              questionHistory: updatedHistory,
            },
          }
        })
      },

      unlockBadge: (badgeId: string) => {
        set((state) => {
          if (state.progress.badges.includes(badgeId)) return state
          return {
            progress: {
              ...state.progress,
              badges: [...state.progress.badges, badgeId],
            },
          }
        })
      },

      resetProgress: () => set({ progress: INITIAL_PROGRESS }),
    }),
    {
      name: 'dsv-quiz-store',
    }
  )
)
