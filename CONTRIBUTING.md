# Contributing to Prompt Platform

## Local Setup

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker and Docker Compose
- Git

### First-Time Setup

```bash
# Clone the repo
git clone <repo-url> && cd prompt-platform

# Run the automated setup script
bash scripts/dev-setup.sh
```

Or manually:

```bash
# Copy environment file
cp .env.example .env.local

# Start PostgreSQL
docker compose up -d

# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# Seed development data
pnpm db:seed

# Start the dev server
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Branch Naming

Use the following prefixes:

| Prefix       | Use case                          |
| ------------ | --------------------------------- |
| `feat/`      | New feature                       |
| `fix/`       | Bug fix                           |
| `refactor/`  | Code restructuring (no new behavior) |
| `chore/`     | Tooling, deps, CI changes         |
| `docs/`      | Documentation only                |
| `test/`      | Adding or updating tests          |

Examples:
- `feat/prompt-approval-workflow`
- `fix/auth-redirect-loop`
- `chore/upgrade-next-16`

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short summary>

<optional body>

<optional footer>
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`, `ci`

Examples:
```
feat(prompts): add version history to prompt detail page
fix(auth): resolve session expiry redirect loop
chore(deps): upgrade prisma to 7.5
```

Keep the summary line under 72 characters. Use the body for context on *why*, not *what*.

## Pull Request Process

1. **Create a feature branch** from `main`.
2. **Make your changes** in small, focused commits.
3. **Ensure all checks pass locally:**
   ```bash
   pnpm lint
   pnpm format:check
   pnpm test
   pnpm build
   ```
4. **Push your branch** and open a PR against `main`.
5. **Fill in the PR template** with a description, screenshots (if UI), and test plan.
6. **Request review** from at least one team member.
7. **Address review feedback** with new commits (do not force-push during review).
8. **Squash and merge** once approved.

## Testing Requirements

### Unit Tests (Vitest)
- All service layer functions must have tests.
- Zod schemas should have tests for both valid and invalid inputs.
- Test files live next to the code they test: `foo.ts` -> `foo.test.ts`.

### E2E Tests (Playwright)
- Critical user flows (login, create prompt, approval workflow) must have E2E coverage.
- E2E tests live in the `tests/` directory.
- Run locally with `pnpm test:e2e`.

### When to Write Tests
- New service functions: always.
- Bug fixes: add a regression test.
- New API routes: at minimum, test the happy path and one error case.
- UI components: test interactive behavior, not static rendering.

## Code Style

This project uses **ESLint** and **Prettier** for code quality and formatting.

```bash
# Auto-fix lint issues
pnpm lint --fix

# Format all files
pnpm format

# Check formatting without modifying files
pnpm format:check
```

Key style rules:
- No semicolons.
- Single quotes.
- Trailing commas everywhere.
- 100-character print width.
- Use `@/` path aliases instead of relative imports when crossing directory boundaries.

## Database Migration Guidelines

### Creating Migrations
```bash
# Edit prisma/schema.prisma, then:
pnpm db:migrate
# Prisma will prompt you to name the migration.
```

### Rules
1. **Migrations must be additive.** Add columns, tables, or indexes. Never drop or rename without a plan.
2. **New columns must be nullable or have defaults.** This keeps deploys safe when the migration runs before the new code is live.
3. **Large data migrations** should be separate from schema migrations. Create a script in `scripts/` and reference it in the PR.
4. **Test migrations** by running `pnpm db:reset` locally before pushing.
5. **Never edit a migration that has been merged to main.** Create a new migration instead.

## Review Checklist

Before requesting review, confirm:

- [ ] Code compiles without errors (`pnpm build`).
- [ ] Linter passes (`pnpm lint`).
- [ ] Formatter passes (`pnpm format:check`).
- [ ] Unit tests pass (`pnpm test`).
- [ ] New code has appropriate test coverage.
- [ ] Database migrations are additive and safe.
- [ ] No secrets or credentials in the code.
- [ ] Environment variables documented in `.env.example`.
- [ ] TypeScript strict mode: no `any` types without justification.
- [ ] Zod schemas exist for all new API inputs.
