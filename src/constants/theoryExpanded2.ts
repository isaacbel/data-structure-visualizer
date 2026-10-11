/**
 * theoryExpanded2.ts — AUTO-GENERATED
 * Rich, textbook-grade theory content — Part 2 (remaining data structures).
 * DO NOT EDIT MANUALLY. Regenerate with: node scripts/populate-theory-2.cjs
 */

import type { TheoryContent, TheoryResource } from '@/types'

// Silence unused import warning
type _R = TheoryResource

export const THEORY_EXPANDED2: Record<string, Partial<TheoryContent>> = {
  'vector': {
    definition: `A dynamic array (called Vector in C++, ArrayList in Java, and list in Python) is a resizable array that automatically grows when elements exceed its current capacity. Internally it maintains: a pointer to a heap-allocated buffer, a logical "size" (number of elements currently stored), and a physical "capacity" (size of the allocated buffer). When size reaches capacity, a new buffer—typically double the old size—is allocated, all elements are copied, and the old buffer is freed.`,
    history: `Static arrays dominated early computing, but their fixed-size requirement was a constant source of bugs and wasted memory. Dynamic arrays emerged with the rise of structured languages in the 1970s. The C++ STL std::vector was standardized in C++98. Java's ArrayList appeared in Java 1.2 (1998). Python's list (internally implemented as a dynamic array in CPython since version 1.5, 1997) is perhaps the world's most-used dynamic array. The doubling growth strategy was formalized and analyzed by Sedgewick and Wayne in their Algorithms textbook.`,
    intuition: `Think of a dynamic array like a bookshelf you can expand. When it fills up, you buy a new shelf twice as big, move all books over, and continue. The occasional expensive "move-all-books" operation is amortized across the many cheap "add-one-book" operations, giving O(1) amortized cost.`,
    mathematicalFoundation: `Amortized analysis via potential method:
Let Φ = 2·size − capacity (potential energy)
Each cheap insert costs 1 + ΔΦ = 1 + 2 = O(1)
Each resize insert costs n + ΔΦ = n + (0 - n) = O(1)

Total cost of n insertions = O(n) → amortized O(1) each

Growth factor g = 2: wastes up to 50% capacity
Growth factor g = 1.5: balances memory and copy cost
Java ArrayList uses g = 1.5; Python uses g ≈ 1.125 (finer steps)`,
    applications: `Python lists, JavaScript arrays, Java ArrayList, C++ std::vector, C# List<T>, Rust Vec<T>. Used everywhere arrays are needed but size is unknown at compile time: collecting query results, building output buffers, implementing stacks and queues, storing variable-length datasets.`,
    advantages: `O(1) amortized append. O(1) random access by index (like static arrays). O(n) sequential scan with excellent cache locality (contiguous memory). Automatically manages its own memory. Simpler API than linked lists. Supported as a first-class type in every major language.`,
    disadvantages: `O(n) insert/delete in the middle (shifts elements). Resizing is O(n) in worst case (though amortized O(1)). Wastes up to 50% memory when half-full after resize. Not thread-safe by default. Worst-case latency spike during resize (important for real-time systems).`,
    comparisons: `Dynamic Array vs Static Array: Dynamic grows automatically; static has fixed compile-time size. Static is slightly faster (no capacity checks). Dynamic Array vs Linked List: Dynamic array wins on O(1) access, cache efficiency, lower pointer overhead. Linked list wins on O(1) middle insert/delete without shifting.`,
    commonMistakes: [
      `Modifying a dynamic array while iterating over it — causes index skipping or exceptions.`,
      `Assuming size == capacity — size is elements used, capacity is memory allocated.`,
      `Using a dynamic array for FIFO queue — front-dequeue is O(n). Use a deque instead.`,
      `In C++: invalidating iterators after push_back causes reallocation.`,
      `In Java: using ArrayList<int> instead of ArrayList<Integer> — primitives require boxing.`,
    ],
    interviewQuestions: [
      `Explain amortized O(1) insertion in a dynamic array.`,
      `Why is the growth factor typically 2 or 1.5?`,
      `How would you implement a dynamic array from scratch in C?`,
      `What is the difference between size and capacity in a dynamic array?`,
      `Why is deletion from the middle O(n) even in a dynamic array?`,
      `Implement a stack using a dynamic array.`,
      `Implement a circular buffer using a fixed-size array.`,
    ],
    optimizations: [
      `Pre-allocate capacity with reserve() when final size is known.`,
      `Use shrink_to_fit() after bulk removal to reclaim wasted memory.`,
      `For performance-critical paths, use raw arrays and manual realloc in C/C++.`,
      `Consider std::deque (C++) or collections.deque (Python) for frequent front-insertions.`,
    ],
    relatedTopics: [
      `array`,
      `stack`,
      `deque`,
      `linked-list-singly`,
    ],
    pseudocode: `PUSH(element):
  if size == capacity:
    newCap = capacity * 2
    allocate new buffer[newCap]
    copy all elements to new buffer
    free old buffer
    capacity = newCap
  buffer[size] = element
  size++

POP():
  if size == 0: error
  size--
  return buffer[size]

GET(i):
  if i < 0 or i >= size: error
  return buffer[i]`,
    stepByStep: [
      `Initialize buffer with capacity=1, size=0`,
      `To insert: check if size==capacity`,
      `If full: allocate new buffer of size capacity×2, copy all elements, free old buffer`,
      `Place new element at buffer[size], increment size`,
      `To delete middle: shift all elements after index left by one position, decrement size`,
      `To access: compute buffer[index] directly (O(1))`,
    ],
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(1) amortized', delete: 'O(n)', space: 'O(n)' },
  },
  'linked-list-singly': {
    definition: `A singly linked list is a linear data structure where each element is stored in a node containing: (1) the data value, and (2) a pointer to the next node in the sequence. The list is accessed via a head pointer to the first node. The last node's next pointer is null, marking the end of the list. Unlike arrays, nodes are not stored contiguously in memory — each is independently allocated on the heap.`,
    history: `Linked lists were invented by Allen Newell, Cliff Shaw, and Herbert Simon at RAND Corporation in 1955–1956 as part of the IPL (Information Processing Language) for their Logic Theorist AI program — the first AI program to prove mathematical theorems. The structure later appeared in LISP (1958, John McCarthy) as the fundamental cons cell (a pair of car/cdr pointers), making linked lists central to the history of both AI and functional programming.`,
    intuition: `A linked list is like a treasure hunt: each clue (node) tells you where to find the next clue. To find item #5, you must follow 5 clues in sequence. There's no shortcut to jump directly to item #5 — you always start from the beginning (head). Inserting or removing an item is easy once you know its location — just redirect the surrounding arrows. No shifting required.`,
    mathematicalFoundation: `For a singly linked list with n nodes:
  Head traversal to position k: k steps = O(k)
  Linear scan: O(n)
  Insert at head: O(1) — redirect 2 pointers
  Insert at tail (with tail pointer): O(1)
  Insert at position k: O(k) to reach, O(1) to rewire
  Space per node: sizeof(data) + sizeof(pointer)
  Total space: n × (sizeof(data) + sizeof(pointer))

Detecting cycles: Floyd's tortoise and hare algorithm
  Fast pointer moves 2 steps, slow moves 1
  If they meet, a cycle exists → O(n) time, O(1) space`,
    applications: `Implementing stacks (push/pop at head = O(1)). Hash table chaining for collision resolution. Undo/redo command queues. Memory allocator free lists. Polynomial arithmetic (terms stored as nodes). Browser tab history. Music player playlists. Graph adjacency lists.`,
    advantages: `Dynamic size — grows one node at a time without pre-allocation. O(1) insert/delete at the head or when position is known. No wasted capacity slots (each node is exactly sized). Natural recursive structure matches recursive algorithms. Efficient for implementing stacks and deques.`,
    disadvantages: `No random access — must traverse from head: O(n). Extra memory per node for the next pointer (typically 8 bytes on 64-bit systems). Poor cache performance — nodes scattered in heap memory, causing cache misses. Reverse traversal requires a second pass or a doubly linked list. Not suitable for algorithms requiring index-based access.`,
    comparisons: `Singly vs Doubly Linked List: Doubly adds a prev pointer enabling O(1) backward traversal and more efficient deletion when the node is known. Costs an extra 8 bytes per node. Singly vs Array: Array wins on O(1) random access and cache efficiency. Singly wins on O(1) insert/delete at head and no fixed capacity.`,
    commonMistakes: [
      `Losing the head pointer before completing an operation — the entire list is orphaned.`,
      `Not handling the empty list case (head == null) before dereferencing.`,
      `Off-by-one in traversal — stopping one node too early.`,
      `Forgetting to update the tail pointer when inserting at the end.`,
      `Memory leak in C/C++ — not freeing deleted nodes.`,
      `Creating a cycle accidentally by setting next incorrectly during insertion.`,
    ],
    interviewQuestions: [
      `Reverse a singly linked list in O(n) time and O(1) space.`,
      `Detect a cycle in a linked list (Floyd's Tortoise and Hare).`,
      `Find the middle element of a linked list in one pass.`,
      `Merge two sorted linked lists into one sorted list.`,
      `Remove the Nth node from the end of a list.`,
      `Check if a linked list is a palindrome.`,
      `Find the intersection point of two linked lists.`,
      `Remove duplicates from an unsorted linked list.`,
      `Clone a linked list with random pointers.`,
      `Sort a linked list using merge sort.`,
    ],
    optimizations: [
      `Store a tail pointer for O(1) append without traversal.`,
      `For read-heavy workloads, unroll the list into a cache-friendly array instead.`,
      `Use a sentinel/dummy head node to eliminate null checks in insertion/deletion code.`,
      `Pool-allocate nodes from a pre-allocated block for better cache locality.`,
    ],
    pseudocode: `INSERT_HEAD(list, val):
  newNode = allocate Node
  newNode.data = val
  newNode.next = list.head
  list.head = newNode

DELETE(list, val):
  prev = null, curr = list.head
  while curr != null:
    if curr.data == val:
      if prev == null: list.head = curr.next
      else: prev.next = curr.next
      free(curr)
      return
    prev = curr; curr = curr.next

REVERSE(list):
  prev = null, curr = list.head
  while curr != null:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  list.head = prev`,
    stepByStep: [
      `Create a new node with the given data and next=null`,
      `To insert at head: point new node's next to current head, update head to new node`,
      `To insert at position k: traverse k-1 nodes to find predecessor`,
      `Wire new node between predecessor and its former next`,
      `To delete: traverse to find node, wire predecessor's next to deleted node's next`,
      `Free the deleted node's memory (in manual memory management languages)`,
    ],
    relatedTopics: [
      `linked-list-doubly`,
      `linked-list-circular`,
      `stack`,
      `queue`,
      `array`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
  'linked-list-doubly': {
    definition: `A doubly linked list extends the singly linked list by giving each node two pointers: next (pointing forward) and prev (pointing backward). This enables bidirectional traversal and O(1) deletion when the node reference is known (no need to find the predecessor, since prev already stores it). Many production data structures — LRU caches, browser history, text editor rope nodes — use doubly linked lists for exactly this reason.`,
    history: `The doubly linked list evolved naturally from the singly linked list once programmers needed efficient backward traversal. It became central to operating system design: the Linux kernel's list.h implements an intrusive doubly linked list used throughout the kernel for process scheduling, memory management, and file systems. The LRU cache — ubiquitous in databases and CPU caches — relies fundamentally on a doubly linked list for O(1) move-to-front.`,
    intuition: `Unlike a one-way street (singly linked), a doubly linked list is a two-lane road — you can drive in either direction. If you're standing at any node, you can immediately go to the node before it (prev) or after it (next) without returning to the start. This makes deletion at known positions trivial: just tell your neighbors to skip you.`,
    mathematicalFoundation: `Space overhead: 2 pointers per node = 16 extra bytes (on 64-bit) vs 8 for singly
Delete at known node: O(1) — update 2 pointers
Insert between nodes A and B: O(1) — update 4 pointers

For a doubly linked list used as deque:
  push_front: O(1)  pop_front: O(1)
  push_back: O(1)   pop_back: O(1)
  This makes it a perfect deque implementation`,
    applications: `LRU Cache: move accessed node to front in O(1). Browser history: back and forward buttons navigate prev/next pointers. Text editors: gap buffer or rope-like structures for cursor movement. OS process queues: Linux kernel task_struct uses an intrusive doubly linked list. Undo/redo: each state is a node; undo goes to prev, redo to next. Music players: previous/next song navigation.`,
    advantages: `O(1) deletion at any known node (no predecessor search needed). Bidirectional traversal. Serves as both a stack and a queue efficiently (deque). Natural implementation for LRU cache and history systems. Can be traversed forward or backward.`,
    disadvantages: `16 bytes of pointer overhead per node (vs 8 for singly). More complex insert/delete code — must update 4 pointers instead of 2. No random access — still O(n) to reach position k. Poor cache performance (scattered heap allocation). Higher cognitive complexity for beginners.`,
    commonMistakes: [
      `Only updating next without updating prev (or vice versa) — breaks bidirectional traversal.`,
      `Not handling head/tail special cases when inserting at boundaries.`,
      `Forgetting to null out prev/next on deleted nodes — can cause dangling pointer bugs.`,
      `Using doubly linked list when a singly linked list or deque suffices.`,
    ],
    interviewQuestions: [
      `Implement an LRU cache using a doubly linked list and hash map.`,
      `Flatten a multilevel doubly linked list.`,
      `Convert a doubly linked list to a balanced BST.`,
      `Implement a deque using a doubly linked list.`,
      `Clone a doubly linked list.`,
    ],
    relatedTopics: [
      `linked-list-singly`,
      `linked-list-circular`,
      `lru-cache`,
      `deque`,
    ],
    pseudocode: `DELETE_NODE(node):
  node.prev.next = node.next
  node.next.prev = node.prev
  free(node)

INSERT_AFTER(node, val):
  newNode.data = val
  newNode.next = node.next
  newNode.prev = node
  if node.next != null: node.next.prev = newNode
  node.next = newNode`,
    stepByStep: [
      `Each node stores: data, prev pointer, next pointer`,
      `Head.prev = null, Tail.next = null`,
      `Insert after node A: create B, set B.prev=A, B.next=A.next, update A.next.prev=B, A.next=B`,
      `Delete node N: set N.prev.next = N.next and N.next.prev = N.prev`,
      `Update head if deleting head, update tail if deleting tail`,
    ],
    optimizations: [
      `Use sentinel head and tail nodes to eliminate all boundary null checks.`,
      `Intrusive doubly linked list (Linux kernel style): embed list pointers inside payload struct to avoid extra allocation.`,
      `XOR linked list: save one pointer per node using XOR of prev and next addresses (advanced, not recommended for production).`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
  'stack': {
    definition: `A stack is a linear data structure following the Last-In, First-Out (LIFO) principle: the last element inserted is the first one removed. Operations are restricted to one end called the top. The three core operations are: Push (insert at top), Pop (remove from top), and Peek/Top (inspect top without removing). Stacks are one of the most fundamental abstractions in computer science, appearing in language runtimes, parsers, and undo systems.`,
    history: `The stack concept was developed by Friedrich L. Bauer and Klaus Samelson in 1955–1957 at the Technical University of Munich, who filed a German patent for a "push-down store" for expression evaluation. Alan Turing had implicitly used a stack model in his 1945 design of the ACE computer. The program call stack — the stack of function invocations that every program maintains — was formalized with the rise of structured programming (Dijkstra, 1968). Every compiled language runtime uses a hardware-assisted call stack managed by the CPU's stack pointer register.`,
    intuition: `A stack is like a stack of plates: you always add to the top and remove from the top. You cannot access the 3rd plate without removing the plates on top of it first. This constraint is not a limitation — it's a feature that makes stacks perfect for problems where you need to "remember where you came from": function calls, parenthesis matching, expression evaluation, and backtracking.`,
    mathematicalFoundation: `LIFO property: the last element pushed is the first popped
Formal definition:
  push(s, x): s → s + [x]
  pop(s): returns x, s → s without last element
  Invariant: pop(push(s, x)) = s

Call stack depth for recursive algorithm:
  DFS on n-node tree: O(h) stack frames, h = height
  Fibonacci naive recursion: O(2^n) calls, O(n) stack depth

Pushdown automaton: a finite automaton + stack
  Recognizes context-free languages (programming language syntax)`,
    applications: `Function call stack: every function call pushes a stack frame (return address + local variables); return pops it. Expression evaluation: infix-to-postfix conversion (Shunting-Yard algorithm). Bracket matching: balanced parentheses checker. Browser back button: URL history stack. Text editor undo: each edit pushed as a command object. DFS graph traversal: uses explicit or implicit (recursion) stack. Compiler parsing: recursive descent parsers use the call stack. Syntax highlighting: nested code structure matching.`,
    advantages: `Extremely simple: only 3 operations needed. O(1) push, pop, and peek. Naturally maps to recursive algorithms (call stack equivalence). Enforces ordered access, preventing random corruption. Efficient for expression parsing, syntax analysis, and backtracking. Hardware acceleration via CPU stack pointer register.`,
    disadvantages: `No random access — only the top element is accessible. O(n) search for arbitrary elements. Fixed-size array implementations risk stack overflow. Dynamic implementations have pointer overhead. The LIFO constraint means you cannot use a stack where FIFO ordering is needed.`,
    comparisons: `Stack vs Queue: Stack is LIFO (last in, first out); Queue is FIFO (first in, first out). DFS uses a stack; BFS uses a queue. Stack vs Deque: Deque supports push/pop at both ends; Stack is restricted to one end. A Deque can simulate a stack. Stack vs Array: Array offers O(1) indexed access; Stack only exposes the top.`,
    commonMistakes: [
      `Stack overflow: recursion too deep without a base case.`,
      `Popping from an empty stack — always check isEmpty() first.`,
      `Using a stack when a queue is needed (confusing LIFO and FIFO semantics).`,
      `Forgetting that Java java.util.Stack is synchronized (slow) — prefer Deque.`,
      `Not accounting for the stack frame size in recursive depth estimation.`,
    ],
    interviewQuestions: [
      `Implement a stack using two queues.`,
      `Implement a queue using two stacks.`,
      `Evaluate a postfix (RPN) expression using a stack.`,
      `Implement an algorithm to check balanced parentheses.`,
      `Find the next greater element for each element in an array (monotonic stack).`,
      `Implement a min-stack that returns the minimum element in O(1).`,
      `Simplify a Unix file path string using a stack.`,
      `Decode a nested encoded string using a stack.`,
    ],
    pseudocode: `PUSH(stack, x):
  stack.top++
  stack.data[stack.top] = x

POP(stack):
  if stack.top == -1: error "underflow"
  x = stack.data[stack.top]
  stack.top--
  return x

PEEK(stack):
  if stack.top == -1: error "empty"
  return stack.data[stack.top]`,
    stepByStep: [
      `Maintain a pointer "top" initially at -1 (empty stack)`,
      `Push: increment top, store element at data[top]`,
      `Pop: read data[top], decrement top, return the value`,
      `Peek: return data[top] without decrementing`,
      `isEmpty: check top == -1`,
      `isFull (array-based): check top == capacity - 1`,
    ],
    optimizations: [
      `Use a dynamic array as the backing store for auto-resizing.`,
      `For thread-safe stacks, use a lock-free Treiber stack (CAS-based).`,
      `For minimum-element tracking, maintain a parallel min-stack.`,
      `In hot paths, prefer array-based stack over linked-list stack for cache efficiency.`,
    ],
    relatedTopics: [
      `queue`,
      `deque`,
      `linked-list-singly`,
      `vector`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
  'queue': {
    definition: `A queue is a linear data structure following the First-In, First-Out (FIFO) principle: the first element inserted is the first one removed. Insertions (enqueue) happen at the rear and removals (dequeue) happen at the front. Queues model any real-world waiting line: customers at a bank, packets in a network buffer, print jobs waiting for a printer.`,
    history: `Queuing theory was formalized by Danish engineer Agner Krarup Erlang in 1909 for telephone network design. The data structure form appeared in early computer systems as I/O buffers and scheduling queues. E.W. Dijkstra's BFS algorithm (1959), which uses a queue, helped establish queues as a fundamental CS abstraction. Modern CPU branch predictors and out-of-order execution units use hardware queue structures called ROBs (Reorder Buffers).`,
    intuition: `A queue is exactly like a line at a coffee shop: first customer to arrive is first to be served. New customers join at the back (enqueue). The cashier serves customers from the front (dequeue). This fairness property — preserving arrival order — makes queues the foundation of fair scheduling and ordered processing.`,
    mathematicalFoundation: `FIFO property: first-in, first-out ordering
Circular array implementation:
  front, rear indices modulo capacity
  enqueue: rear = (rear + 1) % capacity
  dequeue: front = (front + 1) % capacity
  Full: (rear + 1) % capacity == front
  Empty: front == rear

Little's Law (queuing theory):
  L = λW
  L = average items in queue
  λ = arrival rate
  W = average wait time`,
    applications: `BFS graph traversal: queue drives the level-by-level expansion. OS task scheduler: CPU round-robin scheduling uses process queues. Network packet buffers: routers queue packets when congested. Print spooler: print jobs queued in arrival order. Web server request queue: HTTP request processing. Asynchronous messaging: Kafka, RabbitMQ, SQS all implement distributed queues. Keyboard buffer: keystrokes queued before CPU processes them.`,
    advantages: `Fair ordering (FIFO): ensures no starvation. O(1) enqueue and dequeue with circular array implementation. Natural fit for producer-consumer concurrency patterns. Simple and predictable semantics.`,
    disadvantages: `No random access. Only front and rear elements accessible. Linear array implementation wastes memory (elements drift toward the end). FIFO ordering means urgent items cannot jump the queue (use priority queue instead).`,
    comparisons: `Queue vs Stack: Queue is FIFO, Stack is LIFO. BFS uses queue, DFS uses stack. Queue vs Deque: Deque adds O(1) insert/delete at both ends; Queue is restricted. Queue vs Priority Queue: Priority queue dequeues by priority, not arrival order.`,
    commonMistakes: [
      `Queue drift in fixed-array implementations — use circular (ring) buffer.`,
      `Confusing enqueue (rear) and dequeue (front) directions.`,
      `Not checking isEmpty() before dequeue — causes underflow.`,
      `Using a queue when a priority queue is needed (ignoring item urgency).`,
      `Thread-safety: standard queue implementations are not thread-safe.`,
    ],
    interviewQuestions: [
      `Implement a queue using two stacks.`,
      `Design a circular queue with fixed capacity.`,
      `BFS shortest path on a grid using a queue.`,
      `Implement a sliding window maximum using a deque.`,
      `Serialize a binary tree level by level using a queue.`,
      `Design a recently-used queue (move to back on access).`,
    ],
    pseudocode: `ENQUEUE(queue, x):
  if isFull: error
  queue.data[queue.rear] = x
  queue.rear = (queue.rear + 1) % capacity
  queue.size++

DEQUEUE(queue):
  if isEmpty: error
  x = queue.data[queue.front]
  queue.front = (queue.front + 1) % capacity
  queue.size--
  return x`,
    stepByStep: [
      `Maintain front (removal end) and rear (insertion end) indices`,
      `Enqueue: place element at data[rear], advance rear circularly`,
      `Dequeue: read data[front], advance front circularly`,
      `Empty when size == 0, Full when size == capacity`,
      `Circular indexing: idx = (idx + 1) % capacity`,
    ],
    relatedTopics: [
      `stack`,
      `deque`,
      `priority-queue`,
      `circular-queue`,
    ],
    optimizations: [
      `Use a circular (ring) buffer to avoid memory drift in fixed-size queues.`,
      `For concurrent use, implement a lock-free Michael-Scott queue.`,
      `Use a deque as backing store for amortized O(1) operations.`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
  'deque': {
    definition: `A Deque (Double-Ended Queue, pronounced "deck") is a generalization of both stacks and queues that allows insertion and deletion at both the front and the rear in O(1) time. It combines the capabilities of a stack (LIFO from one end) and a queue (FIFO across ends) into a single versatile structure.`,
    history: `Deques were formalized as an abstract data type in the 1960s. The C++ std::deque (standardized in C++98) implements a deque using a map of fixed-size memory blocks, giving O(1) push/pop at both ends without a single large contiguous allocation. Java's ArrayDeque (Java 6, 2006) is implemented as a circular array and is now the preferred replacement for both Stack and Queue in Java — Josh Bloch's Effective Java recommends it explicitly.`,
    intuition: `A deque is like a train that people can board and exit from both the front and the back simultaneously. Need LIFO? Push and pop from the same end. Need FIFO? Push to one end and pop from the other. Need a sliding window? Maintain a monotonic deque. The deque's flexibility makes it useful for algorithms that need both stack and queue behavior.`,
    mathematicalFoundation: `Deque operations:
  push_front: O(1) amortized
  push_back:  O(1) amortized
  pop_front:  O(1) amortized
  pop_back:   O(1) amortized
  peek_front/back: O(1)

Circular array implementation:
  front = (front - 1 + capacity) % capacity  (push_front)
  rear  = (rear + 1) % capacity              (push_back)
  Full: (rear + 1) % capacity == front`,
    applications: `Sliding window maximum/minimum (LeetCode 239): maintains a monotone deque. Work-stealing scheduler: idle threads steal tasks from the back of busy threads' deques. Browser history: back (pop from history-stack) and forward (pop from forward-stack). Palindrome checking: pop from both ends simultaneously. A* search: 0-1 BFS uses deque (cost-0 edges push to front, cost-1 to back).`,
    advantages: `Combines stack and queue capabilities. O(1) operations at both ends. More flexible than either stack or queue. Java ArrayDeque is faster than LinkedList for most operations due to better cache behavior.`,
    disadvantages: `No O(1) random access (unlike an array). More complex implementation than stack or queue alone. Slightly more memory overhead than a pure stack or queue.`,
    commonMistakes: [
      `Confusing front and back conventions — be consistent about which end is "front".`,
      `Using Java LinkedList as a deque — ArrayDeque is significantly faster.`,
      `Assuming Java Deque has a peek() method — it has peekFirst() and peekLast().`,
    ],
    interviewQuestions: [
      `Sliding window maximum of size k (use monotonic deque).`,
      `Implement a deque using two stacks.`,
      `Design an iterator that traverses a deque from both ends alternately.`,
      `Use a deque to implement a palindrome checker.`,
      `0-1 BFS: shortest path with edge weights 0 or 1.`,
    ],
    relatedTopics: [
      `stack`,
      `queue`,
      `circular-queue`,
      `priority-queue`,
    ],
    pseudocode: `PUSH_FRONT(deque, x):
  deque.front = (deque.front - 1 + cap) % cap
  deque.data[deque.front] = x

PUSH_BACK(deque, x):
  deque.data[deque.rear] = x
  deque.rear = (deque.rear + 1) % cap

POP_FRONT(deque):
  x = deque.data[deque.front]
  deque.front = (deque.front + 1) % cap
  return x

POP_BACK(deque):
  deque.rear = (deque.rear - 1 + cap) % cap
  return deque.data[deque.rear]`,
    stepByStep: [
      `Use a circular array with front and rear indices`,
      `push_front: decrement front circularly, write element`,
      `push_back: write element at rear, increment rear circularly`,
      `pop_front: read front element, increment front circularly`,
      `pop_back: decrement rear circularly, read element`,
      `Empty: front == rear; Full: (rear+1)%cap == front`,
    ],
    optimizations: [
      `Use block-based allocation (C++ std::deque model) to avoid single large reallocation.`,
      `For concurrent use, consider lock-free Chase-Lev work-stealing deque.`,
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
  'red-black-tree': {
    definition: `A Red-Black tree is a self-balancing binary search tree where each node carries an extra bit of information: its color (red or black). Five invariants (Red-Black properties) guarantee that the tree remains approximately balanced: (1) every node is red or black, (2) the root is black, (3) every null leaf is black, (4) a red node has only black children, (5) all paths from any node to its null descendants contain the same number of black nodes (black-height). Together these ensure the tree height is at most 2·log₂(n+1).`,
    history: `Red-Black trees were invented by Rudolf Bayer in 1972 under the name "symmetric binary B-trees". The red-black coloring and modern description were introduced by Leonidas Guibas and Robert Sedgewick in their 1978 paper "A dichromatic framework for balanced trees". The structure became the standard balanced BST in production after being adopted by the C++ STL (std::map, std::set), Java (TreeMap, TreeSet), and the Linux kernel's CFS scheduler.`,
    intuition: `Think of a red-black tree as a relaxed AVL tree. Instead of enforcing height difference ≤ 1 everywhere (strict), red-black trees enforce a weaker constraint using colors: "no two consecutive reds" + "equal black-height on all paths". This allows more imbalance (up to 2× height of a perfect tree) in exchange for requiring fewer rotations on writes. Read performance is slightly worse than AVL; write performance is better.`,
    mathematicalFoundation: `Black-height bh(T): number of black nodes on any path from root to leaf
Height guarantee: h ≤ 2·log₂(n+1)
Proof: path with most nodes alternates black-red-black-red → 2×bh nodes
  Minimum nodes with black-height bh: 2^bh − 1
  Since n ≥ 2^bh − 1: bh ≤ log₂(n+1)
  Thus h ≤ 2·log₂(n+1)

Insert: at most 2 rotations + O(log n) recolorings
Delete: at most 3 rotations + O(log n) recolorings`,
    applications: `C++ std::map and std::set (Red-Black Tree internally). Java TreeMap and TreeSet. Linux CFS (Completely Fair Scheduler): O(log n) task scheduling. Git reflog. Nginx timer management. epoll in Linux kernel (file descriptor event management). Python's sortedcontainers library. Interval trees for scheduling.`,
    advantages: `Guaranteed O(log n) worst case for all operations. Fewer rotations than AVL on write-heavy workloads (at most 3 rotations per insert/delete). Used in all major language standard libraries. Well-studied with decades of optimizations. Stable performance regardless of insertion order.`,
    disadvantages: `More complex implementation than AVL (5 invariants, more rotation cases). Slightly worse read performance than AVL (height ≤ 2 log n vs ≤ 1.44 log n). Extra memory: 1 bit per node for color (usually stored in the low bit of a pointer). Not cache-friendly due to pointer-based structure.`,
    comparisons: `Red-Black vs AVL: AVL has stricter balance (h ≤ 1.44 log n vs 2 log n for RB). AVL gives faster searches; RB gives faster insertions/deletions. Production libraries prefer RB for mixed workloads. Red-Black vs Skip List: Both give O(log n) operations. Skip list is simpler and lock-free-friendly; Red-Black is more cache-efficient. Red-Black vs B-Tree: B-Tree is designed for disk I/O (wide nodes, few levels); Red-Black is optimized for RAM.`,
    commonMistakes: [
      `Confusing the 4 rotation cases (LL, LR, RL, RR) with recoloring cases.`,
      `Not handling the "double black" case during deletion — the most complex part.`,
      `Forgetting to recolor the root to black after rotations.`,
      `Treating null leaves incorrectly — they are always black.`,
      `Not testing with all cases: empty tree, single node, left-leaning vs right-leaning.`,
    ],
    interviewQuestions: [
      `List all 5 Red-Black tree properties and explain each.`,
      `Why do Red-Black trees require at most 3 rotations per insert?`,
      `Compare Red-Black trees with AVL trees for read-heavy vs write-heavy workloads.`,
      `How does the Linux CFS scheduler use a Red-Black tree?`,
      `What is the maximum height of a Red-Black tree with n nodes?`,
      `Explain the "double black" case in Red-Black tree deletion.`,
    ],
    pseudocode: `INSERT(tree, key):
  1. Insert as in BST, color new node RED
  2. Fix violations:
     while node is red and parent is red:
       case A: uncle is red → recolor parent, uncle black; grandparent red
       case B: uncle is black, zig-zag → rotate to zig-zig shape
       case C: uncle is black, zig-zig → rotate grandparent, recolor
  3. Color root BLACK`,
    stepByStep: [
      `Insert node using standard BST insertion, color it RED`,
      `If parent is BLACK: no violation, done`,
      `If parent is RED (violation): check uncle's color`,
      `Uncle is RED: recolor parent and uncle to BLACK, grandparent to RED, repeat up`,
      `Uncle is BLACK, zig-zag: rotate to create zig-zig shape`,
      `Uncle is BLACK, zig-zig: rotate grandparent, swap colors of parent and grandparent`,
      `Ensure root is always BLACK`,
    ],
    relatedTopics: [
      `bst`,
      `avl`,
      `treap`,
      `b-tree`,
    ],
    optimizations: [
      `Use pointer tagging (store color in the low bit of the pointer) to save memory.`,
      `For read-mostly workloads, prefer AVL trees instead.`,
      `Use left-leaning Red-Black (LLRB) trees for a simpler deletion algorithm.`,
      `Augment with subtree-size for O(log n) order-statistic queries.`,
    ],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },
  'b-tree': {
    definition: `A B-Tree is a self-balancing search tree designed to minimize disk I/O operations. Unlike binary trees which have exactly 2 children per node, a B-Tree of order m has nodes with up to m children and (m-1) keys. All leaves are at the same depth (the tree is perfectly height-balanced). When a node overflows (gains more than m-1 keys), it splits, pushing the median key up to its parent. This creates a wide, shallow tree with very few levels.`,
    history: `B-Trees were invented by Rudolf Bayer and Edward McCreight at Boeing Research Labs in 1972. The "B" possibly stands for "Bayer", "Boeing", "broad", or "balanced" — Bayer never confirmed. The structure solved a critical problem: hard disk access times (milliseconds) are 100,000× slower than RAM (nanoseconds), so algorithms must minimize disk reads. A B-Tree of order 1000 stores millions of records in just 3-4 levels. Today, PostgreSQL, MySQL, SQLite, MongoDB, and virtually every filesystem use B-Trees or B+ Tree variants for their indexes.`,
    intuition: `Imagine a library catalog with wide index cards. Each card holds not one but 100 book entries, pointing to 101 sub-sections. To find any book in a library of 1 million, you read at most 3 cards. Compare to a binary tree which would need 20 comparisons. The key insight: make each "page" (node) as fat as possible so the tree height (= number of page reads) is minimized.`,
    mathematicalFoundation: `B-Tree of order m (min-degree t where m=2t):
  Each node: t-1 ≤ keys ≤ 2t-1 (except root: 1 ≤ keys ≤ 2t-1)
  Each internal node: t ≤ children ≤ 2t

Height: h ≤ log_t(ceil(n+1)/2)
  With t=500: h ≤ log_500(n/2)
  For n=1 billion: h ≤ log_500(5×10^8) ≈ 3.5 → at most 4 page reads!

Split: when node has 2t-1 keys:
  Median becomes parent key
  Left child: t-1 keys, Right child: t-1 keys`,
    applications: `Database indexes: PostgreSQL, MySQL use B-Trees for primary and secondary indexes, enabling O(log n) range queries. File systems: NTFS, ext4, HFS+, APFS, Btrfs all use B-Tree or B+-Tree variants for directory/inode indexes. Key-value stores: RocksDB, LevelDB use LSM-trees (inspired by B-Trees). Document stores: MongoDB's WiredTiger storage engine. Full-text search: Lucene inverted indexes use B-Tree-like sorted structures.`,
    advantages: `Minimizes disk I/O — few levels = few block reads. Supports both point queries and range queries. Perfectly balanced — all leaves at same depth. Efficient for sequential and random access. Nodes sized to match disk block size (typically 4KB or 8KB) for optimal I/O.`,
    disadvantages: `Complex split/merge algorithms — harder to implement than BST. Wasted space in partially filled nodes (up to 50% with minimum fill). All data can be in internal nodes (solved by B+ Tree). Not cache-friendly for in-memory use (B-Tree of order 2 = Red-Black tree is better for RAM).`,
    comparisons: `B-Tree vs B+ Tree: B+ Tree stores all data only in leaves (internal nodes hold only keys for routing), enabling sequential scan via leaf chain. B-Tree stores data in all nodes. For databases, B+ Tree is usually preferred. B-Tree vs Red-Black Tree: B-Tree is optimized for disk (wide nodes, few levels); Red-Black is optimized for RAM (narrow nodes, pointer-based). B-Tree vs Hash Index: B-Tree supports range queries, prefix queries, and ordering; hash index supports only exact-match O(1) lookup.`,
    commonMistakes: [
      `Choosing order m too small — increases tree height and disk reads.`,
      `Not aligning node size to disk block size — causes read amplification.`,
      `Implementing split without propagating correctly to root — corrupts the tree.`,
      `Forgetting that deletion may require borrowing from a sibling or merging.`,
      `Using B-Tree for in-memory-only data — Red-Black tree is more cache-efficient.`,
    ],
    interviewQuestions: [
      `Why is a B-Tree better than a BST for database indexing?`,
      `Explain the split operation in a B-Tree.`,
      `What is the minimum degree t, and what constraints does it impose?`,
      `Compare B-Tree and B+ Tree — when would you choose each?`,
      `Why do B-Trees have nodes sized to match disk block sizes?`,
      `How does a B-Tree handle deletion without breaking balance?`,
    ],
    pseudocode: `SEARCH(node, key):
  i = find largest i such that node.keys[i] <= key
  if i found and node.keys[i] == key: return node
  if node is leaf: return NOT FOUND
  return SEARCH(node.children[i+1], key)

INSERT(tree, key):
  if root is full:
    newRoot = new Node
    newRoot.children[0] = tree.root
    SPLIT_CHILD(newRoot, 0)
    tree.root = newRoot
  INSERT_NON_FULL(tree.root, key)`,
    stepByStep: [
      `Search: at each node, binary-search keys to find correct child pointer`,
      `Descend to the correct child (or report found/not-found at leaf)`,
      `Insert: split any full nodes encountered on the way down (proactive split)`,
      `Insert key into the (guaranteed non-full) leaf`,
      `Split pushes the median key up to the parent, creating two children`,
      `Delete: ensure node has ≥ t keys before descending (borrow or merge if needed)`,
    ],
    relatedTopics: [
      `b-plus-tree`,
      `bst`,
      `avl`,
      `red-black-tree`,
    ],
    optimizations: [
      `Size each node to exactly one disk page (4KB or 8KB) for optimal I/O.`,
      `Use binary search within nodes for O(log m) key lookup instead of linear scan.`,
      `Implement bulk loading for B-Trees (sort keys, then build bottom-up in O(n log n)).`,
      `Cache the root and first few levels in memory to eliminate top-level disk reads.`,
    ],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },
  'b-plus-tree': {
    definition: `A B+ Tree is a variant of the B-Tree where all actual data records (or pointers to data) reside exclusively in leaf nodes. Internal nodes contain only keys used as routing guides. All leaf nodes are connected by a doubly linked chain, enabling extremely efficient range queries: after finding the range start in O(log n), sequential scanning proceeds along the leaf chain without returning to the root.`,
    history: `The B+ Tree emerged naturally from database engineering needs in the late 1970s and early 1980s. IBM researchers developed early variants for IMS (Information Management System). Douglas Comer's 1979 paper "The Ubiquitous B-Tree" documented both B-Trees and B+ Trees and remains the definitive reference. Today, essentially every RDBMS uses B+ Trees: MySQL InnoDB (default since MySQL 5.5), PostgreSQL, Oracle, SQL Server, and SQLite all use B+ Trees for their clustered and secondary indexes.`,
    intuition: `A B+ Tree is like a library with two-tier indexing: the card catalog (internal nodes) has only titles to guide you to the right shelf section, and all actual books (data) are on the shelves (leaf nodes). The shelves are arranged in alphabetical order and connected by a thread (the leaf chain). To find all books by "Knuth", you look up "Knuth" in the catalog, find the first shelf, then simply walk the thread forward to collect all matching books.`,
    mathematicalFoundation: `All n records are in leaf nodes
Internal nodes: routing keys only (copies of leaf keys)
Leaf level: doubly linked list of all data in sorted order

Range query [a, b]:
  1. Search for a: O(log n)
  2. Scan leaf chain rightward until key > b: O(k/B) disk reads
     where k = result count, B = records per leaf page

Height: same as B-Tree: h ≤ log_t(n/2)
Fan-out: internal nodes can hold more keys (no data) → wider tree → fewer levels`,
    applications: `MySQL InnoDB: the primary key index is a clustered B+ Tree (data rows are leaf nodes). PostgreSQL: all indexes (primary, secondary, partial) use B+ Tree by default. SQL Server: clustered indexes = B+ Trees. SQLite: page-based B+ Tree for all tables and indexes. File systems: NTFS directory index, Apple HFS+, Linux ext4 htree. RocksDB: uses B+ Tree-inspired sorted string tables (SSTs).`,
    advantages: `Sequential range scans are extremely efficient — leaf chain avoids multiple tree traversals. Internal nodes have higher fan-out (only keys, no data) → shallower tree than equivalent B-Tree. All records accessible at the same depth (uniform leaf level). Leaf-chain enables full table scans in sequential I/O order.`,
    disadvantages: `Keys are duplicated: every key appears both in the leaf (with data) and potentially in internal nodes (as routing keys) → slightly more memory than B-Tree. Deletion from internal nodes must also update the corresponding leaf — more complex than B-Tree deletion. Cannot retrieve data from internal nodes directly (unlike B-Tree).`,
    comparisons: `B+ Tree vs B-Tree: B+ Tree has leaf chain for fast range queries; B-Tree does not. B+ Tree internal nodes are wider (higher fan-out, fewer levels). B-Tree stores data everywhere; B+ Tree stores data only in leaves. For databases: B+ Tree is almost always preferred. B+ Tree vs Hash Index: B+ Tree supports range, prefix, and exact-match queries; hash index supports only exact-match in O(1). MySQL uses B+ Tree by default, hash index optionally.`,
    commonMistakes: [
      `Confusing B-Tree and B+ Tree — they have different data placement rules.`,
      `Forgetting to update the leaf-chain pointers after splits and merges.`,
      `Not maintaining sorted order in the leaf chain.`,
      `Incorrect key duplication logic between internal and leaf nodes.`,
    ],
    interviewQuestions: [
      `Why do most databases prefer B+ Trees over B-Trees?`,
      `Explain how a B+ Tree enables efficient range queries.`,
      `How does MySQL InnoDB use a clustered B+ Tree index?`,
      `What is the advantage of the B+ Tree leaf chain over returning to the root?`,
      `Why do B+ Tree internal nodes have higher fan-out than B-Tree internal nodes?`,
      `Describe the split operation in a B+ Tree leaf node.`,
    ],
    pseudocode: `RANGE_QUERY(tree, lo, hi):
  leaf = SEARCH_LEAF(tree.root, lo)    // O(log n)
  results = []
  while leaf != null:
    for key in leaf.keys:
      if key > hi: return results
      if key >= lo: results.append(key)
    leaf = leaf.next                    // Follow leaf chain
  return results`,
    stepByStep: [
      `Search: traverse internal nodes using routing keys to reach the correct leaf`,
      `Find the leaf containing the first key ≥ lo`,
      `Scan forward along the leaf chain collecting keys ≤ hi`,
      `Insert: always insert into a leaf; split leaf if full, push median to parent`,
      `Leaf split: create new leaf, update prev/next pointers to maintain chain`,
      `Delete: remove from leaf; borrow from sibling or merge if underflow`,
    ],
    relatedTopics: [
      `b-tree`,
      `bst`,
      `hash-table`,
      `skip-list`,
    ],
    optimizations: [
      `Fill factor: keep leaves at ~70% full during bulk load for efficient future insertions.`,
      `Buffer pool: cache the top tree levels in RAM to eliminate most disk reads.`,
      `Use fill factor 100% for read-only databases (no future insertions).`,
      `Compress repeated key prefixes in internal nodes to increase fan-out.`,
    ],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  },
  'fenwick-tree': {
    definition: `A Fenwick Tree (also called Binary Indexed Tree or BIT), invented by Peter Fenwick in 1994, is a compact data structure that computes prefix sums in O(log n) time and supports point updates in O(log n) time, using only a simple array of size n (no pointers, no extra allocation). The key insight is to use the lowest-set-bit (LSB) of each index to determine which range each array cell is "responsible" for, creating an implicit tree structure inside a flat array.`,
    history: `Peter Fenwick published the Binary Indexed Tree in 1994 in a paper titled "A New Data Structure for Cumulative Frequency Tables" in the Software — Practice and Experience journal. He was solving a problem in arithmetic compression where cumulative frequencies needed fast updates and queries. The structure was quickly adopted in competitive programming and became a staple for range sum and rank queries, appearing in virtually every competitive programming contest preparation guide.`,
    intuition: `The magic of a Fenwick Tree is in the bit manipulation: every index i is responsible for a range of length equal to its lowest set bit (i & -i). Index 4 (100 in binary) covers 4 elements; index 6 (110) covers 2 elements; index 7 (111) covers 1 element. To compute prefix_sum[i], you walk left through the tree by repeatedly subtracting the lowest set bit: i → i - (i & -i). To update index i, you walk right by adding the lowest set bit: i → i + (i & -i).`,
    mathematicalFoundation: `Lowest set bit: LSB(i) = i & (-i)

Prefix sum query [1..i]:
  sum = 0
  while i > 0:
    sum += tree[i]
    i -= i & (-i)    // Move to parent
  return sum

Point update at index i, adding delta:
  while i <= n:
    tree[i] += delta
    i += i & (-i)    // Move to responsible ancestor

Both operations: exactly O(log n) iterations (number of bits in n)

Range sum [l..r] = prefix_sum(r) - prefix_sum(l-1)`,
    applications: `Competitive programming: range sum queries with point updates (the "canonical" BIT problem). Counting inversions in an array: O(n log n) solution. Finding the k-th order statistic in a dynamic set. Frequency tables for arithmetic coding. 2D BIT for 2D prefix sums. LIS (Longest Increasing Subsequence): O(n log n) with BIT.`,
    advantages: `Extremely simple implementation (5-10 lines). Uses exactly n integers of storage (no pointer overhead). Faster than segment trees for prefix-sum-only problems (smaller constant). Cache-friendly flat array layout. Easy to extend to 2D.`,
    disadvantages: `Only works for associative, invertible operations (sum, XOR). Cannot answer arbitrary range queries (only prefix-based). Less flexible than a segment tree (no range updates without tricks). Cannot directly find minimum or maximum in a range.`,
    comparisons: `Fenwick Tree vs Segment Tree: Fenwick is simpler (5 lines) and faster for prefix sums. Segment tree supports arbitrary range queries, non-invertible operations, and range updates via lazy propagation. For prefix sums only: use Fenwick. For more: use segment tree. Fenwick vs Prefix Sum Array: Static prefix array answers queries in O(1) but cannot handle updates. Fenwick handles both queries and updates in O(log n).`,
    commonMistakes: [
      `Using 0-based indexing — Fenwick Trees require 1-based indexing.`,
      `Confusing the direction of query traversal (subtract LSB) vs update (add LSB).`,
      `Using for non-invertible operations (like maximum) — Fenwick requires inverse operations.`,
      `Forgetting to initialize the tree with all zeros before building from an array.`,
    ],
    interviewQuestions: [
      `Implement a Fenwick Tree with point update and prefix sum query.`,
      `Extend a Fenwick Tree to support range sum queries [l, r].`,
      `Count the number of inversions in an array using a Fenwick Tree.`,
      `Find the k-th smallest element using a Fenwick Tree.`,
      `Implement a 2D Fenwick Tree for 2D prefix sum queries.`,
    ],
    pseudocode: `BUILD(arr, n):
  for i in 1..n:
    UPDATE(i, arr[i])

UPDATE(i, delta):
  while i <= n:
    tree[i] += delta
    i += i & (-i)      // Add lowest set bit

QUERY_PREFIX(i):
  sum = 0
  while i > 0:
    sum += tree[i]
    i -= i & (-i)      // Remove lowest set bit
  return sum

QUERY_RANGE(l, r):
  return QUERY_PREFIX(r) - QUERY_PREFIX(l - 1)`,
    stepByStep: [
      `Use 1-based indexing: tree[1..n]`,
      `i & (-i) computes the lowest set bit of i`,
      `Update: add delta to tree[i], then move i += i&(-i) upward until i > n`,
      `Query prefix sum: accumulate tree[i], move i -= i&(-i) downward until i == 0`,
      `Range query [l,r] = prefix(r) - prefix(l-1)`,
    ],
    relatedTopics: [
      `segment-tree`,
      `array`,
    ],
    optimizations: [
      `Build BIT in O(n) by using direct assignment instead of n individual updates.`,
      `2D BIT for matrix prefix sums: nested index traversal in both dimensions.`,
      `Offline BIT: sort queries to answer all queries in a single sweep.`,
    ],
    complexity: { access: 'N/A', search: 'O(log n)', insert: 'O(log n)', delete: 'N/A', space: 'O(n)' },
  },
  'skip-list': {
    definition: `A Skip List is a probabilistic data structure that builds multiple layers of sorted linked lists. The bottom layer contains all elements; each higher layer contains a random subset (about half) of the layer below, acting as "express lanes". To search, you start at the top-left and move right until you'd overshoot, then drop down one level and repeat. This achieves O(log n) expected search, insert, and delete with a much simpler implementation than balanced trees.`,
    history: `Skip lists were invented by William Pugh in 1989 (published 1990 in Communications of the ACM). Pugh was frustrated by the complexity of balanced tree implementations and proposed the skip list as a probabilistic alternative with the same expected performance but far simpler code. Redis uses skip lists for its sorted set data structure (ZADD/ZRANK). LevelDB and RocksDB use skip lists for their in-memory memtable. Java's ConcurrentSkipListMap is a thread-safe sorted map in the JDK.`,
    intuition: `A skip list is like a city's transit system: the local bus (bottom layer) stops everywhere; the express bus (middle layer) skips most stops; the highway (top layer) bypasses everything except major checkpoints. To get from A to Z, you take the highway as far as possible, then switch to express, then walk the last stretch. Each layer halves the number of stops, giving O(log n) total steps.`,
    mathematicalFoundation: `Each element promoted to level i with probability p (typically 0.5)

Expected nodes at level i: n × p^(i-1)
Max levels: L = log_{1/p}(n) expected

Expected search time: O(log n)
Worst case: O(n) (all nodes at bottom, no skips) — extremely rare

Expected space: O(n) total pointers
  Sum over levels: n + n/2 + n/4 + ... = 2n = O(n)

Probability of bad worst case: 1/n^c for any desired constant c`,
    applications: `Redis ZADD/ZRANGE: sorted sets implemented as skip lists for O(log n) rank queries. LevelDB/RocksDB: in-memory memtable for write buffering. Java ConcurrentSkipListMap: lock-free sorted concurrent map. Lucene: uses skip lists for inverted index traversal. Databases: some use skip lists for multi-version concurrency control (MVCC).`,
    advantages: `Much simpler to implement than Red-Black or AVL trees. Naturally supports concurrent (lock-free) implementations. Expected O(log n) operations (practically equivalent to balanced trees). Ordered iteration in O(n). Easy to add custom levels and access patterns.`,
    disadvantages: `No worst-case O(log n) guarantee — probabilistic, not deterministic. Larger memory usage than balanced BSTs (multiple forward pointers per node). Cache-unfriendly: chasing pointers across levels causes cache misses. Not supported in most standard libraries (specialized use cases).`,
    commonMistakes: [
      `Using fixed levels instead of random promotion — negates the probabilistic balance.`,
      `Not initializing sentinel (header) node with the maximum key and max levels.`,
      `Incorrect level promotion logic — should be independent fair coin flips.`,
      `Forgetting to update multiple levels on insert/delete.`,
    ],
    interviewQuestions: [
      `Design a skip list from scratch with search, insert, and delete.`,
      `Why does Redis use a skip list for sorted sets instead of a balanced BST?`,
      `Prove that the expected height of a skip list is O(log n).`,
      `Implement a concurrent skip list using CAS operations.`,
      `Find the k-th largest element in a skip list.`,
    ],
    pseudocode: `SEARCH(list, target):
  curr = list.header
  for level from maxLevel down to 0:
    while curr.forward[level].key < target:
      curr = curr.forward[level]
  curr = curr.forward[0]
  if curr.key == target: return curr
  return NOT FOUND

INSERT(list, key):
  update = array tracking rightmost node at each level
  // (standard update array technique)
  newLevel = randomLevel()
  node = new SkipNode(key, newLevel)
  for i in 0..newLevel:
    node.forward[i] = update[i].forward[i]
    update[i].forward[i] = node`,
    stepByStep: [
      `Start at header node, highest level`,
      `Move right as long as next node's key < target`,
      `Drop down one level when next node would overshoot`,
      `Repeat until at level 0; check if current node matches`,
      `Insert: track rightmost node at each level in update[] array`,
      `Randomly determine new node's height (geometric distribution)`,
      `Wire new node into each level using update[] array`,
    ],
    relatedTopics: [
      `bst`,
      `avl`,
      `red-black-tree`,
      `hash-table`,
    ],
    optimizations: [
      `Use p=1/4 instead of 1/2 to reduce memory at the cost of slightly slower searches.`,
      `For read-heavy workloads, increase p to build more levels for faster search.`,
      `Lock-free CAS-based skip list for concurrent data structures.`,
    ],
    complexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n log n)' },
  },
  'bloom-filter': {
    definition: `A Bloom filter is a space-efficient probabilistic data structure that tests whether an element is a member of a set. It can report false positives (saying an element is in the set when it isn't) but never false negatives (it never misses an element that is actually in the set). It uses a bit array of m bits and k independent hash functions. To insert: set bits at all k hash positions. To query: check all k positions — if any is 0, the element is definitely not in the set; if all are 1, the element is probably in the set.`,
    history: `Bloom filters were invented by Burton Howard Bloom in 1970 in his paper "Space/Time Trade-offs in Hash Coding with Allowable Errors". They were largely theoretical until network engineers rediscovered them in the 1990s–2000s for web caching, routing, and database optimization. Today, Bloom filters appear in Google Bigtable, Apache Cassandra, Apache HBase, Ethereum nodes, Chrome's Safe Browsing, Akamai CDN (duplicate URL detection), and many more systems.`,
    intuition: `A Bloom filter is like a background check system with k databases. To enroll someone, you mark them in all k databases. To check if someone is enrolled, you query all k databases — if all say "yes", they're probably enrolled; if even one says "no", they're definitely not. The more databases (hash functions) and the larger each database (bits), the fewer false positives. The trade-off: once enrolled, you can't unenroll (no deletion in standard Bloom filters).`,
    mathematicalFoundation: `Parameters: m = bits, k = hash functions, n = elements inserted

False positive probability:
  p ≈ (1 - e^(-kn/m))^k

Optimal k for given m and n:
  k = (m/n) × ln(2) ≈ 0.693 × (m/n)

Optimal m for desired false positive rate p:
  m = -n × ln(p) / (ln(2))²

Example: 1 million elements, 1% false positive rate:
  m = 9.585 million bits ≈ 1.14 MB
  k = 6.64 ≈ 7 hash functions`,
    applications: `Chrome Safe Browsing: local Bloom filter of known malicious URLs — no server round-trip needed for most URLs. Akamai CDN: detect one-hit-wonders (resources accessed only once) to avoid caching them. Apache Cassandra/HBase/Bigtable: "definitely not in SST file" check before expensive disk read. Ethereum full nodes: quickly check if a transaction affects a given contract. Spell checkers: probabilistic dictionary lookup. Network routers: source IP routing table with Bloom filter pre-check.`,
    advantages: `Extremely space-efficient: 10 bits per element for 1% false positive rate. O(k) constant time for both insert and lookup regardless of set size. No false negatives — guaranteed. Naturally handles high-cardinality membership tests. Simple and fast to implement.`,
    disadvantages: `False positives: cannot guarantee "definitely in set". Cannot delete elements (standard Bloom filter). Cannot enumerate elements in the set. Cannot count occurrences. False positive rate increases as more elements are inserted.`,
    comparisons: `Bloom Filter vs Hash Set: Hash set has O(1) exact lookups with no false positives, but uses O(n × key_size) memory. Bloom filter uses O(m) bits with false positives. For membership tests at scale, Bloom filter is 10-100× more memory efficient. Bloom Filter vs Cuckoo Filter: Cuckoo filter supports deletion and has slightly better lookup performance, but is more complex.`,
    commonMistakes: [
      `Using poor/correlated hash functions — reduces effective independence.`,
      `Not sizing m correctly — leads to high false positive rate as filter fills up.`,
      `Attempting deletion from a standard Bloom filter — corrupts other elements.`,
      `Using a Bloom filter where false positives are unacceptable.`,
    ],
    interviewQuestions: [
      `Explain how a Bloom filter works and its false positive probability formula.`,
      `How would you calculate the optimal number of hash functions k for a Bloom filter?`,
      `Design a system using a Bloom filter to avoid expensive database lookups.`,
      `What is a Counting Bloom filter and how does it support deletion?`,
      `Why can't you delete from a standard Bloom filter?`,
    ],
    pseudocode: `INSERT(filter, element):
  for i in 1..k:
    pos = hash_i(element) % m
    filter.bits[pos] = 1

CONTAINS(filter, element):
  for i in 1..k:
    pos = hash_i(element) % m
    if filter.bits[pos] == 0:
      return DEFINITELY_NOT_IN_SET
  return PROBABLY_IN_SET`,
    stepByStep: [
      `Create a bit array of m bits, all initialized to 0`,
      `Choose k independent hash functions h1, h2, ..., hk`,
      `Insert element x: compute h1(x)%m, h2(x)%m, ..., hk(x)%m, set those bit positions to 1`,
      `Query element x: compute all k hash positions`,
      `If any bit is 0: definitely not in set (return false)`,
      `If all bits are 1: probably in set (return true, may be false positive)`,
    ],
    relatedTopics: [
      `hash-table`,
      `hash-set`,
      `hash-map`,
    ],
    optimizations: [
      `Use MurmurHash3 or xxHash for fast, high-quality hash functions.`,
      `Use a Counting Bloom filter (4-bit counters instead of bits) to support deletion.`,
      `Use a Scalable Bloom filter to grow dynamically as elements are added.`,
      `Partition the bit array into k disjoint sections for improved cache behavior.`,
    ],
    complexity: { access: 'N/A', search: 'O(k)', insert: 'O(k)', delete: 'N/A', space: 'O(m)' },
  },
  'directed-graph': {
    definition: `A directed graph (digraph) G = (V, E) consists of vertices V and directed edges E where each edge is an ordered pair (u, v) indicating a one-way connection from u to v. Unlike undirected graphs, edge (u, v) does not imply edge (v, u). Digraphs model asymmetric relationships: web pages linking to each other, tasks depending on other tasks, one-way streets in a city map.`,
    history: `Graph theory began with Euler's 1736 solution to the Königsberg bridges problem. Directed graphs were formally studied as the theory of automata and computation developed in the 1930s–1950s. Turing machines, finite automata, and flowcharts are all directed graph models. Dijkstra (1959), Bellman-Ford (1958), and Tarjan's SCC algorithm (1972) are foundational algorithms on directed graphs.`,
    intuition: `Think of Twitter's follower graph: user A follows user B means there's a directed edge A→B, but B doesn't necessarily follow A. Or think of a city map with one-way streets. The direction of each edge carries semantic meaning: "depends on", "links to", "comes before", "can reach".`,
    mathematicalFoundation: `In-degree of v: number of edges pointing INTO v
Out-degree of v: number of edges pointing OUT of v
Sum of all in-degrees = Sum of all out-degrees = |E|

Path: sequence of vertices v₁,v₂,...,vₖ with edges (v₁,v₂),(v₂,v₃),...
Cycle: path where first and last vertex are the same
DAG: directed acyclic graph (no cycles)

Strongly connected component (SCC):
  Maximal set of vertices where each vertex is reachable from every other`,
    applications: `Web crawling: each webpage is a vertex, hyperlinks are directed edges (PageRank). Task scheduling: build system (make, Gradle) uses dependency DAGs. Package managers: npm, pip resolve directed dependency graphs. Social networks: Twitter/Instagram follower relationships. Compiler control flow: basic blocks connected by directed jumps. State machines: each state is a vertex, transitions are directed edges. Transportation: one-way streets, flight routes.`,
    advantages: `Models asymmetric, directional relationships precisely. Enables detection of cycles (deadlock detection in OS). Supports topological ordering for dependency resolution. Foundation for shortest path algorithms (Dijkstra, Bellman-Ford).`,
    disadvantages: `More complex than undirected graphs — in-degree and out-degree differ. More complex cycle detection. Strongly connected components require specialized algorithms (Tarjan/Kosaraju). Cannot use undirected MST algorithms directly.`,
    commonMistakes: [
      `Treating directed edges as bidirectional — direction carries semantic meaning.`,
      `Not initializing visited array in DFS — infinite loops on cyclic graphs.`,
      `Using Dijkstra with negative-weight directed edges — use Bellman-Ford instead.`,
      `Confusing reachability (A can reach B) with strong connectivity (A↔B bidirectionally).`,
    ],
    interviewQuestions: [
      `Detect a cycle in a directed graph using DFS.`,
      `Find all strongly connected components using Tarjan's algorithm.`,
      `Topologically sort a DAG.`,
      `Find the shortest path in a directed graph with non-negative weights (Dijkstra).`,
      `Check if there is a path from vertex s to vertex t in a directed graph.`,
      `Count the number of paths from s to t in a DAG.`,
    ],
    pseudocode: `DFS_CYCLE_DETECTION(graph):
  visited = {}
  rec_stack = {}
  for each vertex v:
    if v not in visited:
      if DFS(v, visited, rec_stack): return CYCLE_FOUND
  return NO_CYCLE

DFS(v, visited, rec_stack):
  visited.add(v); rec_stack.add(v)
  for neighbor u of v:
    if u not in visited:
      if DFS(u, visited, rec_stack): return true
    elif u in rec_stack: return true   // Back edge = cycle
  rec_stack.remove(v)
  return false`,
    stepByStep: [
      `Represent graph as adjacency list or matrix`,
      `BFS/DFS: mark visited to avoid revisiting`,
      `For cycle detection: track "in current DFS path" (recursion stack)`,
      `Topological sort: output vertices in reverse post-order of DFS`,
      `Shortest path (non-negative): Dijkstra with priority queue`,
      `SCC: Tarjan (single DFS) or Kosaraju (two DFS passes)`,
    ],
    relatedTopics: [
      `undirected-graph`,
      `weighted-graph`,
      `dag`,
      `adjacency-list`,
      `adjacency-matrix`,
    ],
    optimizations: [
      `Use adjacency list (not matrix) for sparse real-world graphs to save O(V²) space.`,
      `Bidirectional BFS for shortest paths reduces search space from O(b^d) to O(b^(d/2)).`,
      `Johnson's algorithm for all-pairs shortest paths in sparse graphs: O(V² log V + VE).`,
    ],
    complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(V+E)', space: 'O(V+E)' },
  },

  'hash-map': {
    definition: `A Hash Map (also called HashMap, Dictionary, or Map) is a key-value store that uses a hash function to map keys to array indices, enabling O(1) average-case lookup, insertion, and deletion by key. It is the most widely used data structure in programming: Python dicts, JavaScript objects, Java HashMap, C++ unordered_map, Go maps, and Rust HashMaps are all hash maps. Unlike a hash set (which stores keys only), a hash map stores associated values for each key.`,
    history: `Hash map origins trace to H.P. Luhn (IBM, 1953) and Gene Amdahl's formalization of hashing the same year. Modern standard library implementations include: Java HashMap (Java 1.2, 1998), Python dict (CPython 3.6+ preserves insertion order), C++ unordered_map (C++11). Java 8's HashMap upgraded to tree bins (Red-Black tree) for large bucket chains, giving O(log n) worst-case instead of O(n).`,
    intuition: `A hash map is like a filing cabinet with labeled drawers. The hash function computes which drawer a key belongs in. Storing a value: open the correct drawer, place it inside. Retrieving: compute the key's drawer, look inside. Collisions (two keys in same drawer) are handled by chaining or open addressing.`,
    mathematicalFoundation: `Load factor alpha = n / m  (n = elements, m = buckets)
Expected chain length: alpha
Expected search time: O(1 + alpha) = O(1) when alpha is O(1)
Resize threshold: alpha > 0.75 -> double capacity, rehash all in O(n)
Amortized O(1) per insert via potential analysis`,
    applications: `Database hash indexes for O(1) exact-match lookup. Caching (memcached, Redis). Symbol tables in compilers. DNS caches. Memoization in DP. Word frequency counting. Anagram grouping. LRU Cache (HashMap + doubly linked list).`,
    advantages: `O(1) average insert, search, delete. Flexible key types (any hashable type). Faster than BST-based maps for most workloads. Foundation for countless algorithms and system designs.`,
    disadvantages: `O(n) worst case with poor hash function or adversarial inputs. No ordered iteration. Hash function must handle all key types. Not thread-safe by default.`,
    comparisons: `HashMap vs TreeMap: HashMap O(1) avg but unordered; TreeMap O(log n) but sorted. HashMap vs Array: Array O(1) integer-indexed; HashMap O(1) avg with any hashable key. HashMap vs HashSet: HashSet stores keys only; HashMap stores key+value pairs.`,
    commonMistakes: [
      `Using mutable objects (lists) as keys — they are not hashable in Python.`,
      `Concurrent modification during iteration — ConcurrentModificationException in Java.`,
      `Assuming insertion order is preserved in older Java/C++ — use LinkedHashMap for order.`,
      `Null key handling varies: Java allows one null key; C++ unordered_map does not.`,
    ],
    interviewQuestions: [
      `Two Sum: find two numbers summing to target — O(n) with hash map.`,
      `Group anagrams using a hash map of sorted-string keys.`,
      `Find the first non-repeating character in a string.`,
      `Count word frequencies in a document.`,
      `Design LRU Cache: hash map + doubly linked list.`,
      `Subarray sum equals k: prefix-sum hash map.`,
    ],
    pseudocode: `INSERT(map, key, value):
  idx = hash(key) % capacity
  for entry in buckets[idx]:
    if entry.key == key: entry.value = value; return
  buckets[idx].append(Entry(key, value))
  size++; if load_factor > 0.75: resize()

GET(map, key):
  for entry in buckets[hash(key) % capacity]:
    if entry.key == key: return entry.value
  return NOT_FOUND`,
    stepByStep: [
      `Compute hash(key) % capacity to find the bucket index`,
      `Search bucket's chain for existing entry with the same key`,
      `If found: update value in place (no duplicate keys)`,
      `If not found: append new (key, value) entry to bucket chain`,
      `If load_factor (size/capacity) > 0.75: double capacity, rehash all entries`,
      `Delete: find entry in bucket chain, remove it, decrement size`,
    ],
    relatedTopics: [
      `hash-table`,
      `hash-set`,
      `bloom-filter`,
      `lru-cache`,
    ],
    complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },

  'hash-set': {
    definition: `A Hash Set is a collection that stores only unique elements with no defined ordering. It is backed by a hash table using elements themselves as keys (with no associated value). The core operation is O(1) average membership testing: "is X in the set?". Hash Sets model mathematical sets and support union, intersection, and difference operations efficiently.`,
    history: `Hash sets emerged from hash tables with a set-specific API in standard libraries in the 1990s. Java HashSet (Java 1.2, 1998) is implemented as a HashMap with a dummy value. Python's built-in set type (Python 2.4, 2004) is one of the most widely-used built-in types in Python. C++ unordered_set (C++11) and Rust HashSet complete the landscape of standard library hash sets.`,
    intuition: `A hash set is like an instant-answer guest list: you can check in O(1) if anyone is on it, add new names, or remove them. No duplicates exist — adding the same name twice changes nothing. The hash function determines exactly which spot on the list to look at for each name.`,
    mathematicalFoundation: `Set operations:
  Union A union B: O(|A|+|B|)
  Intersection A intersection B: O(min(|A|,|B|))
  Difference A minus B: O(|A|)
  Subset check A subset of B: O(|A|)
All basic ops (add/contains/remove): O(1) average`,
    applications: `Duplicate detection in streams. Visited set in BFS/DFS graph traversal. Spell checker dictionaries. Finding unique elements. Two-pointer and sliding-window uniqueness checks. Mathematical set operations. Longest consecutive sequence (O(n) with hash set lookup).`,
    advantages: `O(1) average membership test, insert, remove. Automatically enforces uniqueness. Clean API for set algebra operations. More memory-efficient than hash map when values are not needed.`,
    disadvantages: `No ordering — cannot iterate in sorted order. O(n) worst case with bad hash function. Requires hashable (immutable) elements. Not thread-safe without explicit synchronization.`,
    comparisons: `HashSet vs TreeSet: HashSet O(1) unordered; TreeSet O(log n) sorted. HashSet vs List: List allows duplicates O(n) membership; HashSet enforces uniqueness O(1) membership. HashSet vs HashMap: HashSet stores keys only; HashMap stores key+value pairs.`,
    commonMistakes: [
      `Using a list instead of a set for membership testing — O(n) vs O(1) difference.`,
      `Mutating elements after insertion — their hash changes, corrupting the set state.`,
      `Expecting iteration order in Java HashSet — use LinkedHashSet for insertion order.`,
      `Using mutable objects (list, dict) as set elements — they are not hashable.`,
    ],
    interviewQuestions: [
      `Find all unique elements in an unsorted array.`,
      `Detect a cycle in a linked list using a set of visited node addresses.`,
      `Longest consecutive sequence — O(n) using hash set membership checks.`,
      `Find the intersection of two arrays using hash sets.`,
      `Happy Number: detect loop using a set of previously seen values.`,
      `Find duplicate elements in an array.`,
    ],
    pseudocode: `ADD(set, element):
  if CONTAINS(set, element): return false  // Duplicate
  idx = hash(element) % capacity
  set.buckets[idx].append(element)
  set.size++; if load_factor > 0.75: resize()
  return true

CONTAINS(set, element):
  for e in set.buckets[hash(element) % capacity]:
    if e == element: return true
  return false`,
    stepByStep: [
      `Hash the element to find its bucket: idx = hash(elem) % capacity`,
      `Add: check bucket for duplicate first; if not found, append and increment size`,
      `Contains: scan bucket chain for matching element — O(1) expected`,
      `Remove: scan bucket chain, remove matching element, decrement size`,
      `Resize when load_factor > 0.75: double capacity, rehash all elements`,
      `Union: iterate all elements of set B, add each to set A using O(1) add`,
    ],
    relatedTopics: [
      `hash-map`,
      `hash-table`,
      `bloom-filter`,
    ],
    complexity: { access: 'N/A', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
}
