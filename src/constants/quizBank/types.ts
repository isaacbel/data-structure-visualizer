import type { QuizQuestion, QuizBadge } from '@/types/quiz'

export function q(
  id: string,
  dsId: string,
  difficulty: QuizQuestion['difficulty'],
  category: QuizQuestion['category'],
  operation: string | undefined,
  qEN: string,
  qFR: string,
  optEN: string[],
  optFR: string[],
  correct: number | number[],
  expEN: string,
  expFR: string,
  hintEN?: string,
  hintFR?: string,
  extra?: Partial<QuizQuestion>
): QuizQuestion {
  return {
    id,
    dsId,
    type: extra?.type || (Array.isArray(correct) ? 'multi_select' : 'mcq'),
    q: { en: qEN, fr: qFR },
    options: { en: optEN, fr: optFR },
    correct,
    difficulty,
    category,
    operation,
    explanation: { en: expEN, fr: expFR },
    incorrectExplanations: extra?.incorrectExplanations,
    hint: hintEN && hintFR ? { en: hintEN, fr: hintFR } : undefined,
    references: extra?.references || ['CLRS 4th Edition', 'VisuAlgo Textbook'],
    relatedTopic: extra?.relatedTopic || dsId,
    learningObjective: extra?.learningObjective || {
      en: `Master ${operation || category} for ${dsId}`,
      fr: `Maîtriser ${operation || category} pour ${dsId}`,
    },
    tags: extra?.tags || [dsId, category, difficulty],
    estimatedTimeSeconds: extra?.estimatedTimeSeconds || 45,
    visualStateBefore: extra?.visualStateBefore,
    codeSnippet: extra?.codeSnippet,
  }
}
