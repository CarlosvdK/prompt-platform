# Roadmap

## Phase 0: Scaffold (Complete)

- [x] Initialize Next.js 15 project with TypeScript strict mode
- [x] Configure Tailwind CSS 4, ESLint, Prettier
- [x] Set up Prisma with PostgreSQL
- [x] Define complete database schema (all models, enums, indexes)
- [x] Docker Compose for local PostgreSQL
- [x] Dockerfile for production deployment
- [x] Configure Vitest and Playwright
- [x] Create CLAUDE.md, AGENT_RULES.md, CONTRIBUTING.md
- [x] Create agent context directories (skills/, memory/, hooks/, docs/)

## Phase 1: Data Layer and Auth

- [ ] Create Prisma seed file with representative development data
- [ ] Set up NextAuth.js with credential provider
- [ ] Implement user registration and login pages
- [ ] Create the database utility (`src/lib/db.ts` -- Prisma client singleton)
- [ ] Implement base service functions for Prompt CRUD
- [ ] Implement base service functions for Category and Tag CRUD
- [ ] Implement AppError class and error handling utilities
- [ ] Create Zod schemas for all input boundaries
- [ ] Set up role-based middleware for route protection
- [ ] Write unit tests for service functions and schemas

## Phase 2: Public Catalog

- [ ] Install and configure shadcn/ui components
- [ ] Create root layout with navigation
- [ ] Build home page with featured prompts and category grid
- [ ] Build category listing page
- [ ] Build category detail page (prompts filtered by category)
- [ ] Build prompt detail page with preview display
- [ ] Implement search functionality (PostgreSQL FTS)
- [ ] Build search results page with filtering and sorting
- [ ] Add loading.tsx and error.tsx for all route groups
- [ ] Implement responsive design for all public pages
- [ ] Add pagination for prompt listings

## Phase 3: Unlock Flow

- [ ] Define AdProvider adapter interface
- [ ] Implement mock ad provider for development
- [ ] Build unlock request API route
- [ ] Build unlock verify API route
- [ ] Create client-side unlock button component
- [ ] Implement unlock token generation and verification
- [ ] Build mock ad display component (development)
- [ ] Create UnlockEvent and AdEvent recording
- [ ] Implement rate limiting for unlock requests
- [ ] Add IP hashing for privacy-compliant rate limiting
- [ ] Write tests for the complete unlock flow

## Phase 4: Admin and Review

- [ ] Build admin layout with sidebar navigation
- [ ] Create admin dashboard with key metrics
- [ ] Build review queue page (list of PENDING_REVIEW prompts)
- [ ] Build review detail page (content, previews, metadata, history)
- [ ] Implement review actions (approve, reject, request changes, escalate)
- [ ] Build prompt management page (CRUD for all statuses)
- [ ] Implement publish and unpublish actions
- [ ] Build audit log viewer with filtering
- [ ] Add role-based access guards to all admin routes
- [ ] Write tests for review workflow state transitions

## Phase 5: Agent Pipeline

- [ ] Define AI provider adapter interface
- [ ] Implement mock AI provider for development
- [ ] Build agent run trigger API
- [ ] Create agent execution engine (process queued runs)
- [ ] Implement prompt generation skill
- [ ] Implement preview generation skill
- [ ] Build agent run monitoring page in admin
- [ ] Create PromptDraft to Prompt promotion flow
- [ ] Add agent run status tracking and error handling
- [ ] Write tests for the agent pipeline

## Phase 6: Polish

- [ ] Performance optimization (caching, query optimization, bundle analysis)
- [ ] SEO optimization (metadata, Open Graph, structured data, sitemap)
- [ ] Accessibility audit and fixes
- [ ] Error monitoring setup (Sentry or similar)
- [ ] Logging and observability
- [ ] Security audit (CSP headers, CSRF, input sanitization review)
- [ ] Load testing
- [ ] Documentation finalization

## Future (Post-MVP)

- [ ] Subscription unlock alternative (monthly fee to skip ads)
- [ ] API access for programmatic prompt retrieval
- [ ] Community-contributed prompts with moderated submission
- [ ] Analytics dashboard (prompt performance, revenue, user behavior)
- [ ] Prompt collections / bundles
- [ ] User favorites and history
- [ ] Email notifications for prompt updates
- [ ] Dedicated search engine (Typesense or Elasticsearch)
- [ ] Multi-language prompt support
- [ ] Prompt rating and feedback system
- [ ] OAuth providers (Google, GitHub)
- [ ] Webhook integrations for enterprise users
