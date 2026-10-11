import type { QuizQuestion } from '@/types/quiz'
import { q } from './types'

export const ADVANCED_QUIZZES: QuizQuestion[] = [
  // ── Union-Find (DSU) ──────────────────────────────────────────────────────
  q(
    'dsu-ackermann', 'union-find', 'advanced', 'complexity', 'find',
    'What is the amortized time complexity per operation of Union-Find when optimized with Path Compression AND Union by Rank/Size?',
    "Quelle est la complexité temporelle amortie par opération d'Union-Find optimisée avec la compression de chemin ET l'union par rang ?",
    ['O(α(N)) near-constant (inverse Ackermann function α(N) < 5)', 'O(1) strictly', 'O(log N)', 'O(N)'],
    ['O(α(N)) quasi-constant (fonction d\'Ackermann inverse α(N) < 5)', 'O(1) strictement', 'O(log N)', 'O(N)'],
    0,
    'Combining Path Compression and Union by Rank reduces the amortized cost per find/union operation to O(α(N)), where α is the inverse Ackermann function (α(N) ≤ 4 for all practical universe sizes).',
    "L'association de la compression de chemin et de l'union par rang réduit le coût amorti à O(α(N)), où α est la fonction d'Ackermann inverse.",
    'Inverse Ackermann grows so slowly it is effectively constant.', 'L\'Ackermann inverse croît si lentement qu\'il est pratiquement constant.'
  ),
  q(
    'dsu-path-compression', 'union-find', 'intermediate', 'operations', 'find',
    'What does Path Compression do during a find(x) operation in Union-Find?',
    "Que fait la Compression de Chemin (Path Compression) lors d'un appel find(x) dans Union-Find ?",
    ['Flattens the structure by making every visited node point directly to the root', 'Sorts elements alphabetically', 'Rebalances the binary tree', 'Clears all pointers to null'],
    ['Aplatit la structure en faisant pointer chaque nœud visité directement vers la racine', 'Trie les éléments', 'Rééquilibre l\'arbre binaire', 'Efface tous les pointeurs'],
    0,
    'Path compression recursively updates parent pointers of all traversed nodes along the path from x to root to point directly to root, flattening tree height.',
    "La compression de chemin fait pointer tous les nœuds du chemin directement vers la racine, aplatissant l'arbre pour les accès futurs.",
    'Flattens parent links directly to representative root.', 'Aplatit les liens parents directement vers la racine.'
  ),

  // ── LRU Cache ──────────────────────────────────────────────────────────────
  q(
    'lru-data-structures', 'lru-cache', 'intermediate', 'concepts', 'get',
    'Which two data structures are combined to implement an LRU (Least Recently Used) Cache with O(1) get and put operations?',
    "Quelles deux structures de données sont combinées pour implémenter un Cache LRU avec des opérations get et put en O(1) ?",
    ['Hash Map + Doubly Linked List', 'Array + Binary Search Tree', 'Queue + Min-Heap', 'Stack + Trie'],
    ['Table de Hachage + Liste Doublement Chaînée', 'Tableau + Arbre Binaire', 'File + Tas Min', 'Pile + Trie'],
    0,
    'A Hash Map provides O(1) key-to-node lookup, while a Doubly Linked List enables O(1) node relocation to head (most recent) and removal from tail (least recent).',
    "La Table de Hachage offre la recherche en O(1), et la Liste Doublement Chaînée permet le déplacement et la suppression du plus ancien en O(1).",
    'Hash map for O(1) lookup, DLL for O(1) node ordering.', 'Hash map pour recherche O(1), DLL pour ordonnancement O(1).'
  ),

  // ── Monotonic Stack & Queue ────────────────────────────────────────────────
  q(
    'mono-stack-next-greater', 'array', 'advanced', 'applications', 'traverse',
    'Which data structure finds the Next Greater Element for every array item in linear O(N) overall time?',
    "Quelle structure de données permet de trouver le Prochain Élément Plus Grand pour chaque élément en temps linéaire O(N) ?",
    ['Monotonic Decreasing Stack', 'Priority Queue', 'Segment Tree', 'Hash Set'],
    ['Pile Monotone Décroissante (Monotonic Stack)', 'File de Priorité', 'Arbre de Segments', 'Ensemble de Hachage'],
    0,
    'A Monotonic Stack maintains elements in monotonic order. Each element is pushed and popped at most once, achieving O(N) total processing time for Next Greater Element queries.',
    "Une Pile Monotone maintient un ordre strict. Chaque élément étant empilé et dépilé au plus une fois, le traitement global prend O(N).",
    'Every element enters and leaves stack at most once.', 'Chaque élément entre et sort au plus une fois de la pile.'
  ),
]
