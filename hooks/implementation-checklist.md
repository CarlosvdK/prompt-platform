# Implementation Checklist

Use this checklist during active implementation to ensure code quality and consistency. Check items as you go.

## Code Quality

- [ ] Following `skills/coding-standards.md`:
  - TypeScript strict mode, no `any` without justification.
  - Functional services (no classes).
  - camelCase for variables/functions, PascalCase for types/components, kebab-case for files.
  - Import order: node built-ins, external packages, internal aliases, relative.
  - Path aliases (`@/`) for cross-boundary imports.

- [ ] Using Zod for input validation:
  - Every API route parses request body/params with a Zod schema.
  - Schemas live in `src/lib/schemas/`.
  - Schemas define minimum and maximum lengths, valid ranges, and enum constraints.

- [ ] Business logic is in services:
  - Route handlers are thin (parse, call service, respond).
  - Components do not contain business logic.
  - Services are framework-agnostic (no Next.js or React imports).

- [ ] Typed errors for failure cases:
  - Using `AppError` with code, message, and status code.
  - No raw `throw new Error('something')` without structure.
  - Error responses follow the format `{ error: { code, message, details? } }`.

## Security

- [ ] No unapproved prompts leak to public routes:
  - All public-facing prompt queries filter by `status: 'PUBLISHED'`.
  - The prompt detail page returns 404 for non-published prompts (not 403, to avoid information leakage).
  - Search results only include published prompts.

- [ ] Auth and authorization enforced:
  - Protected routes check session existence.
  - Role-based routes check user role.
  - API routes return 401 for unauthenticated and 403 for unauthorized.

- [ ] Input sanitization:
  - User-provided strings are validated for length and format via Zod.
  - SQL injection is prevented by Prisma's parameterized queries.
  - XSS is prevented by React's default escaping (do not use `dangerouslySetInnerHTML` without sanitization).

## Data Integrity

- [ ] Audit logging in place for state-changing actions:
  - Review decisions create AuditLog entries.
  - Publish/unpublish actions create AuditLog entries.
  - User role changes create AuditLog entries.

- [ ] Workflow state transitions are validated:
  - The service layer enforces valid transitions (see `memory/domain-glossary.md`).
  - Invalid transitions throw a typed error.
  - Status changes update all relevant timestamps (e.g., `publishedAt` on publish).

## Testing

- [ ] Tests written for new service functions:
  - Happy path tested.
  - At least one error case tested.
  - Edge cases considered.

- [ ] Tests written for new Zod schemas:
  - Valid input passes.
  - Required field omission fails.
  - Invalid types fail.

- [ ] Existing tests still pass:
  - Run `pnpm test` before marking the task as done.

## Database

- [ ] If schema was modified:
  - Migration is additive (see `skills/database-migrations.md`).
  - Migration has been tested with `pnpm db:reset`.
  - Seed data updated if needed.
  - New columns are nullable or have defaults.

## Code Review Readiness

- [ ] No `console.log` left in production code (use a proper logger if logging is needed).
- [ ] No commented-out code (delete it; git preserves history).
- [ ] No TODO comments without a linked issue or open question reference.
- [ ] No hardcoded values that should be environment variables or constants.
