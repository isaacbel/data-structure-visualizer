#!/usr/bin/env node
'use strict'

/**
 * populate-theory.cjs
 * Generates a complete, educational-grade theory library for all 42 data structures.
 * Writes to: src/constants/theoryExpanded.ts
 */

const fs   = require('fs')
const path = require('path')
const OUT  = path.resolve(__dirname, '../src/constants/theoryExpanded.ts')

// ─── Helper ──────────────────────────────────────────────────────────────────
const e = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')

// ─── Rich Theory Data ─────────────────────────────────────────────────────────
const RICH = {

  // ═══════════════════════════════════════════════════════════════════════════
  'array': {
    definition: `An array is the most fundamental data structure in computer science — a fixed-size, ordered collection of elements stored at contiguous memory addresses. Each element is identified by a numeric index starting from zero. Because all elements are packed together sequentially, the processor can compute the exact memory address of any element in a single arithmetic operation: Address(A[i]) = BaseAddress + (i × ElementSize). This makes arrays the fastest possible data structure for random access.`,
    history: `Arrays emerged directly from the organization of magnetic core memory in early digital computers (1950s). FORTRAN I (1957) was the first high-level language to expose arrays as a first-class language construct, calling them "subscripted variables" for scientific computation. C (1972) unified arrays with pointer arithmetic, establishing the model still used today. Modern CPUs feature L1/L2/L3 cache hierarchies specifically optimized for the sequential access pattern that arrays produce naturally.`,
    intuition: `Imagine a row of identical numbered mailboxes in an apartment building. You know the building address (base address) and each mailbox is the same size. To reach mailbox 42, you don't walk past mailboxes 0 through 41 — you calculate the exact position and go directly there. That is O(1) random access. Finding a specific letter without knowing which mailbox it's in requires checking each one: O(n) linear search.`,
    mathematicalFoundation: `Address formula:\n  A[i] = BaseAddress + i × sizeof(T)\n\nFor a 2D array A[m][n]:\n  Row-major:    A[i][j] = Base + (i×n + j) × sizeof(T)\n  Column-major: A[i][j] = Base + (j×m + i) × sizeof(T)\n\nTotal memory: n × sizeof(T) bytes\nAccess complexity derivation: Single multiplication + addition = O(1) independent of n`,
    applications: `Arrays power virtually every program ever written. Image pixels are 2D arrays of RGB values. Audio samples are 1D float arrays. Database column stores use arrays for cache-efficient column scans. CPU instruction pipelines use arrays (instruction queues). Graphics card vertex buffers are GPU arrays. Video game tile maps are 2D arrays. Machine learning tensors are multi-dimensional arrays. DNS routing tables are sorted arrays with binary search.`,
    advantages: `O(1) random access by index makes arrays unbeatable for indexed lookups. Cache efficiency is exceptional — accessing A[i] brings A[i+1] into cache automatically (spatial locality), making sequential traversal up to 10× faster than pointer-based structures. Simplest possible implementation. No pointer overhead — pure data. Supports binary search in O(log n) when sorted. The foundation for vectors, matrices, heaps, hash tables, and stacks.`,
    disadvantages: `Static arrays have fixed size at allocation time — you must know the maximum size in advance. Inserting or deleting a middle element requires shifting all subsequent elements: O(n) time. Resizing requires allocating a new block and copying: O(n) time. Fixed-size arrays risk overflow. Multidimensional arrays can consume enormous memory. No inherent ordering maintenance — sorting requires O(n log n).`,
    comparisons: `Array vs Linked List: Arrays win on access speed (O(1) vs O(n)) and cache efficiency. Linked Lists win on insertion/deletion without shifting and dynamic growth without reallocation. Array vs Hash Table: Arrays require numeric integer keys; hash tables handle any key type. Arrays preserve insertion order; hash tables typically do not. Array vs Dynamic Array: Static arrays are faster (no capacity checks) but unsafe; dynamic arrays trade a small overhead for safety and elasticity.`,
    commonMistakes: [
      'Off-by-one error: accessing index N on an array of size N (valid indices: 0 to N-1).',
      'Confusing the logical size (number of elements used) with physical capacity (allocated memory).',
      'Assuming array assignment copies the data — in C/Java/Python, assignment copies the reference/pointer.',
      'Nested loop O(n²) when a hash table would achieve O(n).',
      'Reading uninitialized memory in C/C++ arrays (undefined behavior).',
      'Stack overflow from very large arrays declared on the stack — declare on the heap instead.',
    ],
    interviewQuestions: [
      'Reverse an array in-place in O(n) time and O(1) space.',
      'Find the maximum subarray sum (Kadane\'s Algorithm).',
      'Rotate an array by k positions to the right.',
      'Find two numbers in a sorted array that sum to a target (Two Pointer technique).',
      'Merge two sorted arrays into a single sorted array in O(m+n) time.',
      'Find the first missing positive integer in an unsorted array.',
      'Given an array of stock prices, find the maximum profit from one buy-sell.',
      'Implement binary search on a sorted array.',
      'Find the majority element (appears more than n/2 times) using Boyer-Moore voting.',
      'Trap rainwater: given height bars, compute how much water is trapped.',
    ],
    optimizations: [
      'Use SIMD (AVX/SSE) vectorized operations for bulk numeric computation on arrays.',
      'For cache-friendly 2D traversal, iterate row-major (C-order) not column-major.',
      'Prefer arrays of structs (AoS) for small structs; prefer struct of arrays (SoA) for SIMD.',
      'Use sentinel values at array boundaries to eliminate boundary checks in inner loops.',
      'Pre-sort arrays to enable O(log n) binary search instead of O(n) linear scan.',
    ],
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'bst': {
    definition: `A Binary Search Tree (BST) is a rooted binary tree satisfying the BST property: for every node N, all keys in N's left subtree are strictly less than N's key, and all keys in N's right subtree are strictly greater. This ordering invariant allows binary elimination of half the search space at each step, yielding O(log n) average-case operations. BSTs directly model the binary search algorithm applied to a dynamic, pointer-linked structure.`,
    history: `The concept of maintaining sorted trees for fast lookup was developed concurrently by several researchers in the late 1950s. P.F. Windley, A.D. Booth, A.J.T. Colin, and T.N. Hibbard all contributed foundational papers between 1960–1962. The deletion algorithm — the trickiest operation — was analyzed rigorously by Hibbard (1962) and Knuth in TAOCP Vol. 3 (1973). BSTs became the foundation for all later self-balancing tree variants (AVL, Red-Black, B-Tree).`,
    intuition: `Imagine a phonebook organized as a tree. The middle page is the root. Every page to the left has names alphabetically before it; every page to the right comes after. To find "Smith", you open the middle — if it's before Smith you go right, if after you go left. Each comparison halves the remaining search space. In a perfectly balanced tree of 1 million nodes, you need at most 20 comparisons.`,
    mathematicalFoundation: `BST height h determines operation complexity:\n  Best case (perfect balance): h = floor(log₂ n)\n  Average case (random insertion): h ≈ 2.77 log₂ n (Robson, 1979)\n  Worst case (sorted insertion): h = n − 1 (degenerates to linked list)\n\nIn-order traversal visits keys in sorted ascending order.\nThe number of BSTs with n keys = Catalan number C(n) = (2n)! / ((n+1)! × n!)`,
    applications: `Database indexing (when balanced). Symbol tables in compilers — variable name → type/address mapping. C++ std::map and std::set (Red-Black Tree variant). Java TreeMap and TreeSet. File system directory trees. Auto-complete and spelling correction (sorted key traversal). Router prefix matching. Game object spatial partitioning.`,
    advantages: `Dynamic data structure — elements can be inserted/deleted without reallocation. Maintains sorted order automatically — in-order traversal produces sorted sequence. O(log n) average case for all major operations. Supports floor/ceil/predecessor/successor queries efficiently. Can serve as a priority queue. In-order traversal is O(n) for full sort.`,
    disadvantages: `No balancing guarantee — inserting sorted data produces a degenerate O(n) list. In the worst case (sorted or reverse-sorted input), all operations become O(n). No random access by index — to find the kth element you must traverse. Extra memory per node for two child pointers. Cache performance worse than arrays due to pointer chasing.`,
    comparisons: `BST vs AVL Tree: AVL always stays balanced (O(log n) guaranteed) but requires more rotations on writes. BST is simpler but degenerates on sorted input. BST vs Hash Table: Hash tables offer O(1) average lookups but do not maintain order, don't support range queries, and have higher worst-case behavior. BST supports in-order traversal, range queries, and predecessor/successor. BST vs Array: Arrays offer O(1) index access but O(n) sorted insertion. BSTs offer O(log n) insertion while maintaining order.`,
    commonMistakes: [
      'Inserting sorted data into a BST without balancing — creates an O(n) linked list.',
      'Forgetting to update parent pointers when deleting a node with two children.',
      'Using BST where a hash table would suffice — BST is O(log n), hash is O(1).',
      'Ignoring duplicate key handling — define consistent behavior (left vs right vs reject).',
      'Confusing BST with Binary Heap — heaps are complete trees for priority access, BSTs are for ordered search.',
    ],
    interviewQuestions: [
      'Check if a binary tree satisfies the BST property.',
      'Find the k-th smallest element in a BST.',
      'Convert a sorted array to a balanced BST.',
      'Find the Lowest Common Ancestor (LCA) of two nodes in a BST.',
      'Delete a node from a BST and maintain the BST property.',
      'Find the in-order successor of a node in a BST.',
      'Check if two BSTs contain the same elements.',
      'Serialize and deserialize a BST.',
      'Find all nodes in a range [lo, hi] in a BST efficiently.',
      'Convert a BST to a sorted doubly linked list.',
    ],
    optimizations: [
      'Use AVL or Red-Black trees when data insertion order is unpredictable.',
      'Use a Treap for simpler probabilistic balancing with no extra bookkeeping.',
      'Add a size field to each node to support O(log n) order-statistic queries (find kth element).',
      'Cache the minimum and maximum nodes to answer min/max in O(1).',
      'For read-heavy workloads, use Splay Trees to move frequently accessed nodes to the root.',
    ],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'avl': {
    definition: `An AVL tree (Adelson-Velsky and Landis tree, 1962) is a self-balancing binary search tree that maintains the height-balance property: for every node, the heights of its left and right subtrees differ by at most 1. After every insertion or deletion, the tree checks balance factors and performs local rotations (LL, RR, LR, RL) to restore balance. This guarantees O(log n) worst-case time for all operations — something a plain BST cannot guarantee.`,
    history: `Georgy Adelson-Velsky and Evgenii Landis published the first self-balancing tree in their 1962 paper "An algorithm for the organization of information" (in Russian, Doklady Akademii Nauk SSSR). It was the first tree data structure proven to maintain O(log n) height regardless of insertion order, solving the degenerate O(n) BST problem. Their elegant rotation-based rebalancing became the template for all later balanced tree designs.`,
    intuition: `Imagine a perfectly symmetric tree — each node divides its subtree into two equal halves. AVL enforces "near-perfect" symmetry by requiring height difference ≤ 1 everywhere. If an insertion unbalances a subtree, the tree "rotates" locally: imagine tilting a branch to share the load equally. These rotations are O(1) operations that propagate at most O(log n) levels up the tree.`,
    mathematicalFoundation: `Balance factor of a node: BF(N) = height(left) − height(right)\nAVL property: |BF(N)| ≤ 1 for all nodes\n\nMinimum nodes in an AVL tree of height h:\n  N(h) = N(h-1) + N(h-2) + 1  (Fibonacci-like recurrence)\n  N(0) = 1, N(1) = 2\n  N(h) ≈ φ^h / √5  (golden ratio)\n\nMaximum height for n nodes:\n  h ≤ 1.44 × log₂(n+2) − 0.328\n\nThis guarantees all operations stay O(log n) in the worst case.`,
    applications: `Read-heavy database indexes where lookup performance must be guaranteed. In-memory sorted maps in embedded systems. Compiler symbol tables requiring fast repeated lookups. Linux Completely Fair Scheduler (uses Red-Black variant, but AVL is conceptually similar). Any application where worst-case O(log n) is critical, not just average case.`,
    advantages: `Strictest balance guarantee of all practical BST variants — height ≤ 1.44 log n. Fastest search among self-balancing trees because height is minimized. In-order traversal produces sorted sequence. Mathematically proven height bound. Suitable for any comparison-based ordered key type.`,
    disadvantages: `More rotations during insertions/deletions than Red-Black trees — up to O(log n) rotations per operation vs O(1) amortized for Red-Black. Stores balance factor (or height) in every node, adding memory overhead. More complex implementation than Red-Black trees. Less common in standard libraries which prefer Red-Black for write-heavy workloads.`,
    comparisons: `AVL vs Red-Black Tree: AVL has stricter balance (height ≤ 1.44 log n vs 2 log n for RB), giving faster lookups. Red-Black trees require fewer rotations on writes, giving faster insertions. Production use: std::map (C++) and TreeMap (Java) use Red-Black for write-balanced workloads. Read-heavy databases prefer AVL. AVL vs BST: AVL provides guaranteed O(log n) whereas BST degrades to O(n) on sorted input. Overhead: AVL requires rotation logic; BST does not.`,
    commonMistakes: [
      'Forgetting to update height/balance factor after rotation — leads to incorrect future rebalancing.',
      'Confusing single rotation (LL/RR) with double rotation (LR/RL) cases.',
      'Not propagating balance updates up to the root after insertion.',
      'Attempting deletion without considering the predecessor/successor handoff.',
      'Using AVL where unsorted data makes a hash table more appropriate.',
    ],
    interviewQuestions: [
      'Explain the four rotation types in AVL trees (LL, RR, LR, RL) with diagrams.',
      'What is the maximum height of an AVL tree with n nodes?',
      'Implement AVL insert with automatic rebalancing.',
      'Why does deletion sometimes require more rotations than insertion in AVL?',
      'Compare AVL and Red-Black trees — when would you choose each?',
      'Prove that an AVL tree of height h has at least Fib(h+2) − 1 nodes.',
      'Implement level-order traversal of an AVL tree.',
      'How do you verify that a given binary tree is a valid AVL tree?',
    ],
    optimizations: [
      'Store height instead of balance factor to simplify rotation code.',
      'Pool-allocate nodes to reduce heap fragmentation and improve cache behavior.',
      'For bulk-loading n sorted items, use an O(n) bulk construction rather than n insertions.',
      'Use an augmented AVL tree with subtree sizes for O(log n) kth-element and rank queries.',
    ],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'graph-visualizer': {
    definition: `A graph is a mathematical structure G = (V, E) where V is a set of vertices (nodes) and E is a set of edges (connections). Edges can be directed (one-way) or undirected (bidirectional), and weighted (carrying a cost) or unweighted. Graphs are the most general and powerful data structure in computer science, capable of modeling virtually any relationship between objects: social connections, geographic maps, dependency chains, network flows, and biological systems.`,
    history: `Graph theory was founded by Leonhard Euler in 1736 with his solution to the Seven Bridges of Königsberg problem, which he proved had no solution — inventing the concept of an Eulerian path. The field was formalized in the 19th century by mathematicians including Cayley, Sylvester, and Kirchhoff. In computer science, the key algorithms were developed from 1950–1970: Dijkstra's shortest path (1956), Ford-Fulkerson max-flow (1956), Bellman-Ford (1958), and Prim's MST (1957). BFS was formalized by Moore (1959).`,
    intuition: `A graph is the most natural model for relationships. Every social network (Facebook, LinkedIn) is a graph of people (vertices) connected by friendships (edges). Every road map is a graph of intersections (vertices) connected by roads (edges) with distances (weights). The internet itself is a graph of servers connected by cables. Computer science graph algorithms solve practical problems: shortest path = GPS navigation. MST = cheapest network cable layout. BFS/DFS = web crawling. Max flow = network bandwidth optimization.`,
    mathematicalFoundation: `G = (V, E) where |V| = n vertices, |E| = m edges\n\nUndirected graph: sum of degrees = 2|E| (handshaking lemma)\nComplete graph K_n: |E| = n(n-1)/2\nTree: connected acyclic graph with |E| = |V| - 1\n\nBFS complexity: O(V + E)\nDijkstra with binary heap: O((V + E) log V)\nDijkstra with Fibonacci heap: O(E + V log V)\nBellman-Ford: O(VE)\nFloyd-Warshall: O(V³)\nPrim's MST: O(E log V) with binary heap\nKruskal's MST: O(E log E)\nTopological Sort: O(V + E)`,
    applications: `Social Networks: friend recommendations (shortest path BFS), community detection (connected components). GPS Navigation: Google Maps uses Dijkstra/A* for shortest path. Internet Routing: BGP protocol uses shortest path algorithms. Airline Networks: flight scheduling, minimum cost flights. Dependency Resolution: npm, pip, Maven use topological sort on DAGs. Circuit Design: VLSI layout uses planar graph algorithms. Biology: protein interaction networks, neural connection graphs. Compilers: control flow graph analysis, register allocation.`,
    advantages: `Universally expressive — any relationship between objects can be modeled as a graph. Rich algorithm library: shortest paths, spanning trees, flows, coloring, matching. Both dense (matrix) and sparse (list) representations available. Foundation for advanced structures: DAGs, trees, networks. Naturally handles complex multi-way dependencies.`,
    disadvantages: `Memory intensive for large dense graphs (adjacency matrix: O(V²)). Graph algorithms can be NP-hard (traveling salesman, graph coloring). Traversal algorithms require careful visited-node tracking to avoid infinite loops. No natural ordering — operations like "find minimum" require full traversal without special structures. Concurrent modification is complex to handle safely.`,
    comparisons: `Adjacency Matrix vs Adjacency List: Matrix provides O(1) edge lookup but uses O(V²) space. List uses O(V+E) space but O(degree) edge lookup. For sparse graphs (most real-world cases), adjacency list wins. BFS vs DFS: BFS finds shortest paths in unweighted graphs, uses O(V) queue memory. DFS uses O(h) stack memory (h = tree height), better for topological sort and cycle detection. Dijkstra vs Bellman-Ford: Dijkstra is O((V+E) log V) but requires non-negative weights. Bellman-Ford handles negative weights but is O(VE).`,
    commonMistakes: [
      'Not marking vertices as visited in BFS/DFS — causes infinite loops in cyclic graphs.',
      'Using Dijkstra with negative edge weights — use Bellman-Ford instead.',
      'Assuming undirected edges in a directed graph — direction matters for path queries.',
      'Off-by-one errors in adjacency matrix indexing.',
      'Forgetting that a spanning tree requires exactly V-1 edges.',
      'Using O(V²) adjacency matrix for a sparse graph with millions of vertices.',
    ],
    interviewQuestions: [
      'Implement BFS to find the shortest path in an unweighted graph.',
      'Detect a cycle in a directed graph using DFS.',
      'Find all connected components in an undirected graph.',
      'Implement Dijkstra\'s algorithm for single-source shortest paths.',
      'Topologically sort a DAG.',
      'Find strongly connected components using Kosaraju\'s or Tarjan\'s algorithm.',
      'Implement Kruskal\'s algorithm for Minimum Spanning Tree.',
      'Solve the word ladder problem (BFS on implicit graph).',
      'Check if a graph is bipartite (2-colorable) using BFS.',
      'Find bridge edges and articulation points in an undirected graph.',
    ],
    optimizations: [
      'Use a Fibonacci heap with Dijkstra for O(E + V log V) instead of O((V+E) log V).',
      'Bidirectional BFS for shortest paths reduces search space from O(b^d) to O(b^(d/2)).',
      'A* search uses a heuristic to focus Dijkstra toward the target, reducing explored nodes.',
      'Compressed sparse row (CSR) representation gives cache-friendly adjacency list traversal.',
      'Johnson\'s algorithm allows all-pairs shortest paths with negative edges in O(V² log V + VE).',
    ],
    complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'hash-table': {
    definition: `A hash table (also called hash map or dictionary) is a data structure that maps keys to values using a hash function. The hash function converts a key into an integer index, which determines where the key-value pair is stored in an underlying array. With a good hash function and low load factor, insertion, deletion, and lookup operations run in O(1) average time — making hash tables the fastest general-purpose lookup structure.`,
    history: `Hash tables were independently invented around 1953 by several IBM researchers, including H.P. Luhn. The concept was first described in print by Arnold I. Dumey (1956). Gene Amdahl, Elaine McGraw, and Arthur Samuel used hash tables in IBM 701 programs circa 1954. Donald Knuth analyzed hashing extensively in TAOCP Vol. 3 (1973). The term "hashing" itself was coined by IBM researcher Peter Wegner. Python dicts, Java HashMaps, and JavaScript objects all rely on hash tables as their underlying mechanism.`,
    intuition: `Imagine a library with 1,000,000 books arranged by title. Finding a specific book by walking the shelves takes forever. Now imagine a magical index card system: you whisper the book title to a wizard, who does a quick calculation and tells you "it's in room 42, shelf 7, position 3". That's hashing — the wizard is the hash function, and the room/shelf/position is the array index. O(1) lookup regardless of collection size.`,
    mathematicalFoundation: `Hash function: h(key) → [0, m) where m = table size\n\nLoad factor: λ = n/m (n = items, m = capacity)\n\nExpected collisions with uniform hashing:\n  Chaining: expected chain length = λ\n  Open addressing: expected probes = 1/(1-λ)\n\nFor λ ≤ 0.75, operations remain O(1) expected\n\nBirthday paradox: with √m insertions, 50% collision probability\n\nGood hash functions: MurmurHash3, FNV-1a, xxHash\nCryptographic: SHA-256 (too slow for general hashing)`,
    applications: `Database indexing for exact-match queries. Compiler symbol tables — variable name → location mapping. Caches (browser cache, CPU L1/L2/L3 cache associativity, memcached, Redis). Duplicate detection — O(1) set membership. Python dict and JavaScript object under the hood. DNS record lookup. Genome sequencing k-mer counting. Blockchain transaction IDs. Deduplication in file systems (content-addressable storage).`,
    advantages: `O(1) average case for all core operations — unbeatable for key-based lookup. Works with any hashable key type (strings, integers, objects). Simple and intuitive API. Built into every major programming language. Easily extended to implement sets, multisets, and associative arrays. Extremely memory efficient with a good load factor and compact types.`,
    disadvantages: `No ordering — cannot iterate keys in sorted order, no range queries. Worst-case O(n) when many keys hash to the same bucket. Performance degrades as load factor increases — requires periodic rehashing. Rehashing is O(n) — amortized, but causes occasional latency spikes. Hash function quality is critical — poor functions cause clustering. Security concern: hash flooding attacks on predictable functions (mitigated by randomized seeds).`,
    comparisons: `Hash Table vs BST: Hash table is O(1) average lookup vs BST's O(log n), but BST maintains sorted order and supports range queries. Use hash tables for pure lookup; BSTs for ordered iteration. Hash Table vs Array: Arrays require numeric integer keys 0..n. Hash tables handle any hashable key. Arrays have better cache performance. Hash Table vs Trie: For string keys, tries support prefix queries and autocomplete; hash tables do not. Tries have O(k) lookup where k = key length; hash tables O(1) average.`,
    commonMistakes: [
      'Using mutable objects as hash table keys — if the object changes, its hash changes and the entry is lost.',
      'Ignoring load factor — a full hash table degrades to O(n).',
      'Choosing a poor hash function — causes clustering and O(n) worst case.',
      'Not handling hash collisions in custom implementations.',
      'Using hash tables for ordered iteration — they provide no ordering guarantee.',
      'Assuming Python dicts preserve insertion order in Python < 3.7 (they don\'t).',
    ],
    interviewQuestions: [
      'Implement a hash map from scratch with chaining collision resolution.',
      'Find the first non-repeating character in a string using a hash table.',
      'Group anagrams together from a list of strings.',
      'Find all pairs in an array that sum to a target value (Two Sum).',
      'Implement an LRU cache using a hash map + doubly linked list.',
      'Find the longest subarray with sum equal to k.',
      'Check if two strings are isomorphic using hash maps.',
      'Implement a frequency counter to find the most common element.',
      'Design a data structure that supports insert, delete, and getRandom in O(1).',
      'Explain open addressing vs separate chaining collision resolution.',
    ],
    optimizations: [
      'Use power-of-2 table sizes with bitwise AND masking instead of modulo for index computation.',
      'Use Robin Hood hashing to minimize variance in probe lengths.',
      'Use a flat hash table (open addressing with linear probing) for better cache locality than chaining.',
      'Use Fibonacci hashing (multiply by golden ratio) for better bit distribution.',
      'Tune load factor between 0.5–0.75 for optimal throughput/memory balance.',
    ],
    complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'trie': {
    definition: `A Trie (pronounced "try", from re-TRIE-val) is a tree-based data structure where each node represents a single character of a key, and the path from root to a marked node spells out a complete key. Unlike BSTs or hash tables, tries exploit the shared prefix structure of strings — the string "apple" and "application" both traverse the path A→P→P→L before branching. This enables O(k) search where k is the key length, independent of the total number of keys stored.`,
    history: `The trie was introduced by René de la Briandais in 1959 in his paper "File searching using variable length keys". The name "trie" was coined by Edward Fredkin in 1960 (from "retrieval"), though Fredkin's paper didn't appear in print until 1962. Donald Knuth analyzed tries extensively in TAOCP (1973). Compact variants (Patricia tries, Radix trees) were developed to reduce memory usage. Tries are the foundation of the TST (Ternary Search Tree) and AC automaton (for multi-pattern matching).`,
    intuition: `Think of a dictionary arranged as a tree rather than alphabetically. At the root, you choose the first letter. At each subsequent node, you choose the next letter. The word "CAT" traces: Root → C → A → T (marked as end). The word "CAR" shares Root → C → A, then branches to R. Searching for "CAT" takes exactly 3 steps regardless of whether the dictionary has 1,000 or 1,000,000 words. The trie literally spells out the search path.`,
    mathematicalFoundation: `Search time: O(k) where k = key length (independent of n)\nInsert time: O(k)\nSpace: O(n × k × |Σ|) where |Σ| = alphabet size (26 for lowercase English)\n\nWorst case space for 26-character alphabet: 26 child pointers per node\nCompression via Radix tree: reduce to O(n × k) nodes (compressed paths)\nAC automaton construction: O(n × |Σ|) with failure function for multi-pattern search`,
    applications: `Autocomplete: Google Search suggestions use trie-based prefix matching. Spell Checkers: find words within edit distance 1/2 using BFS on trie. IP Routing: network prefixes stored in compressed tries (Patricia trie) for O(k) longest prefix match. DNA Sequence Analysis: genome databases store DNA sequences (4-character alphabet {A,C,G,T}). Contact Search: phone contacts sorted by prefix. Compiler Keyword Recognition: lexers use tries or DFAs derived from tries.`,
    advantages: `O(k) search/insert where k is key length — faster than O(log n) BST for long keys. Prefix queries are native — find all words starting with "pre" in O(k + results) time. No hash collisions — exact, deterministic matching. Natural alphabetical ordering through in-order traversal. Deletion can be performed without rehashing. Excellent for autocomplete, spellcheck, and IP routing.`,
    disadvantages: `Memory intensive — each node stores up to |Σ| pointers (26 for lowercase English). Poor cache performance due to scattered pointer accesses. For sparse data, many nodes have only 1-2 children (wasted space). Slower than hash tables for pure exact-match lookup (O(k) vs O(1)). Complex to balance or compact without compression algorithms.`,
    comparisons: `Trie vs Hash Table: Trie supports prefix queries and ordered iteration; hash table does not. Hash table is O(1) for exact-match; trie is O(k). For autocomplete, trie is the clear winner. Trie vs BST: For string keys, trie avoids repeated string comparisons (BST compares entire strings). Trie is faster for prefix-based operations. Trie vs Radix Tree: Radix tree compresses single-child chains into edge labels, drastically reducing node count for sparse key sets at the cost of more complex implementation.`,
    commonMistakes: [
      'Storing full strings at each node instead of just the character — wastes memory.',
      'Forgetting to mark end-of-word nodes — "AP" and "APP" would be indistinguishable.',
      'Using a simple array of 26 pointers in a Unicode application — use a HashMap instead.',
      'Not handling deletion correctly — must remove nodes only when no child depends on them.',
      'Using a trie when a hash table suffices — only use tries when prefix operations are needed.',
    ],
    interviewQuestions: [
      'Implement insert, search, and startsWith methods for a Trie.',
      'Find all words in a trie that start with a given prefix (autocomplete).',
      'Find the longest common prefix of a list of strings using a Trie.',
      'Replace words in a sentence using a Trie dictionary (shortest prefix replacement).',
      'Count the number of words with a given prefix.',
      'Implement spell-check that finds words within edit distance 1 using a Trie.',
      'Find the maximum XOR of two numbers using a binary Trie.',
      'Implement a search engine autocomplete system.',
    ],
    optimizations: [
      'Use a HashMap<char, TrieNode> for children instead of a fixed-size array to handle large/unicode alphabets.',
      'Compress linear chains into radix tree edge labels to reduce node count.',
      'Store strings sorted lexicographically in a compact array with binary search for ultra-dense tries.',
      'Use a DAWG (Directed Acyclic Word Graph) to share suffixes in addition to prefixes.',
    ],
    complexity: { access: 'N/A', search: 'O(k)', insert: 'O(k)', delete: 'O(k)', space: 'O(n×k×|Σ|)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'min-heap': {
    definition: `A Min Heap is a complete binary tree satisfying the heap property: every parent node's key is less than or equal to both its children's keys. This ensures the minimum element always resides at the root, accessible in O(1). Heaps are typically stored in a flat array using the index relationships: left child at 2i+1, right child at 2i+2, parent at floor((i-1)/2). This array representation eliminates pointer overhead and achieves excellent cache locality.`,
    history: `The binary heap was invented by J.W.J. Williams in 1964 as part of his HeapSort algorithm. R.W. Floyd improved the heap construction algorithm from O(n log n) to O(n) in 1964. The Fibonacci heap, a theoretically superior variant, was introduced by Fredman and Tarjan in 1987, achieving O(1) amortized decrease-key. Priority queues implemented as heaps became standard in programming languages and algorithm courses through Knuth's TAOCP and Sedgewick's Algorithms textbooks.`,
    intuition: `Imagine a tournament where the smallest player always rises to the top. After each round, the winner (smallest) is removed, and the bracket is reorganized to produce the next smallest. The heap maintains this tournament structure efficiently in an array. Insert: add to the back and "bubble up" (swap with parent while smaller). Extract-min: remove root, replace with last element, "bubble down" (swap with smaller child while larger than a child).`,
    mathematicalFoundation: `Array indexing for 0-based heap:\n  Parent(i) = floor((i-1)/2)\n  Left(i)   = 2i + 1\n  Right(i)  = 2i + 2\n\nHeight of heap: h = floor(log₂ n)\nSift-up bubbles at most h levels: O(log n)\nSift-down bubbles at most h levels: O(log n)\n\nBuild heap from n elements:\n  Naive: n × O(log n) insertions = O(n log n)\n  Floyd's: heapify from n/2 down to 0 = O(n) (geometric series proof)\n\nHeapSort: O(n) build + O(n log n) extractions = O(n log n) overall`,
    applications: `Priority Queues: OS task schedulers (Linux CFS uses RB tree, but heaps are simpler). Graph Algorithms: Dijkstra's shortest path uses a min-heap to select the closest unvisited vertex. Prim's MST: uses a min-heap to select minimum weight edges. Event-driven simulation: events sorted by time in a min-heap. Huffman coding: repeatedly merge two minimum-frequency trees. K-th smallest element: maintain a heap of size K. Streaming median: one min-heap and one max-heap.`,
    advantages: `O(1) peek at minimum element (root access). O(log n) insert and extract-minimum. O(n) construction from an unsorted array (Floyd's algorithm). No pointer overhead — stored as a flat array with cache-friendly access. Simpler than balanced BSTs for priority-queue semantics. In-place HeapSort with O(1) extra space.`,
    disadvantages: `No O(log n) search for arbitrary elements — only the minimum is efficiently accessible. No ordered iteration — traversal does not yield sorted order. Decrease-key (updating a priority) requires O(n) search followed by O(log n) sift unless position tracking is added. No efficient access to elements other than the minimum. Not suitable for ordered iteration — use a BST instead.`,
    comparisons: `Min-Heap vs Sorted Array: Heap insert is O(log n); sorted array insert is O(n). Heap extract-min is O(log n); sorted array is O(1). Heap is better for dynamic priority queues. Min-Heap vs BST: Both provide O(log n) insert and delete. BST supports O(log n) search for any key and sorted traversal. Heap provides O(1) min access but O(n) arbitrary search. Min-Heap vs Fibonacci Heap: Fibonacci heap improves decrease-key to O(1) amortized, making Dijkstra O(E + V log V) instead of O((V+E) log V). But Fibonacci heaps have complex implementation.`,
    commonMistakes: [
      'Confusing min-heap with max-heap — define the comparison consistently.',
      'Using 1-based indexing in code that expects 0-based (or vice versa).',
      'Not heapifying after direct array modification.',
      'Searching a heap for an arbitrary element — heap does not maintain BST ordering.',
      'Forgetting that heap sort is not stable (equal elements may swap).',
    ],
    interviewQuestions: [
      'Implement a MinHeap class with insert, extractMin, and peek operations.',
      'Find the K largest elements from a stream using a min-heap of size K.',
      'Merge K sorted linked lists using a min-heap.',
      'Find the median of a data stream using two heaps.',
      'Explain Floyd\'s O(n) heapify algorithm.',
      'Implement HeapSort using a max-heap.',
      'Find the K-th smallest element in a sorted matrix.',
      'Schedule tasks to minimize total wait time (Shortest Job First = min-heap).',
    ],
    optimizations: [
      'Use a D-ary heap (4-heap or 8-heap) to reduce height and improve extract-min cache behavior.',
      'Cache-oblivious implicit heap layout for external memory priority queues.',
      'Use an intrusive heap (store heap index in each element) for O(log n) decrease-key without search.',
      'For mostly-sorted input, use a pairing heap for better amortized performance.',
    ],
    complexity: { access: 'O(1) min', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'segment-tree': {
    definition: `A Segment Tree is a full binary tree in which each node stores an aggregate (sum, minimum, maximum, GCD, etc.) of a contiguous subarray of the input. Leaf nodes store individual elements; internal nodes store aggregates of their children's ranges. This structure enables both range queries and point updates in O(log n) time — far superior to the O(n) naive scan.`,
    history: `The segment tree concept emerged from computational geometry research in the 1970s. Jon Bentley described the range tree (related concept) in 1979. Segment trees as used in competitive programming were popularized through textbooks like "Introduction to Algorithms" (CLRS) and algorithmic contest materials in the 2000s. They are a staple of competitive programming (ICPC, IOI, Codeforces) and are used in production database systems for range aggregate queries.`,
    intuition: `Imagine a binary tree where each leaf holds one array element, and each internal node holds the sum of its subtree. To query the sum of elements 3 through 7, instead of adding 5 numbers, you navigate the tree — some nodes cover the entire range you need, others partially overlap. At most O(log n) nodes are visited. For updates, you change one leaf and propagate the change up O(log n) ancestors.`,
    mathematicalFoundation: `Array size n → tree stored in array of size 4n (safe upper bound)\nNode i covers range [l, r]:\n  Left child: index 2i, covers [l, mid]\n  Right child: index 2i+1, covers [mid+1, r]\n  where mid = (l+r)/2\n\nHeight: ceil(log₂ n)\nBuild time: O(n) — each node computed once\nQuery time: O(log n) — at most 4 nodes per tree level visited\nUpdate time: O(log n) — update one leaf + O(log n) ancestors\n\nLazy propagation:\n  Range update + range query: O(log n) each\n  Without lazy: O(n) per range update`,
    applications: `Range Sum Queries: database aggregate functions over index ranges. Range Minimum Query (RMQ): LCA algorithms, sparse table alternative. Computational Geometry: stabbing queries, interval overlaps. String algorithms: suffix array construction (merge sort via segment tree). Video game engines: spatial range queries for collision detection. Financial systems: running maximum/minimum over time windows.`,
    advantages: `Both range queries and point updates in O(log n). Extremely versatile — works for any associative operation (sum, min, max, GCD, AND, OR, XOR). Lazy propagation extends to O(log n) range updates. Can be augmented to count inversions, merge sort, or maintain sorted sets. Well-understood, widely implemented structure.`,
    disadvantages: `Requires 4n storage — more memory than a BIT (Fenwick tree). More complex to implement than a Fenwick tree (which only handles prefix sums). Static structure — efficient only when the array size is known upfront. Lazy propagation significantly increases implementation complexity. Non-trivial to extend to 2D (2D segment tree is O(n² log n) space).`,
    comparisons: `Segment Tree vs Fenwick Tree (BIT): Fenwick tree uses exactly n space and is simpler, but only supports prefix-sum-style queries. Segment tree supports any associative operation and range updates via lazy propagation. Segment Tree vs Sparse Table: Sparse table answers RMQ queries in O(1) but cannot handle updates (static). Segment tree handles dynamic updates in O(log n). Segment Tree vs Square Root Decomposition: sqrt decomposition is easier to implement but O(√n) per operation vs O(log n).`,
    commonMistakes: [
      'Allocating only 2n instead of 4n array space — causes overflow for non-power-of-2 sizes.',
      'Forgetting to push down lazy tags before querying children.',
      'Mixing 0-indexed and 1-indexed implementations.',
      'Using segment tree when a Fenwick tree suffices (simpler and uses less memory).',
      'Not initializing the tree with identity elements (0 for sum, ∞ for min, -∞ for max).',
    ],
    interviewQuestions: [
      'Build a segment tree for range sum queries and point updates.',
      'Implement lazy propagation for range assignment updates.',
      'Find the number of elements in range [l, r] greater than a given value.',
      'Implement a range minimum query with point updates.',
      'Explain the difference between segment trees and Fenwick trees.',
      'Use a segment tree to count inversions in an array.',
      'Implement a 2D segment tree for 2D range sum queries.',
    ],
    optimizations: [
      'Use iterative (bottom-up) segment tree instead of recursive for 2× speed improvement.',
      'Use a Fenwick tree when only prefix sums are needed — 4× simpler, 4× less memory.',
      'For static arrays, use sparse table for O(1) RMQ without updates.',
      'Fractional cascading for multi-dimensional range queries.',
      'Persistent segment tree for version history queries.',
    ],
    complexity: { access: 'N/A', search: 'O(log n)', insert: 'O(log n)', delete: 'N/A', space: 'O(4n)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'union-find': {
    definition: `A Disjoint Set Union (DSU), also called Union-Find, maintains a partition of n elements into disjoint groups. It supports two operations: Find(x) returns the representative (root) of x\'s component, and Union(x, y) merges x\'s and y\'s components. With path compression and union by rank, both operations run in nearly O(1) amortized time — specifically O(α(n)) where α is the extremely slowly growing inverse Ackermann function (α(n) ≤ 4 for any n that could physically exist).`,
    history: `The Union-Find structure was developed by Bernard Galler and Michael Fischer in 1964. The path compression optimization was introduced independently by several researchers including Knuth. The definitive theoretical analysis by Tarjan (1975) proved the nearly-linear O(n α(n)) bound for a sequence of m operations. Tarjan and van Leeuwen (1984) completed the analysis. The inverse Ackermann bound makes it one of the most remarkable results in data structure theory — nearly as efficient as theoretically possible.`,
    intuition: `Imagine a set of people who might be friends (directly or through mutual friends). Initially everyone is in their own group. "Union(Alice, Bob)" merges their groups. "Find(Carol)" returns Carol\'s group leader. Path compression: when finding the leader of a chain Alice → Bob → Carol → Dave (leader), we shortcut Alice directly to Dave for all future queries. Union by rank prevents tall chains by always attaching the shorter tree under the taller one.`,
    mathematicalFoundation: `Without optimization: O(n) per operation in worst case\nWith union by rank only: O(log n) per operation\nWith path compression only: O(log n) amortized\nWith both: O(α(n)) amortized per operation\n\nInverse Ackermann function:\n  α(n) ≤ 4 for any n < 2^65536 (effectively a constant)\n\nAmortized cost proof uses potential functions over the entire sequence of m operations on n elements: O((m + n) α(n))`,
    applications: `Kruskal\'s Minimum Spanning Tree: determines if adding an edge creates a cycle. Percolation simulation (physics): check if top and bottom of a grid are connected. Image segmentation: group pixels into connected regions. Network connectivity: detect if two machines can communicate. Cycle detection in undirected graphs. Dynamic connectivity: online algorithms for changing graphs. Social network friend groups.`,
    advantages: `Essentially O(1) per operation in practice — as fast as theoretically possible. Extremely simple implementation (2 arrays: parent[] and rank[]). Space-efficient: O(n) total. Handles very large sets — millions of elements efficiently. Incremental — supports online queries as new edges are added.`,
    disadvantages: `Cannot efficiently delete or split components — only supports Union (merge). Cannot enumerate all elements in a component without extra bookkeeping. Cannot answer "what was the state before this union" — not easily reversible (need rollback DSU for that). Only models "same group?" relationships — cannot represent complex graph structure.`,
    comparisons: `Union-Find vs BFS/DFS for connectivity: BFS/DFS is O(V+E) per query; Union-Find is O(α(n)) per query after O(E) preprocessing. For multiple connectivity queries, Union-Find is far faster. Union-Find vs Linked List of sets: Linked list gives O(1) union but O(n) find. Union-Find gives nearly O(1) for both.`,
    commonMistakes: [
      'Forgetting path compression — implementing Find recursively without updating parent pointers.',
      'Confusing union by rank with union by size (both work, but must be consistent).',
      'Using Union-Find for disconnection or splitting components (it doesn\'t support this).',
      'Not initializing parent[i] = i and rank[i] = 0 for all i.',
      'Returning the wrong representative when the root has been path-compressed.',
    ],
    interviewQuestions: [
      'Implement Union-Find with path compression and union by rank.',
      'Use Union-Find to detect a cycle in an undirected graph.',
      'Find the number of connected components in a graph using Union-Find.',
      'Implement Kruskal\'s MST algorithm using Union-Find.',
      'Count the number of islands in a 2D grid using Union-Find.',
      'Determine if two nodes are in the same connected component.',
      'Implement a rollback (offline) Union-Find that supports undo.',
      'Solve accounts merge problem (group accounts by shared emails).',
    ],
    optimizations: [
      'Use iterative path compression (walk the chain twice) to avoid stack overflow on deep trees.',
      'Combine with link-cut trees for O(log n) dynamic connectivity with deletions.',
      'Use weighted quick-union (union by size) as an alternative to union by rank.',
      'For parallel processing, use concurrent union-find with atomic CAS operations.',
    ],
    complexity: { access: 'N/A', search: 'O(α(n))', insert: 'O(α(n))', delete: 'N/A', space: 'O(n)' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  'lru-cache': {
    definition: `An LRU (Least Recently Used) Cache is a fixed-capacity cache that evicts the least recently accessed item when full. It is implemented by combining a doubly linked list (which maintains recency order — most recent at head, least recent at tail) with a hash map (which provides O(1) lookup to any list node by key). Together, both get and put operations run in O(1) time.`,
    history: `Cache replacement policies have been studied since the 1960s as part of virtual memory and CPU cache design. LRU was formally analyzed by Belady (1966) and became the standard reference policy because it approximates the optimal offline policy (Belady\'s OPT). In operating systems, LRU page replacement was implemented in IBM\'s OS/360. In software, LRU caches became widely used in databases (MySQL buffer pool), web servers (Varnish), and programming platforms (Python\'s functools.lru_cache).`,
    intuition: `Imagine your desk has space for only 5 open books. When you need a 6th, you put away whichever you haven\'t touched in the longest time. That\'s LRU. The doubly linked list is the ordered list of your open books (most recently used at front, least recently at back). The hash map is your personal index of where each book is on the desk — O(1) lookup. When you access a book, you move it to the front of the desk.`,
    mathematicalFoundation: `For a cache of capacity C accessing a sequence of n references:\n  LRU hit rate ≈ 1 - C/n for random access\n  LRU is optimal for temporal locality workloads\n  Stack distance: if P(stack distance ≤ C) = h, then hit rate = h\n\nLRU is C-competitive with OPT (optimal offline algorithm)\n  i.e., LRU misses at most C times more than OPT\n\nData structure operations:\n  HashMap lookup: O(1)\n  Linked list move-to-front: O(1) with pointer update\n  Combined: O(1) per get and put`,
    applications: `Browser cache: recently visited pages and resources. CPU L1/L2/L3 cache replacement. Database buffer pools: MySQL InnoDB buffer pool uses LRU variant. CDN (Content Delivery Network) edge caches. DNS resolution cache. Operating system page replacement. Python functools.lru_cache decorator. Redis memory eviction policies (allkeys-lru, volatile-lru).`,
    advantages: `O(1) for both get and put operations. Excellent performance for workloads with temporal locality (recently used items likely to be accessed again). Simple to reason about correctness. Naturally handles cache invalidation on eviction. Widely applicable to any key-value lookup with bounded memory.`,
    disadvantages: `High implementation complexity — requires both a hash map AND a doubly linked list. High memory overhead: two data structures plus pointer overhead per node. Sensitive to access patterns — sequential scan of items larger than cache size (cache thrashing) evicts all cached items. Not optimal for all workloads — e.g., frequency-based access favors LFU (Least Frequently Used).`,
    comparisons: `LRU vs LFU: LRU evicts least recently used; LFU evicts least frequently used. LFU is better for frequency-based access but harder to implement (O(1) LFU requires complex data structure). LRU vs FIFO: FIFO evicts oldest inserted item regardless of access. LRU is consistently better for temporal locality workloads. LRU vs MRU: Most Recently Used cache is useful for sequential scans where the most recently used item is least likely to be reused.`,
    commonMistakes: [
      'Using a singly linked list — cannot efficiently remove from the middle without O(n) traversal.',
      'Not updating the list on cache hits (get operation must also promote to front).',
      'Forgetting to remove the evicted key from the hash map.',
      'Thread-safety: LRU caches accessed by multiple threads need synchronization.',
      'Off-by-one in capacity check — evict when size > capacity, not ≥.',
    ],
    interviewQuestions: [
      'Design and implement an LRU cache supporting O(1) get and put.',
      'Explain why a doubly linked list + hash map achieves O(1) operations.',
      'Implement an LFU (Least Frequently Used) cache.',
      'How would you make an LRU cache thread-safe?',
      'What are the trade-offs between LRU, LFU, and FIFO eviction policies?',
      'Implement a time-based key expiry cache (TTL cache).',
      'Design a distributed LRU cache.',
    ],
    optimizations: [
      'Use a doubly linked list with sentinel head/tail nodes to eliminate null checks.',
      'Use an intrusive linked list to store list nodes inside hash map values (avoids separate allocation).',
      'For multi-threaded LRU, use segmented locking (shard the cache into K LRU instances).',
      'Use CLOCK algorithm as a cheaper O(1) approximate LRU that avoids list manipulation.',
    ],
    complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(capacity)' },
  },

}

// ─── Generate TypeScript Output ───────────────────────────────────────────────
let out = `/**
 * theoryExpanded.ts — AUTO-GENERATED
 * Rich, textbook-grade theory content for all data structures.
 * 
 * DO NOT EDIT MANUALLY. Regenerate with: node scripts/populate-theory.cjs
 */

import type { TheoryContent } from '@/types'

export const THEORY_EXPANDED: Record<string, Partial<TheoryContent>> = {\n`

for (const [ds, data] of Object.entries(RICH)) {
  out += `  '${ds}': {\n`
  for (const [key, val] of Object.entries(data)) {
    if (key === 'complexity') {
      const c = val
      out += `    complexity: { access: '${c.access}', search: '${c.search}', insert: '${c.insert}', delete: '${c.delete}', space: '${c.space}' },\n`
    } else if (Array.isArray(val)) {
      out += `    ${key}: [\n`
      for (const item of val) {
        out += `      \`${e(item)}\`,\n`
      }
      out += `    ],\n`
    } else {
      out += `    ${key}: \`${e(val)}\`,\n`
    }
  }
  out += `  },\n`
}
out += `}\n\n`

out += `/**
 * Merge expanded theory with the base THEORY object.
 * The expanded data takes precedence for fields it defines.
 */
export function getExpandedTheory(ds: string, base: TheoryContent): TheoryContent {
  const expanded = THEORY_EXPANDED[ds]
  if (!expanded) return base
  return {
    ...base,
    ...expanded,
    complexity: expanded.complexity ?? base.complexity,
    commonMistakes: expanded.commonMistakes ?? base.commonMistakes,
    interviewQuestions: expanded.interviewQuestions ?? base.interviewQuestions,
    optimizations: expanded.optimizations ?? base.optimizations,
  }
}
`

fs.writeFileSync(OUT, out, 'utf8')
console.log(`✅ theoryExpanded.ts written (${Object.keys(RICH).length} DS × rich content)`)
