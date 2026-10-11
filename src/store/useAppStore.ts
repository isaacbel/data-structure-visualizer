import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, Theme } from '@/types'

interface UserProgress {
  visited: Record<string, boolean>
  completed: Record<string, boolean>
  bookmarks: string[]
  favorites: string[]
  lastVisited: string | null
  onboardingComplete: boolean
}

interface AppState extends UserProgress {
  language: Language
  theme: Theme
  reducedMotion: boolean
  colorBlindMode: boolean
  largeText: boolean
  animationSpeed: number
  activeCodeLine: number
  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  setReducedMotion: (value: boolean) => void
  setColorBlindMode: (value: boolean) => void
  setLargeText: (value: boolean) => void
  setAnimationSpeed: (speed: number) => void
  setActiveCodeLine: (line: number) => void
  markVisited: (id: string) => void
  markCompleted: (id: string) => void
  toggleBookmark: (id: string) => void
  toggleFavorite: (id: string) => void
  setLastVisited: (id: string) => void
  completeOnboarding: () => void
  getProgressPercent: (ids: string[]) => number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'dark',
      reducedMotion: false,
      colorBlindMode: false,
      largeText: false,
      animationSpeed: 1,
      activeCodeLine: -1,
      visited: {},
      completed: {},
      bookmarks: [],
      favorites: [],
      lastVisited: null,
      onboardingComplete: false,

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
          document.documentElement.classList.toggle('light', theme === 'light')
        }
        set({ theme })
      },
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setColorBlindMode: (colorBlindMode) => set({ colorBlindMode }),
      setLargeText: (largeText) => set({ largeText }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
      setActiveCodeLine: (activeCodeLine) => set({ activeCodeLine }),

      markVisited: (id) =>
        set((s) => ({
          visited: { ...s.visited, [id]: true },
          lastVisited: id,
        })),

      markCompleted: (id) =>
        set((s) => ({
          completed: { ...s.completed, [id]: true },
          visited: { ...s.visited, [id]: true },
        })),

      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((b) => b !== id)
            : [...s.bookmarks, id],
        })),

      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),

      setLastVisited: (id) => set({ lastVisited: id }),
      completeOnboarding: () => set({ onboardingComplete: true }),

      getProgressPercent: (ids) => {
        const { visited } = get()
        if (ids.length === 0) return 0
        const count = ids.filter((id) => visited[id]).length
        return Math.round((count / ids.length) * 100)
      },
    }),
    { name: 'dsv-store' },
  ),
)
