import type { QuizQuestion } from '@/types/quiz'
import { q } from './types'

export const DP_QUIZZES: QuizQuestion[] = [
  // ── 0/1 Knapsack ──────────────────────────────────────────────────────────
  q(
    'dp-knapsack-recurrence', 'array', 'intermediate', 'concepts', 'knapsack',
    'What is the core state transition recurrence for 0/1 Knapsack with item weight w[i] and value v[i]?',
    "Quelle est la récurrence de transition d'état pour le problème du Sac à Dos 0/1 (Knapsack) avec poids w[i] et valeur v[i] ?",
    ['dp[i][w] = max(dp[i-1][w], v[i] + dp[i-1][w - w[i]])', 'dp[i][w] = dp[i-1][w] + v[i]', 'dp[i][w] = max(dp[i][w-1], dp[i-1][w])', 'dp[i][w] = v[i] * w[i]'],
    ['dp[i][w] = max(dp[i-1][w], v[i] + dp[i-1][w - w[i]])', 'dp[i][w] = dp[i-1][w] + v[i]', 'dp[i][w] = max(dp[i][w-1], dp[i-1][w])', 'dp[i][w] = v[i] * w[i]'],
    0,
    'For item i and capacity w: we choose between NOT taking item i (dp[i-1][w]) vs TAKING item i (v[i] + dp[i-1][w - w[i]]), provided w ≥ w[i].',
    "Pour chaque objet i et capacité w : on choisit le max entre ne pas prendre l'objet (dp[i-1][w]) et le prendre (v[i] + dp[i-1][w - w[i]]).",
    'Choice between excluding or including current item.', 'Choix entre exclure ou inclure l\'objet courant.'
  ),

  // ── LCS & LIS ──────────────────────────────────────────────────────────────
  q(
    'dp-lcs-complexity', 'array', 'intermediate', 'complexity', 'lcs',
    'What is the time complexity to find the Longest Common Subsequence (LCS) of two strings of lengths M and N using Dynamic Programming?',
    "Quelle est la complexité temporelle pour trouver la Plus Longue Sous-séquence Commune (LCS) de deux chaînes de longueurs M et N ?",
    ['O(M · N)', 'O(M + N)', 'O(2^(M+N))', 'O((M · N)²)'],
    ['O(M · N)', 'O(M + N)', 'O(2^(M+N))', 'O((M · N)²)'],
    0,
    'DP computes an M × N table where dp[i][j] stores the LCS length for prefixes A[0..i-1] and B[0..j-1], requiring O(M · N) time.',
    "La programmation dynamique remplit une grille M × N, ce qui nécessite O(M · N) étapes.",
    'Grid dimension is M by N.', 'La dimension de la grille est M par N.'
  ),
  q(
    'dp-lis-patience-sorting', 'array', 'advanced', 'complexity', 'lis',
    'What is the optimal time complexity to find the Longest Increasing Subsequence (LIS) of N numbers using Patience Sorting + Binary Search?',
    "Quelle est la complexité optimale pour trouver la Plus Longue Sous-séquence Croissante (LIS) avec le tri Patience + Recherche dichotomique ?",
    ['O(N log N)', 'O(N²)', 'O(N)', 'O(2^N)'],
    ['O(N log N)', 'O(N²)', 'O(N)', 'O(2^N)'],
    0,
    'Standard DP takes O(N²), but maintaining tails array with binary search (Patience Sorting) reduces LIS to O(N log N) time.',
    "La DP classique prend O(N²), mais l'optimisation par recherche dichotomique (Patience Sorting) réduit la complexité à O(N log N).",
    'Binary search on active tails reduces N² to N log N.', 'La recherche dichotomique réduit N² à N log N.'
  ),
]
