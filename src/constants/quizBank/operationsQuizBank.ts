import type { QuizQuestion } from '@/types/quiz'
import { q } from './types'

export const OPERATION_SPECIFIC_QUIZZES: QuizQuestion[] = [
  // ── BST Operations ────────────────────────────────────────────────────────
  q(
    'op-bst-rotate-left', 'bst', 'advanced', 'operations', 'rotateLeft',
    'During a Left Rotation on node X with right child Y, which node becomes the new parent of X?',
    "Lors d'une Rotation Gauche sur le nœud X avec l'enfant droit Y, quel nœud devient le nouveau parent de X ?",
    ['Node Y', 'Node X left child', 'Node Y left child', 'The root node'],
    ['Le nœud Y', 'L\'enfant gauche de X', 'L\'enfant gauche de Y', 'La racine'],
    0,
    'A Left Rotation pivots node X down to become the left child of its right child Y.',
    "La rotation gauche fait descendre X pour devenir l'enfant gauche de son ancien enfant droit Y.",
    'Y moves up, X moves down to Y.left.', 'Y monte, X descend en Y.gauche.'
  ),
  q(
    'op-bst-predecessor', 'bst', 'intermediate', 'operations', 'predecessor',
    'How do you find the In-Order Predecessor of a node X in a Binary Search Tree if X has a non-empty left subtree?',
    "Comment trouver le Prédécesseur Infixe d'un nœud X s'il possède un sous-arbre gauche non vide ?",
    ['Find the maximum key in the left subtree (go left once, then right as far as possible)', 'Go right once, then left', 'Return the parent node', 'Return the root node'],
    ['Trouver la clé maximale dans le sous-arbre gauche (aller à gauche une fois, puis à droite au maximum)', 'Aller à droite puis à gauche', 'Retourner le parent', 'Retourner la racine'],
    0,
    'If X has a left child, its in-order predecessor is the rightmost (maximum) node in its left subtree.',
    "Si X a un enfant gauche, son prédécesseur infixe est le nœud le plus à droite (maximum) dans son sous-arbre gauche.",
    'Maximum node in left subtree.', 'Nœud maximum du sous-arbre gauche.'
  ),
  q(
    'op-bst-lca', 'bst', 'intermediate', 'operations', 'lca',
    'When computing the Lowest Common Ancestor (LCA) of keys P and Q in a BST, how do you know current node N IS the LCA?',
    "Lors du calcul du Plus Proche Ancêtre Commun (LCA) de P et Q dans un ABR, comment sait-on que le nœud N est le LCA ?",
    ['When P and Q lie on opposite sides of N (or one key equals N.val)', 'When N is a leaf node', 'When N has no parent', 'When P + Q = N.val'],
    ['Lorsque P et Q sont de côtés opposés par rapport à N (ou l\'un des deux est égal à N.val)', 'Lorsque N est une feuille', 'Lorsque N n\'a pas de parent', 'Lorsque P + Q = N.val'],
    0,
    'In a BST, N is the LCA of P and Q if one key is ≤ N.val and the other key is ≥ N.val (the paths split at N).',
    "Dans un ABR, N est le LCA si une clé est ≤ N.val et l'autre est ≥ N.val (les chemins se séparent en N).",
    'The tree paths split at the LCA node.', 'Les chemins de l\'arbre se séparent au nœud LCA.'
  ),

  // ── Heap Operations ───────────────────────────────────────────────────────
  q(
    'op-heap-sift-up', 'min-heap', 'intermediate', 'operations', 'insert',
    'When inserting a new element into a Min-Heap, where is it initially placed before Heapify Up (sift-up)?',
    "Lors de l'insertion d'un nouvel élément dans un Tas Min, où est-il placé initialement avant l'entassement vers le haut ?",
    ['At the end of the heap array (as the next available leaf node)', 'At the root index 0', 'At index 1 always', 'At a random position'],
    ['À la fin du tableau de tas (comme prochaine feuille disponible)', 'À l\'indice racine 0', 'À l\'indice 1 toujours', 'À une position aléatoire'],
    0,
    'New elements are inserted at the first available array slot at the bottom left-to-right leaf level, then sifted up until parent ≤ child.',
    "Les nouveaux éléments sont insérés au premier emplacement disponible à la fin, puis remontés jusqu'à satisfaire la propriété de tas.",
    'Inserted at end, then sifted up.', 'Inséré à la fin, puis remonté.'
  ),
  q(
    'op-heap-extract-min', 'min-heap', 'intermediate', 'operations', 'extractMin',
    'How is the root element removed during extractMin() in a Min-Heap of size N?',
    "Comment l'élément racine est-il supprimé lors de l'opération extractMin() dans un Tas Min de taille N ?",
    ['Replace root with last element (array[N-1]), decrement size, then call siftDown(0)', 'Shift all elements left by 1', 'Set root to null without shifting', 'Delete all left subtrees'],
    ['Remplacer la racine par le dernier élément (array[N-1]), décrémenter la taille, puis appeler siftDown(0)', 'Décaler tous les éléments vers la gauche', 'Mettre la racine à null', 'Supprimer les sous-arbres'],
    0,
    'To preserve the complete binary tree structure, root is replaced with the last element array[N-1], size is decremented, and siftDown(0) restores heap order.',
    "Pour conserver la structure d'arbre binaire complet, la racine est remplacée par le dernier élément, puis réentassée vers le bas.",
    'Swap root with last leaf, then sift down.', 'Échanger la racine avec la dernière feuille, puis entasser vers le bas.'
  ),

  // ── Graph Edge Case Operations ──────────────────────────────────────────────
  q(
    'op-graph-cycle-detection', 'directed-graph', 'intermediate', 'operations', 'cycleDetection',
    'How does DFS detect a directed cycle in a Directed Graph?',
    "Comment le parcours DFS détecte-t-il un cycle orienté dans un Graphe Orienté ?",
    ['If a Back Edge is encountered to a node currently in the Recursion Stack (VISITING state)', 'If any node is visited twice in BFS', 'If the graph has an odd number of edges', 'If all degree values are even'],
    ['Si une arête retour pointe vers un nœud présent dans la Pile de Récursion (état VISITING)', 'Si un nœud est visité deux fois en BFS', 'Si le nombre d\'arêtes est impair', 'Si tous les degrés sont pairs'],
    0,
    'A directed cycle exists if and only if DFS reaches a vertex that is currently active on the recursion stack (Gray / Visiting state), indicating a back-edge.',
    "Un cycle orienté existe si et seulement si le DFS atteint un sommet en cours de visite sur la pile de récursion (arête retour).",
    'Back-edge to active recursion stack node indicates cycle.', 'Une arête retour vers un nœud de la pile active indique un cycle.'
  ),
]
