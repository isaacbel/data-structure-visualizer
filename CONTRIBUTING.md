# Contributing to DSA Visualizer

Thank you for your interest in contributing! This guide explains how to contribute code, documentation, translations, and educational content.

---

## Getting Started

```bash
# Fork and clone the repo
git clone https://github.com/your-username/data-structure-visualizer.git
cd data-structure-visualizer

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# QA validation
node scripts/master-qa-validation.cjs
```

---

## Types of Contributions

### 🐛 Bug Fixes
1. Check existing issues before creating a new one
2. Create a branch: `git checkout -b fix/issue-description`
3. Fix the bug with a test if possible
4. Submit a PR with a clear description

### ✨ New Features
1. Open an issue first to discuss the feature
2. Get approval before starting implementation
3. Follow the architecture patterns in `docs/ARCHITECTURE.md`

### 📖 Educational Content
1. Follow the theory structure in `src/constants/theoryExpanded*.ts`
2. Every theory chapter must include: Definition, Memory Layout, Invariants, Complexity Table, Glossary, FAQ, Summary
3. Ensure all code examples compile and are correct

### 🌐 Translations
1. Follow the guide in `docs/INTERNATIONALIZATION.md`
2. Provide translations for all 81 keys
3. For RTL languages, test the layout in an RTL environment

### 🎨 Visualizations
1. Create the component in `src/components/visualizers/`
2. Follow the existing pattern (useEffect for animation, Framer Motion for transitions)
3. Support all listed operations from the registry
4. Test with edge cases: empty structure, single element, maximum size

---

## Code Standards

### TypeScript
- Strict mode is enabled. No `any` types unless absolutely necessary
- Export all types from `src/types/index.ts`
- Use `Record<string, T>` instead of `{ [key: string]: T }`

### Components
- All components are functional with hooks
- Use `cn()` from `@/utils/cn` for conditional classes
- Follow the `'use client'` / server component split

### Styling
- Use Tailwind CSS utility classes
- Avoid inline styles
- Mobile-first responsive design

---

## Testing

```bash
# Unit tests
npm test

# E2E tests (requires Playwright)
npx playwright test

# TypeScript compilation
npm run typecheck

# Lint
npm run lint
```

---

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add suffix array visualizer
fix: correct heap delete animation
docs: add contributing guide
test: add array edge case tests
refactor: extract animation hook
```

---

## Pull Request Checklist

- [ ] Code compiles with no TypeScript errors
- [ ] All existing tests pass
- [ ] New code has tests where applicable
- [ ] UI changes are responsive on mobile
- [ ] Educational content is accurate and reviewed
- [ ] No TODOs, placeholder text, or `console.log` statements
- [ ] `node scripts/master-qa-validation.cjs` passes

---

## Code of Conduct

Be respectful, constructive, and inclusive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).
