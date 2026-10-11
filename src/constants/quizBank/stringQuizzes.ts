import type { QuizQuestion } from '@/types/quiz'
import { q } from './types'

export const STRING_QUIZZES: QuizQuestion[] = [
  // ── KMP ───────────────────────────────────────────────────────────────────
  q(
    'kmp-lps-1', 'suffix-array', 'intermediate', 'concepts', 'kmp',
    'What does the Longest Prefix Suffix (LPS / π table) array store in the Knuth-Morris-Pratt (KMP) string matching algorithm?',
    "Que stocke le tableau LPS (Longest Prefix Suffix) dans l'algorithme de recherche de chaîne KMP ?",
    ['Length of the longest proper prefix of Pattern[0..i] that is also a suffix of Pattern[0..i]', 'Sorted order of all suffixes', 'Hash codes of all substrings', 'Next character index to compare'],
    ['Longueur du plus long vrai préfixe de Pattern[0..i] qui est aussi un suffixe de Pattern[0..i]', 'Ordre trié de tous les suffixes', 'Codes de hachage de toutes les sous-chaînes', 'Indice du prochain caractère'],
    0,
    'The LPS table precomputes pattern self-overlaps, allowing KMP to skip redundant character comparisons in O(N + M) time without backtracking text pointer.',
    "Le tableau LPS précalcule les chevauchements du motif, permettant à KMP d'éviter les comparaisons redondantes en temps O(N + M).",
    'Allows skipping text backtracking.', 'Permet d\'éviter le retour en arrière sur le texte.'
  ),

  // ── Rabin-Karp ─────────────────────────────────────────────────────────────
  q(
    'rabin-karp-rolling-hash', 'suffix-array', 'intermediate', 'concepts', 'rabinKarp',
    'What technique enables the Rabin-Karp algorithm to compute substring hashes in O(1) time per shift?',
    "Quelle technique permet à l'algorithme de Rabin-Karp de calculer le hachage d'une sous-chaîne en O(1) lors d'un décalage ?",
    ['Rolling Hash (Modular Arithmetic Hashing)', 'Prefix Sum Array', 'Fast Fourier Transform', 'Bitmask XOR'],
    ['Hachage Glissant (Rolling Hash)', 'Sommes Préfixes', 'Transformée de Fourier Rapide', 'Masque de bits XOR'],
    0,
    'A Rolling Hash updates the hash of window [i+1..i+M] from window [i..i+M-1] in O(1) by subtracting leading char weight and adding new trailing char.',
    "Le hachage glissant met à jour la valeur de hachage de la fenêtre en O(1) en soustrayant le caractère sortant et en ajoutant l'entrant.",
    'O(1) window update via modular arithmetic.', 'Mise à jour en O(1) par arithmétique modulaire.'
  ),

  // ── Suffix Array & Suffix Tree ──────────────────────────────────────────────
  q(
    'suffix-array-def', 'suffix-array', 'advanced', 'concepts', 'build',
    'What does a Suffix Array store for a string S of length N?',
    "Que stocke un Tableau des Suffixes (Suffix Array) pour une chaîne S de longueur N ?",
    ['Sorted array of starting indices of all N suffixes of S', 'Trie containing all characters', 'Array of hash values', 'Array of character frequencies'],
    ['Tableau trié des indices de départ de tous les N suffixes de S', 'Trie contenant tous les caractères', 'Tableau de hachages', 'Tableau de fréquences de caractères'],
    0,
    'A Suffix Array is an integer array containing the starting positions of all suffixes of S sorted in lexicographical order.',
    "Un tableau des suffixes est un tableau d'entiers contenant les positions de départ de tous les suffixes de S triés par ordre lexicographique.",
    'Stores sorted suffix start positions.', 'Stocke les indices de départ des suffixes triés.'
  ),

  // ── Rope ───────────────────────────────────────────────────────────────────
  q(
    'rope-concat-1', 'rope', 'advanced', 'operations', 'concat',
    'Why is a Rope data structure preferred over traditional contiguous arrays for heavy text editing in IDEs?',
    "Pourquoi la structure en Corde (Rope) est-elle préférée aux tableaux pour l'édition de texte lourd dans les IDE ?",
    ['Concat and Split operations take O(log N) instead of O(N)', 'Uses 10x less RAM', 'Enables instant spell-checking', 'Prevents file corruptions'],
    ['Les opérations de Concaténation et Scission prennent O(log N) au lieu de O(N)', 'Utilise 10x moins de RAM', 'Permet le correcteur orthographique', 'Évite la corruption de fichiers'],
    0,
    'Ropes represent strings as binary trees of leaf fragments, allowing concatenation and splitting of gigabyte-sized texts in O(log N) time.',
    "Les cordes représentent les chaînes sous forme d'arbres binaires de fragments, permettant la concaténation et le découpage en O(log N).",
    'Binary tree concatenation takes O(log N).', 'La concaténation par arbre binaire prend O(log N).'
  ),
]
