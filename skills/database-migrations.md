# Database Migration Safety Rules

## Core Principles

1. **Migrations are always additive.** Add columns, add tables, add indexes. Never drop or rename in a single step.
2. **Migrations are immutable once merged.** Never edit a migration file that has been merged to `main`. Create a new migration instead.
3. **Migrations are small and focused.** One concern per migration. Do not combine schema changes with data migrations.
4. **Migrations always have a rollback strategy.** Before writing a migration, know how you would undo it.

## Safe Operations (Always Allowed)

- Adding a new table.
- Adding a nullable column to an existing table.
- Adding a column with a default value.
- Adding an index.
- Adding a new enum value (append only -- never reorder or remove).

## Dangerous Operations (Require Migration Plan)

### Renaming a Column

Never rename directly. Use a three-step migration plan:

```
Migration 1: Add the new column (nullable or with default)
Migration 2: Backfill data from old column to new column (script in scripts/)
Migration 3: Drop the old column (only after all code references are updated)
```

Each step is a separate PR. Step 3 only happens after Step 2 is deployed and verified.

### Dropping a Column

```
Migration 1: Remove all code references to the column (deploy this first)
Migration 2: Drop the column (only after the code change is live and stable)
```

### Changing a Column Type

```
Migration 1: Add a new column with the desired type
Migration 2: Backfill and convert data
Migration 3: Update code to use the new column
Migration 4: Drop the old column
```

### Removing an Enum Value

This is exceptionally dangerous. Existing rows may reference the value.

```
Migration 1: Update all rows using the old value to a replacement value
Migration 2: Remove the enum value from the schema
```

Both steps require careful testing against production-like data.

## Migration Workflow

### Creating a Migration

```bash
# 1. Edit prisma/schema.prisma
# 2. Generate and name the migration
pnpm db:migrate
# Prisma will prompt for a name. Use a descriptive name:
#   add-preview-type-column
#   create-analytics-table
#   add-index-on-prompt-status
```

### Testing a Migration

```bash
# Reset the database and re-run all migrations + seed
pnpm db:reset

# Verify the schema matches expectations
pnpm db:studio
```

### Before Merging

- [ ] Migration is additive (or follows the multi-step plan for destructive changes).
- [ ] Migration has been tested locally with `pnpm db:reset`.
- [ ] Seed data still works after the migration.
- [ ] No existing tests are broken.
- [ ] New columns are nullable or have defaults (to support rolling deploys where migration runs before new code).
- [ ] Migration name is descriptive.
- [ ] If a data migration is needed, a script exists in `scripts/` and is referenced in the PR.

## Prisma-Specific Notes

### Schema Conventions

- Use `@map("snake_case_table_name")` for table names.
- Use `@id @default(cuid())` for primary keys.
- Use `@updatedAt` for timestamp tracking.
- Define `@@index` for columns used in WHERE clauses and foreign keys.
- Use `@db.Text` for long string fields (descriptions, content).
- Use `Json` type for flexible metadata fields.

### Enum Handling

Prisma enums map to PostgreSQL enums. When adding a new value:

```prisma
enum PromptStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  NEEDS_CHANGES
  PUBLISHED
  ARCHIVED
  // New values go at the end
  SUSPENDED  // <-- example new value
}
```

Never reorder existing enum values. Always append.

### Seed Data

The seed file at `prisma/seed.ts` should be updated whenever:
- A new table is added (add representative seed data).
- A required column is added (update existing seed records).
- An enum value changes meaning.

Seed data should be idempotent -- running `pnpm db:seed` twice should not fail or create duplicates.

## Rollback Strategies

| Change Type | Rollback |
|---|---|
| New table | Drop the table |
| New column (nullable) | Drop the column |
| New column (with default) | Drop the column |
| New index | Drop the index |
| Data backfill | Reverse the data transformation (requires script) |

For complex rollbacks, prepare a rollback migration file in advance but do not apply it unless needed.

## Production Migration Checklist

- [ ] Migration has been tested in staging environment.
- [ ] Backup has been taken before migration runs.
- [ ] Migration runs within acceptable time (under 30 seconds for schema changes).
- [ ] Application code is backward-compatible with both old and new schema.
- [ ] Monitoring is in place to detect issues post-migration.
- [ ] Rollback plan is documented and tested.
