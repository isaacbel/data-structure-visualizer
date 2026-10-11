# Testing Strategy

## Overview

The DSA Visualizer uses a layered testing strategy:

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit & Integration | Vitest + React Testing Library | Logic, hooks, store |
| End-to-End | Playwright | Critical user flows |
| QA Validation | Custom CJS scripts | Content completeness |
| TypeScript | `tsc --noEmit` | Type safety |
| Lint | ESLint | Code quality |
| A11y | Playwright + axe-core | WCAG compliance |

---

## Running Tests

```bash
# Unit tests (watch mode)
npm test

# Unit tests (single run + coverage)
npm run test:coverage

# TypeScript type check
npm run typecheck

# Lint
npm run lint

# E2E tests (Playwright)
npx playwright test

# QA validation (content completeness)
node scripts/master-qa-validation.cjs

# Release candidate report
node scripts/release-candidate-report.cjs
```

---

## Unit Tests (`src/**/__tests__/`)

Written with **Vitest** and **React Testing Library**.

### Coverage Targets

| Category | Target |
|----------|--------|
| Utilities | ≥ 90% |
| Hooks | ≥ 80% |
| Store | ≥ 90% |
| Components | ≥ 70% |

### Example

```ts
import { describe, it, expect } from 'vitest'
import { matchScore } from '../HeaderSearchModal'

describe('matchScore', () => {
  it('exact name match returns 100', () => {
    expect(matchScore({ id: 'array', name: { en: 'Array' }, ... }, 'array')).toBe(100)
  })
})
```

---

## E2E Tests (`e2e/`)

Written with **Playwright** targeting **Chromium, Firefox, WebKit, and Mobile Chrome**.

### Test Suites

| File | Description |
|------|-------------|
| `e2e/app.spec.ts` | Core navigation, visualizer, search, theme, language |
| `e2e/a11y.spec.ts` | Accessibility audits per page |

### Running E2E

```bash
# Install browsers (first time)
npx playwright install

# Run all tests
npx playwright test

# Run specific suite
npx playwright test e2e/app.spec.ts

# Interactive UI mode
npx playwright test --ui

# Show report
npx playwright show-report
```

---

## QA Validation Scripts

### `scripts/master-qa-validation.cjs`

Validates:
- ✅ 42 data structures registered
- ✅ Theory content for each DS
- ✅ Code implementations in 9 languages
- ✅ External resources curated
- ✅ TypeScript compiles

```bash
node scripts/master-qa-validation.cjs
```

### `scripts/release-candidate-report.cjs`

Generates the full release report:
- Bundle size analysis
- Feature completeness percentage
- Content coverage by category
- Open issues

```bash
node scripts/release-candidate-report.cjs
```

---

## CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push and pull request:

1. Install dependencies
2. TypeScript compilation
3. ESLint
4. Vitest
5. Playwright E2E (Chromium)
6. QA validation
7. Bundle analysis

The pipeline **fails** if:
- TypeScript errors exist
- Any test fails
- QA validation score < 100%
