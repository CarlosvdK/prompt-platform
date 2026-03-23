# Definition of Done

A task is not done until every item on this list is satisfied. Use this as the final gate before marking work as complete.

## Code

- [ ] **Code compiles without errors.** `pnpm build` succeeds.
- [ ] **No TypeScript strict mode violations.** No `@ts-ignore`, no `any` without documented justification.
- [ ] **Linting clean.** `pnpm lint` reports zero errors.
- [ ] **Formatting clean.** `pnpm format:check` reports zero issues.

## Tests

- [ ] **Tests written for new functionality.**
  - Service functions: unit tests with Vitest.
  - Zod schemas: validation tests for valid and invalid inputs.
  - API routes: at least happy path and one error case.
  - Workflow transitions: valid and invalid state changes.
- [ ] **All tests pass.** `pnpm test` reports zero failures.
- [ ] **No test regressions.** Previously passing tests still pass.

## PR and Documentation

- [ ] **PR description includes context.** Explains what changed, why it changed, and how it was tested.
- [ ] **PR description includes test plan.** Lists manual and automated verification steps.
- [ ] **No secrets in code.** No API keys, tokens, passwords, or credentials committed.

## Security

- [ ] **No security regressions.** Auth guards intact, authorization checks enforced, published-only filter on public queries.
- [ ] **Input validation in place.** New API endpoints validate input with Zod schemas.
- [ ] **Audit trail maintained.** State-changing admin actions create AuditLog entries.

## Performance

- [ ] **No performance regressions.** No N+1 queries, no unbounded data fetches, no missing pagination.
- [ ] **Database queries use indexes.** New WHERE clause columns have `@@index` directives in the Prisma schema.

## Documentation and Memory

- [ ] **Documentation updated if needed.** Relevant docs/ files reflect any new patterns or behaviors.
- [ ] **Decisions log updated if applicable.** Any architecture decision made during the task is recorded in `memory/decisions-log.md`.
- [ ] **Open questions updated if applicable.** New questions added, resolved questions moved to the Resolved section.
- [ ] **Roadmap updated if applicable.** Completed items checked off in `memory/roadmap.md`.

## Database (If Applicable)

- [ ] **Migration is safe.** `hooks/migration-safety.md` checklist completed.
- [ ] **Seed data updated.** New tables or required columns reflected in `prisma/seed.ts`.
- [ ] **`pnpm db:reset` succeeds.** Full drop, migrate, seed cycle works.

## Approval Workflow (If Applicable)

- [ ] **No prompt content exposed without approval.** PUBLISHED status gate enforced in code.
- [ ] **Workflow transitions validated.** Invalid transitions throw errors.
- [ ] **Audit entries created.** All review actions and status changes logged.
