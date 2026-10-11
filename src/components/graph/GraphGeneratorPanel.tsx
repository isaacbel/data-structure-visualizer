'use client'

import { useState } from 'react'
import { Dices, RefreshCw, Sparkles } from 'lucide-react'
import type { GraphGeneratorOptions, GraphModel } from '@/core/graph/types'
import { generateGraph } from '@/core/graph/generators'
import type { VisualState } from '@/types'

interface GraphGeneratorPanelProps {
  onGenerate: (state: VisualState) => void
  onClose?: () => void
}

const MODELS: { id: GraphModel; label: string; desc: string }[] = [
  { id: 'erdos-renyi', label: 'Erdős–Rényi', desc: 'Random binomial edges G(n,p)' },
  { id: 'barabasi-albert', label: 'Barabási–Albert', desc: 'Scale-free network via preferential attachment' },
  { id: 'watts-strogatz', label: 'Watts–Strogatz', desc: 'Small-world network with high clustering' },
  { id: 'random-tree', label: 'Random Tree', desc: 'Random tree generated via Prüfer sequence' },
  { id: 'random-dag', label: 'Random DAG', desc: 'Directed acyclic graph with topological order' },
  { id: 'random-grid', label: 'Random Grid', desc: 'Rectangular mesh / lattice graph' },
  { id: 'random-bipartite', label: 'Random Bipartite', desc: 'Two independent vertex sets U and V' },
  { id: 'complete', label: 'Complete Graph', desc: 'Every pair of distinct vertices connected' },
  { id: 'star', label: 'Star Graph', desc: 'Central hub connected to all leaf nodes' },
  { id: 'wheel', label: 'Wheel Graph', desc: 'Central hub connected to an outer cycle' },
  { id: 'ring', label: 'Cycle / Ring Graph', desc: 'Single closed loop of vertices' },
  { id: 'path', label: 'Path Graph', desc: 'Linear sequence of connected vertices' },
  { id: 'petersen', label: 'Petersen Graph', desc: 'Classic cubic symmetric 10-vertex graph' },
  { id: 'random-sparse', label: 'Random Sparse', desc: 'Low density graph (O(n) edges)' },
  { id: 'random-dense', label: 'Random Dense', desc: 'High density graph (O(n²) edges)' },
]

export function GraphGeneratorPanel({ onGenerate, onClose }: GraphGeneratorPanelProps) {
  const [model, setModel] = useState<GraphModel>('erdos-renyi')
  const [vertexCount, setVertexCount] = useState(12)
  const [density, setDensity] = useState(0.3)
  const [directed, setDirected] = useState(false)
  const [weighted, setWeighted] = useState(true)
  const [allowNegativeWeights, setAllowNegativeWeights] = useState(false)
  const [weightMin, setWeightMin] = useState(1)
  const [weightMax, setWeightMax] = useState(20)
  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const opts: GraphGeneratorOptions & { model: GraphModel } = {
        model,
        vertexCount,
        density,
        directed,
        weighted,
        allowNegativeWeights,
        weightMin,
        weightMax,
        seed: seed || Math.floor(Math.random() * 1000000),
      }
      const data = generateGraph(opts)

      // Convert GraphData to VisualState with circular layout
      const radius = Math.min(800, 420) / 2 - 60
      const cx = 400, cy = 210
      const nodes = data.nodes.map((id, i) => {
        const angle = (2 * Math.PI * i) / data.nodes.length - Math.PI / 2
        return {
          id,
          value: id.replace('v', ''),
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          highlight: false,
        }
      })

      const edges = data.edges.map((e) => ({
        from: e.from,
        to: e.to,
        weight: e.weight,
        directed: e.directed ?? directed,
        highlight: false,
      }))

      onGenerate({ nodes, edges, description: `Generated ${model} graph (${nodes.length} vertices, ${edges.length} edges)` })
      setIsGenerating(false)
      if (onClose) onClose()
    }, 50)
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-cyan-400" size={18} />
          <h3 className="font-bold text-slate-100 text-sm">Random Graph Generator</h3>
        </div>
        <button
          onClick={() => setSeed(Math.floor(Math.random() * 1000000))}
          className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/10"
        >
          <Dices size={12} /> Randomize Seed
        </button>
      </div>

      {/* Model Grid */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-300">Graph Model / Type</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value as GraphModel)}
          className="w-full rounded-lg border border-white/10 bg-slate-950 p-2 text-xs font-semibold text-cyan-300 focus:border-cyan-500 focus:outline-none"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>{m.label} — {m.desc}</option>
          ))}
        </select>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Vertices */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Vertices (n):</span>
            <span className="font-mono text-cyan-400 font-bold">{vertexCount}</span>
          </div>
          <input
            type="range"
            min={3}
            max={200}
            value={vertexCount}
            onChange={(e) => setVertexCount(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-500"
          />
        </div>

        {/* Density */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Density (p):</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(density * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={1.0}
            step={0.05}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-500"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={directed}
            onChange={(e) => setDirected(e.target.checked)}
            className="accent-cyan-500"
          />
          <span>Directed Edges</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={weighted}
            onChange={(e) => setWeighted(e.target.checked)}
            className="accent-cyan-500"
          />
          <span>Weighted Edges</span>
        </label>
        {weighted && (
          <label className="flex items-center gap-2 cursor-pointer col-span-2">
            <input
              type="checkbox"
              checked={allowNegativeWeights}
              onChange={(e) => setAllowNegativeWeights(e.target.checked)}
              className="accent-cyan-500"
            />
            <span>Allow Negative Weights (Bellman-Ford)</span>
          </label>
        )}
      </div>

      {/* Weight range */}
      {weighted && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Weights:</span>
          <input
            type="number"
            value={weightMin}
            onChange={(e) => setWeightMin(Number(e.target.value))}
            className="w-14 rounded border border-white/10 bg-slate-950 px-2 py-1 text-xs text-slate-200"
          />
          <span>to</span>
          <input
            type="number"
            value={weightMax}
            onChange={(e) => setWeightMax(Number(e.target.value))}
            className="w-14 rounded border border-white/10 bg-slate-950 px-2 py-1 text-xs text-slate-200"
          />
        </div>
      )}

      {/* Seed */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Deterministic Seed:</span>
        <input
          type="number"
          placeholder="Random"
          value={seed ?? ''}
          onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full rounded border border-white/10 bg-slate-950 px-2 py-1 text-xs font-mono text-cyan-300"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="btn-primary flex items-center justify-center gap-2 py-2.5 text-xs font-bold shadow-lg"
      >
        <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
        {isGenerating ? 'Generating Graph…' : 'Generate Graph'}
      </button>
    </div>
  )
}
