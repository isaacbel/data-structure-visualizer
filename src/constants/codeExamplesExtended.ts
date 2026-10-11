/**
 * Extended multi-language code examples for all major data structures.
 * Provides C, Java, C#, Go, Rust implementations for operations that
 * are missing from codeExamples.ts.
 *
 * Merged into getCode() via extendedGetCode().
 */
import type { CodeLanguage } from '@/types'

type CodeMap = Partial<Record<CodeLanguage, string>>
type OpMap = Record<string, CodeMap>
type DSMap = Record<string, OpMap>

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function ml(obj: CodeMap): CodeMap { return obj }

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ARRAY                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
const ARRAY: OpMap = {
  insert: ml({
    java: `import java.util.ArrayList;
public class Array {
    public static void insert(ArrayList<Integer> arr, int idx, int val) {
        arr.add(idx, val);   // O(n) shift
    }
}`,
    csharp: `using System.Collections.Generic;
public static class ArrayOps {
    public static void Insert(List<int> arr, int idx, int val) {
        arr.Insert(idx, val);   // O(n) shift
    }
}`,
    go: `func insertAt(arr []int, idx, val int) []int {
    arr = append(arr, 0)
    copy(arr[idx+1:], arr[idx:])
    arr[idx] = val
    return arr
}`,
    rust: `fn insert_at(arr: &mut Vec<i32>, idx: usize, val: i32) {
    arr.insert(idx, val);   // O(n)
}`,
    c: `void insert(int arr[], int *n, int idx, int val) {
    for (int i = *n; i > idx; i--)
        arr[i] = arr[i-1];
    arr[idx] = val;
    (*n)++;
}`,
  }),
  search: ml({
    java: `public static int search(int[] arr, int val) {
    for (int i = 0; i < arr.length; i++)
        if (arr[i] == val) return i;
    return -1;  // O(n) linear search
}`,
    csharp: `public static int Search(int[] arr, int val) {
    return Array.IndexOf(arr, val);  // O(n)
}`,
    go: `func search(arr []int, val int) int {
    for i, v := range arr {
        if v == val { return i }
    }
    return -1
}`,
    rust: `fn search(arr: &[i32], val: i32) -> Option<usize> {
    arr.iter().position(|&x| x == val)
}`,
    c: `int search(int arr[], int n, int val) {
    for (int i = 0; i < n; i++)
        if (arr[i] == val) return i;
    return -1;
}`,
  }),
  delete: ml({
    java: `public static void deleteAt(ArrayList<Integer> arr, int idx) {
    arr.remove(idx);   // O(n) shift
}`,
    csharp: `public static void Delete(List<int> arr, int idx) {
    arr.RemoveAt(idx);
}`,
    go: `func deleteAt(arr []int, idx int) []int {
    return append(arr[:idx], arr[idx+1:]...)
}`,
    rust: `fn delete_at(arr: &mut Vec<i32>, idx: usize) {
    arr.remove(idx);
}`,
    c: `void delete_at(int arr[], int *n, int idx) {
    for (int i = idx; i < *n - 1; i++)
        arr[i] = arr[i+1];
    (*n)--;
}`,
  }),
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  BST                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
const BST: OpMap = {
  insert: ml({
    c: `#include <stdlib.h>
typedef struct Node { int key; struct Node *left, *right; } Node;
Node* newNode(int k) {
    Node* n = malloc(sizeof(Node));
    n->key = k; n->left = n->right = NULL;
    return n;
}
Node* insert(Node* root, int key) {
    if (!root) return newNode(key);
    if (key < root->key)      root->left  = insert(root->left,  key);
    else if (key > root->key) root->right = insert(root->right, key);
    return root;  // duplicates ignored
}`,
    java: `class BST {
    static class Node { int key; Node left, right;
        Node(int k) { key = k; } }
    Node root;
    void insert(int key) { root = insert(root, key); }
    private Node insert(Node n, int key) {
        if (n == null) return new Node(key);
        if (key < n.key)      n.left  = insert(n.left,  key);
        else if (key > n.key) n.right = insert(n.right, key);
        return n;
    }
}`,
    csharp: `public class BST {
    class Node { public int Key; public Node Left, Right;
        public Node(int k) { Key = k; } }
    Node root;
    public void Insert(int key) => root = Insert(root, key);
    Node Insert(Node n, int key) {
        if (n == null) return new Node(key);
        if      (key < n.Key) n.Left  = Insert(n.Left,  key);
        else if (key > n.Key) n.Right = Insert(n.Right, key);
        return n;
    }
}`,
    go: `type Node struct { Key int; Left, Right *Node }

func insert(root *Node, key int) *Node {
    if root == nil { return &Node{Key: key} }
    if key < root.Key      { root.Left  = insert(root.Left,  key) }
    else if key > root.Key { root.Right = insert(root.Right, key) }
    return root
}`,
    rust: `use std::boxed::Box;
enum BST { Empty, Node { key: i32, left: Box<BST>, right: Box<BST> } }

impl BST {
    fn insert(self, key: i32) -> BST {
        match self {
            BST::Empty => BST::Node { key, left: Box::new(BST::Empty), right: Box::new(BST::Empty) },
            BST::Node { key: k, left, right } if key < k =>
                BST::Node { key: k, left: Box::new(left.insert(key)), right },
            BST::Node { key: k, left, right } if key > k =>
                BST::Node { key: k, left, right: Box::new(right.insert(key)) },
            other => other,
        }
    }
}`,
  }),
  search: ml({
    c: `int search(Node* root, int key) {
    if (!root) return 0;
    if (key == root->key) return 1;
    if (key <  root->key) return search(root->left,  key);
    return search(root->right, key);
}`,
    java: `boolean search(Node n, int key) {
    if (n == null) return false;
    if (key == n.key) return true;
    return key < n.key ? search(n.left, key) : search(n.right, key);
}`,
    csharp: `bool Search(Node n, int key) {
    if (n == null) return false;
    if (key == n.Key) return true;
    return key < n.Key ? Search(n.Left, key) : Search(n.Right, key);
}`,
    go: `func search(root *Node, key int) bool {
    if root == nil { return false }
    if key == root.Key { return true }
    if key < root.Key { return search(root.Left, key) }
    return search(root.Right, key)
}`,
    rust: `fn search(root: &BST, key: i32) -> bool {
    match root {
        BST::Empty => false,
        BST::Node { key: k, left, right } =>
            if key == *k { true }
            else if key < *k { search(left, key) }
            else { search(right, key) },
    }
}`,
  }),
  delete: ml({
    c: `Node* findMin(Node* n) {
    while (n->left) n = n->left;
    return n;
}
Node* delete(Node* root, int key) {
    if (!root) return NULL;
    if      (key < root->key) root->left  = delete(root->left,  key);
    else if (key > root->key) root->right = delete(root->right, key);
    else {
        if (!root->left)  return root->right;
        if (!root->right) return root->left;
        Node* succ = findMin(root->right);
        root->key = succ->key;
        root->right = delete(root->right, succ->key);
    }
    return root;
}`,
    java: `Node delete(Node n, int key) {
    if (n == null) return null;
    if      (key < n.key) n.left  = delete(n.left,  key);
    else if (key > n.key) n.right = delete(n.right, key);
    else {
        if (n.left  == null) return n.right;
        if (n.right == null) return n.left;
        Node succ = n.right;
        while (succ.left != null) succ = succ.left;
        n.key   = succ.key;
        n.right = delete(n.right, succ.key);
    }
    return n;
}`,
    go: `func deleteNode(root *Node, key int) *Node {
    if root == nil { return nil }
    if key < root.Key { root.Left = deleteNode(root.Left, key) }
    else if key > root.Key { root.Right = deleteNode(root.Right, key) }
    else {
        if root.Left == nil  { return root.Right }
        if root.Right == nil { return root.Left }
        succ := root.Right
        for succ.Left != nil { succ = succ.Left }
        root.Key   = succ.Key
        root.Right = deleteNode(root.Right, succ.Key)
    }
    return root
}`,
  }),
  inorder: ml({
    c: `void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->key);
    inorder(root->right);
}`,
    java: `void inorder(Node n) {
    if (n == null) return;
    inorder(n.left);
    System.out.print(n.key + " ");
    inorder(n.right);
}`,
    csharp: `void Inorder(Node n) {
    if (n == null) return;
    Inorder(n.Left);
    Console.Write(n.Key + " ");
    Inorder(n.Right);
}`,
    go: `func inorder(root *Node) {
    if root == nil { return }
    inorder(root.Left)
    fmt.Print(root.Key, " ")
    inorder(root.Right)
}`,
    rust: `fn inorder(root: &BST) {
    if let BST::Node { key, left, right } = root {
        inorder(left);
        print!("{} ", key);
        inorder(right);
    }
}`,
  }),
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  BFS / DFS / Dijkstra (shared across graph types)                           */
/* ─────────────────────────────────────────────────────────────────────────── */
const GRAPH_BFS: CodeMap = {
  c: `#include <stdio.h>
#include <string.h>
#define V 100
int adj[V][V], n;
void bfs(int start) {
    int visited[V] = {0}, queue[V], front = 0, rear = 0;
    queue[rear++] = start; visited[start] = 1;
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);
        for (int v = 0; v < n; v++)
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1; queue[rear++] = v;
            }
    }
}`,
  java: `import java.util.*;
void bfs(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    visited.add(start); queue.add(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        System.out.print(node + " ");
        for (int nb : graph.getOrDefault(node, List.of()))
            if (!visited.contains(nb)) { visited.add(nb); queue.add(nb); }
    }
}`,
  csharp: `void BFS(Dictionary<int, List<int>> graph, int start) {
    var visited = new HashSet<int> { start };
    var queue   = new Queue<int>(new[] { start });
    while (queue.Count > 0) {
        int node = queue.Dequeue();
        Console.Write(node + " ");
        foreach (var nb in graph.GetValueOrDefault(node, new()))
            if (visited.Add(nb)) queue.Enqueue(nb);
    }
}`,
  go: `import "fmt"
func bfs(graph map[int][]int, start int) {
    visited := map[int]bool{start: true}
    queue := []int{start}
    for len(queue) > 0 {
        node := queue[0]; queue = queue[1:]
        fmt.Print(node, " ")
        for _, nb := range graph[node] {
            if !visited[nb] { visited[nb] = true; queue = append(queue, nb) }
        }
    }
}`,
  rust: `use std::collections::{HashMap, HashSet, VecDeque};
fn bfs(graph: &HashMap<i32, Vec<i32>>, start: i32) -> Vec<i32> {
    let mut visited = HashSet::from([start]);
    let mut queue   = VecDeque::from([start]);
    let mut order   = Vec::new();
    while let Some(node) = queue.pop_front() {
        order.push(node);
        for &nb in graph.get(&node).unwrap_or(&vec![]) {
            if visited.insert(nb) { queue.push_back(nb); }
        }
    }
    order
}`,
}

const GRAPH_DFS: CodeMap = {
  c: `int visited[100];
void dfs(int adj[][100], int v, int n) {
    visited[v] = 1; printf("%d ", v);
    for (int u = 0; u < n; u++)
        if (adj[v][u] && !visited[u]) dfs(adj, u, n);
}`,
  java: `void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited) {
    visited.add(node); System.out.print(node + " ");
    for (int nb : graph.getOrDefault(node, List.of()))
        if (!visited.contains(nb)) dfs(graph, nb, visited);
}`,
  csharp: `void DFS(Dictionary<int, List<int>> graph, int node, HashSet<int> visited) {
    visited.Add(node); Console.Write(node + " ");
    foreach (var nb in graph.GetValueOrDefault(node, new()))
        if (!visited.Contains(nb)) DFS(graph, nb, visited);
}`,
  go: `func dfs(graph map[int][]int, node int, visited map[int]bool) {
    visited[node] = true
    fmt.Print(node, " ")
    for _, nb := range graph[node] {
        if !visited[nb] { dfs(graph, nb, visited) }
    }
}`,
  rust: `fn dfs(graph: &HashMap<i32, Vec<i32>>, node: i32, visited: &mut HashSet<i32>) {
    if !visited.insert(node) { return; }
    print!("{} ", node);
    for &nb in graph.get(&node).unwrap_or(&vec![]) {
        dfs(graph, nb, visited);
    }
}`,
}

const DIJKSTRA: CodeMap = {
  c: `#include <limits.h>
#define V 9
int minDist(int dist[], int visited[]) {
    int min = INT_MAX, idx = -1;
    for (int v = 0; v < V; v++)
        if (!visited[v] && dist[v] <= min) { min = dist[v]; idx = v; }
    return idx;
}
void dijkstra(int graph[V][V], int src) {
    int dist[V], visited[V] = {0};
    for (int i = 0; i < V; i++) dist[i] = INT_MAX;
    dist[src] = 0;
    for (int count = 0; count < V - 1; count++) {
        int u = minDist(dist, visited);
        visited[u] = 1;
        for (int v = 0; v < V; v++)
            if (!visited[v] && graph[u][v] && dist[u] != INT_MAX
                && dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
    }
}`,
  java: `import java.util.*;
int[] dijkstra(int[][] graph, int src) {
    int n = graph.length;
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];
        if (d > dist[u]) continue;
        for (int v = 0; v < n; v++)
            if (graph[u][v] > 0 && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                pq.offer(new int[]{dist[v], v});
            }
    }
    return dist;
}`,
  csharp: `int[] Dijkstra(int[][] graph, int src) {
    int n = graph.Length;
    var dist = Enumerable.Repeat(int.MaxValue, n).ToArray();
    dist[src] = 0;
    var pq = new SortedSet<(int d, int v)> { (0, src) };
    while (pq.Count > 0) {
        var (d, u) = pq.Min; pq.Remove(pq.Min);
        if (d > dist[u]) continue;
        for (int v = 0; v < n; v++)
            if (graph[u][v] > 0) {
                int nd = dist[u] + graph[u][v];
                if (nd < dist[v]) { dist[v] = nd; pq.Add((nd, v)); }
            }
    }
    return dist;
}`,
  go: `import (
    "container/heap"
    "math"
)
func dijkstra(graph [][]int, src int) []int {
    n := len(graph)
    dist := make([]int, n)
    for i := range dist { dist[i] = math.MaxInt32 }
    dist[src] = 0
    pq := &MinHeap{{0, src}}
    heap.Init(pq)
    for pq.Len() > 0 {
        item := heap.Pop(pq).([]int)
        d, u := item[0], item[1]
        if d > dist[u] { continue }
        for v, w := range graph[u] {
            if w > 0 && dist[u]+w < dist[v] {
                dist[v] = dist[u] + w
                heap.Push(pq, []int{dist[v], v})
            }
        }
    }
    return dist
}`,
  rust: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
fn dijkstra(graph: &Vec<Vec<(usize, i64)>>, src: usize) -> Vec<i64> {
    let n = graph.len();
    let mut dist = vec![i64::MAX; n];
    dist[src] = 0;
    let mut heap = BinaryHeap::new();
    heap.push(Reverse((0i64, src)));
    while let Some(Reverse((d, u))) = heap.pop() {
        if d > dist[u] { continue; }
        for &(v, w) in &graph[u] {
            if dist[u] + w < dist[v] {
                dist[v] = dist[u] + w;
                heap.push(Reverse((dist[v], v)));
            }
        }
    }
    dist
}`,
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HEAP                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const MIN_HEAP_OPS: OpMap = {
  insert: ml({
    c: `void heapifyUp(int heap[], int idx) {
    while (idx > 0) {
        int parent = (idx - 1) / 2;
        if (heap[parent] > heap[idx]) {
            int tmp = heap[parent]; heap[parent] = heap[idx]; heap[idx] = tmp;
            idx = parent;
        } else break;
    }
}
void insert(int heap[], int *size, int val) {
    heap[(*size)++] = val;
    heapifyUp(heap, *size - 1);
}`,
    java: `import java.util.PriorityQueue;
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(value);  // O(log n) insert with bubble-up`,
    csharp: `var minHeap = new PriorityQueue<int, int>();
minHeap.Enqueue(value, value);  // O(log n)`,
    go: `import "container/heap"
// Implement heap.Interface on []int with Less = arr[i] < arr[j]
func (h *IntHeap) Push(x any) { *h = append(*h, x.(int)) }
heap.Push(&h, value)  // O(log n)`,
    rust: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
let mut min_heap: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
min_heap.push(Reverse(value));  // O(log n)`,
  }),
  extractMin: ml({
    c: `int extractMin(int heap[], int *size) {
    int min = heap[0];
    heap[0] = heap[--(*size)];
    heapifyDown(heap, 0, *size);
    return min;
}
void heapifyDown(int heap[], int i, int n) {
    int smallest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && heap[l] < heap[smallest]) smallest = l;
    if (r < n && heap[r] < heap[smallest]) smallest = r;
    if (smallest != i) {
        int tmp = heap[i]; heap[i] = heap[smallest]; heap[smallest] = tmp;
        heapifyDown(heap, smallest, n);
    }
}`,
    java: `int min = minHeap.poll();  // O(log n) — removes and returns minimum`,
    go: `min := heap.Pop(&h).(int)  // O(log n)`,
    rust: `let min = min_heap.pop().map(|Reverse(v)| v);  // O(log n)`,
  }),
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HASH TABLE                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const HASH_TABLE_OPS: OpMap = {
  insert: ml({
    c: `#define SIZE 256
typedef struct Entry { int key, val; struct Entry* next; } Entry;
Entry* table[SIZE];
void insert(int key, int val) {
    int h = key % SIZE;
    Entry* e = malloc(sizeof(Entry));
    e->key = key; e->val = val; e->next = table[h];
    table[h] = e;  // chaining
}`,
    java: `HashMap<Integer, Integer> map = new HashMap<>();
map.put(key, value);  // O(1) average, O(n) worst case`,
    csharp: `var map = new Dictionary<int, int>();
map[key] = value;  // O(1) amortized`,
    go: `m := map[int]int{}
m[key] = value  // O(1) amortized`,
    rust: `use std::collections::HashMap;
let mut map: HashMap<i32, i32> = HashMap::new();
map.insert(key, value);  // O(1) amortized`,
  }),
  search: ml({
    c: `int search(int key) {
    int h = key % SIZE;
    Entry* e = table[h];
    while (e) {
        if (e->key == key) return e->val;
        e = e->next;
    }
    return -1;  // not found
}`,
    java: `map.getOrDefault(key, -1);  // O(1) average`,
    csharp: `map.TryGetValue(key, out int val) ? val : -1;  // O(1)`,
    go: `val, ok := m[key]  // ok is false if key not found`,
    rust: `map.get(&key).copied()  // returns Option<i32>`,
  }),
  delete: ml({
    java: `map.remove(key);  // O(1) average`,
    csharp: `map.Remove(key);  // O(1)`,
    go: `delete(m, key)  // O(1)`,
    rust: `map.remove(&key);  // O(1)`,
  }),
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  STACK                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
const STACK_OPS: OpMap = {
  push: ml({
    c: `#define MAX 100
int stack[MAX], top = -1;
void push(int val) {
    if (top >= MAX - 1) { printf("Overflow\\n"); return; }
    stack[++top] = val;
}`,
    java: `Deque<Integer> stack = new ArrayDeque<>();
stack.push(value);  // O(1)`,
    csharp: `var stack = new Stack<int>();
stack.Push(value);  // O(1)`,
    go: `var stack []int
stack = append(stack, value)  // O(1) amortized`,
    rust: `let mut stack: Vec<i32> = Vec::new();
stack.push(value);  // O(1) amortized`,
  }),
  pop: ml({
    c: `int pop() {
    if (top < 0) { printf("Underflow\\n"); return -1; }
    return stack[top--];
}`,
    java: `int val = stack.pop();  // O(1)`,
    csharp: `int val = stack.Pop();  // O(1)`,
    go: `val := stack[len(stack)-1]; stack = stack[:len(stack)-1]`,
    rust: `let val = stack.pop();  // returns Option<i32>`,
  }),
  peek: ml({
    c: `int peek() { return top >= 0 ? stack[top] : -1; }`,
    java: `int val = stack.peek();  // O(1)`,
    csharp: `int val = stack.Peek();  // O(1)`,
    go: `val := stack[len(stack)-1]  // O(1)`,
    rust: `let val = stack.last();  // returns Option<&i32>`,
  }),
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  LINKED LIST                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const LINKED_LIST_OPS: OpMap = {
  insertHead: ml({
    c: `typedef struct Node { int val; struct Node* next; } Node;
Node* insertHead(Node* head, int val) {
    Node* node = malloc(sizeof(Node));
    node->val = val; node->next = head;
    return node;
}`,
    java: `class LinkedList {
    Node head;
    void insertHead(int val) {
        Node node = new Node(val);
        node.next = head; head = node;
    }
}`,
    csharp: `class LinkedList {
    Node head;
    void InsertHead(int val) {
        var node = new Node(val);
        node.Next = head; head = node;
    }
}`,
    go: `type Node struct { Val int; Next *Node }
func insertHead(head *Node, val int) *Node {
    return &Node{Val: val, Next: head}
}`,
    rust: `struct Node { val: i32, next: Option<Box<Node>> }
fn insert_head(head: Option<Box<Node>>, val: i32) -> Option<Box<Node>> {
    Some(Box::new(Node { val, next: head }))
}`,
  }),
  insertTail: ml({
    c: `Node* insertTail(Node* head, int val) {
    Node* node = malloc(sizeof(Node));
    node->val = val; node->next = NULL;
    if (!head) return node;
    Node* cur = head;
    while (cur->next) cur = cur->next;
    cur->next = node; return head;
}`,
    java: `void insertTail(int val) {
    if (head == null) { head = new Node(val); return; }
    Node cur = head;
    while (cur.next != null) cur = cur.next;
    cur.next = new Node(val);
}`,
    go: `func insertTail(head *Node, val int) *Node {
    node := &Node{Val: val}
    if head == nil { return node }
    cur := head
    for cur.Next != nil { cur = cur.Next }
    cur.Next = node; return head
}`,
    rust: `fn insert_tail(head: Option<Box<Node>>, val: i32) -> Option<Box<Node>> {
    fn append(node: &mut Box<Node>, val: i32) {
        match &mut node.next {
            None => node.next = Some(Box::new(Node { val, next: None })),
            Some(next) => append(next, val),
        }
    }
    let mut h = head;
    if let Some(ref mut n) = h { append(n, val); } else { h = Some(Box::new(Node { val, next: None })); }
    h
}`,
  }),
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  EXTENDED LOOKUP TABLE                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
const EXTENDED: DSMap = {
  array: ARRAY,
  bst: BST,
  'binary-tree': BST,
  avl: BST,
  'red-black-tree': {
    insert: ml({ c: BST.insert.c!, java: BST.insert.java!, go: BST.insert.go!, rust: BST.insert.rust! }),
    search: ml({ c: BST.search.c!, java: BST.search.java!, go: BST.search.go!, rust: BST.search.rust! }),
  },
  stack: STACK_OPS,
  'linked-list-singly': LINKED_LIST_OPS,
  'linked-list-doubly': LINKED_LIST_OPS,
  'min-heap': MIN_HEAP_OPS,
  'max-heap': MIN_HEAP_OPS,
  'hash-table': HASH_TABLE_OPS,
  'hash-map': HASH_TABLE_OPS,
  'hash-set': HASH_TABLE_OPS,
  // Graph algorithms
  'directed-graph':   { bfs: GRAPH_BFS, dfs: GRAPH_DFS, dijkstra: DIJKSTRA },
  'undirected-graph': { bfs: GRAPH_BFS, dfs: GRAPH_DFS },
  'weighted-graph':   { dijkstra: DIJKSTRA, bfs: GRAPH_BFS, dfs: GRAPH_DFS },
  dag:                { bfs: GRAPH_BFS, dfs: GRAPH_DFS },
  'adjacency-list':   { bfs: GRAPH_BFS, dfs: GRAPH_DFS },
  'adjacency-matrix': { bfs: GRAPH_BFS, dfs: GRAPH_DFS },
  'graph-visualizer': { bfs: GRAPH_BFS, dfs: GRAPH_DFS, dijkstra: DIJKSTRA },
}

/**
 * Looks up an extended multi-language code snippet.
 * Returns null if not found — callers should fall back to their own lookup.
 */
export function extendedGetCode(ds: string, op: string, lang: CodeLanguage): string | null {
  return EXTENDED[ds]?.[op]?.[lang] ?? null
}
