'use client'

import { useMemo } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react'
import type { VisualEdge, VisualNode } from '@/types'

interface GraphValidationProps {
  nodes: VisualNode[]
  edges: VisualEdge[]
  directed?: boolean
}

export interface ValidationReport {
  duplicateEdges: number
  invalidWeights: number
  selfLoops: number
  isolatedNodes: number
  hasCycles: boolean
  isConnected: boolean
  nodeCount: number
  edgeCount: number
  density: number
}

export function validateGraph(nodes: VisualNode[], edges: VisualEdge[], directed = false): ValidationReport {
  const nodeCount = nodes.length
  const edgeCount = edges.length
  const maxEdges = directed ? nodeCount * (nodeCount - 1) : (nodeCount * (nodeCount - 1)) / 2
  const density = maxEdges > 0 ? Math.min(1, edgeCount / maxEdges) : 0

  // 1. Duplicate edges
  const seenEdges = new Set<string>()
  let duplicateEdges = 0
  for (const e of edges) {
    const key = directed ? `${e.from}→${e.to}` : [e.from, e.to].sort().join('--')
    if (seenEdges.has(key)) duplicateEdges++
    else seenEdges.add(key)
  }

  // 2. Invalid weights
  let invalidWeights = 0
  for (const e of edges) {
    if (e.weight !== undefined && (Number.isNaN(e.weight) || !Number.isFinite(e.weight))) {
      invalidWeights++
    }
  }

  // 3. Self-loops
  let selfLoops = 0
  for (const e of edges) {
    if (e.from === e.to) selfLoops++
  }

  // 4. Isolated nodes
  const connectedNodes = new Set<string>()
  for (const e of edges) {
    connectedNodes.add(e.from)
    connectedNodes.add(e.to)
  }
  const isolatedNodes = nodes.filter((n) => !connectedNodes.has(n.id)).length

  // 5. Connectivity (BFS)
  let isConnected = true
  if (nodeCount > 1) {
    const adj = new Map<string, string[]>()
    for (const e of edges) {
      adj.set(e.from, [...(adj.get(e.from) ?? []), e.to])
      if (!directed) adj.set(e.to, [...(adj.get(e.to) ?? []), e.from])
    }
    const visited = new Set<string>()
    const queue = [nodes[0].id]
    visited.add(nodes[0].id)
    while (queue.length > 0) {
      const cur = queue.shift()!
      for (const nb of adj.get(cur) ?? []) {
        if (!visited.has(nb)) { visited.add(nb); queue.push(nb) }
      }
    }
    isConnected = visited.size === nodeCount
  }

  // 6. Cycle detection (DFS)
  let hasCycles = false
  if (nodeCount > 0) {
    const visited = new Set<string>()
    const recStack = new Set<string>()

    const dfs = (id: string, parent: string | null): boolean => {
      visited.add(id)
      recStack.add(id)
      const nbrs = edges
        .filter((e) => e.from === id || (!directed && e.to === id))
        .map((e) => (e.from === id ? e.to : e.from))

      for (const nb of nbrs) {
        if (!visited.has(nb)) {
          if (dfs(nb, id)) return true
        } else if (directed ? recStack.has(nb) : nb !== parent) {
          return true
        }
      }
      recStack.delete(id)
      return false
    }

    for (const n of nodes) {
      if (!visited.has(n.id)) {
        if (dfs(n.id, null)) { hasCycles = true; break }
      }
    }
  }

  return {
    duplicateEdges,
    invalidWeights,
    selfLoops,
    isolatedNodes,
    hasCycles,
    isConnected,
    nodeCount,
    edgeCount,
    density,
  }
}

export function GraphValidation({ nodes, edges, directed = false }: GraphValidationProps) {
  const report = useMemo(() => validateGraph(nodes, edges, directed), [nodes, edges, directed])

  const issues: { type: 'error' | 'warning' | 'info'; msg: string }[] = []

  if (report.duplicateEdges > 0) issues.push({ type: 'warning', msg: `${report.duplicateEdges} duplicate edge(s) found` })
  if (report.invalidWeights > 0) issues.push({ type: 'error', msg: `${report.invalidWeights} edge(s) with invalid weights` })
  if (report.selfLoops > 0) issues.push({ type: 'info', msg: `${report.selfLoops} self-loop(s)` })
  if (report.isolatedNodes > 0) issues.push({ type: 'warning', msg: `${report.isolatedNodes} isolated vertex/vertices` })
  if (!report.isConnected && report.nodeCount > 1) issues.push({ type: 'warning', msg: 'Graph is disconnected' })

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs shadow-lg backdrop-blur">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-semibold text-slate-200">Graph Properties & Health</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${issues.some((i) => i.type === 'error') ? 'bg-red-500/20 text-red-300' : issues.length > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
          {issues.some((i) => i.type === 'error') ? 'Errors Found' : issues.length > 0 ? 'Warnings' : 'Valid'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-slate-400">
        <div>Vertices: <span className="font-mono text-slate-200">{report.nodeCount}</span></div>
        <div>Edges: <span className="font-mono text-slate-200">{report.edgeCount}</span></div>
        <div>Density: <span className="font-mono text-slate-200">{(report.density * 100).toFixed(1)}%</span></div>
        <div>Cycles: <span className={`font-mono ${report.hasCycles ? 'text-amber-400' : 'text-emerald-400'}`}>{report.hasCycles ? 'Cyclic' : 'Acyclic (DAG)'}</span></div>
      </div>

      {issues.length > 0 && (
        <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
          {issues.map((iss, i) => (
            <div key={i} className={`flex items-center gap-1.5 ${iss.type === 'error' ? 'text-red-400' : iss.type === 'warning' ? 'text-amber-400' : 'text-cyan-400'}`}>
              {iss.type === 'error' ? <AlertCircle size={12} /> : iss.type === 'warning' ? <AlertTriangle size={12} /> : <HelpCircle size={12} />}
              <span>{iss.msg}</span>
            </div>
          ))}
        </div>
      )}

      {issues.length === 0 && (
        <div className="mt-2 flex items-center gap-1 text-emerald-400">
          <CheckCircle2 size={12} />
          <span>Graph topology is valid and well-formed</span>
        </div>
      )}
    </div>
  )
}
