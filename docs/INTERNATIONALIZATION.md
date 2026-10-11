# Internationalization (i18n) Guide

## Overview

The DSA Visualizer supports **English (en)** and **French (fr)** with full localization across all UI elements, learning paths, data structure titles, and theory tabs.

---

## How It Works

### Language Type

```ts
// src/types/index.ts
export type Language = 'en' | 'fr'
```

### Translation Keys

All UI strings are defined in `src/constants/translations.ts`.

```ts
export const translations = {
  en: { title: 'Data Structure Visualizer', ... },
  fr: { title: 'Visualiseur de Structures de Données', ... },
} as const
```

---

## Language Switcher

The header toggles between **EN** and **FR** via the header language button.

```tsx
<button
  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10"
>
  {language === 'en' ? 'FR' : 'EN'}
</button>
```

---

## Adding a New Translation Key

1. Open `src/constants/translations.ts`
2. Add the new key to both `en` and `fr` blocks:

   ```ts
   en: { myNewKey: 'Hello' },
   fr: { myNewKey: 'Bonjour' }
   ```

3. Access the string using `useTranslation`:

   ```tsx
   const t = useTranslation(language)
   return <span>{t.myNewKey}</span>
   ```

---

## Adding a New Language

To add another language (e.g. Spanish `es`):

1. Update `Language` type in `src/types/index.ts`:

   ```ts
   export type Language = 'en' | 'fr' | 'es'
   ```

2. Add all translation keys to `src/constants/translations.ts`:

   ```ts
   es: {
     title: 'Visualizador de Estructuras de Datos',
     // ... all 81 keys
   }
   ```

3. Update the language switcher toggle in `src/components/layout/AppLayout.tsx`.
