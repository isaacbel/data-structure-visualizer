'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Code2, Info } from 'lucide-react'
import type { BTreeValidationReport } from '@/core/btree/types'

interface BTreeEducationalPanelProps {
  treeType: 'btree' | 'bplus'
  degreeT: number
  stepDescription: string
  stepAction?: string
  codeLine: number
  validation: BTreeValidationReport | null
}

const BTREE_PSEUDOCODE = [
  'BTreeInsert(T, k):',
  '  if root is full (2t-1 keys):',
  '    s = new Node; s.child[0] = T.root',
  '    SplitChild(s, 0); T.root = s',
  '  InsertNonFull(T.root, k)',
  '',
  'InsertNonFull(x, k):',
  '  if x is leaf:',
  '    insert k in sorted position',
  '  else:',
  '    find i s.t. x.key[i] < k ≤ x.key[i+1]',
  '    if child[i] full: SplitChild(x, i)',
  '    InsertNonFull(child[i], k)',
  '',
  'SplitChild(x, i):',
  '  y = x.child[i]; z = new Node',
  '  median = y.key[t-1]',
  '  z.keys = y.keys[t..2t-2]',
  '  y.keys = y.keys[0..t-2]',
  '  promote median to x.key[i]',
]

const BPLUS_PSEUDOCODE = [
  'BPlusInsert(T, k):',
  '  leaf = FindLeaf(T.root, k)',
  '  insert k into leaf (sorted)',
  '  if leaf.keys.length == 2t:',
  '    mid = floor(len/2)',
  '    new_leaf = leaf.keys[mid..end] (copy-up)',
  '    leaf.keys = leaf.keys[0..mid-1]',
  '    promote leaf.keys[mid] to parent',
  '    link new_leaf ↔ leaf in leaf list',
  '',
  'RangeSearch(T, lo, hi):',
  '  leaf = FindLeaf(T.root, lo)',
  '  results = []',
  '  while leaf and leaf.keys[0] ≤ hi:',
  '    collect keys in [lo, hi]',
  '    leaf = leaf.next  // follow leaf link',
]

const CODE_BY_LANG: Record<string, Record<string, string>> = {
  python: {
    btree: `class BTreeNode:
    def __init__(self, leaf=False):
        self.keys, self.children, self.leaf = [], [], leaf

class BTree:
    def __init__(self, t):
        self.root = BTreeNode(leaf=True)
        self.t = t

    def insert(self, k):
        root = self.root
        if len(root.keys) == 2 * self.t - 1:
            s = BTreeNode()
            s.children.append(self.root)
            self._split_child(s, 0)
            self.root = s
        self._insert_non_full(self.root, k)

    def _split_child(self, x, i):
        t = self.t
        y = x.children[i]
        z = BTreeNode(leaf=y.leaf)
        x.keys.insert(i, y.keys[t - 1])
        z.keys = y.keys[t:]
        y.keys = y.keys[:t - 1]
        if not y.leaf:
            z.children = y.children[t:]
            y.children = y.children[:t]
        x.children.insert(i + 1, z)`,
    bplus: `class BPlusTree:
    def __init__(self, t):
        self.root = BPlusLeaf()
        self.t = t

    def insert(self, k):
        leaf = self._find_leaf(self.root, k)
        leaf.keys.insert(bisect.bisect_left(leaf.keys, k), k)
        if len(leaf.keys) == 2 * self.t:
            self._split_leaf(leaf)

    def _split_leaf(self, leaf):
        mid = len(leaf.keys) // 2
        new_leaf = BPlusLeaf()
        new_leaf.keys = leaf.keys[mid:]
        leaf.keys = leaf.keys[:mid]
        new_leaf.next = leaf.next
        leaf.next = new_leaf
        # promote new_leaf.keys[0] to parent`,
  },
  cpp: {
    btree: `template<typename T, int t>
struct BTreeNode {
    T keys[2*t-1];
    BTreeNode* C[2*t];
    int n; bool leaf;
};

template<typename T, int t>
void BTree<T,t>::splitChild(BTreeNode<T,t>* x, int i) {
    BTreeNode<T,t>* y = x->C[i];
    BTreeNode<T,t>* z = new BTreeNode<T,t>();
    z->leaf = y->leaf;
    z->n = t - 1;
    for (int j = 0; j < t-1; j++) z->keys[j] = y->keys[j+t];
    if (!y->leaf)
        for (int j = 0; j < t; j++) z->C[j] = y->C[j+t];
    y->n = t - 1;
    for (int j = x->n; j >= i+1; j--) x->C[j+1] = x->C[j];
    x->C[i+1] = z;
    for (int j = x->n-1; j >= i; j--) x->keys[j+1] = x->keys[j];
    x->keys[i] = y->keys[t-1];
    x->n++;
}`,
    bplus: `// B+ Tree C++: all data in leaves, leaves are a doubly-linked list
template<typename T, int t>
void BPlusTree<T,t>::splitLeaf(BPlusLeaf<T,t>* leaf) {
    int mid = leaf->n / 2;
    BPlusLeaf<T,t>* newLeaf = new BPlusLeaf<T,t>();
    for (int i = mid; i < leaf->n; i++) newLeaf->keys[i-mid] = leaf->keys[i];
    newLeaf->n = leaf->n - mid;
    leaf->n = mid;
    newLeaf->next = leaf->next;
    if (leaf->next) leaf->next->prev = newLeaf;
    leaf->next = newLeaf;
    newLeaf->prev = leaf;
    // insert newLeaf->keys[0] as separator into parent
}`,
  },
  java: {
    btree: `class BTreeNode {
    int[] keys;
    BTreeNode[] children;
    int n;
    boolean leaf;
    BTreeNode(int t, boolean leaf) {
        this.keys = new int[2*t-1];
        this.children = new BTreeNode[2*t];
        this.leaf = leaf; this.n = 0;
    }
}

void splitChild(BTreeNode x, int i, int t) {
    BTreeNode y = x.children[i];
    BTreeNode z = new BTreeNode(t, y.leaf);
    z.n = t - 1;
    for (int j = 0; j < t-1; j++) z.keys[j] = y.keys[j+t];
    if (!y.leaf)
        for (int j = 0; j < t; j++) z.children[j] = y.children[j+t];
    y.n = t - 1;
    for (int j = x.n; j >= i+1; j--) x.children[j+1] = x.children[j];
    x.children[i+1] = z;
    for (int j = x.n-1; j >= i; j--) x.keys[j+1] = x.keys[j];
    x.keys[i] = y.keys[t-1];
    x.n++;
}`,
    bplus: `// B+ Tree Java: leaf split with linked list`,
  },
  c: {
    btree: `typedef struct BTreeNode {
    int keys[2*T-1];
    struct BTreeNode *C[2*T];
    int n, leaf;
} BTreeNode;

void splitChild(BTreeNode *x, int i) {
    BTreeNode *y = x->C[i];
    BTreeNode *z = newNode();
    z->leaf = y->leaf; z->n = T - 1;
    for (int j = 0; j < T-1; j++) z->keys[j] = y->keys[j+T];
    if (!y->leaf)
        for (int j = 0; j < T; j++) z->C[j] = y->C[j+T];
    y->n = T - 1;
    for (int j = x->n; j >= i+1; j--) x->C[j+1] = x->C[j];
    x->C[i+1] = z;
    for (int j = x->n-1; j >= i; j--) x->keys[j+1] = x->keys[j];
    x->keys[i] = y->keys[T-1];
    x->n++;
}`,
    bplus: `// B+ Tree C: leaves linked in doubly-linked list`,
  },
  javascript: {
    btree: `class BTreeNode {
  constructor(leaf = false) {
    this.keys = []; this.children = []; this.leaf = leaf;
  }
}
class BTree {
  constructor(t) { this.t = t; this.root = new BTreeNode(true); }
  insert(k) {
    const r = this.root;
    if (r.keys.length === 2 * this.t - 1) {
      const s = new BTreeNode(false);
      s.children.push(r);
      this._splitChild(s, 0);
      this.root = s;
    }
    this._insertNonFull(this.root, k);
  }
  _splitChild(x, i) {
    const t = this.t, y = x.children[i], z = new BTreeNode(y.leaf);
    x.keys.splice(i, 0, y.keys[t - 1]);
    z.keys = y.keys.splice(t);
    y.keys.length = t - 1;
    if (!y.leaf) z.children = y.children.splice(t);
    x.children.splice(i + 1, 0, z);
  }
}`,
    bplus: `// B+ Tree JS: copy-up on leaf split, linked leaf list`,
  },
  typescript: {
    btree: `interface BTreeNode<T> {
  id: string;
  keys: T[];
  children: BTreeNode<T>[];
  isLeaf: boolean;
}

function splitChild<T>(parent: BTreeNode<T>, i: number, t: number): void {
  const fullChild = parent.children[i];
  const medianIdx = t - 1;
  const medianKey = fullChild.keys[medianIdx];
  const newSibling: BTreeNode<T> = {
    id: crypto.randomUUID(),
    keys: fullChild.keys.slice(medianIdx + 1),
    children: fullChild.isLeaf ? [] : fullChild.children.slice(medianIdx + 1),
    isLeaf: fullChild.isLeaf,
  };
  fullChild.keys = fullChild.keys.slice(0, medianIdx);
  if (!fullChild.isLeaf) fullChild.children = fullChild.children.slice(0, medianIdx + 1);
  parent.children.splice(i + 1, 0, newSibling);
  parent.keys.splice(i, 0, medianKey);
}`,
    bplus: `// B+ Tree TypeScript: copy-up leaf split, linked leaves`,
  },
}

export function BTreeEducationalPanel({
  treeType,
  degreeT,
  stepDescription,
  stepAction,
  codeLine,
  validation,
}: BTreeEducationalPanelProps) {
  const [activeTab, setActiveTab] = useState<'pseudo' | 'code' | 'stats'>('pseudo')
  const [lang, setLang] = useState('python')

  const pseudocode = treeType === 'bplus' ? BPLUS_PSEUDOCODE : BTREE_PSEUDOCODE
  const codeSource = CODE_BY_LANG[lang]?.[treeType] ?? ''

  const actionColors: Record<string, string> = {
    split: 'bg-amber-500/10 border-amber-400/30 text-amber-300',
    merge: 'bg-purple-500/10 border-purple-400/30 text-purple-300',
    borrow: 'bg-sky-500/10 border-sky-400/30 text-sky-300',
    search: 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300',
    underflow: 'bg-red-500/10 border-red-400/30 text-red-300',
    root_split: 'bg-orange-500/10 border-orange-400/30 text-orange-300',
    root_collapse: 'bg-pink-500/10 border-pink-400/30 text-pink-300',
    link_traverse: 'bg-blue-500/10 border-blue-400/30 text-blue-300',
    insert: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300',
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-slate-900 shadow-xl overflow-hidden">
      {/* Header: Structure info */}
      <div className="border-b border-white/10 bg-slate-950/80 p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
            <Info size={14} />
            <span>{treeType === 'bplus' ? 'B+ Tree' : 'B-Tree'} — Min Degree t={degreeT}</span>
          </div>
          <div className="flex gap-2 text-[10px] font-mono text-slate-500">
            <span>max keys: <strong className="text-slate-300">{2 * degreeT - 1}</strong></span>
            <span>max children: <strong className="text-slate-300">{2 * degreeT}</strong></span>
          </div>
        </div>

        {/* Current step description */}
        {stepDescription && (
          <div className={`rounded-lg border px-2.5 py-1.5 text-xs ${stepAction ? (actionColors[stepAction] ?? 'bg-white/5 border-white/10 text-slate-200') : 'bg-white/5 border-white/10 text-slate-200'}`}>
            {stepDescription}
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-white/10 bg-slate-950">
        {[
          { id: 'pseudo', icon: <BookOpen size={12} />, label: 'Pseudocode' },
          { id: 'code', icon: <Code2 size={12} />, label: 'Code' },
          { id: 'stats', icon: <Info size={12} />, label: 'Statistics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
              activeTab === tab.id
                ? 'border-cyan-400 text-cyan-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'pseudo' && (
          <div className="space-y-0.5 font-mono text-xs">
            {pseudocode.map((line, idx) => {
              const lineNum = idx + 1
              const isCurrent = codeLine === lineNum
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2 px-2 py-0.5 rounded transition ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-l-2 border-cyan-400 text-cyan-200 font-bold'
                      : line === ''
                        ? 'h-3'
                        : 'text-slate-400'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 select-none w-4 shrink-0 pt-0.5">{line ? lineNum : ''}</span>
                  <pre className="whitespace-pre-wrap">{line}</pre>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 flex-wrap">
              {Object.keys(CODE_BY_LANG).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition ${
                    lang === l ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg text-slate-200 overflow-x-auto text-[11px] leading-5 whitespace-pre-wrap">
              <code>{codeSource}</code>
            </pre>
          </div>
        )}

        {activeTab === 'stats' && validation && (
          <div className="space-y-3">
            {/* Validation status */}
            <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
              validation.isValid ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300' : 'border-red-400/30 bg-red-500/10 text-red-300'
            }`}>
              {validation.isValid ? '✓ Tree invariants satisfied' : `✗ ${validation.errors[0]}`}
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Height', value: validation.height },
                { label: 'Node Count', value: validation.nodeCount },
                { label: 'Leaf Count', value: validation.leafCount },
                { label: 'Total Keys', value: validation.totalKeys },
                { label: 'Min Keys/Node', value: `${validation.minKeysPerNode} (min ${degreeT - 1})` },
                { label: 'Max Keys/Node', value: `${validation.maxKeysPerNode} (max ${2 * degreeT - 1})` },
                { label: 'Avg Branching', value: validation.avgBranchingFactor.toFixed(1) },
                { label: 'Leaf Links Valid', value: validation.leafLinksValid ? '✓' : '✗', color: validation.leafLinksValid ? 'text-emerald-400' : 'text-red-400' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between rounded bg-white/5 px-2 py-1.5">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-mono font-bold ${item.color ?? 'text-cyan-400'}`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Complexity info */}
            <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3 space-y-1 text-xs text-slate-400">
              <div className="font-semibold text-slate-200 mb-1">Time Complexity</div>
              <div className="flex justify-between"><span>Search</span><span className="font-mono text-cyan-400">O(log n)</span></div>
              <div className="flex justify-between"><span>Insert</span><span className="font-mono text-cyan-400">O(log n)</span></div>
              <div className="flex justify-between"><span>Delete</span><span className="font-mono text-cyan-400">O(log n)</span></div>
              {treeType === 'bplus' && (
                <div className="flex justify-between"><span>Range Query</span><span className="font-mono text-blue-400">O(log n + k)</span></div>
              )}
              <div className="flex justify-between mt-1"><span>Space</span><span className="font-mono text-purple-400">O(n)</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
