# DSA Visualizer — Documentation Index

Welcome to the official documentation for the **Data Structure & Algorithm Visualizer** — a university-grade, production-quality DSA learning platform.

## 📚 Documentation Sections

| Section | Description |
|---------|-------------|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute code, docs, and translations |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Full system architecture and component guide |
| [API.md](./API.md) | Internal API contracts and data types |
| [PERFORMANCE.md](./PERFORMANCE.md) | Performance budget, benchmarks, and optimization notes |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | WCAG 2.2 AA compliance guide |
| [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) | i18n system and how to add translations |
| [TESTING.md](./TESTING.md) | Testing strategy, coverage, and how to run tests |
| [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) | How to add theory content for a new data structure |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run all tests
npm test

# QA validation
node scripts/master-qa-validation.cjs

# Release candidate report
node scripts/release-candidate-report.cjs
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── dashboard/          # Progress dashboard
│   └── learn/[id]/         # Visualizer per DS
├── components/
│   ├── layout/             # AppLayout, Header, Sidebar
│   ├── ui/                 # Reusable atoms (Button, Modal, …)
│   └── visualizer/         # DS visualizer tabs (Visualize, Theory, Code, Quiz)
├── constants/
│   ├── registry.ts         # 42 DS registry (id, ops, difficulty)
│   ├── theory.ts           # Theory definitions (base)
│   ├── theoryExpanded*.ts  # Theory chapters (memory, glossary, FAQ…)
│   ├── translations.ts     # i18n strings (en, fr, ar)
│   └── dedicatedResources.ts # Curated external resources
├── hooks/                  # Custom React hooks
├── store/                  # Zustand app state
├── types/                  # TypeScript type definitions
└── utils/                  # Helper utilities
```
