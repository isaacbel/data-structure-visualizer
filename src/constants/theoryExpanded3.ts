/**
 * theoryExpanded3.ts — AUTO-GENERATED
 * Rich, textbook-grade theory content — Part 3 (remaining data structures).
 * DO NOT EDIT MANUALLY. Regenerate with: node scripts/populate-theory-3.cjs
 */

import type { TheoryContent } from '@/types'

export const THEORY_EXPANDED3: Record<string, Partial<TheoryContent>> = {
  'binary-tree': {
    definition: `A Binary Tree is a hierarchical data structure where each node has at most two children, conventionally called the left child and the right child. Unlike a Binary Search Tree, a generic binary tree imposes no ordering constraint on the values — any arrangement is valid. A binary tree is the foundation from which all tree variants (BST, AVL, Red-Black, heap) are derived, each adding specific constraints to gain desired properties.`,
    history: `Binary trees have roots in mathematical graph theory and were formalized as a data structure in the early 1960s alongside the development of tree traversal algorithms. The three classical traversal orders (inorder, preorder, postorder) were defined by Donald Knuth in "The Art of Computer Programming" (Volume 1, 1968). Binary trees became fundamental to compiler design (expression trees), Huffman coding (1952), and heap-based priority queues (1964).`,
    intuition: `Think of a binary tree as a family tree where each parent has at most two children. The topmost ancestor is the root. Nodes with no children are called leaves. The depth of a node is how many generations down it is from the root. Unlike a linear list, a tree branches, allowing hierarchical organization that mirrors real-world structures: file systems, organizational charts, mathematical expressions.`,
    mathematicalFoundation: `Full binary tree: every node has 0 or 2 children
Complete binary tree: all levels filled except possibly the last
Perfect binary tree: all internal nodes have 2 children, all leaves same depth

Properties of a perfect binary tree with height h:
  Nodes at level i: 2^i
  Total nodes: 2^(h+1) - 1
  Leaves: 2^h  (half of all nodes)

Number of unique binary trees with n nodes (Catalan number):
  Cₙ = (2n choose n) / (n+1)`,
    applications: `Expression trees: arithmetic expressions represented as trees for evaluation. Huffman coding: optimal prefix-free compression builds a binary tree. Decision trees: machine learning classification. Syntax trees: compilers parse source code into an AST. Game trees: minimax algorithm for games like chess. Heap sort: binary heap is a complete binary tree.`,
    advantages: `Hierarchical organization allows modelling recursive structures naturally. Efficient O(log n) operations when balanced. Recursive algorithms are elegant and intuitive. Foundation for advanced structures: BST, AVL, Red-Black, heap, treap.`,
    disadvantages: `Unbalanced trees degrade to O(n) performance. No ordering constraint means search is O(n). More memory than arrays due to pointer overhead. Complex to implement correctly with all edge cases.`,
    comparisons: `Binary Tree vs BST: BST adds left<root<right ordering for O(log n) search. Binary Tree vs Heap: Heap adds the heap property (parent ≥ children for max-heap) plus the completeness constraint. Binary Tree vs N-ary Tree: Binary tree restricts to ≤ 2 children; N-ary allows more.`,
    commonMistakes: [
      `Forgetting null checks before dereferencing left or right pointers.`,
      `Confusing binary tree (no order) with BST (ordered).`,
      `Off-by-one in height calculation: height of single node is 0 or 1 depending on convention.`,
      `Not considering the empty tree as a valid base case in recursive algorithms.`,
    ],
    interviewQuestions: [
      `Write inorder, preorder, and postorder traversals (recursive and iterative).`,
      `Find the height of a binary tree.`,
      `Check if a binary tree is balanced.`,
      `Serialize and deserialize a binary tree.`,
      `Find the lowest common ancestor of two nodes.`,
      `Mirror/invert a binary tree.`,
      `Level-order traversal (BFS) of a binary tree.`,
      `Count the number of nodes in a complete binary tree in O(log² n).`,
    ],
    pseudocode: `INORDER(node):
  if node == null: return
  INORDER(node.left)
  visit(node)
  INORDER(node.right)

HEIGHT(node):
  if node == null: return -1
  return 1 + max(HEIGHT(node.left), HEIGHT(node.right))

IS_BALANCED(node):
  if node == null: return true
  lh = HEIGHT(node.left)
  rh = HEIGHT(node.right)
  return |lh - rh| <= 1 and IS_BALANCED(left) and IS_BALANCED(right)`,
    stepByStep: [
      `Root node is at level 0; each edge adds one level`,
      `Inorder: left subtree → root → right subtree (gives sorted order for BST)`,
      `Preorder: root → left → right (useful for copying/serializing the tree)`,
      `Postorder: left → right → root (useful for deletion, expression evaluation)`,
      `Level-order: visit all nodes at each level before going deeper (BFS with queue)`,
      `Height: recursively compute max(left_height, right_height) + 1`,
    ],
    relatedTopics: [
      `bst`,
      `avl`,
      `red-black-tree`,
      `min-heap`,
      `max-heap`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
  },
  'max-heap': {
    definition: `A Max-Heap is a complete binary tree where every parent node is greater than or equal to its children. This ensures the maximum element is always at the root, enabling O(1) maximum retrieval. Like a Min-Heap, it is efficiently stored in a flat array (no pointers) using the index relationships: parent = (i-1)/2, left = 2i+1, right = 2i+2.`,
    history: `The heap data structure and heap sort algorithm were invented by J.W.J. Williams in 1964. The same year, Robert Floyd improved heap construction to O(n) (Floyd's heapify algorithm). Max-heaps are used directly in heap sort, priority queues requiring maximum extraction (task scheduling, simulation events), and as an intermediate step in many graph algorithms.`,
    intuition: `A max-heap is like a tournament bracket where the winner (maximum) is always at the top. When the top player (root) is removed, the next strongest player bubbles up to take its place through a process called "sift-down". Inserting a new player means placing them at the bottom and "sift-up" comparing with parents until the heap property is restored.`,
    mathematicalFoundation: `Array indexing (0-based):
  Parent of i: (i-1)/2
  Left child: 2i+1
  Right child: 2i+2

Heap property: arr[parent] >= arr[child]

Height of heap with n nodes: floor(log₂ n)

Build-heap (Floyd's): O(n)
  Sum of heights at level l: ceil(n / 2^(l+1))
  Total work = n × Σ(h/2^h) = O(n) by geometric series

Heap sort: O(n log n) — not stable`,
    applications: `Priority queues (maximum first): process scheduling, simulation event queues. Heap sort: in-place O(n log n) comparison sort. K largest elements: maintain a max-heap of size k. Streaming median: two heaps (max-heap for lower half, min-heap for upper half). Dijkstra's algorithm (min-heap variant for shortest path).`,
    advantages: `O(1) maximum access. O(log n) insert and extract-max. O(n) build from array. In-place heap sort uses O(1) extra space. Simple flat-array storage — no pointer overhead.`,
    disadvantages: `O(n) arbitrary search (no BST-like ordered structure). No efficient minimum access. Only the maximum is O(1); kth element requires O(k log n) extractions. Not cache-friendly for large k extractions.`,
    comparisons: `Max-Heap vs Min-Heap: Max-heap gives O(1) maximum; Min-heap gives O(1) minimum. Max-Heap vs Sorted Array: Sorted array gives O(1) max AND O(n) insert; heap gives O(log n) for both. Max-Heap vs BST: BST gives O(log n) search; heap gives O(n) search but O(1) max and better cache for top-k problems.`,
    commonMistakes: [
      `Using 1-based vs 0-based indexing inconsistently.`,
      `Forgetting to restore heap property after deletion (sift-down required).`,
      `Naive heap construction using n individual inserts: O(n log n) instead of Floyd's O(n).`,
      `Using max-heap when min-heap is needed (e.g., Dijkstra requires minimum).`,
    ],
    interviewQuestions: [
      `Implement a max-heap from scratch with insert and extract-max.`,
      `Find the k largest elements in an unsorted array efficiently.`,
      `Implement heap sort using a max-heap.`,
      `Merge k sorted arrays using a heap.`,
      `Find the running median of a stream of numbers.`,
    ],
    pseudocode: `SIFT_DOWN(heap, i, n):
  while 2i+1 < n:
    largest = i
    if heap[2i+1] > heap[largest]: largest = 2i+1
    if 2i+2 < n and heap[2i+2] > heap[largest]: largest = 2i+2
    if largest == i: break
    swap(heap[i], heap[largest])
    i = largest

EXTRACT_MAX(heap):
  max = heap[0]
  heap[0] = heap[last]; remove last
  SIFT_DOWN(heap, 0, n)
  return max

BUILD_HEAP(arr):
  for i from n/2-1 down to 0:
    SIFT_DOWN(arr, i, n)`,
    stepByStep: [
      `Store heap as 0-indexed array: parent=(i-1)/2, left=2i+1, right=2i+2`,
      `Heap property: arr[i] >= arr[2i+1] and arr[i] >= arr[2i+2]`,
      `Insert: append at end, then sift-up comparing with parent until heap property holds`,
      `Extract-max: swap root with last element, reduce size, sift-down from root`,
      `Build-heap (Floyd): call sift-down on all internal nodes from bottom to top in O(n)`,
    ],
    relatedTopics: [
      `min-heap`,
      `priority-queue`,
      `binary-tree`,
      `bst`,
    ],
    optimizations: [
      `D-ary heap: fan-out d > 2 reduces height → fewer sift-down steps in extract-min.`,
      `Fibonacci heap: O(1) amortized decrease-key for Dijkstra (theoretical speedup).`,
      `Pairing heap: simpler Fibonacci heap alternative with good practical performance.`,
    ],
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },
  'priority-queue': {
    definition: `A Priority Queue is an abstract data type where each element has a priority value, and elements are dequeued in order of priority (highest or lowest first) rather than insertion order. It is typically implemented with a heap (binary heap, Fibonacci heap) or other tree structures. The fundamental operations are: insert (with priority), extract-min/max (remove highest priority element), and peek (inspect without removing).`,
    history: `Priority queues emerged alongside operating systems and simulation software in the 1950s–1960s where tasks needed to be processed in urgency order rather than arrival order. The efficient heap-based implementation was formalized by Williams (1964). Modern priority queues appear in: OS schedulers, Dijkstra's algorithm (1959), A* pathfinding (1968), Huffman coding (1952), and simulation event queues.`,
    intuition: `A priority queue is like an emergency room waiting room: patients are not seen in arrival order but in urgency order. A critically injured patient who arrives last is treated first. When a patient is treated (dequeued), the next most urgent patient moves to the front automatically. Adding a new urgent patient triggers a reshuffle to place them appropriately.`,
    mathematicalFoundation: `Binary heap-based priority queue:
  Insert: O(log n) — sift up
  Extract-min/max: O(log n) — sift down
  Peek: O(1) — root is always min/max
  Build: O(n) — Floyd's algorithm

Fibonacci heap (for algorithms like Dijkstra):
  Insert: O(1) amortized
  Extract-min: O(log n) amortized
  Decrease-key: O(1) amortized
  → Dijkstra with Fibonacci heap: O(E + V log V) vs O((E + V) log V) with binary heap`,
    applications: `Dijkstra shortest path: min-priority queue on vertex distances. A* pathfinding: priority queue ordered by f = g + h. Prim's MST: priority queue on edge weights. Huffman coding: min-heap for building optimal prefix codes. OS scheduler: priority queue of runnable processes. Bandwidth throttling: priority queue for network packet scheduling. Event-driven simulation: event queue ordered by event time.`,
    advantages: `O(log n) insert and extract. O(1) peek at highest priority. Generalization of both stack (LIFO) and queue (FIFO) — both are special cases of priority queues. Enables efficient implementations of greedy algorithms.`,
    disadvantages: `No O(1) arbitrary access. No efficient search by value (only by priority). Basic binary heap doesn't efficiently support decrease-key (O(n) naively).`,
    commonMistakes: [
      `Using a sorted array instead of a heap — O(n) insert instead of O(log n).`,
      `Forgetting that Python's heapq is a min-heap by default — negate values for max-heap.`,
      `Not using a priority queue in Dijkstra — leads to O(V²) instead of O(E log V).`,
      `Using a max-heap when a min-heap is needed or vice versa.`,
    ],
    interviewQuestions: [
      `Implement a priority queue using a binary heap.`,
      `Find the k-th largest element using a min-heap of size k.`,
      `Merge k sorted lists using a priority queue.`,
      `Implement Dijkstra's algorithm with a priority queue.`,
      `Design a task scheduler with priority and cooldown.`,
      `Find the median from a data stream using two heaps.`,
    ],
    pseudocode: `INSERT(pq, item, priority):
  pq.heap.append((priority, item))
  SIFT_UP(pq, last_index)

EXTRACT_MIN(pq):
  min = pq.heap[0]
  pq.heap[0] = pq.heap[last]; remove last
  SIFT_DOWN(pq, 0)
  return min

DECREASE_KEY(pq, item, new_priority):
  find item's index i
  pq.heap[i].priority = new_priority
  SIFT_UP(pq, i)  // priority decreased → might need to move up`,
    stepByStep: [
      `Backed by a min-heap (or max-heap): root always holds the minimum (maximum) priority`,
      `Insert: place at end, bubble up while priority < parent's priority`,
      `Extract: remove root, move last element to root, bubble down to correct position`,
      `Peek: return root without removing — O(1)`,
      `For Dijkstra: insert (vertex, distance) pairs; extract always gives the unvisited vertex with shortest known distance`,
    ],
    relatedTopics: [
      `min-heap`,
      `max-heap`,
      `queue`,
      `deque`,
    ],
    optimizations: [
      `For decrease-key operations: use indexed heap (store index of each element in a hash map).`,
      `For very large queues: use a d-ary heap (d=4 or d=8) for better cache utilization.`,
      `Fibonacci heap for algorithms needing O(1) decrease-key (Dijkstra, Prim's MST).`,
    ],
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },
  'circular-queue': {
    definition: `A Circular Queue (Ring Buffer) is a fixed-size queue that treats its underlying array as if it were circular by using modular arithmetic. When the rear reaches the end of the array, the next element wraps around to index 0. This eliminates the "queue drift" problem of linear queues (where elements continuously shift toward the end of the array) and achieves O(1) enqueue and dequeue with no memory waste.`,
    history: `Ring buffers emerged in early computer systems for I/O buffering. The UNIX pipe (Ken Thompson, 1969) uses a circular buffer to pass data between processes. CPU FIFO queues in hardware (instruction fetch queues, branch predictor queues) are physically implemented as ring buffers. The Java NIO ByteBuffer uses circular addressing. Audio streaming (ALSA, PulseAudio) uses ring buffers to buffer audio frames between producer and consumer threads.`,
    intuition: `A circular queue is like a revolving door: people enter from one side and exit from the other, and the door keeps spinning. The magic is that when you reach the "end" of the door, it seamlessly continues to the "beginning" — there's no wasted space, and both ends move continuously.`,
    mathematicalFoundation: `Indices: front and rear, both 0-initialized
Enqueue: rear = (rear + 1) % capacity
Dequeue: front = (front + 1) % capacity
Empty: front == rear
Full: (rear + 1) % capacity == front
  (or track size separately)

Usable capacity: capacity - 1 slots (one slot sacrificed to distinguish full from empty)
Alternative: maintain size counter to use all capacity slots`,
    applications: `Audio/video streaming buffers: producer (decoder) and consumer (speaker) run at different rates. Unix pipes: data flows through a ring buffer. Network packet queues: NIC receive rings. CPU instruction queues: pipeline stages communicate via ring buffers. Task schedulers: real-time OS task queues. Print spoolers: document queuing.`,
    advantages: `O(1) enqueue and dequeue. No memory drift — full array utilization. Fixed memory footprint (no dynamic allocation). Cache-friendly sequential access. Simple modular arithmetic — no pointer manipulation.`,
    disadvantages: `Fixed maximum capacity — cannot grow beyond initial size. One slot wasted if using front==rear sentinel (without a size counter). Not suitable for unbounded queues. Cannot efficiently search for arbitrary elements.`,
    commonMistakes: [
      `Forgetting the modulo operation — causes array out-of-bounds access.`,
      `Confusing "full" and "empty" conditions when front == rear.`,
      `Not using a size counter and accidentally losing track of fullness.`,
      `Integer overflow in very long-running systems with 32-bit index counters.`,
    ],
    interviewQuestions: [
      `Implement a circular queue using a fixed-size array.`,
      `What is the difference between a circular queue and a regular queue?`,
      `Implement a ring buffer for audio streaming.`,
      `How do you detect full vs empty in a circular queue?`,
      `Design a thread-safe circular queue using locks.`,
    ],
    pseudocode: `ENQUEUE(cq, x):
  if isFull: error
  cq.data[cq.rear] = x
  cq.rear = (cq.rear + 1) % cq.capacity
  cq.size++

DEQUEUE(cq):
  if isEmpty: error
  x = cq.data[cq.front]
  cq.front = (cq.front + 1) % cq.capacity
  cq.size--
  return x

isFull:  size == capacity
isEmpty: size == 0`,
    stepByStep: [
      `Allocate fixed array of size capacity`,
      `Maintain: front index, rear index, and size counter`,
      `Enqueue: write at rear, advance rear = (rear+1) % cap, increment size`,
      `Dequeue: read from front, advance front = (front+1) % cap, decrement size`,
      `Full when size == capacity, empty when size == 0`,
      `Indices wrap around seamlessly — no shifting required`,
    ],
    relatedTopics: [
      `queue`,
      `deque`,
      `stack`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
  'treap': {
    definition: `A Treap (Tree + Heap) is a randomized binary search tree where each node stores two values: a key (determines BST ordering: left < root < right) and a random priority (determines heap ordering: parent priority > children priority). This dual constraint gives the Treap its name and its properties: the BST key ordering provides O(log n) search, while random priorities ensure the tree is balanced with high probability (avoiding worst-case O(n) degeneracy).`,
    history: `Treaps were independently discovered by Raimund Seidel and Cecilia Aragon (published 1996) as a simple randomized alternative to deterministic balanced BSTs. The key insight is that assigning random priorities turns a BST into a structure with the same expected properties as a randomly built BST — which has expected height O(log n). Treaps became popular in competitive programming as a simpler alternative to Red-Black trees with the added benefit of easy merge/split operations.`,
    intuition: `Imagine building a BST by inserting elements in random order — the expected height is O(log n). A treap simulates this: each node gets a random priority at creation, and the heap ordering by priority is equivalent to inserting nodes in priority order. The higher a node's random priority, the closer to the root it ends up — as if it were inserted first in a random build.`,
    mathematicalFoundation: `Expected height: O(log n)
Proof: node x is an ancestor of y iff x has the highest priority among
  all keys in [min(x,y), max(x,y)].
  P(x is ancestor of y) = 1/(|key_x - key_y| + 1)
  Expected depth of x: Σ_{y≠x} P(y is ancestor of x) = O(log n)

Rotations:
  Right rotation preserves BST order and fixes heap violation when
    left.priority > parent.priority
  Left rotation for the symmetric case`,
    applications: `Competitive programming: treaps support split(key) and merge(t1, t2) in O(log n), enabling operations like "insert at index k", "reverse a range", or "query a range" — operations difficult with standard BSTs. Implicit treap: use subtree size instead of key for sequence operations. Database indexing. Lazy propagation for range updates on sequences.`,
    advantages: `Expected O(log n) for all operations with high probability. Simpler implementation than Red-Black or AVL. Elegant split/merge in O(log n) — enables sequence operations. No complex rotational cases — just two rotation types.`,
    disadvantages: `Probabilistic, not deterministic worst-case guarantee. Needs a random number generator. Extra memory for priority field. Slightly higher constant factor than deterministic structures due to random priority generation.`,
    commonMistakes: [
      `Not using a good random number generator — correlated priorities lead to poor balance.`,
      `Confusing key ordering (BST) with priority ordering (heap).`,
      `Incorrect rotation direction — must maintain both BST and heap properties.`,
      `Not updating subtree sizes when using implicit treap for sequence operations.`,
    ],
    interviewQuestions: [
      `Explain how a treap maintains balance without explicit rebalancing.`,
      `Describe the split and merge operations in a treap.`,
      `Compare treap with AVL tree and Red-Black tree.`,
      `Use an implicit treap to implement a rope (sequence with O(log n) index access).`,
    ],
    pseudocode: `ROTATE_RIGHT(node):
  L = node.left
  node.left = L.right
  L.right = node
  return L

INSERT(node, key, priority):
  if node == null: return new TreapNode(key, priority)
  if key < node.key:
    node.left = INSERT(node.left, key, priority)
    if node.left.priority > node.priority:
      node = ROTATE_RIGHT(node)
  else:
    node.right = INSERT(node.right, key, priority)
    if node.right.priority > node.priority:
      node = ROTATE_LEFT(node)
  return node`,
    stepByStep: [
      `Each node stores (key, random_priority)`,
      `BST property: keys follow left < root < right`,
      `Heap property: priorities follow parent > children (max-heap on priorities)`,
      `Insert: insert as BST by key, then rotate up if priority > parent's priority`,
      `Delete: decrease priority to -∞, rotate down until leaf, then remove`,
      `Split(key): returns two treaps: all keys ≤ key, all keys > key — O(log n)`,
      `Merge(L, R): L.all keys < R.all keys — pick higher priority as root, recursively merge — O(log n)`,
    ],
    relatedTopics: [
      `bst`,
      `avl`,
      `red-black-tree`,
      `skip-list`,
    ],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },
  'splay-tree': {
    definition: `A Splay Tree is a self-adjusting binary search tree where every accessed node is moved to the root through a sequence of rotations called "splaying". No extra balance information (color, height, rank) is stored per node. The key insight is that recently accessed nodes are near the root, making repeated accesses to the same elements extremely fast — O(log n) amortized for all operations, even though individual operations may take O(n) time in the worst case.`,
    history: `Splay trees were invented by Daniel Sleator and Robert Tarjan in 1985 in their paper "Self-Adjusting Binary Search Trees." The structure was motivated by the observation that real-world access patterns are not uniform — the same elements are often accessed repeatedly (temporal locality). Splay trees exploit this naturally without needing to know the access distribution in advance. They are used in the GNU C++ library and various compiler symbol tables.`,
    intuition: `A splay tree is like a librarian who always moves the book you just read to the front of the shelf. If you keep reading the same books, they're always at the front (O(1) access). If you read every book equally, the amortized cost is O(log n). The "splaying" operation is the librarian's process of restructuring the shelf — moving the accessed item to the front via rotations.`,
    mathematicalFoundation: `Amortized analysis via potential method:
  Φ(T) = Σ log(size(x)) for all nodes x
  rank(x) = log(size of subtree at x)
  Amortized cost of splay = O(log n)

Access lemma: amortized time to splay x is O(log n)
Working set theorem: if x is accessed with rank r among recent accesses,
  cost is O(log r) — much better than O(log n) for frequently repeated accesses

Splay operations:
  Zig: parent is root → single rotation
  Zig-Zig: node and parent on same side → double rotation (parent first)
  Zig-Zag: node and parent on opposite sides → two rotations (node first)`,
    applications: `Caches: splay trees naturally implement a cache with LRU-like behavior. Compiler symbol tables: variable accesses in loops (high locality). Network routing: recently used routes accessed faster. GNU libstdc++ rope: splay tree-based string data structure. LISP environment: Emacs uses splay trees internally.`,
    advantages: `O(log n) amortized all operations. No extra balance metadata per node (unlike AVL/RB). Excellent real-world performance with temporal locality. Simpler implementation than Red-Black or AVL for amortized analysis. Optimal for working set access patterns.`,
    disadvantages: `O(n) worst-case per operation (though amortized O(log n)). Modifies the tree on every access (including reads) — not thread-safe without locks. Not suitable for concurrent use without heavy locking. Poor cache behavior if access pattern is adversarial.`,
    commonMistakes: [
      `Forgetting the zig-zig rotation must rotate the grandparent FIRST (not the node).`,
      `Trying to use splay trees in concurrent code — every read modifies the structure.`,
      `Not handling the three splay cases (zig, zig-zig, zig-zag) separately.`,
    ],
    interviewQuestions: [
      `Explain the three splay cases: zig, zig-zig, zig-zag.`,
      `Why does zig-zig rotate the grandparent first?`,
      `What is the access lemma and why is splaying amortized O(log n)?`,
      `Compare splay trees with LRU cache for temporal locality.`,
    ],
    pseudocode: `SPLAY(tree, x):
  while x is not root:
    p = parent(x)
    if p is root:      // Zig
      rotate(x)
    elif same_side(x, p):  // Zig-Zig
      rotate(p); rotate(x)
    else:              // Zig-Zag
      rotate(x); rotate(x)

SEARCH(tree, key):
  x = BST_find(tree, key)
  SPLAY(tree, x)  // Move x to root
  return x`,
    stepByStep: [
      `Search for key using standard BST search`,
      `Splay the found node (or last accessed node if not found) to the root`,
      `Zig: if found node's parent is root, single rotation`,
      `Zig-Zig: node and parent same side of grandparent — rotate parent, then node`,
      `Zig-Zag: node and parent opposite sides — rotate node twice`,
      `After splaying, the most recently accessed node is always at the root`,
    ],
    relatedTopics: [
      `bst`,
      `avl`,
      `red-black-tree`,
      `treap`,
    ],
    complexity: { access: 'O(log n) amortized', search: 'O(log n) amortized', insert: 'O(log n) amortized', delete: 'O(log n) amortized', space: 'O(n)' },
  },
  'dag': {
    definition: `A Directed Acyclic Graph (DAG) is a directed graph with no directed cycles — you can never return to a starting vertex by following directed edges. This acyclicity property enables topological ordering: a linear ordering of vertices such that for every directed edge (u,v), u comes before v. DAGs are the mathematical model behind dependency resolution, build systems, version control, and parallel task scheduling.`,
    history: `DAGs as a formal structure emerged from operations research and scheduling theory in the 1950s–1960s. The PERT (Program Evaluation and Review Technique) algorithm (1958, US Navy) uses a DAG to model project task dependencies. Topological sorting algorithms (Kahn 1962, DFS-based 1976) became fundamental in compiler optimization and build systems. Git's commit history forms a DAG. Blockchain (Bitcoin) uses a chain which is a degenerate DAG; newer systems like IOTA use a full DAG.`,
    intuition: `A DAG is like a recipe book: each recipe step depends on previous steps, and you can only proceed forward — you can never go back to an earlier step through the dependency chain. Compiling code with dependencies, installing packages, scheduling tasks in a project — all are DAG problems. The key feature is that there are always some "source" nodes with no incoming edges (starting points) and "sink" nodes with no outgoing edges (end points).`,
    mathematicalFoundation: `DAG: G = (V, E) directed with no cycles

Topological sort exists iff graph is a DAG
  Proof: cycle → some node would need to precede itself

Kahn's algorithm:
  Maintain in-degree count for each vertex
  Start with all zero-in-degree vertices
  While queue not empty: dequeue u, add to result, decrement in-degree of neighbors
  Cycle iff result has < |V| nodes
  Time: O(V + E)

Longest path in DAG (Critical Path): O(V + E)
  Valid because no cycles to revisit nodes
  (NP-hard in general graphs, polynomial in DAGs)`,
    applications: `Build systems (Make, Bazel, Gradle): source file dependency DAGs for incremental compilation. Package managers (npm, pip, Maven): dependency resolution. Git commit history: each commit points to parent commits. Spreadsheets: cell formula dependencies. Workflow orchestration (Airflow, Luigi): task DAGs. Neural networks: computational graphs are DAGs (forward pass). Blockchain: UTXO transaction graph.`,
    advantages: `Topological sort enables linear-time dependency resolution. Longest/shortest path computable in O(V+E) — much better than general graphs. Cycle detection is exact and efficient. Clean model for dependency problems. Many problems solvable by DP over topological order.`,
    disadvantages: `Must maintain acyclicity — adding an edge might create a cycle (requires cycle detection). No natural "rank" or "priority" among vertices at the same level. Visualization of large DAGs is challenging.`,
    commonMistakes: [
      `Assuming all inputs to topological sort are DAGs — always verify with cycle detection.`,
      `Using DFS topological sort on a graph with cycles — produces incorrect results silently.`,
      `Confusing topological sort (DAG) with BFS (unweighted shortest path).`,
      `Not checking all zero-in-degree vertices at initialization in Kahn's algorithm.`,
    ],
    interviewQuestions: [
      `Topological sort using DFS and Kahn's (BFS) algorithm.`,
      `Course schedule: given prerequisites, determine if all courses can be finished.`,
      `Find the longest path in a DAG.`,
      `Count the number of paths from source to destination in a DAG.`,
      `Detect cycle in a directed graph.`,
      `Minimum number of edges to add to make a DAG.`,
    ],
    pseudocode: `TOPOLOGICAL_SORT_KAHN(graph):
  in_degree = compute in-degree for all vertices
  queue = all vertices with in_degree == 0
  result = []
  while queue not empty:
    u = queue.dequeue()
    result.append(u)
    for each neighbor v of u:
      in_degree[v]--
      if in_degree[v] == 0: queue.enqueue(v)
  if len(result) < |V|: CYCLE DETECTED
  return result`,
    stepByStep: [
      `Compute in-degree (number of incoming edges) for each vertex`,
      `Enqueue all vertices with in-degree = 0 (no prerequisites)`,
      `Dequeue a vertex, add to result, decrement in-degree of all its neighbors`,
      `If a neighbor's in-degree reaches 0, enqueue it`,
      `Repeat until queue is empty`,
      `If result size < V: graph has a cycle (not a valid DAG)`,
    ],
    relatedTopics: [
      `directed-graph`,
      `undirected-graph`,
      `adjacency-list`,
      `weighted-graph`,
    ],
    complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
  },
  'suffix-array': {
    definition: `A Suffix Array is a sorted array of all suffixes of a string. For a string S of length n, the suffix array SA is an array of indices [0..n-1] such that S[SA[0]..], S[SA[1]..], ..., S[SA[n-1]..] are in lexicographically sorted order. Combined with the LCP (Longest Common Prefix) array, suffix arrays support pattern matching in O(m + log n) and solve many advanced string problems efficiently.`,
    history: `Suffix arrays were introduced by Manber and Myers in 1990 as a space-efficient alternative to suffix trees. While suffix trees solve the same problems in O(n) construction and O(m) query, they require 20-40× more memory than the input string. Suffix arrays require only 4n bytes. The DC3/Skew algorithm (Kärkkäinen & Sanders, 2003) achieves O(n) construction. SA-IS (Nong et al., 2009) is the modern O(n) linear-time, in-place construction algorithm used in most implementations today.`,
    intuition: `Imagine writing all rotations of a string on slips of paper, then sorting them alphabetically. The suffix array records which original position each sorted suffix started at. To find if pattern P appears in text T: binary search the sorted suffix array — if P matches the start of suffix SA[mid], the position SA[mid] in T is a match. This is like looking up a word in a sorted dictionary.`,
    mathematicalFoundation: `String S of length n
Suffix i: S[i..n-1]
Suffix Array SA: SA[k] = starting index of k-th lexicographically smallest suffix

Construction:
  Naive: sort n suffixes with string comparisons: O(n² log n)
  O(n log n): prefix doubling (double sorted rank length each step)
  O(n): DC3/Skew algorithm or SA-IS

LCP Array:
  LCP[i] = length of longest common prefix of SA[i] and SA[i-1]
  Kasai's algorithm builds LCP in O(n) after SA is computed

Pattern matching:
  Binary search on SA with string comparison: O(m log n)
  With LCP array: O(m + log n)`,
    applications: `Full-text search engines: fast substring queries in large documents. Bioinformatics: genome sequence alignment (BWA aligner uses FM-index built on SA). Data compression: BWT (Burrows-Wheeler Transform) used in bzip2 and BZIP2. Longest repeated substring: found using LCP array in O(n). Longest common substring of two strings. String similarity / plagiarism detection.`,
    advantages: `Space-efficient: 4n bytes vs 20n+ for suffix tree. Supports all operations that suffix trees do (with LCP). Compatible with disk storage for very long strings. O(m log n) or O(m + log n) pattern matching.`,
    disadvantages: `More complex to use than a hash-based approach for simple substring checks. O(n log n) or O(n) construction is non-trivial to implement. For very short patterns, hashing is faster.`,
    commonMistakes: [
      `Off-by-one in suffix indexing — suffixes should cover [i, n-1] including the last character.`,
      `Using naive O(n² log n) sort for large inputs — use SA-IS or prefix doubling.`,
      `Forgetting to append a sentinel character $ (lexicographically smallest) to simplify suffix comparison.`,
      `Not computing the LCP array — many problems require both SA and LCP.`,
    ],
    interviewQuestions: [
      `Build a suffix array for a given string.`,
      `Find the longest repeated substring using a suffix array and LCP array.`,
      `Pattern matching using a suffix array.`,
      `Find the number of distinct substrings of a string using the LCP array.`,
      `Compare suffix array vs suffix tree: when to use each?`,
    ],
    pseudocode: `BUILD_SA_NAIVE(S):
  suffixes = [(S[i:], i) for i in 0..n-1]
  suffixes.sort()
  return [idx for (_, idx) in suffixes]

PATTERN_SEARCH(SA, S, P):
  lo, hi = 0, n-1
  while lo <= hi:
    mid = (lo + hi) / 2
    if S[SA[mid]:SA[mid]+m] == P: return SA[mid]
    elif S[SA[mid]:] < P: lo = mid + 1
    else: hi = mid - 1
  return NOT_FOUND`,
    stepByStep: [
      `List all n suffixes of string S with their starting indices`,
      `Sort the suffixes lexicographically`,
      `Record the starting index of each sorted suffix → this is the suffix array`,
      `For pattern matching: binary search on the suffix array`,
      `At each step, compare pattern P with suffix S[SA[mid]..SA[mid]+m-1]`,
      `Build LCP array using Kasai's algorithm for advanced string operations`,
    ],
    relatedTopics: [
      `suffix-tree`,
      `trie`,
    ],
    complexity: { access: 'N/A', search: 'O(m log n)', insert: 'N/A', delete: 'N/A', space: 'O(n)' },
  },
  'suffix-tree': {
    definition: `A Suffix Tree is a compressed trie of all suffixes of a string. For a string S of length n, it stores all n suffixes in a tree with O(n) nodes and O(n) construction time. Every internal node has at least 2 children, and edges are labeled with non-empty substrings. Suffix trees solve the most challenging string problems in optimal O(n+m) or O(n) time, at the cost of O(n) space (with a constant factor of 20-40 bytes per character).`,
    history: `Suffix trees were introduced by Peter Weiner in 1973 as "position trees." Edward McCreight (1976) improved construction to O(n) time. The most famous construction algorithm, Ukkonen's algorithm, was published by Esko Ukkonen in 1995 and achieves online (left-to-right) suffix tree construction in O(n) time and space. Suffix trees are used in bioinformatics tools like BLAST for genome alignment.`,
    intuition: `A suffix tree is like a compressed dictionary of all possible ways to describe a text. Any substring of the text corresponds to exactly one path from the root. To check if pattern P exists in text T: simply walk the tree following the characters of P — if you can complete the walk, P exists. The tree is built once from T and then answers any query in O(|P|) time.`,
    mathematicalFoundation: `Suffix tree of string S$:
  Has exactly n leaves (one per suffix)
  Has at most n-1 internal nodes
  Total edge label length = O(n)
  Each edge label stored as [l, r] pair into the string → O(n) total space

Ukkonen's algorithm:
  Builds suffix tree online, extending one character at a time
  Amortized O(1) per extension using 3 tricks:
    1. Implicit suffix tree extensions
    2. Suffix links for fast re-entry
    3. Active point tracking
  Total: O(n) time, O(n) space`,
    applications: `Exact pattern matching: O(m) after O(n) construction. Longest repeated substring: deepest internal node. Longest common substring of two strings: generalized suffix tree. Genome sequence alignment: BLAST algorithm. Data compression: LZ77 uses suffix tree internally. Plagiarism detection. All occurrences of pattern: O(m + occ) time.`,
    advantages: `O(m) pattern matching (fastest possible). Solves many string problems in optimal O(n) or O(n + m) time. Online construction (Ukkonen). Foundation for FM-index and other bioinformatics tools.`,
    disadvantages: `Large constant factor: 20-40 bytes per character of input (vs 4 bytes for suffix array). Complex implementation (Ukkonen's algorithm is notoriously tricky). Suffix array preferred for most practical applications due to memory efficiency.`,
    commonMistakes: [
      `Forgetting to append a sentinel character $ — ensures all suffixes end at a leaf.`,
      `Confusing suffix tree (one string) with generalized suffix tree (multiple strings).`,
      `Implementing Ukkonen without understanding the three extension rules.`,
      `Using suffix tree when suffix array + LCP suffices — 5-10× more memory used unnecessarily.`,
    ],
    interviewQuestions: [
      `What is the difference between a suffix tree and a trie of suffixes?`,
      `Explain how Ukkonen's algorithm achieves O(n) construction.`,
      `Find the longest repeated substring using a suffix tree.`,
      `Compare suffix tree vs suffix array — when to use each?`,
      `How does a suffix link speed up Ukkonen's algorithm?`,
    ],
    pseudocode: `PATTERN_MATCH(tree, pattern):
  node = tree.root
  i = 0
  while i < len(pattern):
    edge = node.find_edge(pattern[i])
    if edge == null: return NOT_FOUND
    for ch in edge.label:
      if i == len(pattern): return FOUND
      if pattern[i] != ch: return NOT_FOUND
      i++
    node = edge.target
  return FOUND (report all leaf indices in subtree)`,
    stepByStep: [
      `Append sentinel character $ (lexicographically smallest) to ensure all suffixes end at leaves`,
      `Build the suffix tree using Ukkonen's algorithm (online, O(n))`,
      `To search pattern P: follow edge labels matching characters of P from root`,
      `If P is fully consumed: every leaf in the current subtree is an occurrence of P`,
      `Longest repeated substring: find the deepest internal node (internal nodes = repeated prefixes)`,
      `Longest common substring of S1 and S2: build generalized suffix tree, find deepest node with leaves from both strings`,
    ],
    relatedTopics: [
      `suffix-array`,
      `trie`,
    ],
    complexity: { access: 'N/A', search: 'O(m)', insert: 'N/A', delete: 'N/A', space: 'O(n)' },
  },
  'rope': {
    definition: `A Rope is a tree-based data structure for efficiently storing and manipulating very long strings. Instead of storing the entire string in a single contiguous buffer, a rope stores string fragments in the leaves of a binary tree. Each internal node stores the total length of the string in its left subtree. This allows O(log n) string concatenation, O(log n) split, and O(log n) character access for strings of length n, compared to O(n) for simple arrays.`,
    history: `Ropes were introduced by Boehm, Atkinson, and Plass in their 1995 paper "Ropes: An Alternative to Strings." The motivation was text editors that manipulate documents with millions of characters — naive string operations (insert, delete, concat) take O(n) with flat arrays, causing visible lag. Modern text editors (Xi editor, Emacs with rope.el) and IDEs use rope-like structures. The Rust programming language uses a rope for its LSP server text document management.`,
    intuition: `A rope is like an encyclopedia stored in chapters (leaf nodes). The table of contents (internal nodes) tells you the total size of each chapter subtree. To read character #100,000: look at the table of contents to determine which chapter it falls in (O(log n) traversal). To concatenate two encyclopedias: create a new root node pointing to both — O(1). To split at position k: walk the tree, splitting along the way — O(log n).`,
    mathematicalFoundation: `Rope with n total characters:
  Leaf: stores a short string fragment (size ≤ B, typically 64–256 chars)
  Internal node: weight = total chars in left subtree
  Height: O(log n) if balanced

Operations:
  index(i): O(log n) — walk tree using weight info
  concat(r1, r2): O(1) — create new root
  split(i): O(log n) — split at position i
  insert(i, s): split(i) + concat(concat(left, new_rope(s)), right) = O(log n)
  delete(i, j): similar = O(log n)
  substr(i, j): O(j-i + log n)`,
    applications: `Text editors: Emacs, Xi-editor use rope-based text buffers for O(log n) insert/delete. IDEs: VS Code extension API uses a rope internally for document text. Collaborative editing: Operational Transformation uses rope-like structures. Gene sequence manipulation: concatenation and splitting of DNA strings. Version control: diff algorithms on rope representations.`,
    advantages: `O(log n) insert, delete, concat, split on large strings. No reallocation — no contiguous memory requirement. Natural support for undo/redo via persistent ropes (copy-on-write). Memory-efficient for large strings with many small edits.`,
    disadvantages: `O(log n) character access (vs O(1) for flat arrays). More complex implementation. Poor cache performance (tree traversal vs sequential memory). Overhead not worth it for short strings.`,
    commonMistakes: [
      `Using a rope for short strings where flat arrays are faster.`,
      `Not rebalancing the rope after many operations — height can degrade to O(n).`,
      `Incorrect weight (left-subtree length) update during split/concat.`,
    ],
    interviewQuestions: [
      `Explain the difference between a rope and a flat string for text editing.`,
      `Implement rope concat and split operations.`,
      `What is the weight of an internal rope node?`,
      `How does a rope achieve O(log n) insert?`,
    ],
    pseudocode: `CONCAT(r1, r2):
  root = new Node
  root.left  = r1
  root.right = r2
  root.weight = total_length(r1)
  return root

INDEX(node, i):
  if node is leaf: return node.str[i]
  if i < node.weight: return INDEX(node.left, i)
  else: return INDEX(node.right, i - node.weight)

SPLIT(node, i):
  // Returns (left_rope, right_rope) splitting at position i`,
    stepByStep: [
      `Leaves store actual string fragments (up to B characters)`,
      `Internal nodes store weight = length of left subtree's string`,
      `Index(i): if i < weight, descend left; else descend right with i -= weight`,
      `Concat(r1, r2): create new root, set weight = total_length(r1), done in O(1)`,
      `Split(i): walk tree, splitting nodes along the path, O(log n)`,
      `Rebalance periodically (e.g., after every k operations) to maintain O(log n) height`,
    ],
    relatedTopics: [
      `linked-list-singly`,
      `binary-tree`,
      `gap-buffer`,
    ],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },
  'gap-buffer': {
    definition: `A Gap Buffer is a simple data structure for text editing where the buffer maintains a "gap" (empty space) at the cursor position. Text before the cursor is stored before the gap; text after the cursor is stored after the gap. Insertions at the cursor position fill the gap (O(1)), and cursor movement is O(k) where k is the distance moved. When the gap is exhausted, the buffer is resized by a factor of 2 (amortized O(1)).`,
    history: `Gap buffers were used in early text editors and are still used today. GNU Emacs uses a gap buffer as its primary text buffer representation. The structure was popularized by Emacs in the 1970s and remains in use because the vast majority of text editing operations happen at or near the cursor — making gap buffers extremely efficient in practice despite their theoretical limitations.`,
    intuition: `A gap buffer is like a parking lot with reserved spaces in the middle. When you want to park (insert text), the spaces are right where you need them (at the cursor) — O(1). When you move to a different location (cursor move), you have to move the reserved spaces there — O(distance). The key insight is that cursor movement in text editors is usually small, so this is fast in practice.`,
    mathematicalFoundation: `Buffer: [before_text][       gap       ][after_text]
  gap_start: index of first gap byte
  gap_end:   index of first after-text byte
  gap_size:  gap_end - gap_start

Insert char c at cursor:
  buffer[gap_start] = c
  gap_start++
  O(1)

Delete char before cursor:
  gap_start--
  O(1)

Move cursor left by k:
  copy k chars from just before gap_start to just after gap_end
  gap_start -= k; gap_end -= k
  O(k)

Resize when gap empty:
  Allocate 2× new buffer, copy, maintain gap_start
  O(n) but amortized O(1)`,
    applications: `GNU Emacs: the primary text buffer data structure. Many text editors: Notepad, small embedded editors. Situations where sequential editing at a moving cursor dominates (most real-world text editing scenarios). Educational tool for understanding text editor internals.`,
    advantages: `O(1) insert/delete at current cursor position. Conceptually simple — just an array with a moveable gap. Excellent cache performance (sequential memory). Optimal for typical text editing: most edits happen near the cursor.`,
    disadvantages: `O(k) cursor movement (can be slow for jump-to-line). O(n) arbitrary position insert/delete. Not suitable for multiple cursors without significant complexity. Rope is better for very large documents or many random-access edits.`,
    commonMistakes: [
      `Forgetting to resize when the gap is exhausted.`,
      `Not updating gap_start and gap_end consistently during cursor movement.`,
      `Off-by-one errors in cursor position vs gap position calculation.`,
    ],
    interviewQuestions: [
      `Explain how a gap buffer works and why it's efficient for text editing.`,
      `Compare gap buffer vs rope — when would you use each?`,
      `Implement insert, delete, and cursor movement for a gap buffer.`,
      `What is the amortized complexity of insert when the gap buffer resizes?`,
    ],
    pseudocode: `INSERT(buf, c):
  if gap_start == gap_end: RESIZE(buf)
  buf.data[buf.gap_start] = c
  buf.gap_start++

DELETE_BEFORE_CURSOR(buf):
  if buf.gap_start == 0: error
  buf.gap_start--

MOVE_CURSOR_LEFT(buf):
  if buf.gap_start == 0: return
  buf.data[buf.gap_end - 1] = buf.data[buf.gap_start - 1]
  buf.gap_start--
  buf.gap_end--`,
    stepByStep: [
      `Maintain: data[] array, gap_start, gap_end indices`,
      `Text before cursor: data[0..gap_start-1]`,
      `Gap (empty space): data[gap_start..gap_end-1]`,
      `Text after cursor: data[gap_end..n-1]`,
      `Insert at cursor: fill gap_start, increment gap_start — O(1)`,
      `Move cursor left: copy char from before gap to after gap, decrement both pointers — O(1) per character`,
    ],
    relatedTopics: [
      `rope`,
      `vector`,
      `linked-list-doubly`,
    ],
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
  'xor-linked-list': {
    definition: `An XOR Linked List is a memory-efficient doubly linked list that stores only ONE pointer per node instead of two (prev and next). Each node stores XOR(prev_address, next_address). To traverse forward: XOR the stored value with the address of the previous node to get the next node's address. To traverse backward: XOR with the next node's address to get the previous node's address. This saves 50% of pointer memory compared to a standard doubly linked list.`,
    history: `XOR linked lists exploit the XOR bit trick for pointer arithmetic. The concept appears in various forms in systems programming and was popularized by a classic C programming puzzle. While theoretically elegant, XOR linked lists are rarely used in practice because: (1) modern garbage-collected languages prohibit raw pointer arithmetic, (2) the memory savings are minimal compared to the added complexity, (3) debuggers cannot traverse XOR linked lists. They remain a classic interview/puzzle problem.`,
    intuition: `The XOR trick exploits a mathematical property: if X XOR Y = Z, then Z XOR X = Y and Z XOR Y = X. By storing XOR(prev, next), we can recover either pointer by XORing with the one we already know. It's like a lock-and-key system: the node stores a "scrambled" combination of both neighbors, and each neighbor's address is the key to unlock the other.`,
    mathematicalFoundation: `XOR property: A XOR B XOR A = B
Node.npx = prev_address XOR next_address

Forward traversal starting at head:
  prev = 0 (null)
  curr = head
  loop:
    next = curr.npx XOR prev
    visit(curr)
    prev = curr
    curr = next

Memory savings:
  Standard doubly linked list: 2 pointers × n nodes = 2n pointers
  XOR linked list: 1 pointer × n nodes = n pointers
  Savings: n pointers (50%)`,
    applications: `Embedded systems with extremely limited memory. Educational purposes — demonstrates clever bit manipulation. Interview/puzzle problems. Historical use in systems programming.`,
    advantages: `50% pointer memory savings compared to doubly linked list. Same logical operations as doubly linked list. O(1) traversal in both directions (given starting position).`,
    disadvantages: `Cannot recover a node's address without knowing either its predecessor or successor. Incompatible with garbage-collected languages (GC can move objects, invalidating addresses). Debuggers cannot traverse the list. Memory allocation must return consistent integer-sized addresses. Essentially obsolete in modern computing.`,
    commonMistakes: [
      `Using XOR linked list in any managed language — garbage collector will break the XOR pointers.`,
      `Not casting pointers to uintptr_t before XOR — pointer XOR is undefined behavior in C++.`,
      `Forgetting that head.npx = XOR(0, next) and tail.npx = XOR(prev, 0).`,
    ],
    interviewQuestions: [
      `Explain how an XOR linked list saves memory.`,
      `How do you traverse an XOR linked list forward and backward?`,
      `Why are XOR linked lists rarely used in practice?`,
      `Implement insert and delete for an XOR linked list in C.`,
    ],
    pseudocode: `TRAVERSE(head):
  prev = 0 (null)
  curr = head
  while curr != null:
    visit(curr)
    next = curr.npx XOR prev
    prev = curr
    curr = next

INSERT_AT_HEAD(list, val):
  newNode.npx = XOR(0, list.head)
  if list.head != null:
    list.head.npx = XOR(newNode, (list.head.npx XOR 0))
  list.head = newNode`,
    stepByStep: [
      `Each node stores npx = XOR(address_of_prev, address_of_next)`,
      `Head.npx = XOR(0, next); Tail.npx = XOR(prev, 0)`,
      `Forward traversal: start with prev=0, curr=head`,
      `Compute next = curr.npx XOR prev_address`,
      `Update: prev = curr, curr = next, repeat`,
      `Backward traversal: start at tail, reverse the logic`,
    ],
    relatedTopics: [
      `linked-list-doubly`,
      `linked-list-singly`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(n)', space: 'O(n)' },
  },
  'linked-list-circular': {
    definition: `A Circular Linked List is a linked list where the last node's next pointer points back to the first node (head), forming a ring with no null terminator. It can be singly circular (next pointers only) or doubly circular (both next and prev pointers wrap around). Traversal continues indefinitely; you detect completion by checking if the current node equals the starting node.`,
    history: `Circular linked lists appeared naturally in operating systems as process scheduling rings. Round-robin scheduling (OS process scheduler) maintains a circular list of ready processes — the scheduler moves around the ring giving each process a time slice. The LISP language (1958) uses circular lists for certain functional programming constructs. The Josephus problem, a classic algorithmic puzzle, is naturally modeled as a circular linked list.`,
    intuition: `A circular linked list is like a group of people sitting in a circle holding hands. If you start anywhere and keep going in one direction, you'll eventually visit everyone and return to the start. There's no "last" person — the list is endless. The key challenge: detecting when you've gone around the entire circle (compared the current node to the starting node).`,
    mathematicalFoundation: `N-node circular list: each node.next forms a permutation
Round-robin scheduling fairness:
  Time per rotation: N × time_slice
  Wait time for any process: at most (N-1) × time_slice

Floyd's cycle detection adapted:
  Slow pointer: moves 1 step
  Fast pointer: moves 2 steps
  They meet iff there's a cycle (always true for circular list)
  Meeting point used to find cycle start`,
    applications: `OS round-robin scheduler: circular ready queue for fair time-sharing. Multiplayer game turns: circular list of players ensures fair turn order. Sliding window: circular buffer for streaming data. Josephus problem: circular list with elimination counting. CPU token ring networking: circular topology.`,
    advantages: `Efficient round-robin traversal — no need to return to head. Any node can serve as starting point. Doubly circular enables O(1) insert and delete at any known node.`,
    disadvantages: `Risk of infinite loops if termination condition is not properly coded. More complex than regular linked list. Harder to debug due to circular structure.`,
    commonMistakes: [
      `Infinite loop: forgetting to check curr != start as the loop termination condition.`,
      `Empty list edge case: head itself might point to itself.`,
      `Not updating the last node's next pointer correctly after insert/delete.`,
    ],
    interviewQuestions: [
      `Implement a circular linked list with insert, delete, and traversal.`,
      `Solve the Josephus problem using a circular linked list.`,
      `Detect the start of the cycle in a circular linked list.`,
      `Implement round-robin scheduling using a circular linked list.`,
    ],
    pseudocode: `TRAVERSE(list):
  if list.head == null: return
  curr = list.head
  loop:
    visit(curr)
    curr = curr.next
    if curr == list.head: break  // Completed one full circle

INSERT_AFTER(node, val):
  new_node.next = node.next
  node.next = new_node
  // For doubly circular: also update prev pointers`,
    stepByStep: [
      `Last node.next = head (not null)`,
      `For doubly circular: head.prev = tail, tail.next = head`,
      `Traversal: start at any node, stop when you return to the starting node`,
      `Insert: standard linked list insert, but update last node's next to point to head`,
      `Delete: standard deletion, ensure the predecessor's next skips the deleted node`,
      `Empty check: head == null (or in some conventions, head points to itself)`,
    ],
    relatedTopics: [
      `linked-list-singly`,
      `linked-list-doubly`,
      `queue`,
      `circular-queue`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
  'undirected-graph': {
    definition: `An undirected graph G = (V, E) consists of vertices V and edges E where each edge {u, v} is an unordered pair — the connection is bidirectional. If there's an edge between u and v, you can traverse from u to v AND from v to u with equal ease. Undirected graphs model symmetric relationships: friendship networks, road maps without one-way streets, electrical circuits, molecular bonds.`,
    history: `Undirected graph theory began with Euler's 1736 solution to the Königsberg bridge problem — the first graph theory result in history. Kirchhoff's 1847 work on electrical circuits formalized spanning trees. Modern algorithms like DFS (Hopcroft-Tarjan, 1973) and Prim's MST (1957) are foundational graph algorithms working on undirected graphs.`,
    intuition: `An undirected graph is like a friendship network on Facebook: if A is friends with B, then B is friends with A. There's no direction to the relationship. Traveling on a graph of undirected roads: if you can drive from city A to city B, you can also drive back from B to A on the same road.`,
    mathematicalFoundation: `Handshaking lemma: sum of all degrees = 2|E|
  Every edge contributes 2 to the total degree count

Connected component: maximal set of vertices reachable from each other
Cut vertex (articulation point): removing it disconnects the graph
Bridge: edge whose removal disconnects the graph

Euler circuit exists iff all vertices have even degree
Hamiltonian cycle: visits every vertex exactly once (NP-complete to find)`,
    applications: `Social networks: Facebook friendship graph (undirected). Road networks: city maps with bidirectional streets. Internet topology: network of routers with bidirectional connections. Molecular graphs: atoms as vertices, bonds as edges (chemistry). Collaboration networks: co-author graphs in academic papers. Game boards: maze/grid represented as undirected graph.`,
    advantages: `Simpler than directed graphs for symmetric relationships. Many efficient algorithms: DFS/BFS O(V+E), MST O(E log V), bipartite check O(V+E). Rich theory: connectivity, planarity, coloring, matching.`,
    disadvantages: `Cannot model asymmetric relationships (use directed graph). Some problems (e.g., shortest path) need weighted edges.`,
    commonMistakes: [
      `Storing edge (u,v) without also storing (v,u) in adjacency list (forgetting bidirectionality).`,
      `Not using a visited array in DFS/BFS — leads to infinite loops on cyclic graphs.`,
      `Confusing connected components (undirected) with strongly connected components (directed).`,
    ],
    interviewQuestions: [
      `BFS/DFS traversal of an undirected graph.`,
      `Check if an undirected graph is connected.`,
      `Detect a cycle in an undirected graph.`,
      `Check if a graph is bipartite (2-colorable).`,
      `Find all connected components.`,
      `Find all articulation points and bridges.`,
      `Kruskal's or Prim's Minimum Spanning Tree.`,
    ],
    pseudocode: `BFS(graph, start):
  visited = {start}
  queue = [start]
  while queue not empty:
    u = queue.dequeue()
    visit(u)
    for v in adj[u]:
      if v not in visited:
        visited.add(v)
        queue.enqueue(v)

CYCLE_DETECT_DFS(u, parent, visited):
  visited.add(u)
  for v in adj[u]:
    if v not in visited:
      if CYCLE_DETECT_DFS(v, u, visited): return true
    elif v != parent: return true  // Back edge (not to parent) = cycle
  return false`,
    stepByStep: [
      `Represent as adjacency list: adj[u] = list of neighbors`,
      `BFS: queue-based level-by-level traversal`,
      `DFS: recursive or stack-based depth-first traversal`,
      `Cycle detection (undirected): back edge to non-parent = cycle`,
      `Bipartite check: 2-color with BFS, check no same-color adjacency`,
      `MST: Kruskal (sort edges, union-find) or Prim (priority queue)`,
    ],
    relatedTopics: [
      `directed-graph`,
      `weighted-graph`,
      `dag`,
      `adjacency-list`,
      `adjacency-matrix`,
    ],
    complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
  },
  'weighted-graph': {
    definition: `A Weighted Graph is a graph (directed or undirected) where each edge carries a numerical weight (cost, distance, capacity, time). The weight represents the "cost" of traversing that edge. Most real-world graph problems are weighted: shortest paths in road networks, minimum cost spanning trees, maximum flow in networks. Weighted graphs require algorithms that consider edge costs rather than just topology.`,
    history: `Weighted graph algorithms emerged from operations research in the 1950s. Dijkstra's algorithm (1959) for shortest paths, Bellman-Ford (1956–1958) for graphs with negative edges, Floyd-Warshall (1962) for all-pairs shortest paths, Kruskal's and Prim's (1956–1957) for minimum spanning trees — all became foundational algorithms. Modern GPS systems, airline route optimization, and internet routing protocols (OSPF, BGP) use weighted graph algorithms.`,
    intuition: `A weighted graph is like a road map where each road segment has a travel time or toll. The graph structure tells you which cities are connected; the weights tell you how costly each connection is. Shortest path algorithms find the route minimizing total cost, not just the number of roads taken.`,
    mathematicalFoundation: `Dijkstra's algorithm (non-negative weights):
  Time: O((V + E) log V) with binary heap
  Greedy: always extend the shortest known path
  Correctness: relies on non-negative weights (triangle inequality)

Bellman-Ford (negative weights, no negative cycles):
  Time: O(VE)
  Relaxes all edges V-1 times
  Detects negative cycles in V-th iteration

Floyd-Warshall (all-pairs):
  Time: O(V³)
  DP: dist[i][j] = min over all intermediate vertices k

Kruskal's MST:
  Sort edges by weight, greedily add non-cycle edges
  O(E log E) with union-find`,
    applications: `GPS navigation: Dijkstra on road network with travel times as weights. Airline routes: minimum cost path between cities. Network routing: OSPF protocol uses shortest-path on weighted graph. Telecommunications: minimum cost spanning tree for network cabling. Game AI: A* pathfinding on weighted terrain grids. Supply chain: minimum cost flow optimization.`,
    advantages: `Models real-world costs and distances accurately. Foundation for critical algorithms: Dijkstra, Bellman-Ford, Floyd-Warshall, MST. Many practical optimization problems reduce to weighted graph problems.`,
    disadvantages: `Algorithms are more complex than unweighted equivalents. Negative edges require Bellman-Ford (O(VE)) instead of Dijkstra (O(E log V)). Negative cycles make shortest path undefined.`,
    commonMistakes: [
      `Using Dijkstra with negative edge weights — gives incorrect results; use Bellman-Ford.`,
      `Not checking for negative cycles after Bellman-Ford.`,
      `Confusing edge weight with edge count in shortest path vs hop count.`,
      `Using Floyd-Warshall for sparse graphs — O(V³) is too slow; use Dijkstra per source.`,
    ],
    interviewQuestions: [
      `Implement Dijkstra's algorithm using a priority queue.`,
      `Implement Bellman-Ford and detect negative cycles.`,
      `Find the shortest path in a grid with weighted cells using Dijkstra.`,
      `Implement Kruskal's or Prim's MST algorithm.`,
      `Find the network delay time (Dijkstra from single source).`,
      `Cheapest flights within k stops (modified Dijkstra or Bellman-Ford).`,
    ],
    pseudocode: `DIJKSTRA(graph, source):
  dist = {v: INF for all v}; dist[source] = 0
  pq = MinHeap with (0, source)
  while pq not empty:
    (d, u) = pq.extract_min()
    if d > dist[u]: continue  // Stale entry
    for (v, w) in adj[u]:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        pq.insert(dist[v], v)
  return dist`,
    stepByStep: [
      `Initialize dist[source]=0, dist[all others]=∞`,
      `Min-heap (priority queue) tracks (distance, vertex) pairs`,
      `Extract vertex with minimum distance`,
      `For each neighbor: try to improve their distance (relaxation)`,
      `If improved: add (new_dist, neighbor) to priority queue`,
      `Repeat until all reachable vertices are settled`,
    ],
    relatedTopics: [
      `directed-graph`,
      `undirected-graph`,
      `adjacency-list`,
      `min-heap`,
      `priority-queue`,
    ],
    complexity: { access: 'O(1)', search: 'O((V+E)logV)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
  },
  'adjacency-list': {
    definition: `An Adjacency List is the most common way to represent a graph in memory. Each vertex stores a list of its neighboring vertices (and optionally edge weights). For a graph with V vertices and E edges, it uses O(V + E) space. It is efficient for sparse graphs where E << V² and enables O(degree(v)) enumeration of a vertex's neighbors.`,
    history: `Adjacency lists were formalized as the standard sparse graph representation in the analysis of graph algorithms. Donald Knuth's "The Art of Computer Programming" and Cormen et al.'s CLRS both use adjacency lists as the primary representation. Nearly all practical graph algorithm implementations use adjacency lists due to their space efficiency for real-world sparse graphs.`,
    intuition: `An adjacency list is like a phonebook organized by person: each person (vertex) has their own list of contacts (neighbors). To find Alice's friends: look up Alice's entry and read her list. To check if Alice and Bob are friends: look up Alice's list and search for Bob — O(degree(Alice)) time.`,
    mathematicalFoundation: `Space: O(V + E) — V lists + E total entries across all lists
For undirected graph: each edge (u,v) appears twice — O(2E) = O(E)
For directed graph: each edge appears once — O(E)

Operations:
  List neighbors of v:  O(deg(v))
  Check if edge (u,v) exists: O(deg(u)) — scan u's list
  Add edge: O(1) — append to list
  Remove edge: O(deg(u)) — scan and remove

vs Adjacency Matrix:
  Space: O(V+E) vs O(V²)
  Edge check: O(deg) vs O(1)
  Neighbors: O(deg) vs O(V)
  Preferred for: sparse graphs — real-world networks`,
    applications: `Standard representation for all graph algorithms: BFS, DFS, Dijkstra, Kruskal, Prim, Tarjan. Social network graphs (billions of users, each with ~hundreds of friends — sparse). Web crawler graph. Routing tables in networking. Dependency graphs in build systems.`,
    advantages: `Space-efficient for sparse graphs: O(V+E) vs O(V²) for matrix. Efficient neighbor enumeration. Easy to add edges. Standard and universally understood.`,
    disadvantages: `O(deg(v)) edge existence check (vs O(1) for matrix). Cannot efficiently check "does edge (u,v) exist?" without scanning the list. For dense graphs, matrix is more efficient.`,
    commonMistakes: [
      `For undirected graphs: forgetting to add both (u→v) and (v→u) to the lists.`,
      `Using a matrix instead of a list for sparse graphs — wastes O(V²) memory.`,
      `Not handling multiple edges (multigraph) when the problem requires it.`,
    ],
    interviewQuestions: [
      `When would you choose adjacency list vs adjacency matrix?`,
      `Implement BFS and DFS using an adjacency list.`,
      `Represent a weighted graph with an adjacency list.`,
    ],
    pseudocode: `// Graph as Map<vertex, List<vertex>>
adj = {}
for each vertex v: adj[v] = []

ADD_EDGE(u, v, weight=1):
  adj[u].append((v, weight))
  adj[v].append((u, weight))  // If undirected

BFS(start):
  visited = {start}
  queue = [start]
  while queue:
    u = queue.dequeue()
    for (v, _) in adj[u]:
      if v not in visited:
        visited.add(v); queue.enqueue(v)`,
    stepByStep: [
      `Create a dictionary/array of size V, each entry is an empty list`,
      `Add edge (u,v): append v to adj[u], append u to adj[v] (if undirected)`,
      `Weighted edge: store (neighbor, weight) tuples instead of just neighbor`,
      `BFS: start at source, enqueue neighbors not yet visited`,
      `DFS: recursively visit each unvisited neighbor`,
      `For algorithms like Dijkstra: adjacency list gives efficient neighbor iteration`,
    ],
    relatedTopics: [
      `adjacency-matrix`,
      `directed-graph`,
      `undirected-graph`,
      `weighted-graph`,
    ],
    complexity: { access: 'O(deg)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(deg)', space: 'O(V+E)' },
  },
  'adjacency-matrix': {
    definition: `An Adjacency Matrix is a 2D array (matrix) of size V×V used to represent a graph. matrix[i][j] = 1 (or the edge weight) if there's an edge from vertex i to vertex j, and 0 (or ∞) otherwise. It provides O(1) edge existence checks and is ideal for dense graphs. For V = 1000 vertices, the matrix uses 1MB (1000²×1 byte); for V = 1,000,000 it's 1TB — only feasible for small or dense graphs.`,
    history: `Adjacency matrices have been used in mathematics since the study of algebraic graph theory. The matrix representation naturally supports matrix algebra operations: the k-th power of the adjacency matrix gives the number of paths of length k between any two vertices. This connection between matrix algebra and graph theory was developed by Cayley, Sylvester, and others in the 19th century.`,
    intuition: `An adjacency matrix is like a seating chart for a dinner party: rows are guests (departure), columns are guests (arrival), and a 1 means they can sit next to each other (edge exists). Checking if Alice can sit next to Bob: look at matrix[Alice][Bob] — O(1). Listing all of Alice's neighbors requires scanning the entire Alice row — O(V).`,
    mathematicalFoundation: `A^k [i][j] = number of walks of length k from i to j
  Computed via matrix exponentiation in O(V³ log k)

Transitive closure:
  A* = I + A + A² + ... = (I - A)⁻¹ (for |eigenvalues| < 1)
  Or Floyd-Warshall in O(V³)

For weighted graph: matrix[i][j] = weight or ∞ if no edge
Symmetric for undirected: matrix[i][j] = matrix[j][i]`,
    applications: `Dense graphs: complete or near-complete graphs. Floyd-Warshall all-pairs shortest path: natural matrix DP. Graph algorithms in computational linear algebra. Small graphs in competitive programming. Network flow (small V). Graph neural networks: sparse adjacency matrix as input.`,
    advantages: `O(1) edge existence check. O(V) to list all neighbors (scan a row). Simple to implement. Natural for matrix-algebra-based graph algorithms. Efficient for dense graphs.`,
    disadvantages: `O(V²) space — prohibitive for large sparse graphs. O(V) to enumerate neighbors (even if vertex has only 2 neighbors). Adding vertices requires resizing the entire matrix.`,
    commonMistakes: [
      `Using adjacency matrix for sparse graphs — wastes O(V²) space.`,
      `Not initializing matrix with ∞ (or 0) correctly for weighted graphs.`,
      `For undirected: only filling matrix[i][j] without matrix[j][i].`,
      `Integer overflow when computing matrix powers — use modular arithmetic.`,
    ],
    interviewQuestions: [
      `When do you prefer adjacency matrix over adjacency list?`,
      `Implement Floyd-Warshall on an adjacency matrix.`,
      `Find the number of paths of length k between two vertices.`,
      `Check if two vertices are connected in O(1) using adjacency matrix.`,
    ],
    pseudocode: `// Initialize V×V matrix with 0
matrix = [[0]*V for _ in range(V)]

ADD_EDGE(u, v, weight=1):
  matrix[u][v] = weight
  matrix[v][u] = weight  // If undirected

FLOYD_WARSHALL(dist):
  for k in 0..V-1:
    for i in 0..V-1:
      for j in 0..V-1:
        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`,
    stepByStep: [
      `Create V×V matrix, initialize all entries to 0 (or ∞ for weighted shortest path)`,
      `Add edge (u,v): set matrix[u][v] = 1 (or weight)`,
      `For undirected: also set matrix[v][u] = 1`,
      `Edge check: return matrix[u][v] != 0`,
      `Neighbors of u: iterate row u, collect all j where matrix[u][j] != 0`,
      `Floyd-Warshall: triple loop over all intermediate vertices k`,
    ],
    relatedTopics: [
      `adjacency-list`,
      `directed-graph`,
      `undirected-graph`,
      `weighted-graph`,
    ],
    complexity: { access: 'O(1)', search: 'O(V²)', insert: 'O(1)', delete: 'O(1)', space: 'O(V²)' },
  },
}
