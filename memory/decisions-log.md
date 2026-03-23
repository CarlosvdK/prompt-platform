# Architecture Decisions Log

Record architectural decisions using the format below. Always append new entries at the end. Never delete or modify existing entries.

---

## ADR-001: Single Repo Over Monorepo

**Date:** 2026-03-23
**Status:** Accepted

**Decision:** Use a single Next.js repository rather than a monorepo with separate packages for frontend, backend, and shared code.

**Rationale:**
- Single team working on the project; no need for independent deployment of sub-packages.
- Next.js App Router naturally co-locates frontend and backend (API routes, server components).
- Shared TypeScript types and Zod schemas are used across the entire application without needing package boundaries.
- Simpler CI/CD pipeline, dependency management, and onboarding.

**Alternatives Considered:**
- Turborepo monorepo with `packages/web`, `packages/api`, `packages/shared`. Rejected as premature given team size and deployment model.
- Separate frontend and backend repositories. Rejected because it would require duplicating types and adding API client generation.

---

## ADR-002: Approval-First Publishing Model

**Date:** 2026-03-23
**Status:** Accepted

**Decision:** No prompt is visible to end users until it has been explicitly approved by a human reviewer and published by an admin.

**Rationale:**
- Quality is a key differentiator. Auto-publishing would erode trust.
- Safety and content policy compliance requires human judgment.
- The review step catches issues that automated checks miss (context-dependent quality, subtle policy violations).
- Users trust curated content more than user-generated content marketplaces.

**Alternatives Considered:**
- Auto-publish with post-hoc moderation. Rejected because harmful content could be live before review.
- Community moderation (upvote/downvote). Rejected for MVP; may reconsider as the catalog grows.

---

## ADR-003: Versioned Prompt Architecture

**Date:** 2026-03-23
**Status:** Accepted

**Decision:** Prompts use an append-only versioning model. Each edit to a published prompt creates a new PromptVersion record. Published content is never mutated in place.

**Rationale:**
- Users who unlocked version N should continue to have access to version N.
- Version history enables rollback if a new version has issues.
- Audit trail is complete -- every change is recorded.
- Enables future features like "see what changed" and version comparison.

**Alternatives Considered:**
- Mutable prompt content (just update the row). Rejected because it breaks the unlock contract and eliminates history.
- Git-based versioning (store prompts in a git repo). Rejected as over-engineered for the use case.

---

## ADR-004: Agent-Generated Drafts with Human Review

**Date:** 2026-03-23
**Status:** Accepted

**Decision:** AI agents generate prompt drafts (PromptDraft records linked to AgentRun records), but agents can never publish directly. All drafts enter the review pipeline.

**Rationale:**
- Agents can generate content at scale, but quality and safety require human judgment.
- The AgentRun record provides traceability -- every draft can be traced to the skill and input that generated it.
- Separating generation from publication creates a clear accountability boundary.
- If an agent produces poor content, the pattern is visible in review statistics.

**Alternatives Considered:**
- Fully manual prompt creation. Rejected because it does not scale.
- Agent publishing with automated safety checks. Rejected because automated checks are not sufficient for quality and nuance.

---

## ADR-005: Adapter Pattern for External Services

**Date:** 2026-03-23
**Status:** Accepted

**Decision:** External services (ad providers, AI providers, storage) are accessed through adapter interfaces. The active implementation is selected via environment variables.

**Rationale:**
- Mock adapters enable local development without external API keys.
- Providers can be swapped without changing business logic (e.g., switch ad networks).
- Testing is simpler -- inject mock adapters in test environments.
- Future-proofs against vendor lock-in.

**Alternatives Considered:**
- Direct SDK calls in service code. Rejected because it couples business logic to specific vendors.
- Dependency injection container. Rejected as over-engineered for the number of adapters needed.

---

## ADR-006: PostgreSQL Full-Text Search for MVP

**Date:** 2026-03-23
**Status:** Accepted

**Decision:** Use PostgreSQL's built-in full-text search (tsvector/tsquery) for the initial search implementation rather than a dedicated search engine.

**Rationale:**
- No additional infrastructure to deploy and maintain.
- PostgreSQL full-text search is sufficient for the expected catalog size (hundreds to low thousands of prompts).
- Reduces operational complexity during early development.
- Can be migrated to Elasticsearch or Typesense later if search quality or scale demands it.

**Alternatives Considered:**
- Elasticsearch from day one. Rejected as premature infrastructure cost.
- Typesense (lightweight search engine). Deferred as a potential intermediate step.
- Algolia (managed search). Deferred due to cost at this stage.

**Revisit Trigger:** When catalog exceeds 10,000 prompts or search quality feedback indicates limitations.
