import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DATA_STRUCTURES } from '@/constants/registry'
import { LearnClientPage } from './LearnClientPage'

interface LearnPageProps {
  params: Promise<{ dsId: string }>
}

export async function generateStaticParams() {
  return Object.keys(DATA_STRUCTURES).map((dsId) => ({ dsId }))
}

export async function generateMetadata({ params }: LearnPageProps): Promise<Metadata> {
  const { dsId } = await params
  const config = DATA_STRUCTURES[dsId]

  if (!config) {
    return {
      title: 'Not Found | Data Structure Visualizer',
    }
  }

  const title = `${config.name.en} | Data Structure Visualizer`
  const description = `${config.description.en} — Interactive step-by-step visualizations, theory, code examples in 8 languages, and quizzes.`
  const keywords = [
    config.name.en,
    config.category,
    config.difficulty,
    'data structure',
    'algorithm',
    'visualization',
    'interactive',
    'learn',
  ]

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Data Structure Visualizer',
      url: `https://dsvisualizer.app/learn/${dsId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/learn/${dsId}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { dsId } = await params
  const config = DATA_STRUCTURES[dsId]

  if (!config) {
    notFound()
  }

  return <LearnClientPage dsId={dsId} />
}
