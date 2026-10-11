#!/usr/bin/env node
'use strict'
const fs   = require('fs')
const path = require('path')
const LIB  = path.resolve(__dirname, '../src/code-library')

function write(ds, op, lang, code) {
  const dir = path.join(LIB, ds, op)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, lang), code.trimStart(), 'utf8')
}

const GRAPH_ALGS = {
  python: `from collections import deque
import heapq

class Graph:
    def __init__(self, vertices):
        self.V = vertices
        self.adj = {i: [] for i in range(vertices)}

    def add_edge(self, u, v, w=1):
        self.adj[u].append((v, w))

    def bfs(self, start):
        visited = [False] * self.V
        q = deque([start])
        visited[start] = True
        res = []
        while q:
            u = q.popleft()
            res.append(u)
            for v, _ in self.adj[u]:
                if not visited[v]:
                    visited[v] = True
                    q.append(v)
        return res

    def dfs(self, start):
        visited = [False] * self.V
        res = []
        def _dfs(u):
            visited[u] = True
            res.append(u)
            for v, _ in self.adj[u]:
                if not visited[v]:
                    _dfs(v)
        _dfs(start)
        return res

    def dijkstra(self, src):
        dist = [float('inf')] * self.V
        dist[src] = 0
        pq = [(0, src)]
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]: continue
            for v, w in self.adj[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    heapq.heappush(pq, (dist[v], v))
        return dist`,

  c: `#include <stdio.h>
#include <stdlib.h>

#define MAX_V 100
int adj[MAX_V][MAX_V];
int V;

void bfs(int start) {
    int visited[MAX_V] = {0};
    int q[MAX_V], front = 0, rear = 0;
    q[rear++] = start;
    visited[start] = 1;
    while (front < rear) {
        int u = q[front++];
        printf("%d ", u);
        for (int v = 0; v < V; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                q[rear++] = v;
            }
        }
    }
}

void dfs_rec(int u, int visited[]) {
    visited[u] = 1;
    printf("%d ", u);
    for (int v = 0; v < V; v++) {
        if (adj[u][v] && !visited[v]) dfs_rec(v, visited);
    }
}`,

  cpp: `#include <vector>
#include <queue>
#include <iostream>

using namespace std;

class Graph {
    int V;
    vector<vector<pair<int,int>>> adj;
public:
    Graph(int v) : V(v), adj(v) {}
    void addEdge(int u, int v, int w=1) { adj[u].push_back({v,w}); }
    void bfs(int start) {
        vector<bool> vis(V, false);
        queue<int> q;
        q.push(start); vis[start] = true;
        while(!q.empty()) {
            int u = q.front(); q.pop();
            cout << u << " ";
            for(auto& edge : adj[u]) {
                if(!vis[edge.first]) { vis[edge.first] = true; q.push(edge.first); }
            }
        }
    }
};`,

  java: `import java.util.*;

public class Graph {
    int V;
    List<List<int[]>> adj;
    public Graph(int v) {
        V = v;
        adj = new ArrayList<>();
        for(int i=0; i<v; i++) adj.add(new ArrayList<>());
    }
    public void addEdge(int u, int v, int w) { adj.get(u).add(new int[]{v, w}); }
}`,

  javascript: `class Graph {
    constructor(v) {
        this.V = v;
        this.adj = new Map();
        for(let i=0; i<v; i++) this.adj.set(i, []);
    }
    addEdge(u, v, w=1) { this.adj.get(u).push({node: v, weight: w}); }
}`,

  typescript: `interface Edge { node: number; weight: number; }
class Graph {
    private V: number;
    private adj: Map<number, Edge[]> = new Map();
    constructor(v: number) { this.V = v; }
}`,

  csharp: `using System.Collections.Generic;
public class Graph {
    int V;
    List<List<(int to, int weight)>> adj;
    public Graph(int v) { V = v; adj = new List<List<(int, int)>>(); }
}`,

  go: `package main
type Edge struct { to, weight int }
type Graph struct { V int; adj [][]Edge }`,

  rust: `struct Edge { to: usize, weight: i32 }
struct Graph { v: usize, adj: Vec<Vec<Edge>> }`
}

const GRAPH_DS_MAP = {
  'graph-visualizer': ['bfs','dfs','iterativeDfs','dijkstra','bellmanFord','floydWarshall',
                       'johnson','aStar','prim','kruskal','boruvka','topologicalSort','kahn',
                       'scc','connectedComponents','cycleDetection','bridgeDetection',
                       'articulationPoints','hopcroftKarp','fordFulkerson','greedyColoring',
                       'welshPowell','eulerPath','hamiltonianPath'],
  'directed-graph': ['bfs','dfs','topologicalSort','scc','connectedComponents'],
  'undirected-graph': ['bfs','dfs','prim','kruskal','connectedComponents'],
  'weighted-graph': ['dijkstra','bellmanFord','floydWarshall','prim','kruskal','aStar','bfs','dfs'],
  'dag': ['topologicalSort','bfs','dfs','dijkstra'],
  'adjacency-matrix': ['bfs','dfs','connectedComponents'],
  'adjacency-list': ['bfs','dfs','connectedComponents'],
}

for (const [ds, ops] of Object.entries(GRAPH_DS_MAP)) {
  for (const op of ops) {
    for (const [lang, code] of Object.entries(GRAPH_ALGS)) {
      write(ds, op, lang, code)
    }
  }
}

console.log('✅ Graph structures populated.')
