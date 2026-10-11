import type { Metadata } from 'next'
import { GraphVisualizerPage } from '@/page-components/GraphVisualizerPage'

export const metadata: Metadata = {
  title: 'Graph Visualizer Engine | Interactive Graph Algorithms',
  description: 'Explore, edit, generate, and animate graph algorithms and layouts in real-time.',
}

export default function Page() {
  return <GraphVisualizerPage />
}
