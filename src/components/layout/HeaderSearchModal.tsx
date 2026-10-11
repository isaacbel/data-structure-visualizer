'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ChevronRight, BarChart2, Hash, GitBranch, Layers, ArrowUpDown, Database, Cpu } from 'lucide-react'
import { DATA_STRUCTURES } from '@/constants/registry'
import type { DataStructureConfig } from '@/types'

interface HeaderSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  linear:  <Layers    className="h-3.5 w-3.5" />,
  tree:    <GitBranch className="h-3.5 w-3.5" />,
  graph:   <Hash      className="h-3.5 w-3.5" />,
  hash:    <Database  className="h-3.5 w-3.5" />,
  sorting: <ArrowUpDown className="h-3.5 w-3.5" />,
  advanced:<Cpu       className="h-3.5 w-3.5" />,
  string:  <BarChart2 className="h-3.5 w-3.5" />,
  dp:      <BarChart2 className="h-3.5 w-3.5" />,
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:     'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  intermediate: 'bg-amber-500/20   text-amber-400   border-amber-500/30',
  advanced:     'bg-orange-500/20  text-orange-400  border-orange-500/30',
  expert:       'bg-red-500/20     text-red-400     border-red-500/30',
}

// Synonyms map for fuzzy alias matching
const SYNONYMS: Record<string, string[]> = {
  'array':               ['list', 'sequence', 'vector', 'table'],
  'vector':              ['dynamic array', 'arraylist', 'resizable'],
  'linked-list-singly':  ['singly linked', 'linked list', 'sl list'],
  'linked-list-doubly':  ['doubly linked', 'double linked', 'dll'],
  'linked-list-circular':['circular list', 'ring list'],
  'stack':               ['lifo', 'push pop', 'call stack'],
  'queue':               ['fifo', 'dequeue', 'enqueue'],
  'circular-queue':      ['ring buffer', 'circular buffer'],
  'deque':               ['double ended queue', 'deque'],
  'priority-queue':      ['heap queue', 'min max queue'],
  'bst':                 ['binary search tree', 'ordered tree'],
  'avl':                 ['balanced tree', 'adelson velsky'],
  'red-black-tree':      ['rb tree', 'rbt', 'self balancing'],
  'b-tree':              ['btree', 'b tree', 'multiway tree'],
  'b-plus-tree':         ['b+ tree', 'b plus', 'database index'],
  'trie':                ['prefix tree', 'radix', 'autocomplete'],
  'min-heap':            ['heap', 'priority heap', 'min heap'],
  'max-heap':            ['max heap', 'heap'],
  'segment-tree':        ['range tree', 'segtree', 'lazy propagation'],
  'fenwick-tree':        ['bit', 'binary indexed tree', 'cumulative frequency'],
  'hash-table':          ['hash map', 'dictionary', 'hash', 'lookup table'],
  'hash-map':            ['dictionary', 'map', 'unordered map'],
  'hash-set':            ['set', 'unordered set'],
  'skip-list':           ['skiplist', 'probabilistic'],
  'bloom-filter':        ['probabilistic filter', 'approximate membership'],
  'union-find':          ['disjoint set', 'dsu', 'uf'],
  'lru-cache':           ['least recently used', 'cache eviction'],
  'graph-visualizer':    ['graph', 'dijkstra', 'bfs', 'dfs', 'network'],
  'treap':               ['tree heap', 'randomized bst'],
  'splay-tree':          ['self adjusting', 'amortized log n'],
  'suffix-array':        ['suffix', 'sa', 'string sorting'],
  'suffix-tree':         ['ukkonen', 'string matching'],
  'rope':                ['string rope', 'text editor', 'big string'],
}

function matchScore(ds: DataStructureConfig, query: string): number {
  if (!query) return 1
  const q = query.toLowerCase().trim()
  const name = ds.name.en.toLowerCase()
  const id   = ds.id.toLowerCase()
  const diff = ds.difficulty
  const cat  = ds.category

  if (name.includes(q)) return 100
  if (id.includes(q)) return 90
  if (diff.includes(q)) return 50
  if (cat.includes(q)) return 40

  const syns = SYNONYMS[ds.id] || []
  for (const syn of syns) {
    if (syn.includes(q)) return 70
  }

  // Fuzzy: all query chars appear in order in name
  let qi = 0
  for (const ch of name) {
    if (ch === q[qi]) qi++
    if (qi === q.length) return 30
  }

  return 0
}

export function HeaderSearchModal({ isOpen, onClose }: HeaderSearchModalProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const allDS = Object.values(DATA_STRUCTURES)

  const results = allDS
    .map(ds => ({ ds, score: matchScore(ds, query) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  const navigate = useCallback((dsId: string) => {
    router.push(`/learn/${dsId}`)
    onClose()
    setQuery('')
  }, [router, onClose])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && results[selected]) navigate(results[selected].ds.id)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, results, selected, navigate, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search data structures, algorithms, complexity (O(log n)), difficulty…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden md:inline text-[10px] font-mono bg-slate-800 border border-white/10 rounded px-1.5 py-0.5 text-slate-400">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No data structures match &quot;{query}&quot;. Try searching by category, difficulty, or algorithm name.
            </div>
          ) : (
            results.map(({ ds }, i) => (
              <button
                key={ds.id}
                onClick={() => navigate(ds.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i === selected ? 'bg-violet-600/20 border-l-2 border-violet-500' : 'hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 shrink-0">
                  {CATEGORY_ICONS[ds.category] || <Hash className="h-3.5 w-3.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{ds.name.en}</span>
                    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase ${DIFFICULTY_COLORS[ds.difficulty]}`}>
                      {ds.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{ds.category}</span>
                  </div>
                  <div className="text-xs text-slate-400 truncate">{ds.ops.slice(0, 5).join(' · ')}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2.5 text-[11px] text-slate-500">
          <span><kbd className="font-mono bg-slate-800 border border-white/10 rounded px-1 py-0.5">↑↓</kbd> Navigate</span>
          <span><kbd className="font-mono bg-slate-800 border border-white/10 rounded px-1 py-0.5">↵</kbd> Open</span>
          <span><kbd className="font-mono bg-slate-800 border border-white/10 rounded px-1 py-0.5">Esc</kbd> Close</span>
          <span className="ml-auto">{allDS.length} data structures indexed</span>
        </div>
      </div>
    </div>
  )
}
