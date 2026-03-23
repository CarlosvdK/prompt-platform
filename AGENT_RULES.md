# Agent Rules

These rules apply to all AI agents (Claude, Copilot, Cursor, or any other) working on this codebase.

## Workflow Rules

### 1. Planning First, Always
Before writing code, produce a brief plan that includes:
- What you are changing and why.
- Which files will be created, modified, or deleted.
- Any risks or trade-offs.

Do not skip this step, even for small tasks.

### 2. Review Memory and Skills Before Coding
Read the `/memory` directory (especially `decisions-log.md`) and `/skills` directory before starting work. These contain project history, architectural decisions, and reusable patterns. Ignoring them leads to repeated mistakes and inconsistent code.

### 3. Update the Decisions Log After Major Changes
When you introduce a new pattern, add a dependency, change the database schema, or make any architectural decision, add an entry to `memory/decisions-log.md` with:
- Date
- Decision summary
- Rationale
- Alternatives considered

### 4. Never Auto-Publish Generated Prompts
All prompt content must pass through the approval workflow. No agent may mark a prompt as `PUBLISHED` without explicit human approval. This is a non-negotiable safety boundary.

### 5. Never Bypass the Approval Workflow
The platform has a defined lifecycle for prompts: `DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED`. Agents must not skip states or directly modify prompt status outside of the designated service methods.

### 6. Keep Migrations Safe
- Migrations must be **additive**: add columns, add tables, add indexes.
- Never drop or rename columns without a migration plan that includes backfill logic and explicit human review.
- Always test migrations against a copy of production-like data before merging.

### 7. Document Assumptions
If a requirement is ambiguous, do not guess silently. Write your assumption as a code comment (prefixed `// ASSUMPTION:`) or in the decisions log and flag it for human review.

### 8. Prefer Small Changes
Each PR should address a single concern. If you need to refactor something to enable a feature, do the refactor in a separate PR first.

## Code Rules

### 9. Follow the Service/Adapter Pattern
```
src/lib/services/    # Business logic (pure, testable)
src/lib/adapters/    # External integrations (API clients, storage, AI providers)
```
- Route handlers call services. Services call adapters.
- Components call hooks. Hooks call services or API routes.
- Never put business logic directly in route handlers or React components.

### 10. Use Zod for All Validation
Every data boundary must have a Zod schema:
- API route request bodies and query params.
- Form submissions.
- Data from external services.
- Environment variable parsing.

Schemas live in `src/lib/schemas/`.

### 11. Keep Business Logic in Services
Services are the single source of truth for business rules. They:
- Accept validated input (already parsed by Zod).
- Return typed results or throw typed errors.
- Are framework-agnostic (no Next.js or React imports).

### 12. Test Critical Paths
At minimum, write tests for:
- Service layer business logic.
- Zod schemas (valid and invalid cases).
- API routes that modify data.
- The prompt approval workflow.

### 13. Use Typed Errors
Do not throw raw strings or generic `Error` objects. Define error classes or use a result type pattern:
```typescript
// Preferred
throw new AppError('PROMPT_NOT_FOUND', 'Prompt does not exist', 404)

// Also acceptable
return { success: false, error: { code: 'VALIDATION_FAILED', details } }
```

### 14. Naming Conventions
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components.
- Functions: `camelCase`.
- Types/Interfaces: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Database tables: `PascalCase` (Prisma convention).
- API routes: `kebab-case` URL segments.

### 15. Import Order
1. Node built-ins (`node:fs`, `node:path`)
2. External packages (`next`, `react`, `zod`)
3. Internal aliases (`@/lib/...`, `@/components/...`)
4. Relative imports (`./`, `../`)

Blank line between each group.
