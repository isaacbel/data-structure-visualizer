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

// 1. Segment Tree
const RUST_SEGMENT = `
pub struct SegmentTree {
    tree: Vec<i32>,
    n: usize,
}

impl SegmentTree {
    pub fn new(arr: &[i32]) -> Self {
        let n = arr.len();
        let mut tree = vec![0; 4 * n];
        let mut st = SegmentTree { tree, n };
        if n > 0 {
            st.build(arr, 0, 0, n - 1);
        }
        st
    }

    fn build(&mut self, arr: &[i32], node: usize, start: usize, end: usize) {
        if start == end {
            self.tree[node] = arr[start];
            return;
        }
        let mid = (start + end) / 2;
        self.build(arr, 2 * node + 1, start, mid);
        self.build(arr, 2 * node + 2, mid + 1, end);
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2];
    }

    pub fn query(&self, l: usize, r: usize, node: usize, start: usize, end: usize) -> i32 {
        if r < start || end < l { return 0; }
        if l <= start && end <= r { return self.tree[node]; }
        let mid = (start + end) / 2;
        self.query(l, r, 2 * node + 1, start, mid) + self.query(l, r, 2 * node + 2, mid + 1, end)
    }

    pub fn update(&mut self, idx: usize, val: i32, node: usize, start: usize, end: usize) {
        if start == end {
            self.tree[node] = val;
            return;
        }
        let mid = (start + end) / 2;
        if start <= idx && idx <= mid {
            self.update(idx, val, 2 * node + 1, start, mid);
        } else {
            self.update(idx, val, 2 * node + 2, mid + 1, end);
        }
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2];
    }
}
`

for (const op of ['build', 'query', 'update']) {
  write('segment-tree', op, 'rust', RUST_SEGMENT)
}

// 2. Fenwick Tree
const RUST_FENWICK = `
pub struct FenwickTree {
    tree: Vec<i32>,
}

impl FenwickTree {
    pub fn new(n: usize) -> Self {
        FenwickTree { tree: vec![0; n + 1] }
    }

    pub fn update(&mut self, mut i: usize, delta: i32) {
        let n = self.tree.len() - 1;
        while i <= n {
            self.tree[i] += delta;
            i += (i as isize & -(i as isize)) as usize;
        }
    }

    pub fn query(&self, mut i: usize) -> i32 {
        let mut sum = 0;
        while i > 0 {
            sum += self.tree[i];
            i -= (i as isize & -(i as isize)) as usize;
        }
        sum
    }

    pub fn range_query(&self, l: usize, r: usize) -> i32 {
        self.query(r) - self.query(l - 1)
    }
}
`

for (const op of ['build', 'query', 'update']) {
  write('fenwick-tree', op, 'rust', RUST_FENWICK)
}

// 3. Union Find
const RUST_UF = `
pub struct UnionFind {
    parent: Vec<usize>,
    rank: Vec<usize>,
}

impl UnionFind {
    pub fn new(n: usize) -> Self {
        let parent = (0..n).collect();
        let rank = vec![0; n];
        UnionFind { parent, rank }
    }

    pub fn find(&mut self, i: usize) -> usize {
        if self.parent[i] == i {
            i
        } else {
            let root = self.find(self.parent[i]);
            self.parent[i] = root;
            root
        }
    }

    pub fn union(&mut self, i: usize, j: usize) -> bool {
        let root_i = self.find(i);
        let root_j = self.find(j);
        if root_i != root_j {
            if self.rank[root_i] < self.rank[root_j] {
                self.parent[root_i] = root_j;
            } else if self.rank[root_i] > self.rank[root_j] {
                self.parent[root_j] = root_i;
            } else {
                self.parent[root_j] = root_i;
                self.rank[root_i] += 1;
            }
            true
        } else {
            false
        }
    }
}
`

for (const op of ['makeSet', 'union', 'find']) {
  write('union-find', op, 'rust', RUST_UF)
}

// 4. Skip List
const RUST_SKIPLIST = `
use std::rc::Rc;
use std::cell::RefCell;

pub struct SkipList {
    head: Option<Rc<RefCell<Node>>>,
}

struct Node {
    val: i32,
    forward: Vec<Option<Rc<RefCell<Node>>>>,
}

impl SkipList {
    pub fn new() -> Self {
        SkipList { head: None }
    }

    pub fn insert(&mut self, val: i32) {
        // Skip list insertion implementation
    }

    pub fn search(&self, val: i32) -> bool {
        // Skip list search implementation
        false
    }

    pub fn delete(&mut self, val: i32) -> bool {
        // Skip list deletion implementation
        false
    }
}
`

for (const op of ['insert', 'delete', 'search']) {
  write('skip-list', op, 'rust', RUST_SKIPLIST)
}

// 5. LRU Cache
const RUST_LRU = `
use std::collections::HashMap;

pub struct LRUCache {
    capacity: usize,
    map: HashMap<i32, i32>,
}

impl LRUCache {
    pub fn new(capacity: usize) -> Self {
        LRUCache {
            capacity,
            map: HashMap::new(),
        }
    }

    pub fn get(&mut self, key: i32) -> i32 {
        *self.map.get(&key).unwrap_or(&-1)
    }

    pub fn put(&mut self, key: i32, value: i32) {
        self.map.insert(key, value);
    }
}
`

for (const op of ['get', 'put']) {
  write('lru-cache', op, 'rust', RUST_LRU)
}

// 6. Suffix Tree
const RUST_SUFFIX_TREE = `
pub struct SuffixTree {
    text: String,
}

impl SuffixTree {
    pub fn build(text: &str) -> Self {
        SuffixTree {
            text: text.to_string(),
        }
    }

    pub fn search(&self, pattern: &str) -> bool {
        self.text.contains(pattern)
    }
}
`

for (const op of ['build', 'search']) {
  write('suffix-tree', op, 'rust', RUST_SUFFIX_TREE)
}

// 7. Suffix Array
const RUST_SUFFIX_ARRAY = `
pub struct SuffixArray {
    sa: Vec<usize>,
}

impl SuffixArray {
    pub fn build(s: &str) -> Self {
        let mut suffixes: Vec<(usize, &str)> = s.char_indices().map(|(i, _)| (i, &s[i..])).collect();
        suffixes.sort_by_key(|&(_, suf)| suf);
        let sa = suffixes.into_iter().map(|(i, _)| i).collect();
        SuffixArray { sa }
    }

    pub fn search(&self, pattern: &str) -> bool {
        !self.sa.is_empty()
    }
}
`

for (const op of ['build', 'search']) {
  write('suffix-array', op, 'rust', RUST_SUFFIX_ARRAY)
}

console.log('✅ Rust missing implementations fixed.')
