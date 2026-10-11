import type { Metadata } from 'next'
import RootLayoutClient from './RootLayoutClient'
import '../styles/index.css'

export const metadata: Metadata = {
  title: 'Data Structure Visualizer · Esperanza Club',
  description: 'Master Data Structures & Algorithms Visually - Interactive educational platform by Esperanza Club',
  icons: {
    icon: '/11.png',
    apple: '/11.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
