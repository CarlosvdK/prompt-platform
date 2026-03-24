# Technical Architecture

## System Overview

Softset is a server-rendered Next.js 15 application using the App Router. It follows a layered architecture: route handlers and server components at the top, a service layer for business logic, adapters for external integrations, and Prisma ORM for database access.

The application is deployed as a single service (not microservices). PostgreSQL is the sole data store.

## Tech Stack Rationale

| Technology | Why |
|---|---|
| **Next.js 15 App Router** | Server components reduce client JS, App Router provides modern routing with layouts/loading/error, API routes co-located with the app. |
| **TypeScript (strict)** | Type safety catches errors at compile time, improves IDE support, makes refactoring safer. |
| **Tailwind CSS 4** | Utility-first styling eliminates CSS naming debates, co-locates styles with markup, excellent performance via purging. |
| **shadcn/ui** | Accessible, composable components that are copied into the project for full control. No version lock-in to a component library. |
| **Prisma** | Type-safe database client, migration management, schema-first design, excellent DX. |
| **PostgreSQL** | Robust relational database with full-text search, JSON support, and strong ecosystem. |
| **NextAuth.js v4** | Battle-tested auth with Prisma adapter, session management, role support. |
| **Zod** | Runtime type validation that integrates with TypeScript types, used at every data boundary. |
| **TanStack React Query** | Client-side data fetching and caching for interactive components that need real-time data. |
| **Vitest** | Fast, Vite-native test runner with excellent TypeScript support. |
| **Playwright** | Cross-browser E2E testing with reliable selectors and auto-waiting. |
| **pnpm** | Fast, disk-efficient package manager with strict dependency resolution. |

## Directory Structure

```
prompt-platform/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Development seed data
│   └── migrations/            # Migration history
├── public/                    # Static assets (favicons, images)
├── scripts/                   # Dev and CI helper scripts
│   ├── dev-setup.sh           # First-time setup automation
│   └── db-reset.sh            # Database reset helper
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (public)/          # Unauthenticated pages
│   │   ├── (admin)/           # Authenticated admin pages
│   │   ├── (auth)/            # Login, register pages
│   │   ├── api/               # API route handlers
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles and design tokens
│   │   └── page.tsx           # Home page
│   ├── components/            # Shared React components
│   │   ├── ui/                # shadcn/ui primitives
│   │   └── [domain]/          # Domain-specific components
│   ├── lib/
│   │   ├── adapters/          # External service integrations
│   │   ├── services/          # Business logic functions
│   │   ├── schemas/           # Zod validation schemas
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Pure utility functions
│   │   └── db.ts              # Prisma client singleton
│   └── types/                 # Shared TypeScript types
├── tests/                     # E2E test files
├── skills/                    # Agent skill definitions
├── memory/                    # Project context and decisions
├── hooks/                     # Agent workflow checklists
├── docs/                      # Project documentation
└── [config files]             # tsconfig, eslint, vitest, playwright, etc.
```

## Data Flow Diagrams

### Public User: Browse to Unlock

```
User Browser
    |
    | GET /prompts (server component)
    v
Next.js Server
    |
    | promptService.listPublishedPrompts()
    v
Prisma --> PostgreSQL
    |
    | Returns published prompts with preview data
    v
Server renders HTML with prompt cards
    |
    | Streamed to browser
    v
User clicks a prompt card
    |
    | GET /prompts/[slug] (server component)
    v
promptService.getPublishedPromptBySlug()
    |
    | Returns prompt + previews (content hidden)
    v
Server renders prompt detail page
    |
    | User clicks "Unlock"
    v
Client component: POST /api/prompts/[id]/unlock/request
    |
    | unlockService.requestUnlock()
    | adAdapter.getAdConfig()
    v
Returns ad configuration
    |
    | Client renders ad via provider SDK
    | User watches/interacts with ad
    v
Client component: POST /api/prompts/[id]/unlock/verify
    |
    | unlockService.verifyAndUnlock()
    | adAdapter.verifyCompletion()
    | Creates UnlockEvent + AdEvent
    | Generates unlock token
    v
Returns unlock token + full prompt content
    |
    | Client stores token, displays content
    v
Done
```

### Admin: Review and Publish

```
Admin Browser
    |
    | GET /admin/reviews (server component, auth-protected)
    v
reviewService.getReviewQueue()
    |
    | Returns PENDING_REVIEW prompts
    v
Admin selects a prompt to review
    |
    | GET /admin/reviews/[id] (server component)
    v
promptService.getPromptForReview()
    |
    | Returns full prompt detail with history
    v
Admin makes review decision
    |
    | POST /api/reviews (client component form)
    v
reviewService.submitReviewDecision()
    |
    | Validates transition, updates status
    | Creates ReviewDecision + AuditLog
    v
If APPROVED, admin can publish:
    |
    | POST /api/prompts/[id]/publish
    v
promptService.publishPrompt()
    |
    | Sets status=PUBLISHED, publishedAt=now()
    | Creates PromptVersion, AuditLog
    v
Prompt is now visible in public catalog
```

## Service Layer Pattern

Services are the single source of truth for business rules. They are plain exported async functions (not classes).

```
              ┌─────────────────┐
              │  Route Handler  │  Thin: parse request, call service, format response
              │  or Server      │
              │  Component      │
              └────────┬────────┘
                       │
              ┌────────v────────┐
              │    Service      │  Business logic: validation orchestration,
              │    Function     │  state transitions, authorization checks
              └───┬─────────┬───┘
                  │         │
         ┌────────v──┐  ┌───v────────┐
         │  Prisma   │  │  Adapter   │  External: ad providers, AI providers,
         │  (DB)     │  │            │  storage, email
         └───────────┘  └────────────┘
```

## Adapter Pattern

Each external dependency has an interface and a factory function:

```typescript
// Interface
interface AdProvider {
  getAdConfig(promptId: string): Promise<AdConfig>
  verifyCompletion(token: string): Promise<AdCompletionResult>
}

// Factory
function getAdProvider(): AdProvider {
  switch (process.env.AD_PROVIDER) {
    case 'mock': return mockAdProvider
    case 'google': return googleAdProvider
    default: throw new AppError(...)
  }
}
```

Adapters in use:
- **AdProvider** -- ad display and completion verification.
- **AiProvider** -- prompt generation for the agent pipeline.
- **StorageProvider** -- file/asset storage (future, for image previews).

## Auth Model

- NextAuth.js v4 with Prisma adapter stores sessions in PostgreSQL.
- Credential provider for email + password login (MVP).
- Three roles: USER, REVIEWER, ADMIN (stored in the User model).
- Server-side auth checks in route handlers and server components via `getServerSession()`.
- Middleware-based route protection for the `(admin)` route group.
- No client-side auth state -- server components fetch the session directly.

## API Design Principles

- **RESTful.** Resources are nouns, HTTP methods are verbs.
- **Consistent error format.** `{ error: { code: string, message: string, details?: object } }`
- **Standard status codes.** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 429 (Rate Limited), 500 (Internal Error).
- **Pagination.** `?page=1&limit=20` with response metadata `{ data: [...], meta: { page, limit, total, totalPages } }`.
- **Sorting.** `?sort=createdAt&order=desc`.
- **Filtering.** Query parameters matching field names: `?status=PUBLISHED&category=writing`.

## Deployment Model

### Vercel (Primary)

- Automatic deployments from `main` branch.
- Serverless functions for API routes.
- Edge middleware for route protection.
- Environment variables configured in Vercel dashboard.
- Preview deployments for pull requests.

### Docker (Alternative)

- Multi-stage Dockerfile: deps, build, runtime.
- `next start` with standalone output mode.
- Designed for self-hosted environments (AWS ECS, GCP Cloud Run, etc.).
- Requires managed PostgreSQL (RDS, Cloud SQL, etc.).

### Database

- Managed PostgreSQL service (Neon, Supabase, AWS RDS).
- Migrations run as part of the deployment pipeline (`prisma migrate deploy`).
- Connection pooling recommended for serverless (PgBouncer or Prisma Accelerate).
