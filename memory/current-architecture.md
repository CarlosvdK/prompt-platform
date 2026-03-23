# Current Architecture

## System Overview

The application is a Next.js 15 App Router application deployed as a single service. It uses server-side rendering by default, with client components only where interactivity is required. The database is PostgreSQL accessed via Prisma ORM.

## Route Groups

The App Router uses route groups to organize pages:

```
src/app/
├── (public)/          # Unauthenticated pages
│   ├── page.tsx       # Home / landing
│   ├── prompts/       # Catalog browse and detail
│   ├── categories/    # Category listing and filtered views
│   └── search/        # Search results
├── (admin)/           # Authenticated admin/reviewer pages
│   ├── dashboard/     # Overview metrics
│   ├── reviews/       # Review queue
│   ├── prompts/       # Prompt management (CRUD)
│   ├── agent-runs/    # Agent pipeline monitoring
│   └── audit-log/     # Audit trail viewer
├── (auth)/            # Authentication pages
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── api/               # API route handlers
│   ├── auth/          # NextAuth endpoints
│   ├── prompts/       # Prompt CRUD and unlock
│   ├── reviews/       # Review decisions
│   ├── categories/    # Category management
│   ├── agent-runs/    # Agent pipeline triggers
│   └── admin/         # Admin-only operations
└── layout.tsx         # Root layout
```

## Service Layer Pattern

Business logic lives in pure functions inside `src/lib/services/`. Services:

- Accept validated input (Zod-parsed data).
- Return typed results or throw typed errors (`AppError`).
- Are framework-agnostic (no Next.js imports, no React imports).
- Call adapters for external integrations.
- Call Prisma directly for database operations.

```
Route Handler --> Service --> Prisma (database)
                         --> Adapter (external service)
```

Route handlers are thin: parse the request, call the service, format the response.

## Adapter Pattern

External dependencies are abstracted behind interfaces in `src/lib/adapters/`:

| Adapter | Purpose | Swappable via |
|---|---|---|
| Ad provider | Ad display and verification | `AD_PROVIDER` env var |
| AI provider | Prompt generation in agent pipeline | `AI_PROVIDER` env var |
| Storage | File/asset storage | `STORAGE_PROVIDER` env var |

Each adapter has a defined interface and at least two implementations: a mock (for development) and a real provider.

## Authentication Model

- NextAuth.js v4 with Prisma adapter.
- Credential-based auth (email + password) for MVP.
- OAuth providers can be added later.
- Three roles: `USER`, `REVIEWER`, `ADMIN`.
- Role-based route protection via middleware and server-side checks.

## Data Flow

### Public User Viewing a Prompt

```
Browser --> GET /prompts/[slug] (server component)
        --> promptService.getPublishedPromptBySlug()
        --> Prisma query (status = PUBLISHED only)
        --> Render page with preview content (full content hidden)
```

### Unlock Flow

```
Browser --> POST /api/prompts/[id]/unlock/request
        --> unlockService.requestUnlock()
        --> adAdapter.getAdConfig()
        --> Return ad config to client

Browser --> [User watches ad] --> Ad SDK completion callback

Browser --> POST /api/prompts/[id]/unlock/verify
        --> unlockService.verifyAndUnlock()
        --> adAdapter.verifyCompletion()
        --> Create UnlockEvent + AdEvent
        --> Generate unlock token
        --> Return token + full content
```

### Admin Review Flow

```
Browser --> GET /admin/reviews (server component, auth-protected)
        --> reviewService.getReviewQueue()
        --> Prisma query (status = PENDING_REVIEW)
        --> Render review queue

Browser --> POST /api/reviews
        --> reviewService.submitReviewDecision()
        --> Update prompt status
        --> Create ReviewDecision + AuditLog
        --> Return updated prompt
```

### Agent Pipeline

```
Admin triggers --> POST /api/agent-runs
              --> agentService.createRun()
              --> Create AgentRun record (QUEUED)
              --> Background: execute agent skill
              --> aiAdapter.generate()
              --> Create PromptDraft records
              --> Update AgentRun (COMPLETED)
```

## API Design Principles

- RESTful resource-based URLs.
- JSON request and response bodies.
- Standard HTTP status codes (200, 201, 400, 401, 403, 404, 409, 429, 500).
- Consistent error response format: `{ error: { code, message, details? } }`.
- Pagination via `?page=1&limit=20` query parameters.
- Sorting via `?sort=createdAt&order=desc`.
- Filtering via query parameters matching field names.

## Deployment Model

- **Primary:** Vercel (serverless, automatic from `main` branch).
- **Alternative:** Docker container (multi-stage build in Dockerfile) for self-hosted environments.
- **Database:** Managed PostgreSQL (Neon, Supabase, or AWS RDS).
- **Environment variables** configure all external service connections.
