import type { Metadata } from 'next'
import { BTreeVisualizerPage } from '@/page-components/BTreeVisualizerPage'

export const metadata: Metadata = {
  title: 'B+ Tree Visualizer | Interactive Educational Platform',
  description:
    'Visualize B+ Tree operations step-by-step: insert with copy-up leaf splits, delete, search, range queries, and doubly-linked leaf traversal.',
}

export default function Page() {
  return <BTreeVisualizerPage initialTreeType="bplus" />
}
