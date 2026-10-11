import type { QuizQuestion } from '@/types/quiz'
import { q } from './types'

export const GRAPH_QUIZZES: QuizQuestion[] = [
  // ── BFS & DFS ─────────────────────────────────────────────────────────────
  q(
    'bfs-data-structure', 'graph-visualizer', 'beginner', 'concepts', 'bfs',
    'Which fundamental data structure is used to manage the order of node visits in Breadth-First Search (BFS)?',
    "Quelle structure de données fondamentale est utilisée pour gérer l'ordre de visite des nœuds dans un Parcours en Largeur (BFS) ?",
    ['Queue (FIFO)', 'Stack (LIFO)', 'Priority Queue / Heap', 'Hash Table'],
    ['File / Queue (FIFO)', 'Pile / Stack (LIFO)', 'File de Priorité / Tas', 'Table de Hachage'],
    0,
    'BFS uses a Queue to explore graph vertices level-by-level in FIFO (First-In, First-Out) order.',
    "Le parcours BFS utilise une File (Queue) pour explorer le graphe niveau par niveau selon le principe FIFO.",
    'Level-by-level exploration requires FIFO.', 'L\'exploration niveau par niveau nécessite le principe FIFO.'
  ),
  q(
    'dfs-data-structure', 'graph-visualizer', 'beginner', 'concepts', 'dfs',
    'Which data structure (or execution structure) underlies Depth-First Search (DFS)?',
    "Quelle structure de données (ou de pile d'appel) sous-tend le Parcours en Profondeur (DFS) ?",
    ['Stack (LIFO / Call Stack)', 'Queue (FIFO)', 'Binary Min-Heap', 'Disjoint-Set Union'],
    ['Pile / Stack (LIFO / Pile d\'appel)', 'File / Queue (FIFO)', 'Tas Min Binaire', 'Union-Find'],
    0,
    'DFS explores as deep as possible along each branch before backtracking, naturally backed by a Stack (explicit or recursive call stack).',
    "Le parcours DFS s'enfonce au plus profond de chaque branche avant de revenir en arrière (backtracking), s'appuyant sur une Pile.",
    'Backtracking relies on LIFO evaluation.', 'Le retour en arrière s\'appuie sur une pile LIFO.'
  ),

  // ── Shortest Paths ─────────────────────────────────────────────────────────
  q(
    'dijkstra-edge-weights', 'graph-visualizer', 'intermediate', 'concepts', 'dijkstra',
    'What key constraint must be satisfied by edge weights for Dijkstra algorithm to guarantee correct shortest paths?',
    "Quelle contrainte majeure doit être respectée par les poids des arêtes pour que l'algorithme de Dijkstra garantisse le plus court chemin ?",
    ['All edge weights must be non-negative (weight ≥ 0)', 'Graph must be a Tree', 'Graph must be unweighted', 'No cycles can exist'],
    ['Tous les poids des arêtes doivent être non négatifs (poids ≥ 0)', 'Le graphe doit être un Arbre', 'Le graphe doit être non pondéré', 'Aucun cycle ne doit exister'],
    0,
    'Dijkstra assumes greedily that finalized shortest distances never decrease. Negative edge weights violate this assumption and require Bellman-Ford.',
    "Dijkstra suppose que les distances validées ne peuvent plus diminuer. Des poids négatifs violent cette hypothèse, nécessitant Bellman-Ford.",
    'Negative weights break greedy choice property.', 'Les poids négatifs détruisent le choix glouton.'
  ),
  q(
    'bellman-ford-negative-cycles', 'graph-visualizer', 'advanced', 'operations', 'bellmanFord',
    'How does Bellman-Ford detect the presence of a negative-weight cycle in a graph of V vertices?',
    "Comment Bellman-Ford détecte-t-il la présence d'un cycle de poids négatif dans un graphe de V sommets ?",
    ['If any distance can still be relaxed on the V-th iteration', 'If queue becomes empty', 'If all edges have negative weights', 'By counting visited nodes'],
    ['Si une distance peut encore être réduite lors de la V-ième itération', 'Si la file devient vide', 'Si toutes les arêtes ont des poids négatifs', 'En comptant les sommets'],
    0,
    'Relaxation runs for V-1 passes. If an edge can STILL be relaxed on pass V, a negative-weight cycle exists because distance keeps decreasing infinitely.',
    "La relaxation s'exécute V-1 fois. Si une arête peut ENCORE être relaxée lors de la V-ième passe, il existe un cycle de poids négatif.",
    'V-1 relaxations suffice for simple paths.', 'V-1 relaxations suffisent pour les chemins simples.'
  ),
  q(
    'floyd-warshall-complexity', 'graph-visualizer', 'advanced', 'complexity', 'floydWarshall',
    'What is the time complexity of the Floyd-Warshall All-Pairs Shortest Path algorithm for V vertices?',
    "Quelle est la complexité temporelle de l'algorithme de Floyd-Warshall (plus courts chemins tous couples) pour V sommets ?",
    ['O(V³)', 'O(V²)', 'O(V · E)', 'O(V + E)'],
    ['O(V³)', 'O(V²)', 'O(V · E)', 'O(V + E)'],
    0,
    'Floyd-Warshall uses 3 nested loops over intermediate node k, source i, and destination j, yielding O(V³) time complexity.',
    "Floyd-Warshall utilise 3 boucles imbriquées sur le sommet intermédiaire k, la source i et la destination j, soit O(V³).",
    'Three nested loops over all vertices.', 'Trois boucles imbriquées sur tous les sommets.'
  ),

  // ── Minimum Spanning Tree ──────────────────────────────────────────────────
  q(
    'mst-kruskal-dsu', 'graph-visualizer', 'intermediate', 'operations', 'kruskal',
    'Which auxiliary data structure enables Kruskal algorithm to detect cycles efficiently when adding candidate MST edges?',
    "Quelle structure de données auxiliaire permet à l'algorithme de Kruskal de détecter efficacement les cycles lors de l'ajout d'arêtes ?",
    ['Disjoint-Set Union (Union-Find / DSU)', 'Binary Search Tree', 'Hash Map', 'Stack'],
    ['Union-Find (Ensemble Disjoint / DSU)', 'Arbre Binaire de Recherche', 'Table de Hachage', 'Pile'],
    0,
    'Kruskal sorts edges by weight and uses Union-Find (DSU) to check in near O(1) time if edge endpoints belong to the same component.',
    "Kruskal trie les arêtes et utilise Union-Find pour vérifier en temps quasi O(1) si les extrémités de l'arête sont déjà connectées.",
    'Union-Find tracks connected components.', 'Union-Find suit les composantes connexes.'
  ),
  q(
    'mst-prim-greedy', 'graph-visualizer', 'intermediate', 'concepts', 'prim',
    'How does Prim algorithm select the next edge to add to the growing Minimum Spanning Tree?',
    "Comment l'algorithme de Prim sélectionne-t-il la prochaine arête à ajouter au Tas d'Arbre Couvrant Minimum (MST) ?",
    ['Picks minimum weight edge connecting a visited vertex to an unvisited vertex', 'Picks the absolute smallest edge in entire graph', 'Picks a random edge', 'Picks longest edge without cycles'],
    ['Sélectionne l\'arête de poids minimum reliant un sommet visité à un sommet non visité', 'Prend la plus petite arête globale', 'Prend une arête aléatoire', 'Prend l\'arête la plus longue'],
    0,
    'Prim grows a single connected tree component by greedily adding the cheapest cut edge extending from tree vertices to non-tree vertices.',
    "Prim étend un arbre unique en choisissant à chaque étape l'arête la moins chère reliant le sous-arbre existant à un sommet non encore visité.",
    'Greedy choice on the cut boundary.', 'Choix glouton sur la frontière de coupure.'
  ),

  // ── Topological Sort & SCC ─────────────────────────────────────────────────
  q(
    'topological-sort-dag', 'graph-visualizer', 'intermediate', 'concepts', 'topologicalSort',
    'Which type of graph can be validly ordered by Topological Sorting?',
    "Quel type de graphe peut être ordonné par un Tri Topologique ?",
    ['Directed Acyclic Graph (DAG)', 'Undirected Graph with cycles', 'Weighted Complete Graph', 'Bipartite Graph with odd cycles'],
    ['Graphe Orienté Acyclique (DAG)', 'Graphe Non Orienté avec cycles', 'Graphe Complet Pondéré', 'Graphe Bipartie avec cycles'],
    0,
    'Topological Sort produces a linear ordering of vertices such that for every directed edge u -> v, u comes before v. This requires a DAG.',
    "Le tri topologique ordonne les sommets d'un graphe orienté sans aucun cycle (DAG).",
    'Cycles prevent valid linear precedence ordering.', 'Les cycles empêchent un ordre de préséance valide.'
  ),
]
