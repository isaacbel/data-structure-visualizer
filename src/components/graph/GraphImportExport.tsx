'use client'

import { useState } from 'react'
import { Copy, Download, FileCode, FileSpreadsheet, FileText, Upload, X } from 'lucide-react'
import type { VisualEdge, VisualNode, VisualState } from '@/types'

interface GraphImportExportProps {
  state: VisualState
  onImport: (imported: VisualState) => void
  onClose: () => void
}

export function exportToCSV(nodes: VisualNode[], edges: VisualEdge[]): string {
  let csv = 'Source,Target,Weight,Directed\n'
  for (const e of edges) {
    csv += `${e.from},${e.to},${e.weight ?? 1},${e.directed ? 'true' : 'false'}\n`
  }
  return csv
}

export function exportToDOT(nodes: VisualNode[], edges: VisualEdge[], directed = false): string {
  const op = directed ? 'digraph' : 'graph'
  const link = directed ? '->' : '--'
  let dot = `${op} G {\n`
  for (const n of nodes) {
    dot += `  "${n.id}" [label="${n.value}"];\n`
  }
  for (const e of edges) {
    const wLabel = e.weight !== undefined ? ` [label="${e.weight}"]` : ''
    dot += `  "${e.from}" ${link} "${e.to}"${wLabel};\n`
  }
  dot += '}\n'
  return dot
}

export function exportToGraphML(nodes: VisualNode[], edges: VisualEdge[], directed = false): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n'
  xml += `  <graph id="G" edgedefault="${directed ? 'directed' : 'undirected'}">\n`
  for (const n of nodes) {
    xml += `    <node id="${n.id}"/>\n`
  }
  edges.forEach((e, i) => {
    xml += `    <edge id="e${i}" source="${e.from}" target="${e.to}"/>\n`
  })
  xml += '  </graph>\n'
  xml += '</graphml>\n'
  return xml
}

export function parseCSV(csv: string): { nodes: VisualNode[]; edges: VisualEdge[] } {
  const lines = csv.trim().split('\n').slice(1)
  const nodeSet = new Set<string>()
  const edges: VisualEdge[] = []

  for (const line of lines) {
    const parts = line.split(',').map((p) => p.trim())
    if (parts.length >= 2) {
      const from = parts[0], to = parts[1]
      const weight = parts[2] ? Number(parts[2]) : undefined
      const directed = parts[3] === 'true'
      nodeSet.add(from)
      nodeSet.add(to)
      edges.push({ from, to, weight: Number.isNaN(weight) ? undefined : weight, directed })
    }
  }

  const nodesList = Array.from(nodeSet)
  const nodes: VisualNode[] = nodesList.map((id, i) => ({
    id,
    value: id,
    x: 100 + (i % 5) * 120,
    y: 100 + Math.floor(i / 5) * 100,
  }))

  return { nodes, edges }
}

export function GraphImportExport({ state, onImport, onClose }: GraphImportExportProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [format, setFormat] = useState<'json' | 'csv' | 'dot' | 'graphml'>('json')
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)

  const nodes = state.nodes ?? []
  const edges = state.edges ?? []

  const formattedOutput = () => {
    switch (format) {
      case 'json': return JSON.stringify(state, null, 2)
      case 'csv': return exportToCSV(nodes, edges)
      case 'dot': return exportToDOT(nodes, edges, edges[0]?.directed)
      case 'graphml': return exportToGraphML(nodes, edges, edges[0]?.directed)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput())
    alert('Copied to clipboard!')
  }

  const handleDownload = () => {
    const text = formattedOutput()
    const mimeMap = { json: 'application/json', csv: 'text/csv', dot: 'text/vnd.graphviz', graphml: 'application/xml' }
    const extMap = { json: 'json', csv: 'csv', dot: 'dot', graphml: 'graphml' }
    const blob = new Blob([text], { type: mimeMap[format] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `graph.${extMap[format]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExecuteImport = () => {
    setImportError(null)
    try {
      if (format === 'json') {
        const parsed = JSON.parse(importText) as VisualState
        if (!parsed.nodes || !Array.isArray(parsed.nodes)) throw new Error('Invalid JSON: missing nodes array')
        onImport(parsed)
      } else if (format === 'csv') {
        const { nodes, edges } = parseCSV(importText)
        onImport({ nodes, edges })
      } else {
        throw new Error('Importing DOT/GraphML is supported via CSV/JSON format conversion')
      }
      onClose()
    } catch (err) {
      setImportError((err as Error).message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition ${activeTab === 'export' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}
            >
              <Download size={16} /> Export Graph
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition ${activeTab === 'import' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}
            >
              <Upload size={16} /> Import Graph
            </button>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex gap-2">
          {(['json', 'csv', 'dot', 'graphml'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs uppercase font-mono font-bold transition ${format === fmt ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              {fmt === 'json' && <FileCode size={13} />}
              {fmt === 'csv' && <FileSpreadsheet size={13} />}
              {(fmt === 'dot' || fmt === 'graphml') && <FileText size={13} />}
              {fmt}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'export' ? (
          <div className="flex flex-col gap-3">
            <textarea
              readOnly
              value={formattedOutput()}
              className="h-64 w-full rounded-lg border border-white/10 bg-slate-950 p-3 font-mono text-xs text-cyan-300 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleCopy} className="btn-secondary flex items-center gap-1 px-4 py-2 text-xs font-semibold">
                <Copy size={14} /> Copy Code
              </button>
              <button onClick={handleDownload} className="btn-primary flex items-center gap-1 px-4 py-2 text-xs font-semibold">
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Paste your ${format.toUpperCase()} graph data here...`}
              className="h-64 w-full rounded-lg border border-white/10 bg-slate-950 p-3 font-mono text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
            {importError && <p className="text-xs text-red-400 font-semibold">{importError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="btn-secondary px-4 py-2 text-xs">Cancel</button>
              <button onClick={handleExecuteImport} className="btn-primary px-4 py-2 text-xs font-semibold">Load Graph</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
