import type { QuizQuestion } from '@/types/quiz'
import { q } from './types'

export const SORTING_QUIZZES: QuizQuestion[] = [
  // ── Comparison Sorts ──────────────────────────────────────────────────────
  q(
    'sort-quicksort-pivot-worst', 'array', 'intermediate', 'complexity', 'quicksort',
    'Under what condition does QuickSort exhibit its worst-case time complexity of O(N²)?',
    "Dans quelle condition l'algorithme QuickSort présente-t-il sa pire complexité temporelle en O(N²) ?",
    ['When the chosen pivot is consistently the smallest or largest element (e.g. already sorted array with naive pivot)', 'When all elements are unique', 'When capacity doubles', 'When using 3-way partitioning'],
    ['Lorsque le pivot choisi est systématiquement le plus petit ou le plus grand élément (ex. tableau déjà trié avec un pivot naïf)', 'Lorsque tous les éléments sont uniques', 'Lorsque la capacité double', 'Lors de l\'utilisation du partitionnement à 3 voies'],
    0,
    'If the pivot choice creates extreme 0 : N-1 partitions on every recursion step, recursion depth becomes N instead of log N, leading to O(N²) time.',
    "Si le choix du pivot crée des partitions déséquilibrées 0 : N-1 à chaque étape, la profondeur de récursion devient N au lieu de log N, soit O(N²).",
    'Imbalanced partitions degrade height from log N to N.', 'Des partitions déséquilibrées font passer la hauteur de log N à N.'
  ),
  q(
    'sort-mergesort-space', 'array', 'intermediate', 'complexity', 'mergesort',
    'What is the space complexity of standard iterative/recursive Merge Sort on an array of N elements?',
    "Quelle est la complexité spatiale de l'algorithme classique de Tri Fusion (Merge Sort) sur un tableau de N éléments ?",
    ['O(N) auxiliary space for temporary buffer', 'O(1) in-place space', 'O(log N) space', 'O(N²) space'],
    ['O(N) espace auxiliaire pour le tampon temporaire', 'O(1) espace sur place', 'O(log N) espace', 'O(N²) espace'],
    0,
    'Standard Merge Sort requires an auxiliary array of size N to merge two sorted halves without overwriting uncopied elements.',
    "Le Tri Fusion classique nécessite un tableau auxiliaire de taille N pour fusionner les deux moitiés triées.",
    'Temporary array needed for merging.', 'Tableau temporaire nécessaire pour la fusion.'
  ),
  q(
    'sort-stability-1', 'array', 'intermediate', 'concepts', 'stability',
    'What does it mean for a sorting algorithm to be stable?',
    "Que signifie le fait qu'un algorithme de tri soit dit 'stable' ?",
    ['It preserves the relative order of elements that have equal keys', 'It never exceeds O(N log N) time', 'It uses O(1) extra space', 'It runs without stack overflow'],
    ['Il préserve l\'ordre relatif des éléments possédant des clés égales', 'Il ne dépasse jamais O(N log N)', 'Il utilise un espace O(1)', 'Il s\'exécute sans débordement de pile'],
    0,
    'A stable sort guarantees that if Key(A) == Key(B) and A appeared before B in the input, A will also appear before B in the sorted output.',
    "Un tri stable garantit que si deux éléments ont des clés égales, leur ordre relatif d'origine est préservé après le tri.",
    'Preserves original tie order.', 'Conserve l\'ordre d\'origine des égalités.'
  ),

  // ── Non-Comparison Sorts ───────────────────────────────────────────────────
  q(
    'sort-counting-complexity', 'array', 'advanced', 'complexity', 'countingSort',
    'What is the time complexity of Counting Sort for N elements where keys range from 0 to K?',
    "Quelle est la complexité temporelle du Tri par Comptage (Counting Sort) pour N éléments dont les clés varient de 0 à K ?",
    ['O(N + K)', 'O(N log N)', 'O(N · K)', 'O(K log N)'],
    ['O(N + K)', 'O(N log N)', 'O(N · K)', 'O(K log N)'],
    0,
    'Counting Sort counts key frequencies in O(N) and iterates over frequency array of size K in O(K), yielding O(N + K) linear non-comparison time.',
    "Le tri par comptage compte les fréquences en O(N) et parcourt le tableau de fréquences de taille K en O(K), soit O(N + K).",
    'Linear time when K is O(N).', 'Temps linéaire lorsque K est O(N).'
  ),
]
