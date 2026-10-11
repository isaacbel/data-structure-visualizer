import type { CategoryId, DataStructureConfig, LearningPathId } from '@/types'

function ds(
  id: string,
  type: DataStructureConfig['type'],
  category: CategoryId,
  ops: string[],
  name: { en: string; fr: string },
  difficulty: DataStructureConfig['difficulty'],
  implemented: boolean,
  learningPath?: LearningPathId,
): DataStructureConfig {
  return {
    id,
    type,
    category,
    ops,
    name: { en: name.en, fr: name.fr },
    description: {
      en: `Interactive visualization of ${name.en}`,
      fr: `Visualisation interactive de ${name.fr}`,
    },
    difficulty,
    implemented,
    learningPath,
  }
}

export const DATA_STRUCTURES: Record<string, DataStructureConfig> = {
  // ── Linear ─────────────────────────────────────────────────────────────────
  array: ds('array', 'linear', 'linear', ['insert', 'delete', 'search', 'traverse', 'access'], { en: 'Array', fr: 'Tableau' }, 'beginner', true, 'beginner'),
  vector: ds('vector', 'linear', 'linear', ['push_back', 'pop_back', 'insert', 'delete', 'access'], { en: 'Dynamic Array', fr: 'Tableau Dynamique' }, 'beginner', true, 'beginner'),
  'linked-list-singly': ds('linked-list-singly', 'linked', 'linear', ['insertHead', 'insertTail', 'delete', 'search', 'traverse'], { en: 'Singly Linked List', fr: 'Liste Chaînée Simple' }, 'beginner', true, 'beginner'),
  'linked-list-doubly': ds('linked-list-doubly', 'linked', 'linear', ['insertHead', 'insertTail', 'delete', 'search', 'traverse'], { en: 'Doubly Linked List', fr: 'Liste Doublement Chaînée' }, 'beginner', true, 'beginner'),
  'linked-list-circular': ds('linked-list-circular', 'linked', 'linear', ['insert', 'delete', 'search', 'traverse'], { en: 'Circular Linked List', fr: 'Liste Chaînée Circulaire' }, 'beginner', true, 'beginner'),
  stack: ds('stack', 'stack', 'linear', ['push', 'pop', 'peek'], { en: 'Stack', fr: 'Pile' }, 'beginner', true, 'beginner'),
  queue: ds('queue', 'queue', 'linear', ['enqueue', 'dequeue', 'peek'], { en: 'Queue', fr: 'File' }, 'beginner', true, 'beginner'),
  'circular-queue': ds('circular-queue', 'queue', 'linear', ['enqueue', 'dequeue', 'peek'], { en: 'Circular Queue', fr: 'File Circulaire' }, 'beginner', true, 'beginner'),
  deque: ds('deque', 'queue', 'linear', ['pushFront', 'pushBack', 'popFront', 'popBack'], { en: 'Deque', fr: 'Deque' }, 'beginner', true, 'beginner'),
  'priority-queue': ds('priority-queue', 'queue', 'linear', ['enqueue', 'dequeue', 'peek'], { en: 'Priority Queue', fr: 'File de Priorité' }, 'intermediate', true, 'intermediate'),
  'gap-buffer': ds('gap-buffer', 'linear', 'linear', ['insert', 'delete', 'moveGap'], { en: 'Gap Buffer', fr: 'Tampon à Trou' }, 'advanced', true, 'advanced'),
  rope: ds('rope', 'tree', 'linear', ['split', 'concat', 'index'], { en: 'Rope', fr: 'Corde' }, 'advanced', true, 'expert'),
  'xor-linked-list': ds('xor-linked-list', 'linked', 'linear', ['insertHead', 'insertTail', 'delete', 'traverse'], { en: 'XOR Linked List', fr: 'Liste Chaînée XOR' }, 'advanced', true, 'expert'),

  // ── Trees ──────────────────────────────────────────────────────────────────
  'binary-tree': ds('binary-tree', 'tree', 'tree', ['insert', 'delete', 'search', 'inorder', 'preorder', 'postorder', 'levelorder'], { en: 'Binary Tree', fr: 'Arbre Binaire' }, 'intermediate', true, 'intermediate'),
  bst: ds('bst', 'tree', 'tree', ['insert', 'delete', 'search', 'inorder', 'preorder', 'postorder', 'levelorder'], { en: 'Binary Search Tree', fr: 'Arbre Binaire de Recherche' }, 'intermediate', true, 'intermediate'),
  avl: ds('avl', 'tree', 'tree', ['insert', 'delete', 'search', 'inorder', 'preorder', 'postorder', 'levelorder'], { en: 'AVL Tree', fr: 'Arbre AVL' }, 'intermediate', true, 'intermediate'),
  'red-black-tree': ds('red-black-tree', 'tree', 'tree', ['insert', 'delete', 'search', 'inorder'], { en: 'Red-Black Tree', fr: 'Arbre Rouge-Noir' }, 'advanced', true, 'advanced'),
  'b-tree': ds('b-tree', 'tree', 'tree', ['insert', 'delete', 'search', 'inorder', 'preorder', 'postorder', 'levelorder'], { en: 'B-Tree', fr: 'Arbre B' }, 'advanced', true, 'advanced'),
  'b-plus-tree': ds('b-plus-tree', 'tree', 'tree', ['insert', 'delete', 'search', 'rangeSearch', 'leafTraversal', 'inorder', 'levelorder'], { en: 'B+ Tree', fr: 'Arbre B+' }, 'advanced', true, 'advanced'),
  'segment-tree': ds('segment-tree', 'tree', 'tree', ['build', 'query', 'update'], { en: 'Segment Tree', fr: 'Arbre de Segments' }, 'advanced', true, 'advanced'),
  'fenwick-tree': ds('fenwick-tree', 'tree', 'tree', ['build', 'query', 'update'], { en: 'Fenwick Tree', fr: 'Arbre de Fenwick' }, 'advanced', true, 'advanced'),
  trie: ds('trie', 'tree', 'tree', ['insert', 'search', 'delete', 'dfs'], { en: 'Trie', fr: 'Trie' }, 'intermediate', true, 'intermediate'),
  'min-heap': ds('min-heap', 'tree', 'tree', ['insert', 'extractMin', 'heapify'], { en: 'Min Heap', fr: 'Tas Min' }, 'intermediate', true, 'intermediate'),
  'max-heap': ds('max-heap', 'tree', 'tree', ['insert', 'extractMax', 'heapify'], { en: 'Max Heap', fr: 'Tas Max' }, 'intermediate', true, 'intermediate'),
  treap: ds('treap', 'tree', 'tree', ['insert', 'delete', 'search'], { en: 'Treap', fr: 'Treap' }, 'expert', true, 'expert'),
  'splay-tree': ds('splay-tree', 'tree', 'tree', ['insert', 'delete', 'search'], { en: 'Splay Tree', fr: 'Arbre Splay' }, 'expert', true, 'expert'),

  // ── Graphs ─────────────────────────────────────────────────────────────────
  'graph-visualizer': ds('graph-visualizer', 'graph', 'graph', ['bfs', 'dfs', 'iterativeDfs', 'dijkstra', 'bellmanFord', 'floydWarshall', 'johnson', 'aStar', 'prim', 'kruskal', 'boruvka', 'topologicalSort', 'kahn', 'scc', 'connectedComponents', 'cycleDetection', 'bridgeDetection', 'articulationPoints', 'hopcroftKarp', 'fordFulkerson', 'greedyColoring', 'welshPowell', 'eulerPath', 'hamiltonianPath'], { en: 'Graph Visualizer Engine', fr: 'Moteur de Visualisation de Graphes' }, 'advanced', true, 'advanced'),
  'directed-graph': ds('directed-graph', 'graph', 'graph', ['bfs', 'dfs', 'topologicalSort', 'scc', 'connectedComponents'], { en: 'Directed Graph', fr: 'Graphe Orienté' }, 'intermediate', true, 'intermediate'),
  'undirected-graph': ds('undirected-graph', 'graph', 'graph', ['bfs', 'dfs', 'prim', 'kruskal', 'connectedComponents'], { en: 'Undirected Graph', fr: 'Graphe Non Orienté' }, 'intermediate', true, 'intermediate'),
  'weighted-graph': ds('weighted-graph', 'graph', 'graph', ['dijkstra', 'bellmanFord', 'floydWarshall', 'prim', 'kruskal', 'aStar', 'bfs', 'dfs'], { en: 'Weighted Graph', fr: 'Graphe Pondéré' }, 'intermediate', true, 'intermediate'),
  dag: ds('dag', 'graph', 'graph', ['topologicalSort', 'bfs', 'dfs', 'dijkstra'], { en: 'DAG', fr: 'Graphe Acyclique Orienté' }, 'intermediate', true, 'intermediate'),
  'adjacency-matrix': ds('adjacency-matrix', 'graph', 'graph', ['bfs', 'dfs', 'connectedComponents'], { en: 'Adjacency Matrix', fr: 'Matrice d\'Adjacence' }, 'intermediate', true, 'intermediate'),
  'adjacency-list': ds('adjacency-list', 'graph', 'graph', ['bfs', 'dfs', 'connectedComponents'], { en: 'Adjacency List', fr: 'Liste d\'Adjacence' }, 'intermediate', true, 'intermediate'),

  // ── Hashing ────────────────────────────────────────────────────────────────
  'hash-table': ds('hash-table', 'hash', 'hash', ['insert', 'delete', 'search'], { en: 'Hash Table', fr: 'Table de Hachage' }, 'intermediate', true, 'intermediate'),
  'hash-map': ds('hash-map', 'hash', 'hash', ['insert', 'delete', 'search'], { en: 'Hash Map', fr: 'Table de Hachage Associative' }, 'intermediate', true, 'intermediate'),
  'hash-set': ds('hash-set', 'hash', 'hash', ['insert', 'delete', 'search'], { en: 'Hash Set', fr: 'Ensemble de Hachage' }, 'intermediate', true, 'intermediate'),
  'bloom-filter': ds('bloom-filter', 'hash', 'advanced', ['insert', 'search'], { en: 'Bloom Filter', fr: 'Filtre de Bloom' }, 'advanced', true, 'advanced'),

  // ── Advanced ───────────────────────────────────────────────────────────────
  'union-find': ds('union-find', 'tree', 'advanced', ['makeSet', 'union', 'find'], { en: 'Union-Find', fr: 'Union-Find' }, 'intermediate', true, 'intermediate'),
  'skip-list': ds('skip-list', 'linked', 'advanced', ['insert', 'delete', 'search'], { en: 'Skip List', fr: 'Liste Sautée' }, 'advanced', true, 'advanced'),
  'lru-cache': ds('lru-cache', 'linked', 'advanced', ['get', 'put'], { en: 'LRU Cache', fr: 'Cache LRU' }, 'advanced', true, 'advanced'),
  'suffix-tree': ds('suffix-tree', 'tree', 'advanced', ['build', 'search'], { en: 'Suffix Tree', fr: 'Arbre des Suffixes' }, 'expert', true, 'expert'),
  'suffix-array': ds('suffix-array', 'linear', 'advanced', ['build', 'search'], { en: 'Suffix Array', fr: 'Tableau des Suffixes' }, 'expert', true, 'expert'),
}

export const CATEGORIES = [
  { id: 'linear' as const, name: { en: 'Linear Structures', fr: 'Structures Linéaires' }, icon: 'List' },
  { id: 'tree' as const, name: { en: 'Tree Structures', fr: 'Structures Arborescentes' }, icon: 'GitBranch' },
  { id: 'graph' as const, name: { en: 'Graph Structures', fr: 'Structures de Graphes' }, icon: 'Share2' },
  { id: 'hash' as const, name: { en: 'Hashing Structures', fr: 'Structures de Hachage' }, icon: 'Hash' },
  { id: 'advanced' as const, name: { en: 'Advanced Structures', fr: 'Structures Avancées' }, icon: 'Sparkles' },
  { id: 'sorting' as const, name: { en: 'Sorting Algorithms', fr: 'Algorithmes de Tri' }, icon: 'ArrowUpDown' },
  { id: 'string' as const, name: { en: 'String Algorithms', fr: 'Algorithmes sur Chaînes' }, icon: 'Type' },
  { id: 'dp' as const, name: { en: 'Dynamic Programming', fr: 'Programmation Dynamique' }, icon: 'Grid3x3' },
]

export const LEARNING_PATHS = [
  {
    id: 'beginner' as const,
    name: { en: 'Beginner', fr: 'Débutant' },
    color: 'from-green-500 to-emerald-600',
    structures: ['array', 'linked-list-singly', 'stack', 'queue'],
  },
  {
    id: 'intermediate' as const,
    name: { en: 'Intermediate', fr: 'Intermédiaire' },
    color: 'from-blue-500 to-cyan-600',
    structures: ['bst', 'min-heap', 'hash-table', 'directed-graph'],
  },
  {
    id: 'advanced' as const,
    name: { en: 'Advanced', fr: 'Avancé' },
    color: 'from-violet-500 to-purple-600',
    structures: ['segment-tree', 'trie', 'red-black-tree', 'b-tree'],
  },
  {
    id: 'expert' as const,
    name: { en: 'Expert', fr: 'Expert' },
    color: 'from-orange-500 to-red-600',
    structures: ['treap', 'splay-tree', 'suffix-tree', 'bloom-filter'],
  },
]

export const SORTING_ALGORITHMS = [
  { id: 'bubble-sort', name: 'Bubble Sort', implemented: false },
  { id: 'selection-sort', name: 'Selection Sort', implemented: false },
  { id: 'insertion-sort', name: 'Insertion Sort', implemented: false },
  { id: 'merge-sort', name: 'Merge Sort', implemented: false },
  { id: 'quick-sort', name: 'Quick Sort', implemented: false },
  { id: 'heap-sort', name: 'Heap Sort', implemented: false },
  { id: 'shell-sort', name: 'Shell Sort', implemented: false },
  { id: 'counting-sort', name: 'Counting Sort', implemented: false },
  { id: 'radix-sort', name: 'Radix Sort', implemented: false },
  { id: 'bucket-sort', name: 'Bucket Sort', implemented: false },
]

export function getStructuresByCategory(categoryId: string) {
  return Object.values(DATA_STRUCTURES).filter((ds) => ds.category === categoryId)
}

export function formatStructureName(id: string): string {
  return id.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
