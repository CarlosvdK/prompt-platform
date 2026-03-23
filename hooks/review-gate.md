# Review Gate Checklist

Run through this checklist before submitting a PR or marking a task as complete. Every item must pass.

## Code Correctness

- [ ] **All tests pass.** Run `pnpm test` and confirm zero failures.
- [ ] **Linting passes.** Run `pnpm lint` and confirm zero errors.
- [ ] **No TypeScript errors.** Run `pnpm build` and confirm successful compilation.
- [ ] **Formatting is correct.** Run `pnpm format:check` and confirm no issues.

## Security

- [ ] **No unapproved prompts exposed.** All public-facing queries filter by `status: 'PUBLISHED'`. Grep for prompt queries in new/modified files and verify the status filter.
- [ ] **No credentials in code.** Grep for patterns like API keys, tokens, passwords, or secrets. All sensitive values must come from environment variables.
- [ ] **Auth guards in place.** Every new admin or reviewer route checks authentication and authorization.
- [ ] **Rate limiting considered.** If this change adds a new public API endpoint, consider whether rate limiting is needed.

## Data Safety

- [ ] **Audit logging in place.** If this change introduces new state-changing actions (status transitions, role changes, content modifications), verify that AuditLog entries are created.
- [ ] **Migration safety verified.** If a database migration is included, the `hooks/migration-safety.md` checklist has been completed.

## Documentation

- [ ] **`memory/decisions-log.md` updated** if an architecture decision was made.
- [ ] **`memory/open-questions.md` updated** if a question was resolved or a new question arose.
- [ ] **Environment variables documented** in `.env.example` if any were added.
- [ ] **`memory/roadmap.md` updated** if a roadmap item was completed.

## PR Quality

- [ ] **PR description includes context.** What was changed and why.
- [ ] **PR description includes test plan.** How the change was verified.
- [ ] **Changes are focused.** One concern per PR. If the PR grew beyond its original scope, consider splitting.
- [ ] **Commit messages follow Conventional Commits format** (see `CONTRIBUTING.md`).

## Final Verification

- [ ] **Manual smoke test.** If the change affects UI, run `pnpm dev` and verify the affected pages work correctly.
- [ ] **No regressions.** Test adjacent functionality that could be affected by the change.
- [ ] **Clean git status.** No unintended files staged or modified.
