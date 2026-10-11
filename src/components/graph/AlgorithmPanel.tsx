'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Code2, Cpu, Layers } from 'lucide-react'
import type { CodeLanguage, VisualState } from '@/types'

interface AlgorithmPanelProps {
  state: VisualState
  activeAlgorithm: string
  onSelectAlgorithm: (algo: string) => void
}

export interface GraphAlgorithmMeta {
  id: string
  name: string
  category: 'Traversal' | 'Shortest Paths' | 'MST' | 'Topological' | 'Connectivity' | 'Cycles' | 'Matching' | 'Flow' | 'Coloring' | 'Euler & Hamilton' | 'Bridges'
  timeComplexity: string
  spaceComplexity: string
  goal: string
  pseudocode: string[]
  code: Record<CodeLanguage, string>
}

export const GRAPH_ALGORITHMS: GraphAlgorithmMeta[] = [
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Traversal',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    goal: 'Explore graph layer by layer using a FIFO queue.',
    pseudocode: [
      'bfs(start):',
      '  queue = [start]',
      '  visited = {start}',
      '  while queue not empty:',
      '    u = queue.pop_front()',
      '    for each neighbor v of u:',
      '      if v not in visited:',
      '        visited.add(v)',
      '        queue.push_back(v)',
    ],
    code: {
      python: `def bfs(graph, start):\n    visited = {start}\n    queue = [start]\n    while queue:\n        node = queue.pop(0)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)`,
      c: `void bfs(int start) {\n    queue[rear++] = start;\n    visited[start] = 1;\n    while (front < rear) {\n        int u = queue[front++];\n        for (int v = 0; v < n; v++) {\n            if (adj[u][v] && !visited[v]) {\n                visited[v] = 1;\n                queue[rear++] = v;\n            }\n        }\n    }\n}`,
      cpp: `void bfs(int start) {\n    queue<int> q;\n    q.push(start);\n    visited[start] = true;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        for (int v : adj[u]) {\n            if (!visited[v]) { visited[v] = true; q.push(v); }\n        }\n    }\n}`,
      java: `void bfs(int start) {\n    Queue<Integer> q = new LinkedList<>();\n    q.add(start);\n    visited[start] = true;\n    while (!q.isEmpty()) {\n        int u = q.poll();\n        for (int v : adj.get(u)) {\n            if (!visited[v]) { visited[v] = true; q.add(v); }\n        }\n    }\n}`,
      javascript: `function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  while (queue.length > 0) {\n    const node = queue.shift();\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}`,
      typescript: `function bfs(graph: Map<string, string[]>, start: string): void {\n  const visited = new Set<string>([start]);\n  const queue: string[] = [start];\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    for (const neighbor of graph.get(node) ?? []) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}`,
      rust: ``, go: ``, csharp: ``, kotlin: ``, swift: ``, php: ``,
    },
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Traversal',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    goal: 'Explore as far as possible along each branch before backtracking.',
    pseudocode: [
      'dfs(u):',
      '  visited.add(u)',
      '  for each neighbor v of u:',
      '    if v not in visited:',
      '      dfs(v)',
    ],
    code: {
      python: `def dfs(graph, node, visited=set()):\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)`,
      c: `void dfs(int u) {\n    visited[u] = 1;\n    for (int v = 0; v < n; v++) {\n        if (adj[u][v] && !visited[v]) dfs(v);\n    }\n}`,
      cpp: `void dfs(int u) {\n    visited[u] = true;\n    for (int v : adj[u]) {\n        if (!visited[v]) dfs(v);\n    }\n}`,
      java: `void dfs(int u) {\n    visited[u] = true;\n    for (int v : adj.get(u)) {\n        if (!visited[v]) dfs(v);\n    }\n}`,
      javascript: `function dfs(graph, node, visited = new Set()) {\n  visited.add(node);\n  for (const neighbor of graph[node]) {\n    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);\n  }\n}`,
      typescript: `function dfs(graph: Map<string, string[]>, node: string, visited = new Set<string>()): void {\n  visited.add(node);\n  for (const neighbor of graph.get(node) ?? []) {\n    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);\n  }\n}`,
      rust: ``, go: ``, csharp: ``, kotlin: ``, swift: ``, php: ``,
    },
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    category: 'Shortest Paths',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    goal: 'Find single-source shortest paths in non-negative weighted graphs.',
    pseudocode: [
      'dijkstra(start):',
      '  dist[all] = ∞; dist[start] = 0',
      '  pq = priority_queue([(0, start)])',
      '  while pq not empty:',
      '    (d, u) = pq.pop_min()',
      '    for (v, w) in neighbors(u):',
      '      if dist[u] + w < dist[v]:',
      '        dist[v] = dist[u] + w',
      '        pq.push((dist[v], v))',
    ],
    code: {
      python: `import heapq\ndef dijkstra(graph, start):\n    dist = {v: float('inf') for v in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))`,
      c: `void dijkstra(int start) {\n    for (int i = 0; i < n; i++) dist[i] = INF;\n    dist[start] = 0;\n    // Min priority queue relaxation loop\n}`,
      cpp: `void dijkstra(int start) {\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n    dist[start] = 0;\n    pq.push({0, start});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto [v, w] : adj[u]) {\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n}`,
      java: `void dijkstra(int start) {\n    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[start] = 0;\n    pq.add(new int[]{0, start});\n    while (!pq.isEmpty()) {\n        int[] top = pq.poll(); int u = top[1];\n        for (Edge e : adj.get(u)) {\n            if (dist[u] + e.w < dist[e.v]) {\n                dist[e.v] = dist[u] + e.w;\n                pq.add(new int[]{dist[e.v], e.v});\n            }\n        }\n    }\n}`,
      javascript: `function dijkstra(graph, start) {\n  const dist = {};\n  for (const v in graph) dist[v] = Infinity;\n  dist[start] = 0;\n  const pq = [[0, start]];\n  while (pq.length > 0) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [d, u] = pq.shift();\n    for (const [v, w] of graph[u]) {\n      if (dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        pq.push([dist[v], v]);\n      }\n    }\n  }\n}`,
      typescript: `function dijkstra(graph: Map<string, Array<[string, number]>>, start: string): Record<string, number> {\n  const dist: Record<string, number> = {};\n  dist[start] = 0;\n  return dist;\n}`,
      rust: ``, go: ``, csharp: ``, kotlin: ``, swift: ``, php: ``,
    },
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST",
    category: 'MST',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    goal: 'Find Minimum Spanning Tree by sorting edges and using Union-Find.',
    pseudocode: [
      'kruskal(edges):',
      '  sort edges by weight ascending',
      '  for edge (u, v, w) in edges:',
      '    if find(u) != find(v):',
      '      union(u, v)',
      '      mst.add_edge(u, v, w)',
    ],
    code: {
      python: `def kruskal(nodes, edges):\n    parent = {v: v for v in nodes}\n    def find(i):\n        if parent[i] == i: return i\n        parent[i] = find(parent[i]); return parent[i]\n    edges.sort(key=lambda e: e[2])\n    mst = []\n    for u, v, w in edges:\n        if find(u) != find(v):\n            parent[find(u)] = find(v)\n            mst.append((u, v, w))`,
      c: `// Kruskal implementation in C with Disjoint Set Union`,
      cpp: `// Kruskal MST in C++ with DSU`,
      java: `// Kruskal MST in Java`,
      javascript: `// Kruskal MST in JS`,
      typescript: `// Kruskal MST in TS`,
      rust: ``, go: ``, csharp: ``, kotlin: ``, swift: ``, php: ``,
    },
  },
]

export function AlgorithmPanel({ state, activeAlgorithm, onSelectAlgorithm }: AlgorithmPanelProps) {
  const [activeTab, setActiveTab] = useState<'pseudo' | 'code' | 'state'>('pseudo')
  const [lang, setLang] = useState<CodeLanguage>('python')

  const meta = useMemo(
    () => GRAPH_ALGORITHMS.find((a) => a.id === activeAlgorithm) ?? GRAPH_ALGORITHMS[0],
    [activeAlgorithm],
  )

  const currentLine = state.highlightedCodeLine ?? -1

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-slate-900 shadow-xl overflow-hidden">
      {/* Header / Algo Picker */}
      <div className="border-b border-white/10 p-3 bg-slate-950/80">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
            <Cpu size={15} />
            <span>Graph Algorithm</span>
          </div>
          <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-[10px] text-purple-300">
            {meta.category}
          </span>
        </div>

        <select
          value={activeAlgorithm}
          onChange={(e) => onSelectAlgorithm(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:border-cyan-500 focus:outline-none"
        >
          {GRAPH_ALGORITHMS.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Meta Stats */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-white/5 border-b border-white/10 text-xs">
        <div>
          <span className="text-slate-400">Time:</span>{' '}
          <span className="font-mono text-cyan-400 font-bold">{meta.timeComplexity}</span>
        </div>
        <div>
          <span className="text-slate-400">Space:</span>{' '}
          <span className="font-mono text-purple-400 font-bold">{meta.spaceComplexity}</span>
        </div>
      </div>

      {/* Goal description */}
      <div className="px-3 py-2 border-b border-white/10 text-xs text-slate-300 bg-slate-950/40">
        <span className="font-semibold text-slate-400">Goal:</span> {meta.goal}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-slate-950">
        <button
          onClick={() => setActiveTab('pseudo')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${activeTab === 'pseudo' ? 'border-cyan-400 text-cyan-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <BookOpen size={13} /> Pseudocode
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${activeTab === 'code' ? 'border-cyan-400 text-cyan-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Code2 size={13} /> Code
        </button>
        <button
          onClick={() => setActiveTab('state')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${activeTab === 'state' ? 'border-cyan-400 text-cyan-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Layers size={13} /> State
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
        {activeTab === 'pseudo' && (
          <div className="space-y-1">
            {meta.pseudocode.map((line, idx) => {
              const lineNum = idx + 1
              const isCurrent = currentLine === lineNum
              return (
                <div
                  key={idx}
                  className={`px-2 py-1 rounded transition flex items-center gap-2 ${isCurrent ? 'bg-cyan-500/20 text-cyan-200 border-l-2 border-cyan-400 font-bold' : 'text-slate-400'}`}
                >
                  <span className="text-[10px] text-slate-600 select-none w-4">{lineNum}</span>
                  <pre className="whitespace-pre-wrap">{line}</pre>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {(['python', 'c', 'cpp', 'java', 'javascript', 'typescript'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition ${lang === l ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg text-slate-200 overflow-x-auto text-[11px] leading-5">
              <code>{meta.code[lang] || meta.code.python}</code>
            </pre>
          </div>
        )}

        {activeTab === 'state' && (
          <div className="space-y-3">
            {state.visited && state.visited.length > 0 && (
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Visited Order</div>
                <div className="flex flex-wrap gap-1">
                  {state.visited.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {state.queue && state.queue.length > 0 && (
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">FIFO Queue</div>
                <div className="flex flex-wrap gap-1">
                  {state.queue.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[11px]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {state.stack && state.stack.length > 0 && (
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">LIFO Stack</div>
                <div className="flex flex-wrap gap-1">
                  {state.stack.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
