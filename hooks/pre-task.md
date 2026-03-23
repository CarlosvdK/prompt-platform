# Pre-Task Checklist

Run through this checklist before starting any development task. Do not skip steps even for small changes.

## 1. Read Project Context

- [ ] Read `CLAUDE.md` for hard rules and best practices.
- [ ] Read `AGENT_RULES.md` for code and workflow rules.
- [ ] Scan `memory/decisions-log.md` for decisions relevant to this task.
- [ ] Scan `memory/open-questions.md` for related unresolved items. If this task resolves one, note it.
- [ ] Check `memory/roadmap.md` to understand where this task fits in the project plan.

## 2. Understand the Task

- [ ] What is the goal? Write a one-sentence summary.
- [ ] What domain does this touch? (catalog, preview, unlock, review, agent, admin)
- [ ] What is the acceptance criteria? How will you know the task is done?

## 3. Identify Affected Files

- [ ] Which existing files will be modified?
- [ ] Which new files will be created?
- [ ] Will any files be deleted or renamed?
- [ ] Are any shared types or schemas affected?

## 4. Check for Database Changes

- [ ] Does this task require a schema change in `prisma/schema.prisma`?
- [ ] If yes, is the migration additive? (See `skills/database-migrations.md`)
- [ ] Does the seed file need updating?
- [ ] Will existing data be affected?

## 5. Check for Environment Variable Changes

- [ ] Does this task introduce new environment variables?
- [ ] If yes, have they been added to `.env.example` with documentation?
- [ ] Are there different values needed for development vs production?

## 6. Check for Dependency Changes

- [ ] Does this task require new npm packages?
- [ ] If yes, is the package well-maintained and appropriately licensed?
- [ ] Is there an existing package in the project that serves the same purpose?

## 7. Identify Risks

- [ ] Could this change break existing functionality?
- [ ] Does this change affect the prompt approval workflow? (Extra caution required)
- [ ] Does this change affect authentication or authorization?
- [ ] Is there a security implication?

## Output

After completing this checklist, produce a brief plan (3-10 lines) that summarizes:
1. What you will change and why.
2. Files to create/modify.
3. Any risks or assumptions.

Get confirmation before proceeding with non-trivial changes.
