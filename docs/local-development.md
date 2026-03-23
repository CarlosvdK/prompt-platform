# Local Development Guide

## Prerequisites

- **Node.js 20+** -- [Download](https://nodejs.org/)
- **pnpm 9+** -- Install with `corepack enable && corepack prepare pnpm@latest --activate`
- **Docker and Docker Compose** -- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Git** -- [Download](https://git-scm.com/)

## First-Time Setup

### Automated Setup

```bash
git clone <repo-url> && cd prompt-platform
bash scripts/dev-setup.sh
```

The setup script handles everything: environment file, Docker, dependencies, migrations, and seeding.

### Manual Setup

```bash
# 1. Clone the repository
git clone <repo-url> && cd prompt-platform

# 2. Create environment file
cp .env.example .env.local

# 3. Start PostgreSQL via Docker
docker compose up -d

# 4. Wait for PostgreSQL to be healthy
docker compose ps  # Should show "healthy" status

# 5. Install dependencies
pnpm install

# 6. Run database migrations
pnpm db:migrate

# 7. Seed development data
pnpm db:seed

# 8. Start the development server
pnpm dev
```

The app will be available at **http://localhost:3000**.

## Common Tasks

### Run the Development Server

```bash
pnpm dev
```

Uses Turbopack for fast compilation. The server auto-reloads on file changes.

### Run Unit Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run a specific test file
pnpm test src/lib/services/prompt-service.test.ts
```

### Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests (headless)
pnpm test:e2e

# Run E2E tests in headed mode (see the browser)
pnpm test:e2e -- --headed

# Run a specific E2E test
pnpm test:e2e tests/unlock-flow.spec.ts
```

E2E tests require the dev server to be running.

### Create a Database Migration

```bash
# 1. Edit prisma/schema.prisma
# 2. Generate the migration
pnpm db:migrate
# Prisma will prompt you to name the migration
# Use descriptive names: add-preview-type-column, create-analytics-table
```

### Reset the Database

```bash
# Drops all data, re-runs migrations, re-seeds
pnpm db:reset
```

### Open Prisma Studio

```bash
pnpm db:studio
```

Opens a web UI at http://localhost:5555 for browsing and editing database records.

### Push Schema Changes (Dev Only)

```bash
# Applies schema changes without creating a migration file
# Only use during rapid prototyping, never for changes that need to be tracked
pnpm db:push
```

### Add a shadcn/ui Component

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Components are installed to `src/components/ui/`.

### Lint and Format

```bash
# Run ESLint
pnpm lint

# Auto-fix lint issues
pnpm lint --fix

# Check formatting
pnpm format:check

# Auto-format all files
pnpm format
```

### Build for Production

```bash
pnpm build
pnpm start
```

The production build runs at http://localhost:3000.

## Environment Variables

Key variables in `.env.local`:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://prompt_user:prompt_pass@localhost:5432/prompt_platform` |
| `NEXTAUTH_SECRET` | Session encryption key | `your-secret-key-here` |
| `NEXTAUTH_URL` | App URL for NextAuth | `http://localhost:3000` |
| `AD_PROVIDER` | Ad provider adapter | `mock` |
| `AI_PROVIDER` | AI provider adapter | `mock` |

## Troubleshooting

### Docker: Port 5432 Already in Use

Another PostgreSQL instance is running on the default port.

```bash
# Option 1: Stop the other instance
brew services stop postgresql  # macOS
sudo systemctl stop postgresql  # Linux

# Option 2: Change the port in docker-compose.yml
ports:
  - '5433:5432'  # Use 5433 externally
# Then update DATABASE_URL in .env.local to use port 5433
```

### Prisma: Migration Failed

```bash
# Reset the database (destroys all data)
pnpm db:reset

# If reset also fails, destroy and recreate the Docker volume
docker compose down -v
docker compose up -d
pnpm db:migrate
pnpm db:seed
```

### Node: Wrong Version

```bash
# Check your Node version
node -v

# Use nvm to switch
nvm use 20

# Or use the project's .nvmrc (if present)
nvm use
```

### pnpm: Command Not Found

```bash
# Enable corepack (ships with Node 16+)
corepack enable
corepack prepare pnpm@latest --activate
```

### Tests: Failing After Schema Change

```bash
# Regenerate the Prisma client
pnpm postinstall

# Or explicitly
npx prisma generate
```

### Dev Server: Stale Cache

```bash
# Clear the Next.js cache
rm -rf .next
pnpm dev
```

### E2E Tests: Playwright Browsers Not Installed

```bash
npx playwright install
```

## Database Seed Data

The seed file at `prisma/seed.ts` creates:
- Admin user (for testing admin workflows).
- Sample categories (Writing, Code, Marketing, etc.).
- Sample tags.
- Sample prompts in various statuses.
- Sample previews.

Seed data is idempotent -- running `pnpm db:seed` multiple times does not create duplicates.
