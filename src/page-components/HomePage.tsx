'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Code2,
  GitBranch,
  Layers,
  Play,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/constants/translations'
import { DATA_STRUCTURES, LEARNING_PATHS } from '@/constants/registry'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { NetworkGraph } from '@/components/ui/NetworkGraph'

const FEATURES = [
  { icon: Play, title: 'Interactive Animations', desc: 'Step through algorithms with play, pause, and scrub controls.' },
  { icon: Code2, title: 'Multi-Language Code', desc: 'View implementations in 8 programming languages with syntax highlighting.' },
  { icon: Brain, title: 'Learning Paths', desc: 'Structured curriculum from beginner to expert level.' },
  { icon: Layers, title: '50+ Structures', desc: 'Comprehensive coverage of linear, tree, graph, and advanced structures.' },
  { icon: Zap, title: 'Algorithm Race Mode', desc: 'Compare algorithms side-by-side with live statistics.' },
  { icon: Sparkles, title: 'Practice Mode', desc: 'Test your knowledge with interactive exercises and quizzes.' },
]

const STATS = [
  { value: '50+', label: 'Data Structures' },
  { value: '80+', label: 'Algorithms' },
  { value: '8', label: 'Languages' },
  { value: '100%', label: 'Open Source' },
]

const FAQ = [
  { q: 'Is this free to use?', a: 'Yes! Data Structure Visualizer is completely free and open source.' },
  { q: 'Do I need to create an account?', a: 'No account required. Progress is saved locally in your browser.' },
  { q: 'What languages are supported?', a: 'Code examples are available in Python, C, C++, Java, JavaScript, TypeScript, Rust, and Go.' },
  { q: 'Can I contribute?', a: 'Absolutely! Check our GitHub repository for contribution guidelines.' },
]

export function HomePage() {
  const language = useAppStore((s) => s.language)
  const t = useTranslation(language)
  const implementedCount = useMemo(
    () => Object.values(DATA_STRUCTURES).filter((d) => d.implemented).length,
    [],
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <ParticleBackground />
      <NetworkGraph className="absolute inset-0 opacity-30" />

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300">
            <Sparkles className="h-4 w-4" />
            Open Source Educational Platform
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            <span className="gradient-text">{t.tagline}</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl">
            Explore data structures and algorithms through beautiful, interactive visualizations.
            Learn at your own pace with theory, code, and hands-on practice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/learn/array" className="btn-primary text-lg">
              {t.getStarted}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-lg">
              <BookOpen className="h-5 w-5" />
              {t.dashboard}
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            {implementedCount} structures fully animated · {Object.keys(DATA_STRUCTURES).length} total registered
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-cyan-400 md:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">{t.features}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="glass-card group p-6 transition-transform hover:scale-[1.02]"
            >
              <f.icon className="mb-4 h-10 w-10 text-cyan-400 transition-colors group-hover:text-violet-400" />
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="relative z-10 bg-gradient-to-b from-transparent to-violet-950/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">{t.learningPaths}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {LEARNING_PATHS.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${path.color}`} />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">{path.name[language]}</h3>
                  <ul className="mb-4 space-y-1 text-sm text-slate-400">
                    {path.structures.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <GitBranch className="h-3 w-3 text-cyan-400" />
                        {DATA_STRUCTURES[s]?.name[language] ?? s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/learn/${path.structures[0]}`}
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Start path →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold">{t.faq}</h2>
        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <h3 className="mb-2 font-semibold text-white">{item.q}</h3>
              <p className="text-sm text-slate-400">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-white/5 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to master algorithms?</h2>
          <p className="mb-8 text-slate-400">Join thousands of learners visualizing computer science concepts.</p>
          <Link href="/learn/array" className="btn-primary text-lg">
            {t.exploreStructures}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
