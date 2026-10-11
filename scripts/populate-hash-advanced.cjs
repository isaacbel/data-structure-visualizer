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
   HASH TABLE / MAP / SET / BLOOM FILTER
═══════════════════════════════════════════════════════════════════════════ */
const HASH_IMPLS = {
  python: `class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return hash(key) % self.size

    def insert(self, key, value):
        idx = self._hash(key)
        for item in self.table[idx]:
            if item[0] == key:
                item[1] = value
                return
        self.table[idx].append([key, value])

    def search(self, key):
        idx = self._hash(key)
        for item in self.table[idx]:
            if item[0] == key:
                return item[1]
        return None

    def delete(self, key):
        idx = self._hash(key)
        for i, item in enumerate(self.table[idx]):
            if item[0] == key:
                del self.table[idx][i]
                return True
        return False`,

  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TABLE_SIZE 10

typedef struct Node {
    int key;
    int val;
    struct Node* next;
} Node;

typedef struct {
    Node* buckets[TABLE_SIZE];
} HashTable;

int hash_func(int key) { return abs(key) % TABLE_SIZE; }

void insert(HashTable* ht, int key, int val) {
    int idx = hash_func(key);
    Node* n = (Node*)malloc(sizeof(Node));
    n->key = key; n->val = val; n->next = ht->buckets[idx];
    ht->buckets[idx] = n;
}`,

  cpp: `#include <unordered_map>
#include <iostream>

int main() {
    std::unordered_map<std::string, int> map;
    map["apple"] = 1;
    map["banana"] = 2;
    std::cout << map["apple"] << "\n";
}`,

  java: `import java.util.HashMap;

public class HashTableDemo {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("apple", 1);
        System.out.println(map.get("apple"));
    }
}`,

  javascript: `class HashTable {
    constructor(size = 10) { this.table = new Array(size); }
    insert(key, value) { }
    search(key) { }
    delete(key) { }
}`,

  typescript: `class HashTable<K, V> {
    private map = new Map<K, V>();
    insert(key: K, val: V): void { this.map.set(key, val); }
    search(key: K): V | undefined { return this.map.get(key); }
    delete(key: K): boolean { return this.map.delete(key); }
}`,

  csharp: `using System.Collections.Generic;
public class HashTableDemo {
    Dictionary<string, int> dict = new Dictionary<string, int>();
}`,

  go: `package main
type HashTable struct { m map[string]int }`,

  rust: `use std::collections::HashMap;
fn main() { let mut map = HashMap::new(); map.insert("apple", 1); }`
}

const HASH_DS_MAP = {
  'hash-table': ['insert','delete','search'],
  'hash-map': ['insert','delete','search'],
  'hash-set': ['insert','delete','search'],
  'bloom-filter': ['insert','search'],
}

for (const [ds, ops] of Object.entries(HASH_DS_MAP)) {
  for (const op of ops) {
    for (const [lang, code] of Object.entries(HASH_IMPLS)) {
      write(ds, op, lang, code)
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADVANCED (union-find, skip-list, lru-cache, suffix-tree, suffix-array)
═══════════════════════════════════════════════════════════════════════════ */
const ADV_IMPLS = {
  python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                root_i, root_j = root_j, root_i
            self.parent[root_j] = root_i
            if self.rank[root_i] == self.rank[root_j]:
                self.rank[root_i] += 1

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        val = self.cache.pop(key)
        self.cache[key] = val
        return val
    def put(self, key: int, value: int) -> None:
        if key in self.cache: self.cache.pop(key)
        elif len(self.cache) >= self.cap:
            next(iter(self.cache))
            del self.cache[next(iter(self.cache))]
        self.cache[key] = value`,

  c: `#include <stdio.h>
#include <stdlib.h>
typedef struct { int* parent; int* rank; } UnionFind;
UnionFind* uf_create(int n) {
    UnionFind* uf = malloc(sizeof(UnionFind));
    uf->parent = malloc(n * sizeof(int));
    uf->rank = calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) uf->parent[i] = i;
    return uf;
}
int uf_find(UnionFind* uf, int i) {
    if (uf->parent[i] == i) return i;
    return uf->parent[i] = uf_find(uf, uf->parent[i]);
}`,

  cpp: `#include <vector>
#include <numeric>
class UnionFind {
    std::vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) { std::iota(parent.begin(), parent.end(), 0); }
    int find(int i) { return parent[i] == i ? i : parent[i] = find(parent[i]); }
};`,

  java: `public class UnionFind {
    int[] parent, rank;
    public UnionFind(int n) {
        parent = new int[n]; rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
}`,

  javascript: `class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    find(i) {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);
    }
}`,

  typescript: `class UnionFind {
    private parent: number[];
    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
    }
    find(i: number): number {
        return this.parent[i] === i ? i : (this.parent[i] = this.find(this.parent[i]));
    }
}`,

  csharp: `public class UnionFind {
    int[] parent;
    public UnionFind(int n) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
}`,

  go: `package main
type UnionFind struct { parent []int }`,

  rust: `struct UnionFind { parent: Vec<usize> }`
}

const ADV_DS_MAP = {
  'union-find': ['makeSet','union','find'],
  'skip-list': ['insert','delete','search'],
  'lru-cache': ['get','put'],
  'suffix-tree': ['build','search'],
  'suffix-array': ['build','search'],
}

for (const [ds, ops] of Object.entries(ADV_DS_MAP)) {
  for (const op of ops) {
    for (const [lang, code] of Object.entries(ADV_IMPLS)) {
      write(ds, op, lang, code)
    }
  }
}

console.log('✅ Hash and Advanced structures populated.')
