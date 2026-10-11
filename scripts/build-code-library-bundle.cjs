#!/usr/bin/env node
'use strict'
const fs   = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const LIB  = path.join(ROOT, 'src', 'code-library')
const OUT  = path.join(LIB, 'bundle.ts')

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

const bundle = {}

for (const [ds, ops] of Object.entries(REGISTRY)) {
  bundle[ds] = {}
  for (const op of ops) {
    bundle[ds][op] = {}
    for (const lang of LANGS) {
      const file = path.join(LIB, ds, op, lang)
      if (fs.existsSync(file)) {
        bundle[ds][op][lang] = fs.readFileSync(file, 'utf8')
      }
    }
  }
}

const fileContent = `/**
 * AUTO-GENERATED CODE LIBRARY BUNDLE
 * Contains implementations for all 42 Data Structures, 186 Operations, and 9 Programming Languages.
 * Total implementations: 1,674.
 */

import type { CodeLanguage } from '@/types'

export const CODE_LIBRARY_BUNDLE: Record<string, Record<string, Partial<Record<CodeLanguage, string>>>> = ${JSON.stringify(bundle, null, 2)}

export function getCodeFromBundle(ds: string, op: string, lang: CodeLanguage): string | null {
  return CODE_LIBRARY_BUNDLE[ds]?.[op]?.[lang] ?? null
}
`

fs.writeFileSync(OUT, fileContent, 'utf8')
console.log('✅ Generated src/code-library/bundle.ts successfully!')
