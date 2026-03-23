# Planning Mode Checklist

Use this checklist when entering planning mode for a non-trivial task. Planning mode produces a detailed implementation plan before any code is written.

## 1. Inspect Existing Code

- [ ] Read the relevant service files in `src/lib/services/` to understand current business logic.
- [ ] Read the relevant schema files in `src/lib/schemas/` to understand current validation.
- [ ] Read the relevant adapter files in `src/lib/adapters/` if external services are involved.
- [ ] Read the relevant route handlers in `src/app/api/` to understand current API surface.
- [ ] Read the relevant components in `src/components/` to understand current UI patterns.
- [ ] Read the Prisma schema (`prisma/schema.prisma`) if database models are involved.

## 2. Inspect Relevant Documentation

- [ ] Review `skills/` files relevant to the task domain.
- [ ] Review `docs/` files for architecture and design context.
- [ ] Check `memory/decisions-log.md` for prior decisions that constrain this work.

## 3. Confirm Scope

- [ ] What is included in this task?
- [ ] What is explicitly out of scope?
- [ ] Are there any ambiguities that need clarification before proceeding?
- [ ] Document any assumptions (prefix with `// ASSUMPTION:` in code).

## 4. List All Changes

Create a detailed list of every file that will be created or modified:

```
CREATE: src/lib/services/new-service.ts
CREATE: src/lib/services/new-service.test.ts
CREATE: src/lib/schemas/new-schema.ts
MODIFY: src/app/api/existing-route/route.ts
MODIFY: prisma/schema.prisma
CREATE: prisma/migrations/YYYYMMDD_description/migration.sql
```

## 5. Identify Migration and Config Changes

- [ ] Does this require a database migration?
  - If yes, describe the migration (what tables/columns/indexes are added).
  - Confirm it is additive.
  - Plan the migration name.
- [ ] Does this require new environment variables?
  - If yes, list them with descriptions and example values.
- [ ] Does this require new npm packages?
  - If yes, list them with justification.

## 6. Define Rollback Strategy

- [ ] How would you undo this change if it causes problems?
- [ ] Is the rollback a simple revert, or does it require a data migration?
- [ ] Are there any one-way changes (data transformations that cannot be easily reversed)?

## 7. Check for Breaking Changes

- [ ] Does this change modify any existing API contracts (request/response shapes)?
- [ ] Does this change modify any existing database queries that other code depends on?
- [ ] Does this change modify any shared types that other files import?
- [ ] Does this change modify any component props that other components pass?

## 8. Estimate Test Coverage

- [ ] What service functions need unit tests?
- [ ] What schemas need validation tests?
- [ ] What API routes need integration tests?
- [ ] Are any E2E tests affected or needed?
- [ ] What edge cases should be tested?

## 9. Document Assumptions

List every assumption being made. Examples:
- "Assuming the Category model will not change before this ships."
- "Assuming rate limiting is not needed for this endpoint in MVP."
- "Assuming the reviewer has already read the prompt content when this action is called."

## Output

Produce a structured plan document:

```
## Task: [name]

### Goal
[One sentence]

### Changes
[File list with CREATE/MODIFY/DELETE]

### Migration
[Description or "None"]

### Environment Variables
[List or "None"]

### Dependencies
[List or "None"]

### Tests
[What will be tested]

### Assumptions
[List]

### Rollback
[Strategy]
```

Get confirmation on the plan before writing code.
