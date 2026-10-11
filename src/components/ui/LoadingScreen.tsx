'use client'

import { motion } from 'framer-motion'
import { EsperanzaLogo } from '@/components/brand/EsperanzaLogo'

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mx-auto mb-4">
          <EsperanzaLogo href={null} size={64} priority />
        </div>
        <p className="text-sm text-slate-400">Loading visualizer...</p>
      </motion.div>
    </div>
  )
}
