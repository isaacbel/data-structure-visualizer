import type { QuizQuestion, QuizBadge, QuizDifficulty, QuizUserProgress } from '@/types/quiz'
import { LINEAR_QUIZZES } from './linearQuizzes'
import { TREE_QUIZZES } from './treeQuizzes'
import { GRAPH_QUIZZES } from './graphQuizzes'
import { HASH_QUIZZES } from './hashQuizzes'
import { STRING_QUIZZES } from './stringQuizzes'
import { DP_QUIZZES } from './dpQuizzes'
import { SORTING_QUIZZES } from './sortingQuizzes'
import { SEARCHING_QUIZZES } from './searchingQuizzes'
import { ADVANCED_QUIZZES } from './advancedQuizzes'
import { OPERATION_SPECIFIC_QUIZZES } from './operationsQuizBank'

// Combine all domain question banks
export const ALL_QUIZZES: QuizQuestion[] = [
  ...LINEAR_QUIZZES,
  ...TREE_QUIZZES,
  ...GRAPH_QUIZZES,
  ...HASH_QUIZZES,
  ...STRING_QUIZZES,
  ...DP_QUIZZES,
  ...SORTING_QUIZZES,
  ...SEARCHING_QUIZZES,
  ...ADVANCED_QUIZZES,
  ...OPERATION_SPECIFIC_QUIZZES,
]

// Fallback questions to guarantee EVERY single DS has valid quizzes
function generateFallbackQuizzes(dsId: string): QuizQuestion[] {
  const formattedName = dsId.replace(/-/g, ' ').toUpperCase()
  return [
    {
      id: `${dsId}-fallback-1`,
      dsId,
      type: 'mcq',
      q: {
        en: `What is the primary architectural purpose of the ${formattedName} data structure?`,
        fr: `Quel est l'objectif architectural principal de la structure de données ${formattedName} ?`,
      },
      options: {
        en: [
          `Efficient data organization and targeted operations for ${formattedName}`,
          'Random memory reallocation',
          'Sequential linear string scanning only',
          'Preventing stack overflow exceptions',
        ],
        fr: [
          `Organisation efficace des données et opérations ciblant ${formattedName}`,
          'Réallocation mémoire aléatoire',
          'Analyse séquentielle linéaire uniquement',
          'Prévention du débordement de pile',
        ],
      },
      correct: 0,
      difficulty: 'beginner',
      category: 'concepts',
      operation: 'access',
      explanation: {
        en: `${formattedName} provides specialized space and time trade-offs tailored for specific computational access patterns.`,
        fr: `${formattedName} offre des compromis optimisés en espace et en temps adaptés aux besoins de calcul.`,
      },
      hint: {
        en: 'Consider structural efficiency and access patterns.',
        fr: 'Pensez à l\'efficacité structurelle et aux motifs d\'accès.',
      },
      references: ['CLRS 4th Edition', 'Visualgo Textbook'],
      relatedTopic: dsId,
      learningObjective: {
        en: `Understand core concepts of ${formattedName}`,
        fr: `Comprendre les concepts de base de ${formattedName}`,
      },
      tags: [dsId, 'concepts', 'beginner'],
      estimatedTimeSeconds: 30,
    },
    {
      id: `${dsId}-fallback-2`,
      dsId,
      type: 'mcq',
      q: {
        en: `Which factor primarily determines the space complexity of a ${formattedName} containing N elements?`,
        fr: `Quel facteur détermine principalement la complexité spatiale d'un ${formattedName} de N éléments ?`,
      },
      options: {
        en: [
          'The number of elements N stored and any pointer overhead',
          'The CPU clock speed',
          'The OS page file size',
          'The display refresh rate',
        ],
        fr: [
          'Le nombre d\'éléments N stockés et le surcoût des pointeurs',
          'La fréquence de l\'horloge CPU',
          'La taille du fichier d\'échange de l\'OS',
          'Le taux de rafraîchissement',
        ],
      },
      correct: 0,
      difficulty: 'intermediate',
      category: 'complexity',
      operation: 'insert',
      explanation: {
        en: `Space complexity represents memory allocation relative to input size N and node metadata.`,
        fr: `La complexité spatiale représente l'allocation mémoire proportionnelle à la taille N.`,
      },
      hint: {
        en: 'Memory depends on input size N.',
        fr: 'La mémoire dépend de la taille N.',
      },
      references: ['CLRS 4th Edition'],
      relatedTopic: dsId,
      learningObjective: {
        en: `Analyze memory efficiency of ${formattedName}`,
        fr: `Analyser l'efficacité mémoire de ${formattedName}`,
      },
      tags: [dsId, 'complexity', 'intermediate'],
      estimatedTimeSeconds: 30,
    },
  ]
}

export function getQuestionsForStructure(dsId: string, difficulty?: QuizDifficulty): QuizQuestion[] {
  let list = ALL_QUIZZES.filter((q) => q.dsId === dsId)
  if (list.length === 0) {
    list = generateFallbackQuizzes(dsId)
  }
  if (difficulty) {
    const filtered = list.filter((q) => q.difficulty === difficulty)
    return filtered.length > 0 ? filtered : list
  }
  return list
}

export function getQuestionsByOperation(dsId: string, operation: string): QuizQuestion[] {
  const list = ALL_QUIZZES.filter((q) => q.dsId === dsId && q.operation === operation)
  return list.length > 0 ? list : getQuestionsForStructure(dsId)
}

export function getAdaptiveQuestions(dsId: string, userProgress: QuizUserProgress, count = 5): QuizQuestion[] {
  const pool = getQuestionsForStructure(dsId)
  const history = userProgress.questionHistory

  // Prioritize questions not yet answered correctly
  const sorted = [...pool].sort((a, b) => {
    const scoreA = history[a.id]?.lastAnsweredCorrect ? 1 : 0
    const scoreB = history[b.id]?.lastAnsweredCorrect ? 1 : 0
    return scoreA - scoreB
  })

  return sorted.slice(0, count)
}

export const QUIZ_BADGES: QuizBadge[] = [
  {
    id: 'first_quiz',
    name: { en: 'Codebreaker Apprentice', fr: 'Apprenti Décodeur' },
    desc: { en: 'Complete your first quiz with a non-zero score.', fr: 'Terminez votre premier quiz avec un score supérieur à zéro.' },
    icon: 'Award',
    category: 'General',
    requirement: 'Score > 0 on any quiz',
  },
  {
    id: 'perfect_score',
    name: { en: 'Algorithm Scholar', fr: 'Érudit des Algorithmes' },
    desc: { en: 'Score a perfect 100% accuracy on any quiz.', fr: 'Obtenez 100% de précision sur n\'importe quel quiz.' },
    icon: 'CheckCircle',
    category: 'Mastery',
    requirement: '100% accuracy on a quiz',
  },
  {
    id: 'expert_conqueror',
    name: { en: 'VisuAlgo Conqueror', fr: 'Conquérant VisuAlgo' },
    desc: { en: 'Complete an Expert level quiz.', fr: 'Terminez un quiz de niveau Expert.' },
    icon: 'Zap',
    category: 'Difficulty',
    requirement: 'Complete Expert level quiz',
  },
  {
    id: 'week_streak',
    name: { en: 'Consistency Master', fr: 'Maître de la Régularité' },
    desc: { en: 'Maintain a 7-day learning streak.', fr: 'Maintenez une série de 7 jours consécutifs.' },
    icon: 'Flame',
    category: 'Streaks',
    requirement: '7-day streak',
  },
  {
    id: 'ds_master',
    name: { en: 'DSA Grandmaster', fr: 'Grand Maître des Structures' },
    desc: { en: 'Master 10 distinct data structures with 80%+ accuracy.', fr: 'Maîtrisez 10 structures de données avec au moins 80% de précision.' },
    icon: 'Crown',
    category: 'Mastery',
    requirement: 'Master 10 data structures',
  },
]
