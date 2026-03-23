# Testing Checklists

## Testing Stack

| Tool | Purpose | Config |
|---|---|---|
| Vitest | Unit and integration tests | `vitest.config.ts` |
| Playwright | End-to-end browser tests | `playwright.config.ts` |
| Zod | Schema validation (tested via Vitest) | -- |

## What Must Be Tested

### Service Functions (Unit Tests with Vitest)

Every function in `src/lib/services/` must have corresponding tests. Services contain the business logic and are the highest-value test targets.

**Minimum test cases per service function:**
- Happy path with valid input.
- At least one invalid input case.
- Edge cases (empty arrays, null values, boundary values).
- Error conditions (not found, unauthorized, conflict).

```typescript
// src/lib/services/prompt-service.test.ts
import { describe, it, expect } from 'vitest'
import { getPromptById, createPrompt } from './prompt-service'

describe('getPromptById', () => {
  it('returns the prompt when it exists', async () => { ... })
  it('returns null when the prompt does not exist', async () => { ... })
  it('does not return unpublished prompts for public queries', async () => { ... })
})
```

### Zod Validation Schemas

Every schema in `src/lib/schemas/` must have tests for:
- A valid input that passes parsing.
- Each required field missing (should fail).
- Invalid field types (string where number expected, etc.).
- Boundary values (min/max length, ranges).
- Optional fields (present and absent).

```typescript
describe('createPromptSchema', () => {
  it('accepts valid input', () => { ... })
  it('rejects missing title', () => { ... })
  it('rejects title exceeding max length', () => { ... })
  it('accepts valid prompt type', () => { ... })
  it('rejects invalid prompt type', () => { ... })
})
```

### API Routes (Integration Tests)

Test route handlers with realistic request/response cycles:
- Correct status codes for success and error cases.
- Response body structure.
- Authentication and authorization enforcement.
- Request validation (malformed body, missing params).

### Workflow State Transitions

The prompt lifecycle (DRAFT -> PENDING_REVIEW -> APPROVED -> PUBLISHED, etc.) is a critical state machine. Test:
- Every valid transition.
- Every invalid transition (should throw/reject).
- Guard conditions (only REVIEWER/ADMIN can approve, etc.).
- Side effects of transitions (publishedAt set on publish, audit log created).

### Auth and Authorization Guards

- Unauthenticated access to protected routes returns 401.
- Authenticated access without required role returns 403.
- Role-based access: USER, REVIEWER, ADMIN permissions are enforced.
- Session expiry is handled gracefully.

### Critical User Flows (E2E with Playwright)

E2E tests live in `tests/` and cover full browser workflows:

| Flow | What to test |
|---|---|
| Browse and search | Page loads, categories render, search returns results |
| Prompt detail | Prompt info displays, preview shows, unlock button visible |
| Unlock flow | Ad displays, ad completion triggers unlock, content revealed |
| Admin login | Credentials work, redirects to dashboard |
| Review queue | Queue loads, can view prompt detail, can approve/reject |
| Prompt management | Create, edit, submit for review |

## Test Naming Conventions

Use descriptive, behavior-focused names:

```typescript
// Good
it('returns 404 when prompt does not exist')
it('transitions from PENDING_REVIEW to APPROVED when reviewer approves')
it('rejects unlock request when rate limit is exceeded')

// Bad
it('test 1')
it('works')
it('should handle error')
```

## Mock vs Real Database Strategy

### Unit Tests: Mock the Database

Use Vitest mocks to isolate service logic from Prisma:

```typescript
import { vi } from 'vitest'
import { db } from '@/lib/db'

vi.mock('@/lib/db', () => ({
  db: {
    prompt: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))
```

### Integration Tests: Use a Test Database

For API route tests, use a real PostgreSQL instance (via Docker) with a test-specific database. Run migrations before tests, truncate tables between tests.

```typescript
// test-setup.ts
beforeAll(async () => {
  await runMigrations()
})

beforeEach(async () => {
  await truncateAllTables()
})
```

### E2E Tests: Use Seeded Database

Playwright tests run against a fully seeded development database. The seed data provides predictable content for assertions.

## Coverage Expectations

| Area | Minimum Coverage |
|---|---|
| Services (`src/lib/services/`) | 80% line coverage |
| Schemas (`src/lib/schemas/`) | 100% (all valid/invalid cases) |
| Adapters (`src/lib/adapters/`) | 60% (focus on error handling) |
| API routes | 70% (all endpoints, happy + error paths) |
| Components | Not required (test interactive behavior only) |
| E2E flows | All critical paths listed above |

## Running Tests

```bash
# Run all unit/integration tests
pnpm test

# Run in watch mode during development
pnpm test:watch

# Run a specific test file
pnpm test src/lib/services/prompt-service.test.ts

# Run E2E tests (requires dev server running)
pnpm test:e2e

# Run E2E tests in headed mode for debugging
pnpm test:e2e -- --headed

# Run a specific E2E test file
pnpm test:e2e tests/unlock-flow.spec.ts
```

## Test File Location

- Unit and integration tests: co-located with source files (`foo.test.ts` next to `foo.ts`).
- E2E tests: in the `tests/` directory at project root.
- Test utilities and fixtures: in `tests/helpers/` or `tests/fixtures/`.
