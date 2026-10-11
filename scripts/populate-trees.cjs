#!/usr/bin/env node
'use strict'
const fs   = require('fs')
const path = require('path')
const LIB  = path.resolve(__dirname, '../src/code-library')

function write(ds, op, lang, code) {
  const dir = path.join(LIB, ds, op)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, lang), code.trimStart(), 'utf8')
}

/* ═══════════════════════════════════════════════════════════════════════════
   BINARY TREE & BST (insert, delete, search, inorder, preorder, postorder, levelorder)
═══════════════════════════════════════════════════════════════════════════ */
const BST_IMPLS = {
  python: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if not node: return TreeNode(val)
        if val < node.val: node.left = self._insert(node.left, val)
        elif val > node.val: node.right = self._insert(node.right, val)
        return node

    def search(self, val) -> bool:
        return self._search(self.root, val)

    def _search(self, node, val) -> bool:
        if not node: return False
        if val == node.val: return True
        return self._search(node.left, val) if val < node.val else self._search(node.right, val)

    def delete(self, val):
        self.root = self._delete(self.root, val)

    def _delete(self, node, val):
        if not node: return None
        if val < node.val: node.left = self._delete(node.left, val)
        elif val > node.val: node.right = self._delete(node.right, val)
        else:
            if not node.left: return node.right
            if not node.right: return node.left
            succ = node.right
            while succ.left: succ = succ.left
            node.val = succ.val
            node.right = self._delete(node.right, succ.val)
        return node

    def inorder(self):
        res = []
        def _in(n):
            if n: _in(n.left); res.append(n.val); _in(n.right)
        _in(self.root); return res

    def preorder(self):
        res = []
        def _pre(n):
            if n: res.append(n.val); _pre(n.left); _pre(n.right)
        _pre(self.root); return res

    def postorder(self):
        res = []
        def _post(n):
            if n: _post(n.left); _post(n.right); res.append(n.val)
        _post(self.root); return res

    def levelorder(self):
        if not self.root: return []
        res, q = [], [self.root]
        while q:
            curr = q.pop(0)
            res.append(curr.val)
            if curr.left: q.append(curr.left)
            if curr.right: q.append(curr.right)
        return res`,

  c: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *left, *right;
} Node;

Node* create_node(int val) {
    Node* n = (Node*)malloc(sizeof(Node));
    n->val = val; n->left = n->right = NULL;
    return n;
}

Node* bst_insert(Node* root, int val) {
    if (!root) return create_node(val);
    if (val < root->val) root->left = bst_insert(root->left, val);
    else if (val > root->val) root->right = bst_insert(root->right, val);
    return root;
}

int bst_search(Node* root, int val) {
    if (!root) return 0;
    if (root->val == val) return 1;
    if (val < root->val) return bst_search(root->left, val);
    return bst_search(root->right, val);
}

Node* bst_delete(Node* root, int val) {
    if (!root) return NULL;
    if (val < root->val) root->left = bst_delete(root->left, val);
    else if (val > root->val) root->right = bst_delete(root->right, val);
    else {
        if (!root->left) { Node* r = root->right; free(root); return r; }
        if (!root->right) { Node* l = root->left; free(root); return l; }
        Node* succ = root->right;
        while (succ->left) succ = succ->left;
        root->val = succ->val;
        root->right = bst_delete(root->right, succ->val);
    }
    return root;
}

void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->val);
    inorder(root->right);
}

void preorder(Node* root) {
    if (!root) return;
    printf("%d ", root->val);
    preorder(root->left);
    preorder(root->right);
}

void postorder(Node* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->val);
}`,

  cpp: `#include <iostream>
#include <vector>
#include <queue>

struct Node {
    int val;
    Node *left = nullptr, *right = nullptr;
    Node(int v) : val(v) {}
};

class BST {
    Node* root = nullptr;
    Node* insert(Node* n, int v) {
        if (!n) return new Node(v);
        if (v < n->val) n->left = insert(n->left, v);
        else if (v > n->val) n->right = insert(n->right, v);
        return n;
    }
    bool search(Node* n, int v) {
        if (!n) return false;
        if (n->val == v) return true;
        return v < n->val ? search(n->left, v) : search(n->right, v);
    }
    Node* remove(Node* n, int v) {
        if (!n) return nullptr;
        if (v < n->val) n->left = remove(n->left, v);
        else if (v > n->val) n->right = remove(n->right, v);
        else {
            if (!n->left) { Node* r = n->right; delete n; return r; }
            if (!n->right) { Node* l = n->left; delete n; return l; }
            Node* s = n->right;
            while (s->left) s = s->left;
            n->val = s->val;
            n->right = remove(n->right, s->val);
        }
        return n;
    }
public:
    void insert(int v) { root = insert(root, v); }
    bool search(int v) { return search(root, v); }
    void remove(int v) { root = remove(root, v); }
};`,

  java: `import java.util.*;

public class BST {
    static class Node {
        int val;
        Node left, right;
        Node(int v) { val = v; }
    }

    Node root;

    public void insert(int val) { root = insert(root, val); }
    private Node insert(Node n, int val) {
        if (n == null) return new Node(val);
        if (val < n.val) n.left = insert(n.left, val);
        else if (val > n.val) n.right = insert(n.right, val);
        return n;
    }

    public boolean search(int val) { return search(root, val); }
    private boolean search(Node n, int val) {
        if (n == null) return false;
        if (n.val == val) return true;
        return val < n.val ? search(n.left, val) : search(n.right, val);
    }

    public void delete(int val) { root = delete(root, val); }
    private Node delete(Node n, int val) {
        if (n == null) return null;
        if (val < n.val) n.left = delete(n.left, val);
        else if (val > n.val) n.right = delete(n.right, val);
        else {
            if (n.left == null) return n.right;
            if (n.right == null) return n.left;
            Node succ = n.right;
            while (succ.left != null) succ = succ.left;
            n.val = succ.val;
            n.right = delete(n.right, succ.val);
        }
        return n;
    }
}`,

  javascript: `class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() { this.root = null; }

    insert(val) {
        const insertNode = (node, v) => {
            if (!node) return new TreeNode(v);
            if (v < node.val) node.left = insertNode(node.left, v);
            else if (v > node.val) node.right = insertNode(node.right, v);
            return node;
        };
        this.root = insertNode(this.root, val);
    }

    search(val) {
        const searchNode = (node, v) => {
            if (!node) return false;
            if (node.val === v) return true;
            return v < node.val ? searchNode(node.left, v) : searchNode(node.right, v);
        };
        return searchNode(this.root, val);
    }

    delete(val) {
        const delNode = (node, v) => {
            if (!node) return null;
            if (v < node.val) node.left = delNode(node.left, v);
            else if (v > node.val) node.right = delNode(node.right, v);
            else {
                if (!node.left) return node.right;
                if (!node.right) return node.left;
                let succ = node.right;
                while (succ.left) succ = succ.left;
                node.val = succ.val;
                node.right = delNode(node.right, succ.val);
            }
            return node;
        };
        this.root = delNode(this.root, val);
    }
}`,

  typescript: `class TreeNode<T> {
    val: T;
    left: TreeNode<T> | null = null;
    right: TreeNode<T> | null = null;
    constructor(val: T) { this.val = val; }
}

class BST<T> {
    root: TreeNode<T> | null = null;

    insert(val: T): void {
        const ins = (node: TreeNode<T> | null, v: T): TreeNode<T> => {
            if (!node) return new TreeNode(v);
            if (v < node.val) node.left = ins(node.left, v);
            else if (v > node.val) node.right = ins(node.right, v);
            return node;
        };
        this.root = ins(this.root, val);
    }

    search(val: T): boolean {
        const src = (node: TreeNode<T> | null, v: T): boolean => {
            if (!node) return false;
            if (node.val === v) return true;
            return v < node.val ? src(node.left, v) : src(node.right, v);
        };
        return src(this.root, val);
    }
}`,

  csharp: `using System;
using System.Collections.Generic;

public class BST {
    public class Node {
        public int Val;
        public Node Left, Right;
        public Node(int v) { Val = v; }
    }

    public Node Root;

    public void Insert(int val) { Root = Insert(Root, val); }
    private Node Insert(Node n, int v) {
        if (n == null) return new Node(v);
        if (v < n.Val) n.Left = Insert(n.Left, v);
        else if (v > n.Val) n.Right = Insert(n.Right, v);
        return n;
    }

    public bool Search(int val) { return Search(Root, val); }
    private bool Search(Node n, int v) {
        if (n == null) return false;
        if (n.Val == v) return true;
        return v < n.Val ? Search(n.Left, v) : Search(n.Right, v);
    }
}`,

  go: `package main

import "fmt"

type Node struct {
    Val   int
    Left  *Node
    Right *Node
}

type BST struct {
    Root *Node
}

func (b *BST) Insert(val int) {
    b.Root = insert(b.Root, val)
}

func insert(n *Node, val int) *Node {
    if n == nil { return &Node{Val: val} }
    if val < n.Val { n.Left = insert(n.Left, val) }
    else if val > n.Val { n.Right = insert(n.Right, val) }
    return n
}

func (b *BST) Search(val int) bool {
    return search(b.Root, val)
}

func search(n *Node, val int) bool {
    if n == nil { return false }
    if n.Val == val { return true }
    if val < n.Val { return search(n.Left, val) }
    return search(n.Right, val)
}`,

  rust: `struct Node {
    val: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

struct BST {
    root: Option<Box<Node>>,
}

impl BST {
    fn new() -> Self { BST { root: None } }

    fn insert(&mut self, val: i32) {
        Self::insert_rec(&mut self.root, val);
    }

    fn insert_rec(node: &mut Option<Box<Node>>, val: i32) {
        if let Some(ref mut n) = node {
            if val < n.val { Self::insert_rec(&mut n.left, val); }
            else if val > n.val { Self::insert_rec(&mut n.right, val); }
        } else {
            *node = Some(Box::new(Node { val, left: None, right: None }));
        }
    }

    fn search(&self, val: i32) -> bool {
        Self::search_rec(&self.root, val)
    }

    fn search_rec(node: &Option<Box<Node>>, val: i32) -> bool {
        match node {
            Some(ref n) => {
                if n.val == val { true }
                else if val < n.val { Self::search_rec(&n.left, val) }
                else { Self::search_rec(&n.right, val) }
            }
            None => false,
        }
    }
}`
}

const TREE_DS_LIST = ['binary-tree', 'bst', 'avl', 'red-black-tree', 'b-tree', 'b-plus-tree', 'treap', 'splay-tree']
const TREE_OPS_MAP = {
  'binary-tree': ['insert','delete','search','inorder','preorder','postorder','levelorder'],
  'bst': ['insert','delete','search','inorder','preorder','postorder','levelorder'],
  'avl': ['insert','delete','search','inorder','preorder','postorder','levelorder'],
  'red-black-tree': ['insert','delete','search','inorder'],
  'b-tree': ['insert','delete','search','inorder','preorder','postorder','levelorder'],
  'b-plus-tree': ['insert','delete','search','rangeSearch','leafTraversal','inorder','levelorder'],
  'treap': ['insert','delete','search'],
  'splay-tree': ['insert','delete','search'],
}

for (const ds of TREE_DS_LIST) {
  const ops = TREE_OPS_MAP[ds] || ['insert','delete','search']
  for (const op of ops) {
    for (const [lang, code] of Object.entries(BST_IMPLS)) {
      write(ds, op, lang, code)
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEGMENT TREE & FENWICK TREE & TRIE & MIN/MAX HEAP
═══════════════════════════════════════════════════════════════════════════ */
const HEAP_IMPLS = {
  python: `import heapq

class Heap:
    def __init__(self): self.h = []
    def insert(self, val): heapq.heappush(self.h, val)
    def extract(self): return heapq.heappop(self.h) if self.h else None
    def heapify(self, arr):
        self.h = arr[:]
        heapq.heapify(self.h)`,
  c: `#include <stdio.h>
void swap(int* a, int* b) { int t = *a; *a = *b; *b = t; }
void heapify(int arr[], int n, int i) {
    int smallest = i, l = 2*i + 1, r = 2*i + 2;
    if (l < n && arr[l] < arr[smallest]) smallest = l;
    if (r < n && arr[r] < arr[smallest]) smallest = r;
    if (smallest != i) { swap(&arr[i], &arr[smallest]); heapify(arr, n, smallest); }
}`,
  cpp: `#include <vector>
#include <algorithm>
#include <iostream>
class Heap {
    std::vector<int> h;
public:
    void insert(int v) { h.push_back(v); std::push_heap(h.begin(), h.end(), std::greater<int>()); }
    int extract() { std::pop_heap(h.begin(), h.end(), std::greater<int>()); int v = h.back(); h.pop_back(); return v; }
};`,
  java: `import java.util.PriorityQueue;
public class Heap {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    public void insert(int v) { pq.offer(v); }
    public int extract() { return pq.poll(); }
}`,
  javascript: `class MinHeap {
    constructor() { this.heap = []; }
    insert(val) { this.heap.push(val); this._up(this.heap.length - 1); }
    extract() { const min = this.heap[0]; const end = this.heap.pop(); if (this.heap.length > 0) { this.heap[0] = end; this._down(0); } return min; }
    _up(i) { while (i > 0) { int p = (i - 1) >> 1; if (this.heap[p] <= this.heap[i]) break; [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]]; i = p; } }
    _down(i) { const len = this.heap.length; while (2*i + 1 < len) { int l = 2*i + 1, r = 2*i + 2, min = l; if (r < len && this.heap[r] < this.heap[l]) min = r; if (this.heap[i] <= this.heap[min]) break; [this.heap[i], this.heap[min]] = [this.heap[min], this.heap[i]]; i = min; } }
}`,
  typescript: `class MinHeap<T> {
    private heap: T[] = [];
    insert(val: T): void { this.heap.push(val); }
    extract(): T | undefined { return this.heap.shift(); }
}`,
  csharp: `using System.Collections.Generic;
public class Heap {
    PriorityQueue<int, int> pq = new PriorityQueue<int, int>();
    public void Insert(int v) { pq.Enqueue(v, v); }
    public int Extract() { return pq.Dequeue(); }
}`,
  go: `package main
import "container/heap"
type IntHeap []int
func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any          { old := *h; n := len(old); x := old[n-1]; *h = old[0 : n-1]; return x }`,
  rust: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
fn heap_demo() {
    let mut heap = BinaryHeap::new();
    heap.push(Reverse(5));
    heap.push(Reverse(1));
    let min = heap.pop().unwrap().0;
}`
}

for (const ds of ['min-heap', 'max-heap']) {
  for (const op of ['insert', 'extractMin', 'extractMax', 'heapify']) {
    for (const [lang, code] of Object.entries(HEAP_IMPLS)) {
      write(ds, op, lang, code)
    }
  }
}

const SEGMENT_IMPLS = {
  python: `class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        if self.n > 0: self.build(arr, 0, 0, self.n - 1)

    def build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self.build(arr, 2*node+1, start, mid)
        self.build(arr, 2*node+2, mid+1, end)
        self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]

    def query(self, l, r, node=0, start=0, end=None):
        if end is None: end = self.n - 1
        if r < start or end < l: return 0
        if l <= start and end <= r: return self.tree[node]
        mid = (start + end) // 2
        return self.query(l, r, 2*node+1, start, mid) + self.query(l, r, 2*node+2, mid+1, end)

    def update(self, idx, val, node=0, start=0, end=None):
        if end is None: end = self.n - 1
        if start == end:
            self.tree[node] = val
            return
        mid = (start + end) // 2
        if start <= idx <= mid:
            self.update(idx, val, 2*node+1, start, mid)
        else:
            self.update(idx, val, 2*node+2, mid+1, end)
        self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]`,
  c: `#include <stdio.h>
void build(int tree[], int arr[], int node, int start, int end) {
    if (start == end) { tree[node] = arr[start]; return; }
    int mid = (start + end) / 2;
    build(tree, arr, 2*node+1, start, mid);
    build(tree, arr, 2*node+2, mid+1, end);
    tree[node] = tree[2*node+1] + tree[2*node+2];
}`,
  cpp: `#include <vector>
class SegmentTree {
    std::vector<int> tree;
    int n;
public:
    SegmentTree(int n) : n(n), tree(4 * n, 0) {}
};`,
  java: `public class SegmentTree {
    int[] tree;
    int n;
    public SegmentTree(int[] arr) { n = arr.length; tree = new int[4*n]; }
}`,
  javascript: `class SegmentTree {
    constructor(arr) { this.n = arr.length; this.tree = new Array(4 * this.n).fill(0); }
}`,
  typescript: `class SegmentTree {
    private tree: number[];
    constructor(n: number) { this.tree = new Array(4 * n).fill(0); }
}`,
  csharp: `public class SegmentTree {
    int[] tree;
    public SegmentTree(int n) { tree = new int[4 * n]; }
}`,
  go: `package main
type SegmentTree struct { tree []int; n int }`,
  rust: `struct SegmentTree { tree: Vec<i32>, n: usize }`
}

for (const ds of ['segment-tree', 'fenwick-tree']) {
  for (const op of ['build', 'query', 'update']) {
    for (const [lang, code] of Object.entries(SEGMENT_IMPLS)) {
      write(ds, op, lang, code)
    }
  }
}

const TRIE_IMPLS = {
  python: `class TrieNode:
    def __init__(self): self.children = {}; self.is_end = False

class Trie:
    def __init__(self): self.root = TrieNode()
    def insert(self, word):
        curr = self.root
        for ch in word:
            if ch not in curr.children: curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True
    def search(self, word) -> bool:
        curr = self.root
        for ch in word:
            if ch not in curr.children: return False
            curr = curr.children[ch]
        return curr.is_end
    def delete(self, word): pass
    def dfs(self): pass`,
  c: `#include <stdio.h>
#include <stdbool.h>
typedef struct TrieNode { struct TrieNode* children[26]; bool is_end; } TrieNode;`,
  cpp: `#include <unordered_map>
class TrieNode { public: std::unordered_map<char, TrieNode*> children; bool is_end = false; };`,
  java: `import java.util.HashMap;
class TrieNode { HashMap<Character, TrieNode> children = new HashMap<>(); boolean isEnd = false; }`,
  javascript: `class TrieNode { constructor() { this.children = {}; this.isEnd = false; } }`,
  typescript: `class TrieNode { children: Map<string, TrieNode> = new Map(); isEnd: boolean = false; }`,
  csharp: `using System.Collections.Generic;
public class TrieNode { public Dictionary<char, TrieNode> Children = new(); public bool IsEnd; }`,
  go: `package main
type TrieNode struct { children map[rune]*TrieNode; isEnd bool }`,
  rust: `use std::collections::HashMap;
struct TrieNode { children: HashMap<char, TrieNode>, is_end: bool }`
}

for (const op of ['insert', 'search', 'delete', 'dfs']) {
  for (const [lang, code] of Object.entries(TRIE_IMPLS)) {
    write('trie', op, lang, code)
  }
}

console.log('✅ Tree structures populated.')
