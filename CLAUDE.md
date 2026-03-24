# CLAUDE.md - AI Agent Instructions for Softset

## Before You Start

1. **Always begin in planning mode.** Before writing any code, outline what you intend to change, which files are affected, and what the expected outcome is. Get confirmation before proceeding with non-trivial changes.
2. **Read `/memory` and `/skills` directories first.** These contain project context, past decisions, and reusable patterns. Do not duplicate work that already exists.
3. **Update `memory/decisions-log.md`** whenever you make an architecture decision, introduce a new pattern, or deviate from an existing convention. Future agents (and humans) depend on this log.

## Hard Rules

- **Never ship generated prompts directly to the public.** All prompts must go through the approval workflow before they are visible to end users.
- **Never bypass the approval workflow.** Even for "quick fixes" or "obvious" changes to prompt content, the review and approval steps exist for a reason.
- **Keep migrations safe.** Database migrations must be additive. Never drop columns, tables, or rename fields without an explicit review and a separate migration that backfills data first. Destructive migrations require human sign-off.
- **Use hooks and checklists before finishing tasks.** Before marking work as done, verify against the PR checklist in CONTRIBUTING.md.

## Best Practices

- **Document assumptions.** If you are unsure about a requirement, write your assumption as a comment or in the decisions log and flag it for review.
- **Prefer small, reviewable changes.** One concern per PR. If a task requires multiple changes, break it into sequential PRs.
- **Follow the service/adapter pattern.** Business logic lives in `src/lib/services/`, external integrations live in `src/lib/adapters/`. Routes and components should be thin wrappers.
- **Validate with Zod.** Every API boundary (route handlers, form submissions, external data) must have a Zod schema.
- **Use typed errors.** Throw structured error objects, not raw strings.

## Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Framework      | Next.js 15 (App Router)     |
| Language       | TypeScript (strict mode)    |
| Styling        | Tailwind CSS 4              |
| ORM            | Prisma (PostgreSQL)         |
| Auth           | NextAuth.js v4              |
| Validation     | Zod                         |
| State/Fetching | TanStack React Query        |
| Testing        | Vitest + Playwright         |
| Package Mgr    | pnpm                        |

## Directory Structure

```
prompt-platform/
├── prisma/              # Schema, migrations, seed
├── public/              # Static assets
├── scripts/             # Dev and CI helper scripts
├── src/
│   └── app/             # Next.js App Router (pages, layouts, API routes)
│       ├── api/         # Route handlers
│       ├── (auth)/      # Auth-related pages
│       └── (dashboard)/ # Authenticated pages
│   ├── components/      # Shared React components
│   ├── lib/
│   │   ├── adapters/    # External service integrations
│   │   ├── services/    # Business logic
│   │   ├── schemas/     # Zod validation schemas
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Pure utility functions
│   └── types/           # Shared TypeScript types
├── memory/              # Project context for AI agents
├── skills/              # Reusable prompt/agent skills
├── tests/               # E2E and integration tests
├── uploads/             # Local file uploads (gitignored)
└── [config files]       # Root config (tsconfig, tailwind, etc.)
```

## Common Commands

```bash
# Development
pnpm dev                 # Start dev server with Turbopack
pnpm build               # Production build
pnpm start               # Start production server
pnpm lint                # Run ESLint
pnpm format              # Format code with Prettier
pnpm format:check        # Check formatting without writing

# Testing
pnpm test                # Run unit tests (Vitest)
pnpm test:watch          # Run unit tests in watch mode
pnpm test:e2e            # Run E2E tests (Playwright)

# Database
pnpm db:migrate          # Run Prisma migrations
pnpm db:push             # Push schema changes (dev only)
pnpm db:seed             # Seed the database
pnpm db:studio           # Open Prisma Studio
pnpm db:reset            # Drop, recreate, migrate, and seed
```
