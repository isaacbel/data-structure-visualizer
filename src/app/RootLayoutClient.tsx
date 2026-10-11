'use client'

import { Inter, JetBrains_Mono } from 'next/font/google'
import { AppLayout } from '@/components/layout/AppLayout'
import { EsperanzaLogo } from '@/components/brand/EsperanzaLogo'
import { useAppStore } from '@/store/useAppStore'
import { useEffect, useState } from 'react'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  // Hydration fallback shell to avoid style/layout shifts during client load
  if (!mounted) {
    return (
      <div className={`min-h-screen bg-slate-950 text-white dark ${inter.variable} ${jetbrainsMono.variable}`}>
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-300">
          <EsperanzaLogo href={null} size={56} priority />
          <span className="text-sm text-slate-400">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <AppLayout>{children}</AppLayout>
    </div>
  )
}
