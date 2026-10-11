import type { Metadata } from 'next'
import { BTreeVisualizerPage } from '@/page-components/BTreeVisualizerPage'

export const metadata: Metadata = {
  title: 'B-Tree & B+ Tree Visualizer | Interactive Educational Platform',
  description:
    'Visualize B-Tree and B+ Tree operations step-by-step: insert, delete, search, splits, merges, borrows, and range queries with animated explanations.',
}

export default function Page() {
  return <BTreeVisualizerPage />
}
