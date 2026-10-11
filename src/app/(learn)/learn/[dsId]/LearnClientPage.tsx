'use client'

import { LearnPage } from '@/page-components/LearnPage'

interface LearnClientPageProps {
  dsId: string
}

export function LearnClientPage({ dsId }: LearnClientPageProps) {
  return <LearnPage dsId={dsId} />
}
