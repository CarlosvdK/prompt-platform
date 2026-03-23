# Prompt Platform

A full-stack platform for creating, managing, reviewing, and distributing AI prompts. Users craft prompts through a structured workflow with version control, collaborative review, and an ad-supported unlock model for free access to premium content.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL 16 via Prisma ORM
- **Authentication:** NextAuth.js v4
- **Validation:** Zod
- **State Management:** TanStack React Query
- **Testing:** Vitest (unit), Playwright (E2E)
- **Package Manager:** pnpm

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Docker and Docker Compose

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd prompt-platform

# Automated setup (recommended)
bash scripts/dev-setup.sh

# Or manual setup:
cp .env.example .env.local
docker compose up -d
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
prompt-platform/
├── prisma/                  # Database schema, migrations, seed script
├── public/                  # Static assets
├── scripts/                 # Dev and CI helper scripts
├── src/
│   └── app/                 # Next.js App Router
│       ├── api/             # API route handlers
│       ├── (auth)/          # Authentication pages
│       └── (dashboard)/     # Authenticated dashboard pages
│   ├── components/          # Shared UI components
│   ├── lib/
│   │   ├── adapters/        # External service integrations
│   │   ├── services/        # Core business logic
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Pure utility functions
│   └── types/               # Shared TypeScript types
├── memory/                  # Project context and decisions log
├── skills/                  # Reusable agent skills
├── tests/                   # E2E test suites
└── uploads/                 # Local file uploads (gitignored)
```

## Key Concepts

### Prompt Lifecycle

Every prompt follows a defined workflow:

```
DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED -> (ARCHIVED)
```

- **Draft:** Author creates and iterates on the prompt.
- **In Review:** Submitted for peer or editorial review.
- **Approved:** Reviewed and cleared for publishing.
- **Published:** Live and visible to users.
- **Archived:** Removed from active listings but preserved for history.

### Approval Workflow

Prompts cannot be published without going through review. Reviewers can approve, request changes, or reject. This ensures quality control over all public-facing content.

### Ad Unlock Model

Free users can unlock premium prompts by watching a short ad. The ad provider is configurable (mock provider available for development). This model keeps prompts accessible while supporting the platform.

## Available Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start dev server with Turbopack          |
| `pnpm build`         | Create production build                  |
| `pnpm start`         | Start production server                  |
| `pnpm lint`          | Run ESLint                               |
| `pnpm format`        | Format code with Prettier                |
| `pnpm format:check`  | Check code formatting                    |
| `pnpm test`          | Run unit tests                           |
| `pnpm test:watch`    | Run unit tests in watch mode             |
| `pnpm test:e2e`      | Run E2E tests with Playwright            |
| `pnpm db:migrate`    | Run database migrations                  |
| `pnpm db:push`       | Push schema changes (dev only)           |
| `pnpm db:seed`       | Seed database with sample data           |
| `pnpm db:studio`     | Open Prisma Studio GUI                   |
| `pnpm db:reset`      | Drop, recreate, migrate, and seed DB     |

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable             | Required | Description                          |
| -------------------- | -------- | ------------------------------------ |
| `DATABASE_URL`       | Yes      | PostgreSQL connection string         |
| `NEXTAUTH_URL`       | Yes      | App URL for NextAuth callbacks       |
| `NEXTAUTH_SECRET`    | Yes      | Secret for signing session tokens    |
| `GOOGLE_CLIENT_ID`   | No       | Google OAuth client ID               |
| `GITHUB_CLIENT_ID`   | No       | GitHub OAuth client ID               |
| `AD_PROVIDER`        | No       | Ad service provider (default: mock)  |
| `AI_PROVIDER`        | No       | AI service provider (default: mock)  |
| `OPENAI_API_KEY`     | No       | OpenAI API key for AI features       |
| `ANTHROPIC_API_KEY`  | No       | Anthropic API key for AI features    |

## License

TBD
