'use client'

import { useState } from 'react'
import { Copy, Download, Upload, X } from 'lucide-react'
import type { BTreeNode } from '@/core/btree/types'
import { getTreeStats } from '@/core/btree/generators'

interface BTreeImportExportProps {
  root: BTreeNode<number> | null
  treeType: 'btree' | 'bplus'
  onImportKeys: (keys: number[]) => void
  onClose: () => void
}

function collectAllKeys(root: BTreeNode<number> | null): number[] {
  if (!root) return []
  const keys: number[] = []
  const traverse = (node: BTreeNode<number>) => {
    if (node.isLeaf) {
      keys.push(...node.keys)
    } else {
      node.children.forEach((child, i) => {
        if (!node.isLeaf && i < node.children.length - 1) traverse(child)
        else traverse(child)
        if (i < node.keys.length) keys.push(node.keys[i])
      })
    }
  }
  // Inorder traversal
  const inorder = (node: BTreeNode<number>) => {
    if (node.isLeaf) {
      keys.push(...node.keys)
      return
    }
    node.children.forEach((child, i) => {
      inorder(child)
      if (i < node.keys.length) keys.push(node.keys[i])
    })
  }
  inorder(root)
  return keys
}

function treeToJSON(root: BTreeNode<number> | null, treeType: string, stats: ReturnType<typeof getTreeStats>): string {
  return JSON.stringify({ treeType, stats, keys: collectAllKeys(root) }, null, 2)
}

export function BTreeImportExport({ root, treeType, onImportKeys, onClose }: BTreeImportExportProps) {
  const [tab, setTab] = useState<'export' | 'import'>('export')
  const [format, setFormat] = useState<'json' | 'csv' | 'text'>('json')
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)

  const stats = getTreeStats(root)
  const allKeys = collectAllKeys(root)

  const getExportContent = (): string => {
    switch (format) {
      case 'json':
        return treeToJSON(root, treeType, stats)
      case 'csv':
        return `key\n${allKeys.join('\n')}`
      case 'text':
        return allKeys.join(', ')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent())
  }

  const handleDownload = () => {
    const extMap = { json: 'json', csv: 'csv', text: 'txt' }
    const mimeMap = { json: 'application/json', csv: 'text/csv', text: 'text/plain' }
    const blob = new Blob([getExportContent()], { type: mimeMap[format] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${treeType}.${extMap[format]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportSVG = () => {
    const svg = document.querySelector('svg')
    if (!svg) return
    const source = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${treeType}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    setImportError(null)
    try {
      let keys: number[] = []
      if (format === 'json') {
        const parsed = JSON.parse(importText)
        const rawKeys = Array.isArray(parsed) ? parsed : (parsed.keys ?? [])
        keys = rawKeys.map(Number).filter((n: number) => !isNaN(n))
      } else {
        keys = importText
          .split(/[,\n\r\s]+/)
          .map(Number)
          .filter((n) => !isNaN(n) && isFinite(n))
      }
      if (keys.length === 0) throw new Error('No valid keys found in the input')
      onImportKeys(keys)
      onClose()
    } catch (err) {
      setImportError((err as Error).message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('export')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === 'export' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}
            >
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => setTab('import')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === 'import' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}
            >
              <Upload size={14} /> Import
            </button>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-slate-400"><X size={18} /></button>
        </div>

        {/* Format selector */}
        <div className="flex gap-2">
          {(['json', 'csv', 'text'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1 rounded text-xs uppercase font-bold transition ${format === f ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              {f}
            </button>
          ))}
          {tab === 'export' && (
            <button
              onClick={handleExportSVG}
              className="ml-auto px-3 py-1 rounded text-xs uppercase font-bold bg-white/5 text-slate-400 hover:bg-white/10"
            >
              SVG
            </button>
          )}
        </div>

        {tab === 'export' ? (
          <div className="flex flex-col gap-3">
            <textarea
              readOnly
              value={getExportContent()}
              className="h-48 w-full rounded-lg border border-white/10 bg-slate-950 p-3 font-mono text-xs text-cyan-300"
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleCopy} className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-xs">
                <Copy size={13} /> Copy
              </button>
              <button onClick={handleDownload} className="btn-primary flex items-center gap-1 px-3 py-1.5 text-xs">
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={
                format === 'json' ? '{"keys": [10, 20, 30, ...]} or [10, 20, 30, ...]'
                  : format === 'csv' ? 'key\n10\n20\n30...'
                  : 'Comma or space-separated keys: 10, 20, 30...'
              }
              className="h-48 w-full rounded-lg border border-white/10 bg-slate-950 p-3 font-mono text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
            {importError && <p className="text-xs text-red-400 font-semibold">{importError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="btn-secondary px-3 py-1.5 text-xs">Cancel</button>
              <button onClick={handleImport} className="btn-primary px-3 py-1.5 text-xs">Load Keys</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
