#!/usr/bin/env node
/**
 * Validates that every (ds, op, lang) triple has a non-empty implementation
 * in src/code-library/. Exits with code 1 if any are missing.
 */
'use strict'
const fs   = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

/* ── Registry (mirrors src/constants/registry.ts) ──────────────────────── */
const REGISTRY = {
  // Linear
  array:                  ['insert','delete','search','traverse','access'],
  vector:                 ['push_back','pop_back','insert','delete','access'],
  'linked-list-singly':   ['insertHead','insertTail','delete','search','traverse'],
  'linked-list-doubly':   ['insertHead','insertTail','delete','search','traverse'],
  'linked-list-circular': ['insert','delete','search','traverse'],
  stack:                  ['push','pop','peek'],
  queue:                  ['enqueue','dequeue','peek'],
  'circular-queue':       ['enqueue','dequeue','peek'],
  deque:                  ['pushFront','pushBack','popFront','popBack'],
  'priority-queue':       ['enqueue','dequeue','peek'],
  'gap-buffer':           ['insert','delete','moveGap'],
  rope:                   ['split','concat','index'],
  'xor-linked-list':      ['insertHead','insertTail','delete','traverse'],
  // Trees
  'binary-tree':          ['insert','delete','search','inorder','preorder','postorder','levelorder'],
  bst:                    ['insert','delete','search','inorder','preorder','postorder','levelorder'],
  avl:                    ['insert','delete','search','inorder','preorder','postorder','levelorder'],
  'red-black-tree':       ['insert','delete','search','inorder'],
  'b-tree':               ['insert','delete','search','inorder','preorder','postorder','levelorder'],
  'b-plus-tree':          ['insert','delete','search','rangeSearch','leafTraversal','inorder','levelorder'],
  'segment-tree':         ['build','query','update'],
  'fenwick-tree':         ['build','query','update'],
  trie:                   ['insert','search','delete','dfs'],
  'min-heap':             ['insert','extractMin','heapify'],
  'max-heap':             ['insert','extractMax','heapify'],
  treap:                  ['insert','delete','search'],
  'splay-tree':           ['insert','delete','search'],
  // Graphs
  'graph-visualizer':     ['bfs','dfs','iterativeDfs','dijkstra','bellmanFord','floydWarshall',
                           'johnson','aStar','prim','kruskal','boruvka','topologicalSort','kahn',
                           'scc','connectedComponents','cycleDetection','bridgeDetection',
                           'articulationPoints','hopcroftKarp','fordFulkerson','greedyColoring',
                           'welshPowell','eulerPath','hamiltonianPath'],
  'directed-graph':       ['bfs','dfs','topologicalSort','scc','connectedComponents'],
  'undirected-graph':     ['bfs','dfs','prim','kruskal','connectedComponents'],
  'weighted-graph':       ['dijkstra','bellmanFord','floydWarshall','prim','kruskal','aStar','bfs','dfs'],
  dag:                    ['topologicalSort','bfs','dfs','dijkstra'],
  'adjacency-matrix':     ['bfs','dfs','connectedComponents'],
  'adjacency-list':       ['bfs','dfs','connectedComponents'],
  // Hash
  'hash-table':           ['insert','delete','search'],
  'hash-map':             ['insert','delete','search'],
  'hash-set':             ['insert','delete','search'],
  'bloom-filter':         ['insert','search'],
  // Advanced
  'union-find':           ['makeSet','union','find'],
  'skip-list':            ['insert','delete','search'],
  'lru-cache':            ['get','put'],
  'suffix-tree':          ['build','search'],
  'suffix-array':         ['build','search'],
}

const LANGS = ['python','c','cpp','java','javascript','typescript','csharp','go','rust']

const LIB = path.join(ROOT, 'src', 'code-library')

let totalNeeded = 0, totalFound = 0
const missing = []
const dsMap = {}

for (const [ds, ops] of Object.entries(REGISTRY)) {
  dsMap[ds] = { ops: ops.length, missing: 0 }
  for (const op of ops) {
    for (const lang of LANGS) {
      totalNeeded++
      // Check both the direct file and the generated bundle
      const fileVariants = [
        path.join(LIB, ds, op, lang),
        path.join(LIB, ds, op, lang + '.txt'),
      ]
      const found = fileVariants.some(f => {
        try { return fs.statSync(f).size > 50 } catch { return false }
      })
      if (found) {
        totalFound++
      } else {
        missing.push(`${ds} / ${op} / ${lang}`)
        dsMap[ds].missing++
      }
    }
  }
}

/* ── Report ──────────────────────────────────────────────────────────────── */
console.log('\n╔══════════════════════════════════════════════════════════╗')
console.log('║         CODE LIBRARY VALIDATION REPORT                  ║')
console.log('╚══════════════════════════════════════════════════════════╝\n')
console.log(`  Data Structures  : ${Object.keys(REGISTRY).length}`)
console.log(`  Total Operations : ${Object.values(REGISTRY).flat().length}`)
console.log(`  Languages        : ${LANGS.length}`)
console.log(`  Expected Impl.   : ${totalNeeded}`)
console.log(`  Actual Impl.     : ${totalFound}`)
console.log(`  Missing          : ${totalNeeded - totalFound}`)

if (missing.length > 0) {
  console.log('\n  ── Missing by DS ──────────────────────────────────────')
  for (const [ds, s] of Object.entries(dsMap)) {
    if (s.missing > 0) console.log(`    ${ds.padEnd(28)} ${s.missing} missing`)
  }
  if (missing.length <= 30) {
    console.log('\n  ── All Missing ────────────────────────────────────────')
    missing.forEach(m => console.log('    ' + m))
  }
  console.log('\n  Validation: ❌ FAIL\n')
  process.exit(1)
} else {
  console.log('\n  Validation: ✅ PASS — 0 missing implementations\n')
  process.exit(0)
}
