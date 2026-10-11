import type { Metadata } from 'next'
import { BTreeVisualizerPage } from '@/page-components/BTreeVisualizerPage'

export const metadata: Metadata = {
  title: 'B-Tree Visualizer | Interactive Educational Platform',
  description:
    'Visualize B-Tree operations step-by-step: insert, delete, search, node splits, merges, borrows, and root collapse with animated explanations.',
}

export default function Page() {
  return <BTreeVisualizerPage initialTreeType="btree" />
}
