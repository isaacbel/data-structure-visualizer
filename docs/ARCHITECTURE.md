# Architecture Guide

## Overview

The DSA Visualizer is built with **Next.js 14** (App Router), **TypeScript**, **Zustand** state management, and **Framer Motion** animations.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Next.js App Router                      │
│  /                 → Landing (Hero, Features, Paths)        │
│  /dashboard        → Progress, Bookmarks, Stats             │
│  /learn/[id]       → Visualizer (Visualize + Theory + Code) │
└──────────────────────────┬─────────────────────────────────┘
                           │
         ┌─────────────────▼─────────────────┐
         │            AppLayout               │
         │  Header · Sidebar · Toast · Modals │
         └──────────┬────────────────────────┘
                    │
         ┌──────────▼────────────┐
         │     useAppStore        │  ← Zustand global state
         │  language, theme,      │
         │  progress, bookmarks   │
         └───────────────────────┘
```

---

## Component Hierarchy

### `AppLayout` (`src/components/layout/AppLayout.tsx`)
- Renders global header, sidebar, and modal portals
- Owns: `HeaderSearchModal`, `KeyboardShortcutsModal`, `ThemeSwitcher`
- Applies RTL direction when `language === 'ar'`

### `VisualizerPage` (`src/app/learn/[id]/page.tsx`)
- Looks up DS config from `DATA_STRUCTURES[id]`
- Renders: `VisualizeTab`, `TheoryTab`, `CodeTab`, `QuizTab`, `PracticeTab`

### `TheoryTab` (`src/components/visualizer/TheoryTab.tsx`)
- Displays all educational content: memory layout, invariants, complexity, glossary, FAQ, resources
- Sources: `THEORY` (base), `THEORY_EXPANDED_*` (chapters), `DEDICATED_RESOURCES`
- Includes: `ComparisonModal` for side-by-side trade-off analysis

---

## Data Flow

```
DATA_STRUCTURES[id]     (registry.ts)       → DS config, ops
THEORY[id]              (theory.ts)         → base theory
THEORY_EXPANDED_*[id]   (theoryExpanded*.ts)→ extended chapters
DEDICATED_RESOURCES[id] (dedicatedResources.ts) → curated links
```

---

## State Management (Zustand)

**Store**: `src/store/useAppStore.ts`

| Key | Type | Purpose |
|-----|------|---------|
| `language` | `'en' \| 'fr' \| 'ar'` | UI language |
| `theme` | `'dark' \| 'light'` | Color theme |
| `progress` | `Record<string, number>` | Per-DS completion % |
| `bookmarks` | `string[]` | Bookmarked DS IDs |
| `visitedDS` | `string[]` | History |

---

## Animation Architecture

Animations use **Framer Motion** (`framer-motion` package).

- **Node transitions**: `layout` prop with `layoutId` for FLIP animations
- **Step-by-step**: `AnimatePresence` for step reveal
- **Speed control**: `useAppStore().speed` ↔ `delay = 1000 / speed`

---

## Code Library

The `CodeTab` displays implementations for **42 data structures × 9 languages**:

| Language | Runtime |
|----------|---------|
| Python | CPython 3.12 |
| JavaScript | V8 ES2024 |
| TypeScript | TS 5.x |
| Java | JDK 21 |
| C++ | C++20 |
| C | C11 |
| Go | 1.22 |
| Rust | 1.79 |
| Kotlin | 2.0 |

---

## Adding a New Data Structure

1. Add entry to `src/constants/registry.ts`
2. Add theory to `src/constants/theory.ts`
3. Add expanded chapters to `src/constants/theoryExpanded*.ts`
4. Add resources to `src/constants/dedicatedResources.ts`
5. Create visualizer component in `src/components/visualizers/`
6. Add code implementations to `src/constants/codeImplementations.ts`
7. Run `node scripts/master-qa-validation.cjs` to verify
