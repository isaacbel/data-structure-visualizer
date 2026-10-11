'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, Home, BookOpen, LayoutDashboard, Keyboard, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/constants/translations'
import { CATEGORIES, DATA_STRUCTURES } from '@/constants/registry'
import { cn } from '@/utils/cn'
import { KeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal'
import { HeaderSearchModal } from '@/components/layout/HeaderSearchModal'
import { EsperanzaLogo } from '@/components/brand/EsperanzaLogo'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const language = useAppStore((s) => s.language)
  const theme = useAppStore((s) => s.theme)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const setTheme = useAppStore((s) => s.setTheme)
  const visited = useAppStore((s) => s.visited)
  const t = useTranslation(language)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [kbModalOpen, setKbModalOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Listen for global '?' key to toggle shortcuts modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(tag)) {
        e.preventDefault()
        setKbModalOpen(prev => !prev)
      }
      // Ctrl+K or / to open search
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(tag))) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  const isLearnPage = pathname.startsWith('/learn')
  const showSidebar = isLearnPage

  return (
    <div className={cn('min-h-screen bg-slate-950 text-white', theme)}>
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {showSidebar && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="flex min-w-0 items-center gap-3">
              <EsperanzaLogo
                size={36}
                priority
                showWordmark
                wordmarkClassName="hidden sm:inline"
              />
              <span className="hidden h-5 w-px bg-white/15 lg:block" aria-hidden />
              <span className="hidden truncate text-sm font-medium text-slate-300 lg:inline">
                {t.title}
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/" icon={Home} label={t.home} active={pathname === '/'} />
            <NavLink href="/learn/array" icon={BookOpen} label={t.learn} active={isLearnPage} />
            <NavLink
              href="/dashboard"
              icon={LayoutDashboard}
              label={t.dashboard}
              active={pathname === '/dashboard'}
            />
          </nav>

          {/* Cmd-K search bar pill */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            aria-label="Search data structures (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search…</span>
            <kbd className="ml-1 rounded border border-white/10 bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">⌃K</kbd>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10"
              aria-label={language === 'en' ? 'Passer en Français' : 'Switch to English'}
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            <button
              onClick={() => setKbModalOpen(true)}
              className="rounded-lg border border-white/10 p-2 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Keyboard Shortcuts"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg border border-white/10 p-2 hover:bg-white/10"
              aria-label={t.theme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="rounded-lg p-2 hover:bg-white/10 md:hidden"
              aria-label="Menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-white/10 p-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link href="/" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setMobileNavOpen(false)}>
                {t.home}
              </Link>
              <Link href="/learn/array" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setMobileNavOpen(false)}>
                {t.learn}
              </Link>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setMobileNavOpen(false)}>
                {t.dashboard}
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar for learn pages */}
        {showSidebar && (
          <>
            <aside
              className={cn(
                'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-slate-900/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                'top-16',
              )}
            >
              <div className="custom-scrollbar h-[calc(100vh-4rem)] overflow-y-auto p-4">
                {CATEGORIES.filter((c) => c.id !== 'sorting' && c.id !== 'string' && c.id !== 'dp').map((cat) => {
                  const items = Object.values(DATA_STRUCTURES).filter((d) => d.category === cat.id)
                  if (items.length === 0) return null
                  return (
                    <div key={cat.id} className="mb-6">
                      <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        {(cat.name as Record<string, string>)[language] || cat.name.en}
                      </h3>
                      <div className="space-y-0.5">
                        {items.map((item) => (
                          <Link
                            key={item.id}
                            href={`/learn/${item.id}`}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                              pathname === `/learn/${item.id}`
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                            )}
                          >
                            <span>{item.name[language]}</span>
                            {visited[item.id] && (
                              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </aside>
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </>
        )}

        <main className={cn('flex-1', showSidebar && 'lg:ml-0')}>
          {children}
        </main>
      </div>

      <footer className={cn(
        'border-t border-white/10 bg-slate-950',
        isLearnPage ? 'py-6' : 'py-10',
      )}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
            <div className="flex max-w-md flex-col items-center gap-3 text-center md:items-start md:text-left">
              <EsperanzaLogo size={isLearnPage ? 40 : 48} />
              <p className="text-sm leading-relaxed text-slate-400">
                Esperanza Club — an academic technology community dedicated to computer science,
                algorithms, and hands-on learning.
              </p>
              <p className="text-xs text-slate-500">
                © 2026 Data Structure Visualizer. Open source under MIT License.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="https://github.com" className="hover:text-cyan-400">
                GitHub
              </a>
              <Link href="/dashboard" className="hover:text-cyan-400">
                {t.dashboard}
              </Link>
              <Link href="/" className="hover:text-cyan-400">
                {t.home}
              </Link>
            </div>
          </div>
        </div>
      </footer>
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal isOpen={kbModalOpen} onClose={() => setKbModalOpen(false)} />
      {/* Global Search Modal */}
      <HeaderSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
        active ? 'bg-white/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}
