# Coding Standards

## TypeScript

- **Strict mode is mandatory.** The `tsconfig.json` has `"strict": true`. Never disable it or add `@ts-ignore` without a justifying comment.
- **No `any` type.** Use `unknown` when the type is genuinely unknown, then narrow with type guards or Zod parsing. If you must use `any`, add a `// REASON: ...` comment explaining why.
- **Exhaustive switch statements.** When switching on an enum or union type, always include a `default` case that calls a `never` assertion helper:
  ```typescript
  function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`)
  }
  ```
- **Prefer `const` over `let`.** Use `let` only when reassignment is necessary. Never use `var`.
- **Use template literals** over string concatenation.

## Architecture Pattern

### Functional Services (No Classes)

Services are plain exported functions, not class instances. This keeps them simple, testable, and tree-shakeable.

```typescript
// Good -- functional service
export async function getPromptById(id: string): Promise<Prompt | null> {
  return db.prompt.findUnique({ where: { id } })
}

// Bad -- class-based service
class PromptService {
  async getById(id: string) { ... }
}
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| Route handlers | `src/app/api/` | Parse request, call service, return response |
| Services | `src/lib/services/` | Business logic, validation orchestration |
| Adapters | `src/lib/adapters/` | External API calls, storage, AI providers |
| Schemas | `src/lib/schemas/` | Zod validation schemas |
| Types | `src/types/` | Shared TypeScript type definitions |
| Components | `src/components/` | React UI components |
| Hooks | `src/lib/hooks/` | Custom React hooks |

### Validation at Boundaries

Use Zod schemas at every data entry point:

```typescript
// In route handler
const body = createPromptSchema.parse(await request.json())
const result = await createPrompt(body)
```

Services receive already-validated data and return typed results or throw typed errors.

### Typed Errors

```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Usage
throw new AppError('PROMPT_NOT_FOUND', 'Prompt does not exist', 404)
throw new AppError('VALIDATION_FAILED', 'Invalid input', 400, { fields: errors })
```

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Variables and functions | camelCase | `getPromptById`, `isPublished` |
| Types and interfaces | PascalCase | `PromptStatus`, `ReviewDecision` |
| React components | PascalCase | `PromptCard`, `ReviewQueue` |
| Files (utilities, services) | kebab-case | `prompt-service.ts`, `ad-adapter.ts` |
| Files (React components) | kebab-case | `prompt-card.tsx`, `review-queue.tsx` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_PAGE_SIZE` |
| Enum members | UPPER_SNAKE_CASE | `PENDING_REVIEW`, `APPROVED` |
| Database tables | PascalCase (Prisma) | `Prompt`, `ReviewDecision` |
| API route segments | kebab-case | `/api/prompts/[id]/review-decision` |
| CSS classes | Tailwind utilities | No custom class names unless via design tokens |

## Import Order

Maintain this order with blank lines between groups:

```typescript
// 1. Node built-ins
import { readFile } from 'node:fs/promises'

// 2. External packages
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 3. Internal path aliases
import { getPromptById } from '@/lib/services/prompt-service'
import { PromptCard } from '@/components/prompt-card'

// 4. Relative imports
import { formatDate } from './utils'
```

## Path Aliases

Always use `@/` for imports that cross directory boundaries. Use relative imports only within the same feature directory.

```typescript
// Good
import { db } from '@/lib/db'

// Bad (crossing boundary with relative path)
import { db } from '../../../lib/db'
```

## File Organization

- One primary export per file. A file named `prompt-service.ts` should primarily export prompt-related service functions.
- Co-locate tests: `prompt-service.ts` and `prompt-service.test.ts` live in the same directory.
- Co-locate schemas with their domain: prompt-related schemas in `src/lib/schemas/prompt-schemas.ts`.

## Code Formatting

Enforced by Prettier (see `CONTRIBUTING.md`):
- No semicolons.
- Single quotes.
- Trailing commas everywhere.
- 100-character print width.
