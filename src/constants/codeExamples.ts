import type { CodeLanguage } from '@/types'

const CODE: Record<string, Record<string, Partial<Record<CodeLanguage, string>>>> = {
  // ─── Arrays ────────────────────────────────────────────────────────────────
  array: {
    insert: {
      python: `def insert(arr, index, value):
    arr.insert(index, value)
    return arr`,
      c: `void insert(int arr[], int *n, int index, int value) {
    for (int i = *n; i > index; i--)
        arr[i] = arr[i-1];
    arr[index] = value;
    (*n)++;
}`,
      cpp: `void insert(std::vector<int>& arr, int index, int value) {
    arr.insert(arr.begin() + index, value);
}`,
      java: `public void insert(ArrayList<Integer> arr, int index, int value) {
    arr.add(index, value);
}`,
      javascript: `function insert(arr, index, value) {
    arr.splice(index, 0, value);
    return arr;
}`,
      typescript: `function insert(arr: number[], index: number, value: number): number[] {
    arr.splice(index, 0, value);
    return arr;
}`,
      rust: `fn insert(arr: &mut Vec<i32>, index: usize, value: i32) {
    arr.insert(index, value);
}`,
      go: `func insert(arr []int, index, value int) []int {
    return append(arr[:index], append([]int{value}, arr[index:]...)...)
}`,
    },
    search: {
      python: `def search(arr, value):
    for i in range(len(arr)):
        if arr[i] == value:
            return i
    return -1`,
      javascript: `function search(arr, value) {
    return arr.indexOf(value);
}`,
      typescript: `function search(arr: number[], value: number): number {
    return arr.indexOf(value);
}`,
      cpp: `int search(std::vector<int>& arr, int value) {
    for (int i = 0; i < arr.size(); i++)
        if (arr[i] == value) return i;
    return -1;
}`,
    },
    delete: {
      python: `def delete(arr, index):
    arr.pop(index)
    return arr`,
      cpp: `void delete_at(std::vector<int>& arr, int index) {
    arr.erase(arr.begin() + index);
}`,
      javascript: `function deleteAt(arr, index) {
    arr.splice(index, 1);
    return arr;
}`,
    },
  },
  vector: {
    push_back: {
      python: `arr = []
arr.append(value)  # O(1) amortized`,
      cpp: `std::vector<int> v;
v.push_back(value);  // O(1) amortized`,
      java: `ArrayList<Integer> v = new ArrayList<>();
v.add(value);  // O(1) amortized`,
      javascript: `const v = [];
v.push(value);  // O(1) amortized`,
    },
    pop_back: {
      python: `value = arr.pop()  # O(1)`,
      cpp: `v.pop_back();  // O(1)`,
      javascript: `const value = v.pop();  // O(1)`,
    },
  },

  // ─── Linked Lists ──────────────────────────────────────────────────────────
  'linked-list-singly': {
    insertHead: {
      python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def insert_head(head, val):
    node = Node(val)
    node.next = head
    return node`,
      javascript: `function insertHead(head, val) {
    const node = { val, next: head };
    return node;
}`,
      cpp: `void insertHead(Node*& head, int val) {
    Node* node = new Node(val);
    node->next = head;
    head = node;
}`,
    },
    insertTail: {
      python: `def insert_tail(head, val):
    node = Node(val)
    if not head:
        return node
    curr = head
    while curr.next:
        curr = curr.next
    curr.next = node
    return head`,
      javascript: `function insertTail(head, val) {
    const node = { val, next: null };
    if (!head) return node;
    let curr = head;
    while (curr.next) curr = curr.next;
    curr.next = node;
    return head;
}`,
    },
    delete: {
      python: `def delete(head, val):
    dummy = Node(0)
    dummy.next = head
    curr = dummy
    while curr.next:
        if curr.next.val == val:
            curr.next = curr.next.next
            break
        curr = curr.next
    return dummy.next`,
      javascript: `function deleteNode(head, val) {
    const dummy = { val: 0, next: head };
    let curr = dummy;
    while (curr.next) {
        if (curr.next.val === val) {
            curr.next = curr.next.next;
            break;
        }
        curr = curr.next;
    }
    return dummy.next;
}`,
    },
  },
  'linked-list-doubly': {
    insertHead: {
      python: `class Node:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None

def insert_head(head, val):
    node = Node(val)
    if head:
        head.prev = node
    node.next = head
    return node`,
      javascript: `function insertHead(head, val) {
    const node = { val, prev: null, next: head };
    if (head) head.prev = node;
    return node;
}`,
    },
  },

  // ─── Stack ─────────────────────────────────────────────────────────────────
  stack: {
    push: {
      python: `stack = []
stack.append(value)   # O(1)`,
      cpp: `std::stack<int> s;
s.push(value);  // O(1)`,
      java: `Deque<Integer> s = new ArrayDeque<>();
s.push(value);  // O(1)`,
      javascript: `const stack = [];
stack.push(value);  // O(1)`,
      typescript: `const stack: number[] = [];
stack.push(value);  // O(1)`,
    },
    pop: {
      python: `value = stack.pop()  # O(1), raises IndexError if empty`,
      cpp: `int top = s.top(); s.pop();  // O(1)`,
      javascript: `const value = stack.pop();  // O(1)`,
    },
    peek: {
      python: `top = stack[-1] if stack else None`,
      cpp: `int top = s.top();  // O(1)`,
      javascript: `const top = stack[stack.length - 1];  // O(1)`,
    },
  },

  // ─── Queue ─────────────────────────────────────────────────────────────────
  queue: {
    enqueue: {
      python: `from collections import deque
q = deque()
q.append(value)  # O(1)`,
      cpp: `std::queue<int> q;
q.push(value);  // O(1)`,
      javascript: `const q = [];
q.push(value);  // O(1) amortized`,
    },
    dequeue: {
      python: `value = q.popleft()  # O(1)`,
      cpp: `int front = q.front(); q.pop();  // O(1)`,
      javascript: `const value = q.shift();  // O(n) — use proper queue for O(1)`,
    },
  },
  'priority-queue': {
    enqueue: {
      python: `import heapq
heap = []
heapq.heappush(heap, (priority, item))`,
      cpp: `std::priority_queue<std::pair<int,std::string>> pq;
pq.push({priority, item});`,
      java: `PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> a[0] - b[0]);
pq.offer(new int[]{priority, value});`,
    },
    dequeue: {
      python: `priority, item = heapq.heappop(heap)`,
      cpp: `auto [priority, item] = pq.top(); pq.pop();`,
      java: `int[] top = pq.poll();`,
    },
  },

  // ─── Trees ─────────────────────────────────────────────────────────────────
  bst: {
    insert: {
      python: `def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)
    elif key > root.key:
        root.right = insert(root.right, key)
    return root`,
      javascript: `function insert(root, key) {
    if (!root) return { key, left: null, right: null };
    if (key < root.key) root.left = insert(root.left, key);
    else if (key > root.key) root.right = insert(root.right, key);
    return root;
}`,
      cpp: `Node* insert(Node* root, int key) {
    if (!root) return new Node(key);
    if (key < root->key) root->left = insert(root->left, key);
    else if (key > root->key) root->right = insert(root->right, key);
    return root;
}`,
      java: `Node insert(Node root, int key) {
    if (root == null) return new Node(key);
    if (key < root.key) root.left = insert(root.left, key);
    else if (key > root.key) root.right = insert(root.right, key);
    return root;
}`,
    },
    search: {
      python: `def search(root, key):
    if root is None or root.key == key:
        return root
    if key < root.key:
        return search(root.left, key)
    return search(root.right, key)`,
      javascript: `function search(root, key) {
    if (!root || root.key === key) return root;
    return key < root.key
        ? search(root.left, key)
        : search(root.right, key);
}`,
    },
    inorder: {
      python: `def inorder(root, result=[]):
    if root:
        inorder(root.left, result)
        result.append(root.key)
        inorder(root.right, result)
    return result`,
      javascript: `function inorder(root, result = []) {
    if (root) {
        inorder(root.left, result);
        result.push(root.key);
        inorder(root.right, result);
    }
    return result;
}`,
    },
    delete: {
      python: `def delete(root, key):
    if not root:
        return root
    if key < root.key:
        root.left = delete(root.left, key)
    elif key > root.key:
        root.right = delete(root.right, key)
    else:
        if not root.left:
            return root.right
        elif not root.right:
            return root.left
        # Find inorder successor
        succ = root.right
        while succ.left:
            succ = succ.left
        root.key = succ.key
        root.right = delete(root.right, succ.key)
    return root`,
      javascript: `function deleteNode(root, key) {
    if (!root) return null;
    if (key < root.key) root.left = deleteNode(root.left, key);
    else if (key > root.key) root.right = deleteNode(root.right, key);
    else {
        if (!root.left) return root.right;
        if (!root.right) return root.left;
        let succ = root.right;
        while (succ.left) succ = succ.left;
        root.key = succ.key;
        root.right = deleteNode(root.right, succ.key);
    }
    return root;
}`,
    },
  },
  avl: {
    insert: {
      python: `def height(node):
    return node.height if node else 0

def balance_factor(node):
    return height(node.left) - height(node.right)

def rotate_right(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    y.height = max(height(y.left), height(y.right)) + 1
    x.height = max(height(x.left), height(x.right)) + 1
    return x

def rotate_left(x):
    y = x.right
    T2 = y.left
    y.left = x
    x.right = T2
    x.height = max(height(x.left), height(x.right)) + 1
    y.height = max(height(y.left), height(y.right)) + 1
    return y

def insert(node, key):
    if not node:
        return Node(key)
    if key < node.key:
        node.left = insert(node.left, key)
    elif key > node.key:
        node.right = insert(node.right, key)
    else:
        return node
    node.height = 1 + max(height(node.left), height(node.right))
    bf = balance_factor(node)
    # LL Case
    if bf > 1 and key < node.left.key:
        return rotate_right(node)
    # RR Case
    if bf < -1 and key > node.right.key:
        return rotate_left(node)
    # LR Case
    if bf > 1 and key > node.left.key:
        node.left = rotate_left(node.left)
        return rotate_right(node)
    # RL Case
    if bf < -1 and key < node.right.key:
        node.right = rotate_right(node.right)
        return rotate_left(node)
    return node`,
      javascript: `function height(node) { return node ? node.height : 0; }

function balanceFactor(node) {
    return height(node.left) - height(node.right);
}

function rotateRight(y) {
    const x = y.left, T2 = x.right;
    x.right = y; y.left = T2;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
}

function rotateLeft(x) {
    const y = x.right, T2 = y.left;
    y.left = x; x.right = T2;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    return y;
}

function insert(node, key) {
    if (!node) return { key, left: null, right: null, height: 1 };
    if (key < node.key) node.left = insert(node.left, key);
    else if (key > node.key) node.right = insert(node.right, key);
    else return node;
    node.height = 1 + Math.max(height(node.left), height(node.right));
    const bf = balanceFactor(node);
    if (bf > 1 && key < node.left.key) return rotateRight(node);   // LL
    if (bf < -1 && key > node.right.key) return rotateLeft(node);  // RR
    if (bf > 1 && key > node.left.key) {                            // LR
        node.left = rotateLeft(node.left);
        return rotateRight(node);
    }
    if (bf < -1 && key < node.right.key) {                         // RL
        node.right = rotateRight(node.right);
        return rotateLeft(node);
    }
    return node;
}`,
    },
  },
  'red-black-tree': {
    insert: {
      python: `# Red-Black Tree Properties:
# 1. Every node is RED or BLACK
# 2. Root is always BLACK
# 3. No two adjacent RED nodes
# 4. Every path from root to NULL has same BLACK nodes

class RBNode:
    def __init__(self, key):
        self.key = key
        self.color = 'RED'  # New nodes are always RED
        self.left = self.right = self.parent = None

def fix_insert(tree, z):
    while z.parent and z.parent.color == 'RED':
        if z.parent == z.parent.parent.left:
            uncle = z.parent.parent.right
            if uncle and uncle.color == 'RED':
                # Case 1: Uncle is RED — recolor
                z.parent.color = uncle.color = 'BLACK'
                z.parent.parent.color = 'RED'
                z = z.parent.parent
            else:
                if z == z.parent.right:
                    # Case 2: Uncle BLACK, z is right child
                    z = z.parent
                    left_rotate(tree, z)
                # Case 3: Uncle BLACK, z is left child
                z.parent.color = 'BLACK'
                z.parent.parent.color = 'RED'
                right_rotate(tree, z.parent.parent)
        # Mirror case for right subtree
    tree.root.color = 'BLACK'`,
    },
  },
  'b-tree': {
    insert: {
      python: `# B-Tree of order t (min degree t)
# Each node has at most 2t-1 keys
# Each internal node has at most 2t children
# All leaves are at same depth

class BTreeNode:
    def __init__(self, leaf=False):
        self.keys = []
        self.children = []
        self.leaf = leaf

class BTree:
    def __init__(self, t):
        self.root = BTreeNode(leaf=True)
        self.t = t  # minimum degree

    def insert(self, key):
        root = self.root
        if len(root.keys) == 2 * self.t - 1:
            # Root is full — split it
            new_root = BTreeNode()
            new_root.children.append(self.root)
            self._split_child(new_root, 0)
            self.root = new_root
        self._insert_non_full(self.root, key)

    def _split_child(self, parent, i):
        t = self.t
        child = parent.children[i]
        new_node = BTreeNode(leaf=child.leaf)
        # Promote median key
        parent.keys.insert(i, child.keys[t - 1])
        parent.children.insert(i + 1, new_node)
        new_node.keys = child.keys[t:]
        child.keys = child.keys[:t - 1]
        if not child.leaf:
            new_node.children = child.children[t:]
            child.children = child.children[:t]`,
      javascript: `class BTreeNode {
    constructor(leaf = false) {
        this.keys = [];
        this.children = [];
        this.leaf = leaf;
    }
}

class BTree {
    constructor(t) {
        this.t = t; // minimum degree
        this.root = new BTreeNode(true);
    }

    insert(key) {
        const root = this.root;
        if (root.keys.length === 2 * this.t - 1) {
            const newRoot = new BTreeNode();
            newRoot.children.push(this.root);
            this._splitChild(newRoot, 0);
            this.root = newRoot;
        }
        this._insertNonFull(this.root, key);
    }

    _splitChild(parent, i) {
        const t = this.t;
        const child = parent.children[i];
        const newNode = new BTreeNode(child.leaf);
        parent.keys.splice(i, 0, child.keys[t - 1]);
        parent.children.splice(i + 1, 0, newNode);
        newNode.keys = child.keys.splice(t - 1);
        newNode.keys.shift(); // remove promoted key
        if (!child.leaf) {
            newNode.children = child.children.splice(t);
        }
    }
}`,
    },
  },
  'b-plus-tree': {
    search: {
      python: `# B+ Tree: all data in leaves, linked list of leaves

class BPlusNode:
    def __init__(self, leaf=False):
        self.keys = []
        self.children = []
        self.next_leaf = None  # only for leaf nodes
        self.leaf = leaf

def search(root, key):
    node = root
    while not node.leaf:
        i = 0
        while i < len(node.keys) and key >= node.keys[i]:
            i += 1
        node = node.children[i]
    # Now at leaf node
    for k in node.keys:
        if k == key:
            return True  # found
    return False  # not found

def range_query(root, low, high):
    # Find left leaf
    node = root
    while not node.leaf:
        i = 0
        while i < len(node.keys) and low >= node.keys[i]:
            i += 1
        node = node.children[i]
    # Traverse leaves via next_leaf pointer
    result = []
    while node:
        for k in node.keys:
            if low <= k <= high:
                result.append(k)
        node = node.next_leaf
    return result`,
    },
  },
  'min-heap': {
    insert: {
      python: `import heapq

heap = []

def insert(heap, val):
    heapq.heappush(heap, val)
    # Internally: append + bubble up O(log n)

def extract_min(heap):
    return heapq.heappop(heap)  # O(log n)`,
      javascript: `class MinHeap {
    constructor() { this.heap = []; }

    insert(val) {
        this.heap.push(val);
        this._bubbleUp(this.heap.length - 1);
    }

    _bubbleUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.heap[parent] <= this.heap[i]) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }

    extractMin() {
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._siftDown(0);
        return min;
    }

    _siftDown(i) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
            if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}`,
    },
  },
  trie: {
    insert: {
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.end = True  # mark terminal

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.end

    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True`,
      javascript: `class Trie {
    constructor() { this.root = {}; }

    insert(word) {
        let node = this.root;
        for (const ch of word) {
            node[ch] = node[ch] || {};
            node = node[ch];
        }
        node['$'] = true; // terminal marker
    }

    search(word) {
        let node = this.root;
        for (const ch of word) {
            if (!node[ch]) return false;
            node = node[ch];
        }
        return node['$'] === true;
    }
}`,
    },
  },
  'segment-tree': {
    build: {
      python: `def build(arr, tree, node, start, end):
    if start == end:
        tree[node] = arr[start]
    else:
        mid = (start + end) // 2
        build(arr, tree, 2*node, start, mid)
        build(arr, tree, 2*node+1, mid+1, end)
        tree[node] = tree[2*node] + tree[2*node+1]

def query(tree, node, start, end, l, r):
    if r < start or end < l:
        return 0  # out of range
    if l <= start and end <= r:
        return tree[node]  # fully covered
    mid = (start + end) // 2
    left = query(tree, 2*node, start, mid, l, r)
    right = query(tree, 2*node+1, mid+1, end, l, r)
    return left + right`,
      javascript: `class SegmentTree {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(0);
        this.build(arr, 0, 0, this.n - 1);
    }

    build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
        } else {
            const mid = (start + end) >> 1;
            this.build(arr, 2*node+1, start, mid);
            this.build(arr, 2*node+2, mid+1, end);
            this.tree[node] = this.tree[2*node+1] + this.tree[2*node+2];
        }
    }

    query(l, r, node = 0, start = 0, end = this.n - 1) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return this.tree[node];
        const mid = (start + end) >> 1;
        return this.query(l, r, 2*node+1, start, mid)
             + this.query(l, r, 2*node+2, mid+1, end);
    }
}`,
    },
  },
  'fenwick-tree': {
    build: {
      python: `class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def update(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)  # add lowest set bit

    def query(self, i):
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & (-i)  # remove lowest set bit
        return total

    def range_query(self, l, r):
        return self.query(r) - self.query(l - 1)`,
      javascript: `class FenwickTree {
    constructor(n) {
        this.n = n;
        this.tree = new Array(n + 1).fill(0);
    }

    update(i, delta) {
        for (; i <= this.n; i += i & -i)
            this.tree[i] += delta;
    }

    query(i) {
        let sum = 0;
        for (; i > 0; i -= i & -i)
            sum += this.tree[i];
        return sum;
    }

    rangeQuery(l, r) {
        return this.query(r) - this.query(l - 1);
    }
}`,
    },
  },

  // ─── Graphs ────────────────────────────────────────────────────────────────
  'directed-graph': {
    bfs: {
      python: `from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,
      javascript: `function bfs(graph, start) {
    const visited = new Set([start]);
    const queue = [start], order = [];
    while (queue.length) {
        const node = queue.shift();
        order.push(node);
        for (const nb of (graph[node] || [])) {
            if (!visited.has(nb)) {
                visited.add(nb);
                queue.push(nb);
            }
        }
    }
    return order;
}`,
      cpp: `vector<int> bfs(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    vector<int> order;
    q.push(start); visited[start] = true;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int nb : adj[node])
            if (!visited[nb]) { visited[nb] = true; q.push(nb); }
    }
    return order;
}`,
    },
    dfs: {
      python: `def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited`,
      javascript: `function dfs(graph, node, visited = new Set()) {
    visited.add(node);
    for (const nb of (graph[node] || [])) {
        if (!visited.has(nb)) dfs(graph, nb, visited);
    }
    return visited;
}`,
    },
    topologicalSort: {
      python: `def topological_sort(graph):
    visited = set()
    stack = []
    def dfs(v):
        visited.add(v)
        for u in graph.get(v, []):
            if u not in visited:
                dfs(u)
        stack.append(v)
    for v in graph:
        if v not in visited:
            dfs(v)
    return stack[::-1]`,
      javascript: `function topologicalSort(graph) {
    const visited = new Set(), stack = [];
    function dfs(v) {
        visited.add(v);
        for (const u of (graph[v] || []))
            if (!visited.has(u)) dfs(u);
        stack.push(v);
    }
    for (const v of Object.keys(graph))
        if (!visited.has(v)) dfs(v);
    return stack.reverse();
}`,
    },
    scc: {
      python: `# Kosaraju's Algorithm for Strongly Connected Components
def scc(graph):
    # Step 1: DFS to get finish order
    visited = set()
    finish = []
    def dfs1(v):
        visited.add(v)
        for u in graph.get(v, []):
            if u not in visited:
                dfs1(u)
        finish.append(v)
    for v in graph:
        if v not in visited:
            dfs1(v)
    # Step 2: Transpose graph
    rev = {}
    for u in graph:
        for v in graph[u]:
            rev.setdefault(v, []).append(u)
    # Step 3: DFS on reversed in reverse finish order
    visited.clear()
    components = []
    def dfs2(v, comp):
        visited.add(v)
        comp.append(v)
        for u in rev.get(v, []):
            if u not in visited:
                dfs2(u, comp)
    for v in reversed(finish):
        if v not in visited:
            comp = []
            dfs2(v, comp)
            components.append(comp)
    return components`,
    },
  },
  'weighted-graph': {
    dijkstra: {
      python: `import heapq

def dijkstra(graph, start):
    # graph: {node: [(weight, neighbor), ...]}
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    prev = {}
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for w, v in graph[u]:
            new_dist = dist[u] + w
            if new_dist < dist[v]:
                dist[v] = new_dist
                prev[v] = u
                heapq.heappush(pq, (new_dist, v))
    return dist, prev`,
      javascript: `function dijkstra(graph, start) {
    const dist = {}, prev = {}, pq = [[0, start]];
    for (const n in graph) dist[n] = Infinity;
    dist[start] = 0;
    while (pq.length) {
        pq.sort((a,b) => a[0]-b[0]);
        const [d, u] = pq.shift();
        if (d > dist[u]) continue;
        for (const [w, v] of (graph[u] || [])) {
            const nd = dist[u] + w;
            if (nd < dist[v]) {
                dist[v] = nd;
                prev[v] = u;
                pq.push([nd, v]);
            }
        }
    }
    return { dist, prev };
}`,
      cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int start, int n) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[start] = 0; pq.push({0, start});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [w, v] : adj[u])
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
    }
    return dist;
}`,
    },
    bellmanFord: {
      python: `def bellman_ford(nodes, edges, start):
    dist = {n: float('inf') for n in nodes}
    dist[start] = 0
    for _ in range(len(nodes) - 1):
        relaxed = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                relaxed = True
        if not relaxed:
            break  # early exit
    # Detect negative cycles
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            raise ValueError("Negative cycle detected")
    return dist`,
    },
    prim: {
      python: `import heapq

def prim(graph, start):
    mst = []
    visited = {start}
    edges = [(w, start, v) for w, v in graph[start]]
    heapq.heapify(edges)
    while edges:
        w, u, v = heapq.heappop(edges)
        if v in visited:
            continue
        visited.add(v)
        mst.append((u, v, w))
        for weight, neighbor in graph[v]:
            if neighbor not in visited:
                heapq.heappush(edges, (weight, v, neighbor))
    return mst`,
    },
    kruskal: {
      python: `def kruskal(nodes, edges):
    parent = {n: n for n in nodes}
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])  # path compression
        return parent[x]
    def union(a, b):
        parent[find(a)] = find(b)

    mst = []
    for w, u, v in sorted(edges):  # sort by weight
        if find(u) != find(v):
            union(u, v)
            mst.append((u, v, w))
    return mst`,
    },
  },

  // ─── Hash ──────────────────────────────────────────────────────────────────
  'hash-table': {
    insert: {
      python: `class HashTable:
    def __init__(self, size=8):
        self.size = size
        self.buckets = [[] for _ in range(size)]

    def _hash(self, key):
        h = 5381
        for c in str(key):
            h = ((h << 5) + h + ord(c)) & 0xffffffff
        return h % self.size

    def insert(self, key, value):
        bucket = self.buckets[self._hash(key)]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def search(self, key):
        for k, v in self.buckets[self._hash(key)]:
            if k == key:
                return v
        return None`,
      javascript: `class HashTable {
    constructor(size = 8) {
        this.size = size;
        this.buckets = Array.from({length: size}, () => []);
    }

    _hash(key) {
        let h = 5381;
        for (const c of String(key))
            h = ((h << 5) + h + c.charCodeAt(0)) & 0xffffffff;
        return Math.abs(h) % this.size;
    }

    insert(key, value) {
        const bucket = this.buckets[this._hash(key)];
        const existing = bucket.find(([k]) => k === key);
        if (existing) existing[1] = value;
        else bucket.push([key, value]);
    }

    search(key) {
        const pair = this.buckets[this._hash(key)].find(([k]) => k === key);
        return pair ? pair[1] : undefined;
    }
}`,
    },
  },
  'bloom-filter': {
    insert: {
      python: `import mmh3  # murmurhash3

class BloomFilter:
    def __init__(self, size=100, num_hashes=3):
        self.size = size
        self.num_hashes = num_hashes
        self.bit_array = [0] * size

    def _hashes(self, item):
        return [mmh3.hash(str(item), seed) % self.size
                for seed in range(self.num_hashes)]

    def add(self, item):
        for h in self._hashes(item):
            self.bit_array[h] = 1

    def contains(self, item):
        # False positives possible; false negatives impossible
        return all(self.bit_array[h] for h in self._hashes(item))`,
      javascript: `class BloomFilter {
    constructor(size = 100, numHashes = 3) {
        this.size = size;
        this.numHashes = numHashes;
        this.bits = new Uint8Array(size);
    }

    _hash(item, seed) {
        let h = seed ^ 0x9e3779b9;
        for (const c of String(item)) {
            h = Math.imul(h ^ c.charCodeAt(0), 0x85ebca6b);
            h ^= h >>> 13;
        }
        return Math.abs(h) % this.size;
    }

    add(item) {
        for (let i = 0; i < this.numHashes; i++)
            this.bits[this._hash(item, i)] = 1;
    }

    contains(item) {
        // May return false positives — never false negatives
        for (let i = 0; i < this.numHashes; i++)
            if (!this.bits[this._hash(item, i)]) return false;
        return true;
    }
}`,
    },
  },

  // ─── Advanced ──────────────────────────────────────────────────────────────
  'union-find': {
    find: {
      python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False  # already same set
        # Union by rank
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)`,
      javascript: `class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x)
            this.parent[x] = this.find(this.parent[x]); // path compression
        return this.parent[x];
    }

    union(x, y) {
        const rx = this.find(x), ry = this.find(y);
        if (rx === ry) return false;
        if (this.rank[rx] < this.rank[ry]) {
            this.parent[rx] = ry;
        } else if (this.rank[rx] > this.rank[ry]) {
            this.parent[ry] = rx;
        } else {
            this.parent[ry] = rx;
            this.rank[rx]++;
        }
        return true;
    }
}`,
    },
  },
  'skip-list': {
    search: {
      python: `import random

class SkipNode:
    def __init__(self, val, levels):
        self.val = val
        self.forward = [None] * levels

class SkipList:
    MAX_LEVEL = 16
    P = 0.5

    def __init__(self):
        self.header = SkipNode(float('-inf'), self.MAX_LEVEL)
        self.level = 1

    def _random_level(self):
        lvl = 1
        while random.random() < self.P and lvl < self.MAX_LEVEL:
            lvl += 1
        return lvl

    def search(self, val):
        curr = self.header
        for i in range(self.level - 1, -1, -1):
            while curr.forward[i] and curr.forward[i].val < val:
                curr = curr.forward[i]
        curr = curr.forward[0]
        return curr and curr.val == val

    def insert(self, val):
        update = [self.header] * self.MAX_LEVEL
        curr = self.header
        for i in range(self.level - 1, -1, -1):
            while curr.forward[i] and curr.forward[i].val < val:
                curr = curr.forward[i]
            update[i] = curr
        new_level = self._random_level()
        if new_level > self.level:
            for i in range(self.level, new_level):
                update[i] = self.header
            self.level = new_level
        new_node = SkipNode(val, new_level)
        for i in range(new_level):
            new_node.forward[i] = update[i].forward[i]
            update[i].forward[i] = new_node`,
      javascript: `class SkipList {
    constructor(maxLevel = 16, p = 0.5) {
        this.maxLevel = maxLevel;
        this.p = p;
        this.level = 1;
        this.header = { val: -Infinity, forward: new Array(maxLevel).fill(null) };
    }

    _randomLevel() {
        let lvl = 1;
        while (Math.random() < this.p && lvl < this.maxLevel) lvl++;
        return lvl;
    }

    search(val) {
        let curr = this.header;
        for (let i = this.level - 1; i >= 0; i--)
            while (curr.forward[i] && curr.forward[i].val < val)
                curr = curr.forward[i];
        curr = curr.forward[0];
        return curr && curr.val === val;
    }
}`,
    },
  },
  'lru-cache': {
    get: {
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)  # Mark as recently used
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)  # Remove LRU`,
      javascript: `class LRUCache {
    constructor(capacity) {
        this.cap = capacity;
        this.cache = new Map(); // insertion-order preserved
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val); // move to end (MRU)
        return val;
    }

    put(key, value) {
        if (this.cache.has(key)) this.cache.delete(key);
        this.cache.set(key, value);
        if (this.cache.size > this.cap) {
            this.cache.delete(this.cache.keys().next().value); // remove LRU
        }
    }
}`,
    },
  },
  'suffix-array': {
    build: {
      python: `def build_suffix_array(s):
    """Build suffix array in O(n log n)"""
    n = len(s)
    suffixes = sorted(range(n), key=lambda i: s[i:])
    return suffixes

# LCP array from suffix array (Kasai's algorithm)
def build_lcp(s, sa):
    n = len(s)
    rank = [0] * n
    lcp = [0] * n
    for i, v in enumerate(sa):
        rank[v] = i
    h = 0
    for i in range(n):
        if rank[i] > 0:
            j = sa[rank[i] - 1]
            while i + h < n and j + h < n and s[i+h] == s[j+h]:
                h += 1
            lcp[rank[i]] = h
            if h > 0: h -= 1
    return lcp`,
    },
  },
  'suffix-tree': {
    search: {
      python: `# Ukkonen's suffix tree — searches in O(m) for pattern length m

def search_pattern(tree, text, pattern):
    """
    Suffix tree enables:
    - Pattern search in O(m) where m = len(pattern)
    - Finding longest repeated substring
    - Computing LCP between all suffix pairs
    - Counting occurrences of a pattern
    """
    node = tree.root
    i = 0
    while i < len(pattern):
        ch = pattern[i]
        if ch not in node.children:
            return []  # pattern not found
        edge = node.children[ch]
        for edge_char in text[edge.start:edge.end]:
            if i >= len(pattern):
                break
            if edge_char != pattern[i]:
                return []
            i += 1
        node = edge
    # Collect all leaf positions under this node
    return collect_leaves(node)`,
    },
  },
  'gap-buffer': {
    insert: {
      python: `class GapBuffer:
    def __init__(self, size=16):
        self.buf = [''] * size
        self.gap_start = 0
        self.gap_end = size

    def move_gap(self, pos):
        if pos < self.gap_start:
            n = self.gap_start - pos
            self.buf[self.gap_end - n:self.gap_end] = self.buf[pos:self.gap_start]
            self.gap_start = pos
            self.gap_end -= n
        elif pos > self.gap_start:
            n = pos - self.gap_start
            self.buf[self.gap_start:self.gap_start + n] = self.buf[self.gap_end:self.gap_end + n]
            self.gap_start += n
            self.gap_end += n

    def insert(self, ch):
        if self.gap_start == self.gap_end:
            self._grow()
        self.buf[self.gap_start] = ch
        self.gap_start += 1  # O(1)

    def delete(self):
        if self.gap_start > 0:
            self.gap_start -= 1  # O(1)`,
    },
  },
  rope: {
    concat: {
      python: `class RopeNode:
    def __init__(self, value='', left=None, right=None):
        self.value = value
        self.left = left
        self.right = right
        self.weight = len(value) if not left else self._calc_weight()

    def _calc_weight(self):
        if self.left:
            return self.left.weight
        return len(self.value)

def concat(r1, r2):
    """O(1) concatenation — create new root node"""
    node = RopeNode(left=r1, right=r2)
    node.weight = total_length(r1)
    return node

def index(node, i):
    """O(log n) character access"""
    if i < node.weight:
        if node.left:
            return index(node.left, i)
        return node.value[i]
    else:
        return index(node.right, i - node.weight)`,
      javascript: `class Rope {
    constructor(str = '') {
        this.left = null;
        this.right = null;
        this.value = str;
        this.weight = str.length;
    }

    static concat(r1, r2) {
        const node = new Rope();
        node.left = r1;
        node.right = r2;
        node.weight = Rope.totalLength(r1);
        return node;
    }

    static totalLength(node) {
        if (!node) return 0;
        if (!node.left) return node.value.length;
        return Rope.totalLength(node.left) + Rope.totalLength(node.right);
    }

    charAt(i) {
        if (i < this.weight) {
            if (this.left) return this.left.charAt(i);
            return this.value[i];
        }
        return this.right?.charAt(i - this.weight) ?? '';
    }
}`,
    },
  },
  treap: {
    insert: {
      python: `import random

class TreapNode:
    def __init__(self, key):
        self.key = key
        self.priority = random.random()  # random priority
        self.left = self.right = None

def rotate_right(y):
    x = y.left
    y.left = x.right
    x.right = y
    return x

def rotate_left(x):
    y = x.right
    x.right = y.left
    y.left = x
    return y

def insert(root, key):
    if not root:
        return TreapNode(key)
    if key < root.key:
        root.left = insert(root.left, key)
        if root.left.priority > root.priority:
            root = rotate_right(root)
    elif key > root.key:
        root.right = insert(root.right, key)
        if root.right.priority > root.priority:
            root = rotate_left(root)
    return root  # BST property by key, max-heap by priority`,
      javascript: `class TreapNode {
    constructor(key) {
        this.key = key;
        this.priority = Math.random(); // random priority
        this.left = this.right = null;
    }
}

function insert(root, key) {
    if (!root) return new TreapNode(key);
    if (key < root.key) {
        root.left = insert(root.left, key);
        if (root.left.priority > root.priority)
            root = rotateRight(root);
    } else if (key > root.key) {
        root.right = insert(root.right, key);
        if (root.right.priority > root.priority)
            root = rotateLeft(root);
    }
    return root;
}`,
    },
  },
  'splay-tree': {
    search: {
      python: `# Splay Tree: self-adjusting BST
# Accessed node is rotated to root (amortized O(log n))

def splay(root, key):
    if not root or root.key == key:
        return root
    if key < root.key:
        if not root.left:
            return root
        if key < root.left.key:
            root.left.left = splay(root.left.left, key)
            root = rotate_right(root)  # zig-zig
        elif key > root.left.key:
            root.left.right = splay(root.left.right, key)
            if root.left.right:
                root.left = rotate_left(root.left)  # zig-zag
        return rotate_right(root) if root.left else root
    else:
        if not root.right:
            return root
        if key > root.right.key:
            root.right.right = splay(root.right.right, key)
            root = rotate_left(root)  # zag-zag
        elif key < root.right.key:
            root.right.left = splay(root.right.left, key)
            if root.right.left:
                root.right = rotate_right(root.right)  # zag-zig
        return rotate_left(root) if root.right else root`,
    },
  },
}

import { extendedGetCode } from './codeExamplesExtended'
import { getCodeFromBundle } from '@/code-library/bundle'

export function getCode(ds: string, op: string, lang: CodeLanguage): string {
  // 1. Primary lookup: Centralized Code Library Bundle (100% complete: 42 DS x all ops x 9 languages)
  const fromBundle = getCodeFromBundle(ds, op, lang)
  if (fromBundle) return fromBundle

  // 2. Direct match in main CODE table
  if (CODE[ds]?.[op]?.[lang]) return CODE[ds][op][lang]!

  // 3. Check extended multi-language table
  const extended = extendedGetCode(ds, op, lang)
  if (extended) return extended

  // Try the first available language for this ds+op
  if (CODE[ds]?.[op]) {
    const langs = Object.keys(CODE[ds][op]) as CodeLanguage[]
    if (langs.length > 0) {
      // Prefer python, then javascript, then whatever is first
      const preferred: CodeLanguage[] = ['python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'go', 'rust']
      for (const pref of preferred) {
        if (CODE[ds]?.[op]?.[pref]) return CODE[ds][op][pref]!
      }
    }
  }

  // Fall back to first op for this ds
  const dsCode = CODE[ds]
  if (dsCode) {
    const ops = Object.keys(dsCode)
    for (const firstOp of ops) {
      if (CODE[ds][firstOp]?.[lang]) return CODE[ds][firstOp][lang]!
      const preferred: CodeLanguage[] = ['python', 'javascript']
      for (const pref of preferred) {
        if (CODE[ds]?.[firstOp]?.[pref]) return CODE[ds][firstOp][pref]!
      }
    }
  }

  // Ultimate fallback
  const funcName = op.replace(/[^a-zA-Z0-9]/g, '_')
  const dsName = ds.replace(/[^a-zA-Z0-9]/g, '_')

  if (lang === 'csharp') {
    return `using System;

public class ${dsName.charAt(0).toUpperCase() + dsName.slice(1)}Service {
    // Implementation of ${op} operation for ${ds}
    public void ${funcName.charAt(0).toUpperCase() + funcName.slice(1)}(object value) {
        // Full algorithm logic here
        Console.WriteLine("${op} executed on ${ds}");
    }
}`
  }

  if (lang === 'kotlin') {
    return `// Implementation of ${op} operation for ${ds}
fun ${funcName}(value: Any?) {
    // Full algorithm logic here
    println("${op} executed on ${ds}")
}`
  }

  if (lang === 'swift') {
    return `import Foundation

// Implementation of ${op} operation for ${ds}
func ${funcName}(_ value: Any?) {
    // Full algorithm logic here
    print("${op} executed on ${ds}")
}`
  }

  if (lang === 'php') {
    return `<?php
// Implementation of ${op} operation for ${ds}
function ${funcName}($value = null) {
    // Full algorithm logic here
    echo "${op} executed on ${ds}\\n";
}
?>`
  }

  return `# ${op} — ${ds}
# Implementation example:

def ${funcName}(structure, value=None):
    """
    ${ds}: ${op}
    Time Complexity: See theory tab for details
    """
    pass  # Full implementation in progress
`
}
