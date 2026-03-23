# UI Patterns

## Component Foundation

- **shadcn/ui** is the component library. Components are copied into the project (not imported from a package), which allows full customization.
- **Tailwind CSS 4** for all styling. No CSS modules, no styled-components, no inline style objects.
- **lucide-react** for icons. Do not add other icon libraries.
- **class-variance-authority (cva)** for component variants.
- **clsx + tailwind-merge** via a `cn()` utility for conditional class merging.

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Server vs Client Components

### Default: Server Components

All components are React Server Components (RSC) by default. This means:
- They render on the server, reducing client-side JavaScript.
- They can directly `await` database queries and service calls.
- They cannot use `useState`, `useEffect`, `onClick`, or other client-side APIs.

### When to Use Client Components

Add `'use client'` only when the component needs:
- Event handlers (`onClick`, `onChange`, `onSubmit`).
- Browser APIs (`window`, `localStorage`, `navigator`).
- React state (`useState`, `useReducer`).
- Effects (`useEffect`, `useLayoutEffect`).
- Third-party client libraries (e.g., ad SDK scripts).

### Composition Strategy

Keep client components small and leaf-level. Pass server-fetched data down as props rather than fetching inside client components.

```tsx
// page.tsx (server component)
export default async function PromptPage({ params }: { params: { id: string } }) {
  const prompt = await getPromptById(params.id)
  return <PromptDetail prompt={prompt} />  // server component for layout
}

// prompt-detail.tsx (server component)
function PromptDetail({ prompt }: { prompt: Prompt }) {
  return (
    <div>
      <h1>{prompt.title}</h1>
      <UnlockButton promptId={prompt.id} />  {/* client component, small */}
    </div>
  )
}
```

## Next.js App Router Patterns

### Loading States

Every route group that fetches data should have a `loading.tsx` that provides a skeleton or spinner:

```tsx
// app/(public)/prompts/loading.tsx
export default function Loading() {
  return <PromptGridSkeleton />
}
```

This is automatically wrapped in a `<Suspense>` boundary by Next.js.

### Error Boundaries

Every route group should have an `error.tsx` for graceful error handling:

```tsx
// app/(public)/prompts/error.tsx
'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Route Groups

- `(public)` -- unauthenticated pages: browse, search, prompt detail, unlock flow.
- `(admin)` -- authenticated pages: review queue, prompt management, agent runs, analytics.
- `(auth)` -- login, register, forgot password.

### Layouts

Each route group has its own `layout.tsx` that provides shared navigation, sidebar, or other chrome.

## Design Tokens

Define spacing, colors, and typography scales in `src/app/globals.css` using CSS custom properties. Reference them via Tailwind config or direct `var()` usage.

```css
:root {
  --color-primary: 220 90% 56%;
  --color-background: 0 0% 100%;
  --radius: 0.5rem;
  --spacing-page: 1.5rem;
}
```

## Responsive Design

- **Mobile-first.** Write base styles for mobile, then add `sm:`, `md:`, `lg:` breakpoints.
- **Standard breakpoints:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
- **No fixed widths.** Use `max-w-*` and `w-full` for containers.
- **Test at 320px minimum.** Content must be usable on narrow screens.

## Accessibility

- All interactive elements must be keyboard-accessible.
- Use semantic HTML elements (`button`, `nav`, `main`, `article`, `section`).
- Images require `alt` text. Decorative images use `alt=""`.
- Color contrast must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
- Form inputs must have associated labels.
- Use `aria-*` attributes when semantic HTML is insufficient.
- shadcn/ui components are accessible by default -- do not override their ARIA attributes without good reason.

## Common Component Patterns

### Cards

Use a consistent card pattern for prompts, categories, and other list items:

```tsx
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>{children}</CardContent>
  <CardFooter>{actions}</CardFooter>
</Card>
```

### Data Tables

For admin views (review queue, prompt list, audit logs), use a consistent table pattern with sorting, filtering, and pagination.

### Empty States

Every list/grid view must handle the empty state with a helpful message and, where appropriate, a call to action.

### Forms

Use controlled forms with React Hook Form + Zod resolver for client-side validation. Server-side validation via Zod schemas in route handlers is always required regardless.

## Spacing and Layout Conventions

- Page-level horizontal padding: `px-4 md:px-6 lg:px-8`.
- Max content width: `max-w-7xl mx-auto`.
- Section spacing: `space-y-8` or `gap-8`.
- Card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
