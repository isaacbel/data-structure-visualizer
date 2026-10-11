import type { QuizQuestion } from '@/types/quiz'
import { q } from './types'

export const HASH_QUIZZES: QuizQuestion[] = [
  // ── Hash Table & Hash Map ──────────────────────────────────────────────────
  q(
    'hash-load-factor', 'hash-table', 'intermediate', 'concepts', 'rehash',
    'What is the Load Factor (α = N / M) of a Hash Table, and why does it trigger rehashing?',
    "Qu'est-ce que le Facteur de Charge (α = N / M) d'une Table de Hachage, et pourquoi déclenche-t-il le rehachage ?",
    ['Ratio of stored elements N to bucket slots M; high α increases collision frequency', 'Total bytes of memory used', 'Number of hash functions divided by slots', 'Number of deleted keys'],
    ['Ratio éléments stockés N sur emplacements M ; un α élevé augmente les collisions', 'Total de mémoire en octets', 'Nombre de fonctions de hachage sur emplacements', 'Nombre de clés supprimées'],
    0,
    'Load factor α = N/M measures bucket occupancy. When α exceeds a threshold (e.g. 0.75), collisions rise dramatically, requiring doubling array size M and rehashing.',
    "Le facteur de charge α = N/M mesure l'occupation. Quand α dépasse un seuil (ex. 0,75), les collisions augmentent, nécessitant un redimensionnement.",
    'Alpha measures average keys per bucket.', 'Alpha mesure le nombre moyen de clés par seau.'
  ),
  q(
    'hash-chaining-worst-case', 'hash-table', 'intermediate', 'complexity', 'search',
    'What is the worst-case time complexity of searching in a Hash Table using Separate Chaining when all keys hash to the same bucket?',
    "Quelle est la complexité dans le pire des cas d'une recherche dans une Table de Hachage avec Chaining si toutes les clés tombent dans le même seau ?",
    ['O(N)', 'O(1)', 'O(log N)', 'O(N²)'],
    ['O(N)', 'O(1)', 'O(log N)', 'O(N²)'],
    0,
    'If all N keys hash to a single bucket, the chaining list degenerates into a single Singly Linked List of length N, making search O(N).',
    "Si toutes les N clés entrent dans le même seau, la liste de chaînage devient une liste simple de longueur N, soit O(N).",
    'Degenerates into searching a linked list.', 'Dégénère en recherche dans une liste chaînée.'
  ),

  // ── Bloom Filter ───────────────────────────────────────────────────────────
  q(
    'bloom-filter-false-positives', 'bloom-filter', 'advanced', 'concepts', 'search',
    'Which type of error can occur when querying a Bloom Filter?',
    "Quel type d'erreur peut survenir lors d'une requête dans un Filtre de Bloom ?",
    ['False Positives possible (may say item EXISTS when it does not), but NO False Negatives', 'False Negatives possible, but no False Positives', 'Both False Positives and False Negatives possible', 'Zero errors possible (100% deterministic)'],
    ['Faux Positifs possibles (peut indiquer présent alors qu\'il ne l\'est pas), AUCUN Faux Négatif', 'Faux Négatifs possibles', 'Faux Positifs et Faux Négatifs possibles', 'Zéro erreur (déterministe)'],
    0,
    'Bloom Filters are space-efficient probabilistic structures: if it says "NOT PRESENT", it is 100% guaranteed not present. If it says "PRESENT", it MAY be a false positive due to bit overlaps.',
    "Un filtre de Bloom ne donne AUCUN Faux Négatif (s'il dit absent, l'élément est 100% absent). En revanche, il peut donner des Faux Positifs.",
    'No false negatives; false positives can occur.', 'Aucun faux négatif ; les faux positifs sont possibles.'
  ),

  // ── Skip List ──────────────────────────────────────────────────────────────
  q(
    'skip-list-expected-complexity', 'skip-list', 'advanced', 'complexity', 'search',
    'What is the expected average time complexity of search, insert, and delete operations in a Skip List?',
    "Quelle est la complexité temporelle moyenne attendue pour la recherche, l'insertion et la suppression dans une Skip List ?",
    ['O(log N)', 'O(1)', 'O(N)', 'O(N log N)'],
    ['O(log N)', 'O(1)', 'O(N)', 'O(N log N)'],
    0,
    'Skip Lists use probabilistic multi-level forward pointers (like an express lane hierarchy) to achieve expected O(log N) search, insertion, and deletion times.',
    "Les Skip Lists utilisent une hiérarchie probabiliste de pointeurs pour atteindre une complexité attendue de O(log N).",
    'Multi-level express pointers give binary-search performance.', 'Les pointeurs express multi-niveaux offrent les performances de la recherche dichotomique.'
  ),
]
