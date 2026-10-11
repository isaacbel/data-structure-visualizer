import type { QuizQuestion } from '@/types/quiz'
import { q } from './types'

export const SEARCHING_QUIZZES: QuizQuestion[] = [
  q(
    'search-binary-prereq', 'array', 'beginner', 'concepts', 'binarySearch',
    'What mandatory prerequisite must an array satisfy before Binary Search can be applied?',
    "Quelle précondition obligatoire un tableau doit-il respecter pour qu'une recherche dichotomique (Binary Search) soit valide ?",
    ['The array must be sorted in monotonic order', 'The array must have an even number of elements', 'All elements must be positive', 'The array size must be a power of 2'],
    ['Le tableau doit être trié dans un ordre monotone', 'Le tableau doit avoir un nombre pair d\'éléments', 'Tous les éléments doivent être positifs', 'La taille du tableau doit être une puissance de 2'],
    0,
    'Binary search compares target with the middle element and discards half the array. This decision logic requires elements to be strictly sorted.',
    "La recherche dichotomique compare l'élément cible à l'élément central et élimine une moitié, ce qui exige un tableau préalablement trié.",
    'Monotonic ordering is required to discard half of items.', 'L\'ordre monotone est obligatoire pour éliminer la moitié des éléments.'
  ),
  q(
    'search-binary-overflow-bug', 'array', 'intermediate', 'debugging', 'binarySearch',
    'Why is calculate mid = (low + high) / 2 vulnerable to a integer overflow bug in high-level programming languages?',
    "Pourquoi la formule mid = (low + high) / 2 est-elle sujette à un bug de débordement d'entier (overflow) ?",
    ['If low + high exceeds MAX_INT (2^31 - 1), it overflows to a negative number', 'Division by 2 rounds down incorrectly', 'High can be negative', 'Low can be greater than high'],
    ['Si low + high dépasse MAX_INT, le résultat déborde et devient négatif', 'La division par 2 arrondit mal', 'High peut être négatif', 'Low peut être supérieur à High'],
    0,
    'For large arrays (e.g. 1 billion items), low + high exceeds 2,147,483,647, overflowing to a negative integer. Safe formula: mid = low + (high - low) / 2.',
    "Pour de grands tableaux, low + high dépasse la limite des entiers signés 32 bits. La formule sûre est mid = low + (high - low) / 2.",
    'Use mid = low + (high - low) / 2 to avoid overflow.', 'Utilisez mid = low + (high - low) / 2 pour éviter le débordement.'
  ),
  q(
    'search-interpolation-avg', 'array', 'advanced', 'complexity', 'interpolationSearch',
    'Under what data distribution does Interpolation Search achieve an average time complexity of O(log log N)?',
    "Sous quelle distribution de données la recherche par interpolation atteint-elle une complexité moyenne en O(log log N) ?",
    ['Uniformly distributed values (e.g. phone book numbers)', 'Exponentially distributed values', 'Random unsorted data', 'Fibonacci sequence values'],
    ['Valeurs distribuées de manière uniforme', 'Valeurs à distribution exponentielle', 'Données aléatoires non triées', 'Séquence de Fibonacci'],
    0,
    'Interpolation Search estimates key position using slope formula mid = low + (target - arr[low]) * (high - low) / (arr[high] - arr[low]), achieving O(log log N) for uniform data.',
    "La recherche par interpolation estime la position de la cible par régression linéaire, atteignant O(log log N) sur des données uniformes.",
    'Proportional slope interpolation works best on uniform data.', 'L\'interpolation proportionnelle est optimale sur des données uniformes.'
  ),
]
