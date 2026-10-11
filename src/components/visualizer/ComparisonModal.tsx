import React from 'react'
import { X, Check, ArrowRight, BarChart2, ShieldCheck, Zap } from 'lucide-react'

interface ComparisonPairData {
  title: string
  dsA: { id: string; name: string; time: string; space: string; pros: string[]; cons: string[] }
  dsB: { id: string; name: string; time: string; space: string; pros: string[]; cons: string[] }
  keyDifferences: string[]
  whenToUseA: string
  whenToUseB: string
}

const COMPARISONS: Record<string, ComparisonPairData> = {
  'avl': {
    title: 'AVL Tree vs Red-Black Tree',
    dsA: {
      id: 'avl',
      name: 'AVL Tree',
      time: 'O(log n) strict',
      space: 'O(n) + balance factor',
      pros: ['Faster lookups (stricter height balance h <= 1.44 log n)', 'Predictable query performance'],
      cons: ['Slower insertions & deletions (more rotations)', 'Requires height tracking']
    },
    dsB: {
      id: 'red-black-tree',
      name: 'Red-Black Tree',
      time: 'O(log n) amortized',
      space: 'O(n) + 1 bit color',
      pros: ['Faster insertions & deletions (at most 2 rotations)', 'Widely used in standard libraries (C++ std::map, Java TreeMap)'],
      cons: ['Slightly taller tree than AVL (height h <= 2 log n)', 'Complex deletion rebalancing cases']
    },
    keyDifferences: [
      'AVL trees are strictly balanced (height difference <= 1), while Red-Black trees are relaxed balanced (longest path <= 2x shortest path).',
      'AVL trees perform better for lookup-heavy workloads; Red-Black trees perform better for insertion/deletion-heavy workloads.',
      'Red-Black trees require only 1 bit of balance metadata per node (red/black), whereas AVL trees store node height integers.'
    ],
    whenToUseA: 'Use AVL Trees when read queries significantly outnumber insertions and deletions (e.g. static lookup databases).',
    whenToUseB: 'Use Red-Black Trees when frequent insertions and deletions occur alongside searches (e.g. Java TreeMap, Linux epoll).'
  },
  'b-tree': {
    title: 'B-Tree vs B+ Tree',
    dsA: {
      id: 'b-tree',
      name: 'B-Tree',
      time: 'O(log n)',
      space: 'O(n)',
      pros: ['Data stored in internal nodes allowing early match termination', 'Self-balancing block structure'],
      cons: ['Range queries require tree traversal', 'Internal nodes have larger size due to payload data']
    },
    dsB: {
      id: 'b-plus-tree',
      name: 'B+ Tree',
      time: 'O(log n)',
      space: 'O(n) + leaf linked list',
      pros: ['All data stored in leaves linked sequentially for O(k) range scans', 'Internal nodes store only keys → higher fan-out per page'],
      cons: ['All searches must reach leaf nodes', 'Duplicate keys stored in index nodes']
    },
    keyDifferences: [
      'B-Tree stores keys and values in all nodes; B+ Tree stores values ONLY in leaf nodes.',
      'B+ Tree leaf nodes are linked in a sequential doubly-linked list enabling fast range scans.',
      'B+ Tree internal nodes hold more keys per page because they store no data payload, leading to shallower tree height.'
    ],
    whenToUseA: 'Use B-Trees for in-memory systems or filesystem metadata where random individual key access is primary.',
    whenToUseB: 'Use B+ Trees for relational database indexes (PostgreSQL, SQLite, MySQL InnoDB) requiring range queries and disk block efficiency.'
  },
  'min-heap': {
    title: 'Min-Heap vs Binary Search Tree (BST)',
    dsA: {
      id: 'min-heap',
      name: 'Min-Heap',
      time: 'O(1) min, O(log n) insert',
      space: 'O(n) flat array',
      pros: ['O(1) minimum access', 'Stored in flat array without pointer overhead', 'O(n) build time'],
      cons: ['O(n) arbitrary search', 'Unordered traversal']
    },
    dsB: {
      id: 'bst',
      name: 'Binary Search Tree',
      time: 'O(log n) search/insert',
      space: 'O(n) nodes + pointers',
      pros: ['O(log n) arbitrary search', 'Inorder traversal produces sorted output', 'Predecessor/Successor queries'],
      cons: ['O(n) worst-case if unbalanced', 'Requires pointer allocation per node']
    },
    keyDifferences: [
      'Heap enforces parent <= children (partially ordered); BST enforces left < parent < right (totally ordered).',
      'Heap is implemented as a contiguous array with index math; BST uses explicit left/right node pointers.',
      'Heap finds min/max in O(1); BST finds min/max in O(log n) but supports arbitrary search.'
    ],
    whenToUseA: 'Use Min-Heap for priority queues, event-driven simulations, Dijkstra, and Top-K element tracking.',
    whenToUseB: 'Use BST (or AVL/Red-Black) when you need general dynamic key search, range queries, or ordered iteration.'
  }
}

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  currentDsId: string
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, currentDsId }) => {
  if (!isOpen) return null

  const compData = COMPARISONS[currentDsId] || COMPARISONS['avl']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{compData.title}</h2>
            <p className="text-xs text-slate-400">Interactive Side-by-Side Architectural Evaluation</p>
          </div>
        </div>

        {/* Side by side comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* DS A */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-cyan-300">{compData.dsA.name}</h3>
              <span className="rounded-md bg-cyan-500/20 px-2 py-1 text-[11px] font-mono text-cyan-300 border border-cyan-500/30">
                {compData.dsA.time}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-4">Space: {compData.dsA.space}</p>
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Advantages</span>
              {compData.dsA.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DS B */}
          <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-violet-300">{compData.dsB.name}</h3>
              <span className="rounded-md bg-violet-500/20 px-2 py-1 text-[11px] font-mono text-violet-300 border border-violet-500/30">
                {compData.dsB.time}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-4">Space: {compData.dsB.space}</p>
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Advantages</span>
              {compData.dsB.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Differences */}
        <div className="rounded-xl border border-white/10 bg-slate-800/50 p-5 mb-6">
          <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            Key Architectural Differences
          </h4>
          <ul className="space-y-2">
            {compData.keyDifferences.map((diff, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <ArrowRight className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Decision Rule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-cyan-500/20 bg-slate-800/30 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5" /> Choose {compData.dsA.name} When:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{compData.whenToUseA}</p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-slate-800/30 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5" /> Choose {compData.dsB.name} When:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{compData.whenToUseB}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
