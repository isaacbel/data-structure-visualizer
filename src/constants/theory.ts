export interface TheoryContent {
  definition: string
  complexity: {
    access: string
    search: string
    insert: string
    delete: string
    space: string
  }
  applications: string
  advantages: string
  disadvantages: string
  history?: string
  intuition?: string
  mathematicalFoundation?: string
  comparisons?: string
  commonMistakes?: string[]
  interviewQuestions?: string[]
  optimizations?: string[]
  references?: string[]
}

export const THEORY: Record<string, Record<'en' | 'fr', TheoryContent>> = {
  array: {
    en: {
      definition: 'An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together.',
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
      applications: 'Used in implementing vectors, lists, and matrices. Essential for CPU scheduling, memory management, and image processing.',
      advantages: 'Fast access by index, simple implementation, cache-friendly due to locality of reference.',
      disadvantages: 'Fixed size in static arrays, expensive insertion/deletion due to shifting elements.',
      history: 'Static arrays were first implemented in early assembler systems and formalized by FORTRAN I in 1957, functioning as the foundational memory architecture for processing mathematical vectors.',
      intuition: 'Imagine a row of numbered lockers. If you know the index, you can jump directly to any locker immediately. Finding a specific item without knowing its index requires checking each locker one-by-one.',
      mathematicalFoundation: 'Locational offset formula:\nAddress(A[i]) = BaseAddress + i × ElementSize\nFor example, if base = 0x1000 and integer size = 4 bytes, A[3] is at address 0x100c.',
      comparisons: 'Unlike Linked Lists which allocate memory dynamically and traverse pointers, Arrays occupy contiguous blocks, resulting in O(1) random access but O(n) middle insertions.',
      commonMistakes: [
        'Off-by-one indexing errors (accessing index N on an array of size N).',
        'Confusing logical size (items filled) with physical capacity (memory allocated).',
      ],
      interviewQuestions: [
        'How do you reverse an array in-place?',
        'Implement an algorithm to find the duplicate element in a linear array.',
      ],
    },
    fr: {
      definition: 'Un tableau est une collection d\'éléments stockés dans des emplacements mémoire contigus.',
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
      applications: 'Utilisé dans l\'implémentation de vecteurs, listes et matrices.',
      advantages: 'Accès rapide par indice, implémentation simple, favorable au cache.',
      disadvantages: 'Taille fixe, insertion/suppression coûteuses.',
      history: 'Les tableaux statiques ont été popularisés par FORTRAN I en 1957 pour modéliser les calculs matriciels.',
      intuition: 'Imaginez une rangée de casiers numérotés. L\'accès est immédiat si l\'on connaît l\'indice.',
      mathematicalFoundation: 'Calcul d\'adresse :\nAdresse(A[i]) = AdresseDeBase + i × TailleDeElement',
      comparisons: 'Contrairement aux listes chaînées, le tableau offre un accès en O(1) mais les insertions nécessitent le décalage des cases suivantes.',
      commonMistakes: [
        'Erreur d\'un élément près (off-by-one) lors du bouclage.',
        'Dépassement de capacité du tableau fixe.',
      ],
      interviewQuestions: [
        'Inverser un tableau sur place.',
        'Trouver l\'élément majoritaire.',
      ],
    },
  },
  vector: {
    en: {
      definition: 'A dynamic array (vector) is a resizable array that automatically grows when elements are inserted beyond its capacity, using growth factors.',
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(1) amortized', delete: 'O(n)', space: 'O(n)' },
      applications: 'Standard dynamically-sized lists in Python (lists), C++ (std::vector), and Java (ArrayList).',
      advantages: 'O(1) access time, dynamically grows to accommodate new items.',
      disadvantages: 'Resizing operation causes O(n) worst-case delay; memory overhead due to capacity pre-allocation.',
    },
    fr: {
      definition: 'Un tableau dynamique est un tableau redimensionnable qui grandit automatiquement lorsque les éléments insérés dépassent sa capacité.',
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(1) amorti', delete: 'O(n)', space: 'O(n)' },
      applications: 'Listes de taille dynamique standard en Python, C++ et Java.',
      advantages: 'Accès en O(1), grandit dynamiquement pour accueillir de nouveaux éléments.',
      disadvantages: 'Le redimensionnement cause un délai en O(n) au pire cas ; surcoût mémoire.',
    },
  },
  'linked-list-singly': {
    en: {
      definition: 'A Singly Linked List is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Used to implement stacks, queues, hash collision chaining, and undo lists.',
      advantages: 'Dynamic size, constant-time insertions/deletions at the head.',
      disadvantages: 'O(n) search time, pointer storage overhead, lack of random access.',
    },
    fr: {
      definition: 'Une liste simplement chaînée est une structure linéaire où chaque nœud pointe vers le nœud suivant.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Utilisé pour implémenter des piles, des files, ou chaînage de collisions.',
      advantages: 'Taille dynamique, insertions/suppressions en temps constant en tête.',
      disadvantages: 'Recherche en O(n), surcoût des pointeurs, pas d\'accès aléatoire.',
    },
  },
  'linked-list-doubly': {
    en: {
      definition: 'A Doubly Linked List is a sequence of nodes where each node contains pointers to both the next and the previous nodes.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Browser history, LRU Cache implementations, and text editor buffer states.',
      advantages: 'Can be traversed in both directions, deletion is efficient when reference is known.',
      disadvantages: 'Extra memory required for back pointer, more complex pointer manipulation.',
    },
    fr: {
      definition: 'Une liste doublement chaînée possède deux pointeurs par nœud, désignant le suivant et le précédent.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Historique de navigation, implémentation de cache LRU, tampons d\'éditeurs.',
      advantages: 'Traversable dans les deux sens, suppression plus simple si le nœud est connu.',
      disadvantages: 'Pointeur additionnel gourmand en mémoire, manipulation complexe.',
    },
  },
  'linked-list-circular': {
    en: {
      definition: 'A Circular Linked List is a linked list where the last node points back to the first node, forming a closed loop.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Round-robin task scheduler, multiplayer game turn routing, and audio looping software.',
      advantages: 'Any node can be a starting point, loop traverse is native without null reference checks.',
      disadvantages: 'Endless loops occur if traversal logic is not carefully managed; search is O(n).',
    },
    fr: {
      definition: 'Une liste chaînée circulaire est une liste où le dernier nœud pointe vers le premier.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Ordonnancement Round-Robin, gestion de tours dans les jeux.',
      advantages: 'Tous les nœuds peuvent servir de départ, parcours de boucle natif.',
      disadvantages: 'Boucles infinies si la condition de sortie est mal gérée.',
    },
  },
  stack: {
    en: {
      definition: 'A stack is a Last-In, First-Out (LIFO) linear data structure where elements are inserted and removed from the same end (the top).',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Function call management (call stack), expression parsing, bracket checking, and undo/redo operations.',
      advantages: 'Simple, secure access bounds, constant time insertion/deletion.',
      disadvantages: 'No random access to elements in the middle; stack overflow risk if size is bounded.',
    },
    fr: {
      definition: 'Une pile est une structure LIFO (Dernier Entré, Premier Sorti) avec accès uniquement au sommet.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Pile d\'appels système, annuler/rétablir, évaluation d\'expressions.',
      advantages: 'Simple, accès bornés sécurisés, opérations en temps constant.',
      disadvantages: 'Pas d\'accès aléatoire aux éléments intermédiaires ; risque de débordement.',
    },
  },
  queue: {
    en: {
      definition: 'A queue is a First-In, First-Out (FIFO) linear data structure where elements are inserted at the rear (enqueue) and removed from the front (dequeue).',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Network packet buffering, print job spooling, CPU task scheduling queues, and BFS traversal.',
      advantages: 'Fair scheduling (order preserved), constant time access at endpoints.',
      disadvantages: 'No random access; static implementations suffer from queue drift (solved by circular queues).',
    },
    fr: {
      definition: 'Une file est une structure FIFO (Premier Entré, Premier Sorti) avec insertion en queue et retrait en tête.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Mémoires tampons, ordonnancement CPU, parcours en largeur (BFS).',
      advantages: 'Ordonnancement équitable, opérations en temps constant.',
      disadvantages: 'Pas d\'accès aléatoire.',
    },
  },
  'circular-queue': {
    en: {
      definition: 'A Circular Queue is a queue implementation that connects the last position back to the first position, avoiding unused memory space.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Traffic lights systems, memory rings buffers, and audio streams processing.',
      advantages: 'Reuses memory space continuously without shifts or pointer movements.',
      disadvantages: 'Requires complex modulo-arithmetic logic for boundary tracking.',
    },
    fr: {
      definition: 'Une file circulaire connecte la dernière position à la première pour éviter le gaspillage de mémoire.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Tampons annulaires de mémoire, flux audio.',
      advantages: 'Réutilisation continue de l\'espace sans décalage.',
      disadvantages: 'Nécessite des calculs modulo complexes.',
    },
  },
  deque: {
    en: {
      definition: 'A Deque (Double-Ended Queue) is a linear sequence that allows insertions and deletions at both ends.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'A-Steal work stealing scheduling, undo-redo operations combined, and sliding window algorithms.',
      advantages: 'Provides functionalities of both stacks and queues in constant time.',
      disadvantages: 'Complex storage structure (blocks of arrays linked together).',
    },
    fr: {
      definition: 'Un Deque (file à double entrée) permet des insertions et suppressions aux deux extrémités.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Ordonnancement par vol de travail, historique glissant.',
      advantages: 'Combine les avantages d\'une pile et d\'une file.',
      disadvantages: 'Structure sous-jacente complexe.',
    },
  },
  'priority-queue': {
    en: {
      definition: 'A Priority Queue is a container where elements have priorities, and dequeue extracts the highest-priority element first.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Dijkstra shortest path algorithm, Huffman coding, and operating system priority task scheduler.',
      advantages: 'Keeps items ordered dynamically for fast peak retrieval.',
      disadvantages: 'O(log n) overhead for every modification.',
    },
    fr: {
      definition: 'Une file de priorité extrait l\'élément ayant la plus haute priorité en premier.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Algorithme de Dijkstra, codage de Huffman, ordonnancement CPU.',
      advantages: 'Maintient l\'accès rapide à l\'élément le plus important.',
      disadvantages: 'Surcoût en O(log n) à chaque insertion/modification.',
    },
  },
  'gap-buffer': {
    en: {
      definition: 'A Gap Buffer is an array with an empty gap, which is shifted to the insertion point, allowing O(1) local edits.',
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(1) local', delete: 'O(1) local', space: 'O(n)' },
      applications: 'Text editors (e.g. Emacs) to handle insertions/deletions at cursor.',
      advantages: 'Fast consecutive insertion/deletion at a single focus point.',
      disadvantages: 'O(n) cost to move the cursor to a far-away point.',
    },
    fr: {
      definition: 'Un tampon à trou est un tableau contenant un espace vide déplaçable, facilitant les éditions locales en O(1).',
      complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(1) local', delete: 'O(1) local', space: 'O(n)' },
      applications: 'Éditeurs de texte (comme Emacs) pour gérer les frappes au curseur.',
      advantages: 'Insertions et suppressions consécutives rapides au point focal.',
      disadvantages: 'Déplacer le curseur loin coûte O(n) pour déplacer le trou.',
    },
  },
  rope: {
    en: {
      definition: 'A Rope is a binary tree where leaf nodes store string fragments, supporting O(log n) concatenate and split operations.',
      complexity: { access: 'O(log n)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Heavy-duty text editing software, word processors, and string buffer libraries.',
      advantages: 'O(log n) concat/split regardless of string size; no allocation of large contiguous blocks.',
      disadvantages: 'High pointer storage overhead, complex balanced traversal mechanisms.',
    },
    fr: {
      definition: 'Une corde est un arbre binaire stockant des morceaux de chaînes pour des opérations de coupe/concaténation rapides.',
      complexity: { access: 'O(log n)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Traitements de texte, manipulation de grandes chaînes.',
      advantages: 'Concaténation et coupe en O(log n) même sur des gigaoctets de texte.',
      disadvantages: 'Surcoût important lié aux pointeurs, rééquilibrage complexe.',
    },
  },
  'xor-linked-list': {
    en: {
      definition: 'An XOR Linked List is a memory-efficient doubly linked list where each node stores the XOR of previous and next pointers.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Embedded systems with extremely constrained memory requirements.',
      advantages: 'Halves memory usage of doubly linked lists by saving one pointer per node.',
      disadvantages: 'Code complexity, difficult debugging, cannot easily navigate without keeping track of previous addresses.',
    },
    fr: {
      definition: 'Une liste chaînée XOR économise de la mémoire en stockant le XOR des adresses précédente et suivante.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Systèmes embarqués aux contraintes mémoires extrêmes.',
      advantages: 'Économise la moitié des pointeurs requis pour une liste double.',
      disadvantages: 'Code très difficile à déboguer, impossibilité de naviguer au hasard.',
    },
  },
  'binary-tree': {
    en: {
      definition: 'A Binary Tree is a hierarchical structure where each node has at most two children: left and right.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
      applications: 'Expression parsers, heap structures, and hierarchical classifications.',
      advantages: 'Naturally models hierarchical relationships.',
      disadvantages: 'No ordering constraints; search requires complete O(n) traversal.',
    },
    fr: {
      definition: 'Un arbre binaire est un arbre où chaque nœud a au maximum deux enfants.',
      complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
      applications: 'Évaluation d\'expressions, hiérarchies.',
      advantages: 'Modélisation hiérarchique naturelle.',
      disadvantages: 'Pas d\'ordre inhérent ; la recherche nécessite un parcours O(n).',
    },
  },
  bst: {
    en: {
      definition: 'A Binary Search Tree is a node-based binary tree where the left subtree contains only nodes with keys lesser than the node\'s key, and the right subtree contains only nodes with keys greater.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Used in databases, file systems, 3D game engines, and expression parsers.',
      advantages: 'Efficient search, insertion, and deletion. Ordered structure allows in-order traversal.',
      disadvantages: 'Can become unbalanced, degrading to O(n). Requires balancing mechanisms.',
    },
    fr: {
      definition: 'Un arbre binaire de recherche est une structure arborescente basée sur des nœuds ordonnés.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Utilisé dans les bases de données et systèmes de fichiers.',
      advantages: 'Recherche, insertion et suppression efficaces.',
      disadvantages: 'Peut devenir déséquilibré sans mécanismes d\'équilibrage.',
    },
  },
  avl: {
    en: {
      definition: 'An AVL tree is a self-balancing binary search tree where the height difference (balance factor) between left and right subtrees is at most one.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'High-frequency read database indexing and fast in-memory map/set storage.',
      advantages: 'Guaranteed O(log n) lookups; stricter balancing than Red-Black trees (making search faster).',
      disadvantages: 'Frequent rotation overhead on writes (insertions/deletions).',
    },
    fr: {
      definition: 'Un arbre AVL est un arbre binaire de recherche auto-équilibré où les hauteurs des deux sous-arbres diffèrent d\'au plus 1.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Index de bases de données, recherches en mémoire fréquentes.',
      advantages: 'Garantit O(log n) au pire cas ; équilibrage strict optimisant la lecture.',
      disadvantages: 'Surcoût dû aux rotations fréquentes lors des écritures.',
    },
  },
  'red-black-tree': {
    en: {
      definition: 'A Red-Black tree is a self-balancing binary search tree where each node is colored red or black, satisfying balancing properties through coloring rules.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Standard library Map/Set in Java (TreeMap), C++ (std::map), and Linux kernel CFS scheduler.',
      advantages: 'Fewer rotations on insert/delete than AVL, providing better write performance.',
      disadvantages: 'Slightly unbalanced compared to AVL (path length up to 2*log n).',
    },
    fr: {
      definition: 'Un arbre rouge-noir est un arbre binaire auto-équilibré qui utilise des règles de coloration des nœuds.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Map/Set de bibliothèques standards (std::map C++, TreeMap Java).',
      advantages: 'Moins de rotations en écriture que l\'arbre AVL.',
      disadvantages: 'Hauteur maximale légèrement supérieure à celle de l\'arbre AVL.',
    },
  },
  'b-tree': {
    en: {
      definition: 'A B-Tree is a self-balancing search tree designed for storage systems. Nodes can have multiple keys and children, reducing disk access steps.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Relational database indexing (PostgreSQL, MySQL), file systems (NTFS, ext4).',
      advantages: 'Shallow tree structure minimizes expensive I/O operations from hard drives/SSDs.',
      disadvantages: 'Complex split/merge algorithms, memory waste in partially filled nodes.',
    },
    fr: {
      definition: 'Un arbre B est un arbre auto-équilibré multi-voies optimisé pour les disques durs et systèmes de fichiers.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Indexation de bases de données, systèmes NTFS et ext4.',
      advantages: 'Arbre très plat qui minimise les accès disque physiques coûteux.',
      disadvantages: 'Algorithmes de fusion/division complexes.',
    },
  },
  'b-plus-tree': {
    en: {
      definition: 'A B+ Tree is a B-Tree variant where all keys/data reside in leaf nodes, which are linked together in a list for fast range queries.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Database storage engines (InnoDB in MySQL), B-tree indexes with range filters.',
      advantages: 'Extremely efficient range traversals via leaf-level next pointers.',
      disadvantages: 'Keys are duplicated in internal nodes, consuming slightly more memory.',
    },
    fr: {
      definition: 'Un arbre B+ est une variante de l\'arbre B où toutes les valeurs sont stockées dans les feuilles chaînées entre elles.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Moteurs SQL (InnoDB), requêtes par intervalles.',
      advantages: 'Traversée séquentielle ultra-rapide grâce au chaînage des feuilles.',
      disadvantages: 'Duplication de clés dans les nœuds internes.',
    },
  },
  'segment-tree': {
    en: {
      definition: 'A Segment Tree is a binary tree used to store intervals or segments, allowing rapid range queries and updates.',
      complexity: { access: 'N/A', search: 'O(log n)', insert: 'O(log n)', delete: 'N/A', space: 'O(n)' },
      applications: 'Range sum queries, range minimum queries, and computational geometry.',
      advantages: 'Answers queries and performs point/range updates in O(log n) time.',
      disadvantages: 'Requires significant static array allocation (often 4*N space).',
    },
    fr: {
      definition: 'Un arbre de segments est un arbre binaire stockant des intervalles, utile pour des requêtes sur plage.',
      complexity: { access: 'N/A', search: 'O(log n)', insert: 'O(log n)', delete: 'N/A', space: 'O(n)' },
      applications: 'Calculs de minimum/somme sur plage (Range Queries).',
      advantages: 'Opérations de plage en O(log n) garanties.',
      disadvantages: 'Espace statique requis important (jusqu\'à 4*N).',
    },
  },
  'fenwick-tree': {
    en: {
      definition: 'A Fenwick Tree (Binary Indexed Tree) stores prefix sums in a compact array using bit manipulation of lowest set bits.',
      complexity: { access: 'N/A', search: 'O(log n)', insert: 'O(log n)', delete: 'N/A', space: 'O(n)' },
      applications: 'Cumulative frequency counts, range queries, and prefix sum calculations.',
      advantages: 'Extremely fast bitwise update/query, uses exactly N space (no pointer overhead).',
      disadvantages: 'Cannot be easily adapted for non-invertible operations (like finding maximum in dynamic ranges).',
    },
    fr: {
      definition: 'Un arbre de Fenwick est une structure compacte pour stocker les sommes de préfixes via les bits lowbit.',
      complexity: { access: 'N/A', search: 'O(log n)', insert: 'O(log n)', delete: 'N/A', space: 'O(n)' },
      applications: 'Calculs de fréquences cumulées, sommes partielles dynamiques.',
      advantages: 'Opérations binaires ultra-rapides, requiert exactement N cellules (zéro surcoût pointeur).',
      disadvantages: 'Difficile de gérer des requêtes non réversibles (comme le maximum).',
    },
  },
  trie: {
    en: {
      definition: 'A Trie (Prefix Tree) is an ordered tree where keys are search strings and edges represent characters, sharing prefixes.',
      complexity: { access: 'N/A', search: 'O(k)', insert: 'O(k)', delete: 'O(k)', space: 'O(k * N)' },
      applications: 'Autocomplete systems, search engine suggestions, spell checkers, and routing lookups.',
      advantages: 'Fastest string search (O(k) where k is word length), handles prefix searches natively.',
      disadvantages: 'Large memory footprint due to multiple branch pointers at each level.',
    },
    fr: {
      definition: 'Un Trie (arbre de préfixes) stocke des chaînes de caractères en partageant les chemins communs.',
      complexity: { access: 'N/A', search: 'O(k)', insert: 'O(k)', delete: 'O(k)', space: 'O(k * N)' },
      applications: 'Autocomplétion, vérificateurs d\'orthographe, dictionnaire de préfixes.',
      advantages: 'Recherche indépendante du nombre d\'éléments (dépend uniquement de la taille du mot K).',
      disadvantages: 'Consommation de mémoire élevée.',
    },
  },
  'min-heap': {
    en: {
      definition: 'A Min Heap is a complete binary tree where the parent node has a value smaller than or equal to its children.',
      complexity: { access: 'O(1) peak', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Priority queue, heapsort, and Prim\'s/Dijkstra\'s algorithms.',
      advantages: 'Instant O(1) access to minimum key.',
      disadvantages: 'Slow search for arbitrary elements.',
    },
    fr: {
      definition: 'Un tas minimum est un arbre binaire complet où le parent est plus petit ou égal à ses enfants.',
      complexity: { access: 'O(1) sommet', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Files de priorité, algorithmes de tri (HeapSort).',
      advantages: 'Accès immédiat en O(1) au minimum.',
      disadvantages: 'Recherche d\'un élément arbitraire lente (O(n)).',
    },
  },
  'max-heap': {
    en: {
      definition: 'A Max Heap is a complete binary tree where the parent node has a value greater than or equal to its children.',
      complexity: { access: 'O(1) peak', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Priority queue, heapsort, and scheduling tasks.',
      advantages: 'Instant O(1) access to maximum key.',
      disadvantages: 'Slow search for arbitrary elements.',
    },
    fr: {
      definition: 'Un tas maximum est un arbre binaire complet où le parent est plus grand ou égal à ses enfants.',
      complexity: { access: 'O(1) sommet', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Files de priorité, ordonnancement.',
      advantages: 'Accès immédiat en O(1) au maximum.',
      disadvantages: 'Recherche d\'un élément arbitraire lente.',
    },
  },
  treap: {
    en: {
      definition: 'A Treap is a randomized binary search tree combining BST keys with Max-Heap priorities to ensure O(log n) expected height.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Randomized query structures, priority-indexed sets.',
      advantages: 'Extremely simple to implement compared to Red-Black or AVL trees.',
      disadvantages: 'O(log n) guarantees are probabilistic, not absolute.',
    },
    fr: {
      definition: 'Un Treap combine la recherche d\'un BST avec les priorités d\'un tas pour assurer une hauteur équilibrée probabiliste.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Structures de recherche basées sur le hasard.',
      advantages: 'Très simple à implémenter par rapport aux arbres AVL ou Rouge-Noir.',
      disadvantages: 'Les garanties de temps en O(log n) sont probabilistes.',
    },
  },
  'splay-tree': {
    en: {
      definition: 'A Splay Tree is a self-adjusting search tree that rotates recently accessed nodes to the root (splaying), optimizing for temporal locality.',
      complexity: { access: 'O(log n) amortized', search: 'O(log n) amortized', insert: 'O(log n) amortized', delete: 'O(log n) amortized', space: 'O(n)' },
      applications: 'Caching libraries, routers routing tables, GC tracking memory blocks.',
      advantages: 'Excellent performance for cached/repeated keys (locality of reference).',
      disadvantages: 'Worst-case tree depth is O(n), rendering it slow for sequential range scans.',
    },
    fr: {
      definition: 'Un arbre splay remonte à chaque accès le nœud visité en racine afin de simplifier les futurs accès (localité temporelle).',
      complexity: { access: 'O(log n) amorti', search: 'O(log n) amorti', insert: 'O(log n) amorti', delete: 'O(log n) amorti', space: 'O(n)' },
      applications: 'Implémentation de caches, tables de routage.',
      advantages: 'Excellent pour la localité temporelle (éléments répétés).',
      disadvantages: 'Pire cas en O(n) si les accès sont strictement séquentiels.',
    },
  },
  'directed-graph': {
    en: {
      definition: 'A Graph is a non-linear data structure consisting of nodes (vertices) and edges representing relationships. Graphs can be directed or undirected, weighted or unweighted.',
      complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
      applications: 'Used in social networks, GPS navigation, network routing, and recommendation engines.',
      advantages: 'Flexible representation of relationships. Can model complex real-world scenarios.',
      disadvantages: 'Can be memory intensive. Traversal algorithms can be complex.',
    },
    fr: {
      definition: 'Un graphe est une structure non linéaire constituée de sommets et d\'arêtes.',
      complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
      applications: 'Réseaux sociaux, navigation GPS, routage réseau.',
      advantages: 'Représentation flexible des relations.',
      disadvantages: 'Gourmand en mémoire pour les grands graphes.',
    },
  },
  'undirected-graph': {
    en: {
      definition: 'An Undirected Graph consists of vertices where edges are bidirectional and symmetric.',
      complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
      applications: 'Peer-to-peer connections, maps connectivity, and structural components layout.',
      advantages: 'Simple representation of symmetric relationships.',
      disadvantages: 'Cycle detection requires tracking visited status.',
    },
    fr: {
      definition: 'Un graphe non orienté possède des arêtes bidirectionnelles symétriques.',
      complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
      applications: 'Réseaux P2P, cartes routières bidirectionnelles.',
      advantages: 'Modélisation simple des relations bidirectionnelles.',
      disadvantages: 'Détection de cycles obligatoire pour les parcours.',
    },
  },
  'weighted-graph': {
    en: {
      definition: 'A Weighted Graph associates costs or weights with edges, commonly used in navigation and routing calculations.',
      complexity: { access: 'O(1)', search: 'O(V log V + E)', insert: 'O(1)', delete: 'O(E)', space: 'O(V+E)' },
      applications: 'Google Maps navigation, cost flow optimizer, flight routing systems.',
      advantages: 'Calculates true shortest paths based on physical metrics.',
      disadvantages: 'Highly complex algorithms (Dijkstra, Bellman-Ford).',
    },
    fr: {
      definition: 'Un graphe pondéré associe un coût ou un poids à chaque arête, servant dans les calculs d\'itinéraires.',
      complexity: { access: 'O(1)', search: 'O(V log V + E)', insert: 'O(1)', delete: 'O(E)', space: 'O(V+E)' },
      applications: 'Navigation GPS (Google Maps), routage aérien.',
      advantages: 'Permet de calculer le chemin optimal réel.',
      disadvantages: 'Algorithmes complexes (Dijkstra, Floyd-Warshall).',
    },
  },
  dag: {
    en: {
      definition: 'A Directed Acyclic Graph (DAG) is a directed graph containing no cycles, supporting topological sorting.',
      complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(E)', space: 'O(V+E)' },
      applications: 'Task dependency graphs (make, compilers), git commit trees, and package managers (npm dependency tree).',
      advantages: 'Always solvable order for dependencies (Topological sort).',
      disadvantages: 'Any cycle breaks the DAG properties.',
    },
    fr: {
      definition: 'Un graphe orienté acyclique (DAG) est un graphe orienté sans aucun cycle.',
      complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(E)', space: 'O(V+E)' },
      applications: 'Gestion de dépendances (npm, make, gradle), branches git.',
      advantages: 'Ordonnancement garanti par tri topologique.',
      disadvantages: 'L\'introduction accidentelle de cycle invalide toute la structure.',
    },
  },
  'adjacency-matrix': {
    en: {
      definition: 'An Adjacency Matrix is a 2D array representation of a graph where cells indicate edge presence/weight.',
      complexity: { access: 'O(1) edge check', search: 'O(V^2)', insert: 'O(1)', delete: 'O(1)', space: 'O(V^2)' },
      applications: 'Dense graphs processing, hardware routing tables.',
      advantages: 'Constant time edge queries (is V1 connected to V2?).',
      disadvantages: 'Consumes O(V^2) memory regardless of edge density.',
    },
    fr: {
      definition: 'Une matrice d\'adjacence est un tableau 2D représentant la présence d\'arêtes.',
      complexity: { access: 'O(1)', search: 'O(V^2)', insert: 'O(1)', delete: 'O(1)', space: 'O(V^2)' },
      applications: 'Traitement de graphes très denses.',
      advantages: 'Requête immédiate en O(1) de la présence d\'une arête.',
      disadvantages: 'Consommation mémoire quadratique inévitable.',
    },
  },
  'adjacency-list': {
    en: {
      definition: 'An Adjacency List represents a graph as an array of linked lists, indicating the outgoing edges of each vertex.',
      complexity: { access: 'O(V) edge check', search: 'O(V+E)', insert: 'O(1)', delete: 'O(E)', space: 'O(V+E)' },
      applications: 'Sparse graphs processing, social networks connections modeling.',
      advantages: 'Memory efficient for sparse graphs (most real-world graphs).',
      disadvantages: 'Slow edge queries (requires scanning lists).',
    },
    fr: {
      definition: 'Une liste d\'adjacence représente le graphe comme un tableau de listes chaînées.',
      complexity: { access: 'O(V)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(E)', space: 'O(V+E)' },
      applications: 'Graphes peu denses (la majorité des réseaux réels).',
      advantages: 'Économe en mémoire.',
      disadvantages: 'Recherche d\'arête lente.',
    },
  },
  'hash-table': {
    en: {
      definition: 'A hash table is a data structure that implements an associative array using a hash function to compute an index into an array of buckets.',
      complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Database indexing, caches, symbol tables, and deduplication.',
      advantages: 'Average O(1) operations. Very fast lookups.',
      disadvantages: 'Collisions require handling. Worst case O(n) with poor hash functions.',
    },
    fr: {
      definition: 'Une table de hachage utilise une fonction de hachage pour mapper des clés à des indices.',
      complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Indexation de bases de données, caches, tables de symboles.',
      advantages: 'Opérations en O(1) en moyenne.',
      disadvantages: 'Collisions et pire cas O(n).',
    },
  },
  'hash-map': {
    en: {
      definition: 'A Hash Map is an associative key-value store using hashed lookup values.',
      complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Dictionary mappings, configs caching, and objects properties collection.',
      advantages: 'Extremely fast insertion/retrieval by unique keys.',
      disadvantages: 'Requires collision resolution strategies, unordered.',
    },
    fr: {
      definition: 'Un Hash Map associe des couples clé-valeur via hachage.',
      complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Dictionnaires clés/valeurs, tables d\'attributs.',
      advantages: 'Recherche directe et insertion rapide.',
      disadvantages: 'Non trié par défaut, nécessite la gestion des collisions.',
    },
  },
  'hash-set': {
    en: {
      definition: 'A Hash Set stores unique items using a hash table under the hood to ensure uniqueness.',
      complexity: { access: 'N/A', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Deduplication, membership testing, and sets mathematical operations.',
      advantages: 'Guarantees uniqueness of items automatically in O(1) time.',
      disadvantages: 'No ordering guarantees, memory overhead for empty cells.',
    },
    fr: {
      definition: 'Un Hash Set stocke des éléments uniques en utilisant une table de hachage.',
      complexity: { access: 'N/A', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
      applications: 'Déduplication de données, test d\'appartenance.',
      advantages: 'Assure l\'unicité des clés en temps constant.',
      disadvantages: 'Perte de l\'ordre d\'insertion.',
    },
  },
  'bloom-filter': {
    en: {
      definition: 'A Bloom Filter is a space-efficient probabilistic data structure used to test if an element is a member of a set, allowing false positives but never false negatives.',
      complexity: { access: 'N/A', search: 'O(k)', insert: 'O(k)', delete: 'N/A', space: 'O(m)' },
      applications: 'Web browsers malformed URL checker, database query filters (avoiding expensive disk queries).',
      advantages: 'Near-zero memory footprint; absolute certainty when an item is NOT in the set.',
      disadvantages: 'False positives can occur; items cannot be deleted from a standard Bloom filter.',
    },
    fr: {
      definition: 'Un filtre de Bloom est une structure probabiliste économe en mémoire pour tester l\'appartenance d\'un élément.',
      complexity: { access: 'N/A', search: 'O(k)', insert: 'O(k)', delete: 'N/A', space: 'O(m)' },
      applications: 'Détection d\'URL malveillantes, filtrage d\'accès disque BDD.',
      advantages: 'Économie de mémoire phénoménale, certitude absolue pour le non-appartenance.',
      disadvantages: 'Faux positifs possibles ; suppression impossible sans filtre de Bloom comptable.',
    },
  },
  'union-find': {
    en: {
      definition: 'A Disjoint-Set (Union-Find) maintains partition of elements into disjoint groups, supporting Union and Find operations.',
      complexity: { access: 'N/A', search: 'O(α(n))', insert: 'O(1)', delete: 'N/A', space: 'O(n)' },
      applications: 'Kruskal\'s MST algorithm, cycle detection in graphs, and image segmentation.',
      advantages: 'Almost constant-time operations using path compression and union by rank (α(n) is Inverse Ackermann).',
      disadvantages: 'Only models set partitions; cannot easily retrieve individual elements.',
    },
    fr: {
      definition: 'L\'Union-Find (partition de sous-ensembles) gère des groupes disjoints d\'éléments.',
      complexity: { access: 'N/A', search: 'O(α(n))', insert: 'O(1)', delete: 'N/A', space: 'O(n)' },
      applications: 'Algorithme de Kruskal, détection de cycle, partitionnement.',
      advantages: 'Opérations en temps quasi constant grâce à la compression de chemin (fonction inverse d\'Ackermann).',
      disadvantages: 'Limité aux partitions ; recherche d\'éléments transverses non optimisée.',
    },
  },
  'skip-list': {
    en: {
      definition: 'A Skip List is a probabilistic data structure that builds multiple layers of linked lists, allowing O(log n) search/insert.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Redis sorted sets, LevelDB storage engine indexing, and concurrent maps.',
      advantages: 'Simpler lock-free concurrent implementation than balanced trees.',
      disadvantages: 'Relies on random coin flips; worst case can degrade to O(n) (though extremely rare).',
    },
    fr: {
      definition: 'Une liste sautée est une structure probabiliste superposant plusieurs listes triées pour accélérer les recherches.',
      complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
      applications: 'Dictionnaires ordonnés (Redis), bases de données NoSQL.',
      advantages: 'Facile à implémenter de façon asynchrone concurrente par rapport aux arbres AVL/Rouge-Noir.',
      disadvantages: 'Aléatoire ; s\'il y a mauvaise répartition des sauts, dégradation en O(n) possible.',
    },
  },
  'lru-cache': {
    en: {
      definition: 'An LRU (Least Recently Used) cache discards the least recently used items first when capacity is exceeded, combining a Doubly Linked List and a Hash Map.',
      complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(c)' },
      applications: 'Web caching systems, CPU caches, buffer pools, and virtual memory page replacement.',
      advantages: 'Constant O(1) operations for retrieval and insertion; ideal cache replacement policy.',
      disadvantages: 'High memory overhead due to both pointer list and map storage.',
    },
    fr: {
      definition: 'Un cache LRU (Dernier Récemment Utilisé) supprime d\'abord les éléments les plus anciens lorsque la capacité maximale est atteinte.',
      complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(c)' },
      applications: 'Caches web, mémoire virtuelle, tampons de requêtes.',
      advantages: 'Opérations en O(1) ; éviction pertinente basée sur l\'usage.',
      disadvantages: 'Surcoût mémoire élevé (stockage doublement chaîné + table de hachage).',
    },
  },
  'suffix-tree': {
    en: {
      definition: 'A Suffix Tree is a compressed trie containing all the suffixes of a given text, enabling O(m) substring searches.',
      complexity: { access: 'N/A', search: 'O(m)', insert: 'O(n) build', delete: 'N/A', space: 'O(n)' },
      applications: 'DNA sequencing, plagiarism checkers, bioinformatics, and pattern matching.',
      advantages: 'Locates any pattern of length M in O(M) time, independent of corpus size.',
      disadvantages: 'Extremely high memory footprint (solved practically by suffix arrays).',
    },
    fr: {
      definition: 'Un arbre des suffixes est un trie compressé contenant tous les suffixes d\'un texte.',
      complexity: { access: 'N/A', search: 'O(m)', insert: 'O(n) construction', delete: 'N/A', space: 'O(n)' },
      applications: 'Séquençage ADN, bioinformatique, détection de plagiat.',
      advantages: 'Recherche de motif en O(M) où M est la longueur du motif, peu importe la taille du texte.',
      disadvantages: 'Structure très consommatrice de mémoire.',
    },
  },
  'suffix-array': {
    en: {
      definition: 'A Suffix Array is a sorted array of all suffixes of a string, offering a memory-efficient alternative to Suffix Trees.',
      complexity: { access: 'N/A', search: 'O(m log n)', insert: 'O(n log n) build', delete: 'N/A', space: 'O(n)' },
      applications: 'Bioinformatics, text compression algorithms, and full-text indexation.',
      advantages: 'Consumes significantly less space than Suffix Trees (usually 4x to 10x less).',
      disadvantages: 'Search is slightly slower than Suffix Trees (O(m log n) or O(m) with LCP auxiliary array).',
    },
    fr: {
      definition: 'Un tableau des suffixes contient les indices de tous les suffixes d\'un texte, triés par ordre alphabétique.',
      complexity: { access: 'N/A', search: 'O(m log n)', insert: 'O(n log n) construction', delete: 'N/A', space: 'O(n)' },
      applications: 'Indexation de texte brut, compression BWT (Barrows-Wheeler).',
      advantages: 'Beaucoup plus compact qu\'un arbre des suffixes.',
      disadvantages: 'Recherche légèrement moins rapide (O(m log n)).',
    },
  },
}

export function defaultTheory(name: string): Record<'en' | 'fr', TheoryContent> {
  const make = (lang: 'en' | 'fr') => ({
    definition:
      lang === 'en'
        ? `${name} is a fundamental data structure in computer science.`
        : `${name} est une structure de données fondamentale en informatique.`,
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
    applications:
      lang === 'en'
        ? 'Widely used in software engineering and algorithm design.'
        : 'Largement utilisé en génie logiciel.',
    advantages: lang === 'en' ? 'Efficient for specific use cases.' : 'Efficace pour des cas spécifiques.',
    disadvantages: lang === 'en' ? 'Trade-offs in time and space complexity.' : 'Compromis temporels et spatiaux.',
  })
  return { en: make('en'), fr: make('fr') }
}
