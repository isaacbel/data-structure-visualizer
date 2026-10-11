# Accessibility Guide — WCAG 2.2 AA Compliance

## Overview

The DSA Visualizer targets **WCAG 2.2 Level AA** compliance. This document describes our implementation standards, known issues, and how to maintain accessibility as a contributor.

---

## Keyboard Navigation

Every interactive element is keyboard-reachable and operable.

| Shortcut | Action |
|----------|--------|
| `Tab` | Move focus forward |
| `Shift+Tab` | Move focus backward |
| `Enter` / `Space` | Activate buttons |
| `/` or `Ctrl+K` | Open search modal |
| `?` | Open keyboard shortcuts modal |
| `↑` / `↓` | Navigate search results |
| `Esc` | Close modals |
| `P` | Play/Pause animation |
| `←` / `→` | Step backward/forward |
| `R` | Restart animation |

---

## Color Contrast

All text meets **4.5:1 contrast ratio** (AA) against backgrounds.

| Element | Foreground | Background | Ratio |
|---------|------------|------------|-------|
| Body text | `slate-200` (#e2e8f0) | `slate-900` (#0f172a) | ≥ 7:1 |
| Muted text | `slate-400` (#94a3b8) | `slate-900` (#0f172a) | ≥ 4.5:1 |
| Primary CTA | `white` | `violet-600` (#7c3aed) | ≥ 4.5:1 |

---

## ARIA Labels

All interactive elements have descriptive `aria-label` or `aria-labelledby` attributes.

```tsx
<button aria-label="Search data structures (Ctrl+K)">
<button aria-label="Open keyboard shortcuts">
<button aria-label="Switch language to FR">
<button aria-label="Toggle dark/light theme">
```

---

## Focus Management

- **Modals**: Focus is trapped inside open modals. On close, focus returns to the trigger element.
- **Search modal**: Auto-focuses the input field on open.
- **Animations**: Animated SVG nodes are not interactive and are `aria-hidden="true"`.

---

## Screen Reader Support

- Animated step explanations are rendered as `role="status"` live regions so screen readers announce them without user focus.
- Complexity tables use `<th scope="col">` and `<th scope="row">` for proper navigation.
- Code blocks use `<pre role="region" aria-label="Code implementation">`.

---

## Motion & Animations

Users who prefer reduced motion get simplified animations via:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-* { animation: none !important; transition: none !important; }
}
```

The animation speed control in the UI also lets users set speed to maximum for near-instant transitions.

---

## RTL Support

When Arabic is selected:
- `document.dir = 'rtl'` is applied to the root
- Flex layouts reverse automatically via CSS logical properties
- Icons that convey direction (arrow, chevron) may need mirroring — tracked in issue backlog

---

## Testing Accessibility

```bash
# Manual audit with axe DevTools browser extension
# Target: 0 critical violations, 0 serious violations

# Automated (in CI via Playwright + axe-core)
npx playwright test --grep @a11y
```

---

## Known Issues & Roadmap

| Issue | Status | Priority |
|-------|--------|----------|
| Visualizer SVG nodes not announced during traversal | In Progress | High |
| Skip-to-content link missing on mobile | Planned | Medium |
| Some graphs lack descriptive alt text for link arrows | Planned | Medium |
| RTL icon mirroring | Planned | Low |
