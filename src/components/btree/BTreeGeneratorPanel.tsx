'use client'

import { useState } from 'react'
import { Dices, RefreshCw, X } from 'lucide-react'
import type { BTreeGeneratorOptions } from '@/core/btree/generators'
import { generateBPlusTree, generateBTree } from '@/core/btree/generators'
import type { BTreeNode } from '@/core/btree/types'

interface BTreeGeneratorPanelProps {
  treeType: 'btree' | 'bplus'
  onGenerate: (root: BTreeNode<number>, leafHead: BTreeNode<number> | null, keys: number[]) => void
  onClose: () => void
}

export function BTreeGeneratorPanel({ treeType, onGenerate, onClose }: BTreeGeneratorPanelProps) {
  const [keyCount, setKeyCount] = useState(20)
  const [keyMin, setKeyMin] = useState(1)
  const [keyMax, setKeyMax] = useState(100)
  const [degreeT, setDegreeT] = useState(2)
  const [insertionOrder, setInsertionOrder] = useState<BTreeGeneratorOptions['insertionOrder']>('random')
  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [allowDuplicates, setAllowDuplicates] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const opts: BTreeGeneratorOptions = {
        type: treeType,
        t: degreeT,
        keyCount,
        keyMin,
        keyMax,
        insertionOrder,
        seed: seed || Math.floor(Math.random() * 999999),
        allowDuplicates,
      }

      if (treeType === 'bplus') {
        const { engine, keysInserted } = generateBPlusTree(opts)
        onGenerate(engine.root!, engine.leafHead, keysInserted)
      } else {
        const { engine, keysInserted } = generateBTree(opts)
        onGenerate(engine.root!, null, keysInserted)
      }
      setIsGenerating(false)
    }, 30)
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="text-cyan-400" size={18} />
          <h3 className="font-bold text-slate-100 text-sm">
            Random {treeType === 'bplus' ? 'B+ Tree' : 'B-Tree'} Generator
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSeed(Math.floor(Math.random() * 999999))}
            className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/10"
          >
            <Dices size={12} /> New Seed
          </button>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Key Count */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Number of Keys</span>
            <span className="font-mono text-cyan-400 font-bold">{keyCount}</span>
          </div>
          <input
            type="range"
            min={1}
            max={200}
            value={keyCount}
            onChange={(e) => setKeyCount(Number(e.target.value))}
            className="h-1.5 cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Degree t */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-300">Min Degree (t)</label>
          <select
            value={degreeT}
            onChange={(e) => setDegreeT(Number(e.target.value))}
            className="rounded border border-white/10 bg-slate-950 px-2 py-1.5 text-xs text-cyan-400 font-bold font-mono"
          >
            {[2, 3, 4, 5, 6, 8].map((v) => (
              <option key={v} value={v}>t={v} → max {2 * v - 1} keys/node</option>
            ))}
          </select>
        </div>

        {/* Key range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-300">Key Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={keyMin}
              onChange={(e) => setKeyMin(Number(e.target.value))}
              className="w-16 rounded border border-white/10 bg-slate-950 px-2 py-1 text-xs text-slate-200"
            />
            <span className="text-slate-500 text-xs">to</span>
            <input
              type="number"
              value={keyMax}
              onChange={(e) => setKeyMax(Number(e.target.value))}
              className="w-16 rounded border border-white/10 bg-slate-950 px-2 py-1 text-xs text-slate-200"
            />
          </div>
        </div>

        {/* Insertion Order */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-300">Insertion Order</label>
          <select
            value={insertionOrder}
            onChange={(e) => setInsertionOrder(e.target.value as BTreeGeneratorOptions['insertionOrder'])}
            className="rounded border border-white/10 bg-slate-950 px-2 py-1.5 text-xs text-slate-200"
          >
            <option value="random">Random (shuffled)</option>
            <option value="sequential">Sequential (sorted)</option>
            <option value="reverse">Reverse sorted</option>
            <option value="nearly-sorted">Nearly sorted</option>
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-2 text-xs text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
            className="accent-cyan-500"
          />
          Allow Duplicate Keys
        </label>
      </div>

      {/* Seed */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Deterministic Seed:</span>
        <input
          type="number"
          placeholder="Random"
          value={seed ?? ''}
          onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full rounded border border-white/10 bg-slate-950 px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none"
        />
      </div>

      {/* Generate */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="btn-primary flex items-center justify-center gap-2 py-2.5 text-xs font-bold shadow-lg"
      >
        <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
        {isGenerating ? 'Generating…' : `Generate ${treeType === 'bplus' ? 'B+ Tree' : 'B-Tree'}`}
      </button>

      {/* Description panel */}
      <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3 text-xs text-slate-400 space-y-1">
        <div><span className="font-semibold text-slate-300">Min Degree t={degreeT}:</span> each node holds {degreeT - 1}–{2 * degreeT - 1} keys and {degreeT}–{2 * degreeT} children.</div>
        {treeType === 'bplus' && <div><span className="font-semibold text-slate-300">B+ Tree:</span> All keys are in leaf nodes, linked in a doubly-linked list. Internal nodes contain routing keys (copy-up).</div>}
        {treeType === 'btree' && <div><span className="font-semibold text-slate-300">B-Tree:</span> Keys reside in all nodes. Median key is pushed up during splits. All leaves at same depth.</div>}
      </div>
    </div>
  )
}
