# Content Guide — Adding Theory for a Data Structure

This guide explains how to add or improve educational content for any data structure in the platform.

---

## Theory Architecture

Theory content is stored across two layers:

| File | Purpose |
|------|---------|
| `src/constants/theory.ts` | Base theory: definition, complexity, use cases |
| `src/constants/theoryExpanded*.ts` | Extended chapters: memory, invariants, glossary, FAQ |
| `src/constants/dedicatedResources.ts` | Curated external resources |

---

## Step 1 — Base Theory (`theory.ts`)

```ts
export const THEORY: Record<string, TheoryContent> = {
  'my-ds': {
    definition: 'A concise 1-3 sentence definition.',
    complexity: {
      time: {
        access: 'O(1)',
        search: 'O(n)',
        insert: 'O(1) amortized',
        delete: 'O(n)',
      },
      space: 'O(n)',
    },
    useCases: ['Use case 1', 'Use case 2'],
    advantages: ['Advantage 1', 'Advantage 2'],
    disadvantages: ['Disadvantage 1', 'Disadvantage 2'],
  }
}
```

---

## Step 2 — Extended Theory (`theoryExpanded*.ts`)

Each DS should have these chapters:

```ts
export const THEORY_EXPANDED: Record<string, TheoryExpandedContent> = {
  'my-ds': {
    memoryLayout: {
      description: 'How the structure is laid out in RAM.',
      diagram: `
        ┌────────┬────────┬────────┐
        │  head  │  data  │  next  │
        └────────┴────────┴────────┘`,
    },
    invariants: [
      'Invariant 1: what must always be true',
      'Invariant 2: ordering constraint',
    ],
    glossary: [
      { term: 'Node', definition: 'A unit that stores a value and pointers.' },
    ],
    faq: [
      {
        question: 'When should I use this?',
        answer: 'Use it when you need...',
      },
    ],
    summary: 'A 2-3 sentence wrap-up of the key takeaways.',
    version: '1.0.0',
    lastUpdated: '2024-01-01',
  }
}
```

---

## Step 3 — Resources (`dedicatedResources.ts`)

Add 2-5 curated resources per category:

```ts
export const DEDICATED_RESOURCES: Record<string, ResourceEntry> = {
  'my-ds': {
    videos: [
      {
        title: 'My DS Explained',
        url: 'https://youtube.com/...',
        author: 'Channel Name',
        difficulty: 'beginner',
        whyRecommended: 'Best visual explanation for beginners.',
        readTime: '15 min',
      },
    ],
    articles: [...],
    courses: [...],
    problems: [...],
  }
}
```

---

## Content Quality Standards

Every theory entry must satisfy:

- [ ] Definition is 1-3 sentences, accurate, jargon-free for beginners
- [ ] All complexity values are provided (best, average, worst, space)
- [ ] At least 3 use cases listed
- [ ] At least 2 advantages and 2 disadvantages
- [ ] Memory layout diagram for non-trivial structures
- [ ] At least 3 glossary terms
- [ ] At least 2 FAQ questions
- [ ] At least 1 resource per category (video, article, problem)
- [ ] No placeholder text or TODOs

Run validation after adding content:

```bash
node scripts/master-qa-validation.cjs
```
