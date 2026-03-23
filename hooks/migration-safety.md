# Migration Safety Checklist

Run through this checklist before creating, applying, or merging any database migration. Every question must be answered affirmatively or explicitly addressed.

## Before Writing the Migration

- [ ] **Is the change necessary?** Can the goal be achieved without a schema change?
- [ ] **Have you read `skills/database-migrations.md`?** The migration rules and multi-step patterns are defined there.
- [ ] **Have you checked `memory/decisions-log.md`?** There may be prior decisions about the schema area you are modifying.

## Migration Content

### Additive Check

- [ ] **Is the migration additive?**
  - Adding a new table: Safe.
  - Adding a nullable column: Safe.
  - Adding a column with a default value: Safe.
  - Adding an index: Safe.
  - Adding a new enum value (appended, not inserted): Safe.
  - Renaming a column: NOT additive. Requires multi-step plan.
  - Dropping a column: NOT additive. Requires multi-step plan.
  - Changing a column type: NOT additive. Requires multi-step plan.
  - Removing an enum value: NOT additive. Requires data migration first.

### If Not Additive

- [ ] Has a multi-step migration plan been documented?
- [ ] Is this the correct step in the multi-step plan?
- [ ] Has the previous step been deployed and verified?
- [ ] Has a human explicitly reviewed and approved this destructive change?

## Rollback Strategy

- [ ] **Does this migration have a rollback strategy?**
  - For additive changes: rollback = drop the added element.
  - For data migrations: rollback = reverse data transformation (documented in a script).
  - For destructive changes: rollback may require restoring from backup.
- [ ] **Is the rollback strategy documented** in the PR description?

## Testing

- [ ] **Has the migration been tested locally?**
  - Run `pnpm db:reset` (drops, recreates, migrates, seeds).
  - Verify no errors during migration.
  - Verify seed data is compatible.
  - Open Prisma Studio (`pnpm db:studio`) and inspect the affected tables.

- [ ] **Do existing tests still pass?**
  - Run `pnpm test` after applying the migration.
  - If tests fail, determine whether the test or the migration needs fixing.

## Data Integrity

- [ ] **Does this migration affect existing data?**
  - If adding a NOT NULL column without a default: existing rows will fail. This is a blocker.
  - If adding a column with a default: existing rows get the default. Verify the default is correct.
  - If modifying a column type: existing data must be convertible.

- [ ] **Are foreign key relationships maintained?**
  - New foreign keys must reference existing valid data.
  - Cascade rules (onDelete, onUpdate) are intentional and reviewed.

## Prisma-Specific Checks

- [ ] `@map()` directive used for the table name (snake_case convention).
- [ ] `@@index()` directives added for columns used in WHERE clauses and JOINs.
- [ ] `@default()` values are appropriate.
- [ ] `@db.Text` used for long string fields.
- [ ] Enum values are appended (not reordered).

## Deployment Considerations

- [ ] **Is the migration fast?** Schema-only changes are typically instant. Data migrations may lock tables.
- [ ] **Is the code backward-compatible with the old schema?** During a rolling deploy, old code may run against the new schema briefly.
- [ ] **Is the code forward-compatible with the new schema?** New code must work if the migration has not yet run (e.g., new column is nullable or has a default).

## Sign-Off

- [ ] Migration reviewed by at least one team member.
- [ ] PR description includes: what changed, why, rollback plan, and test results.
