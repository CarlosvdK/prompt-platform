# Product Requirements Document

## Product Vision

Softset is a curated marketplace for AI prompts. Users discover, preview, and unlock high-quality prompts through an ad-gated access model. The platform combines AI-powered content generation with human editorial oversight to maintain a trustworthy, high-quality catalog.

## Target Users

### Public User

A person looking for effective AI prompts to save time, improve output quality, or learn new prompting techniques. They browse the catalog, preview prompt outputs, and unlock prompts by watching ads.

**Characteristics:**
- May be a developer, content creator, marketer, educator, or business professional.
- Values quality and wants to know what they are getting before committing.
- Prefers free access over subscriptions or paywalls.
- Discovers prompts via search, category browsing, or external links.

### Admin Reviewer

A team member responsible for reviewing AI-generated and manually created prompt drafts before they are published. They ensure content quality, safety, and catalog integrity.

**Characteristics:**
- Understands prompt engineering and AI capabilities.
- Familiar with the review rubric and content policies.
- Reviews 10-50 prompts per session.
- Needs efficient tools for quick decision-making.

### Agent (Internal AI)

An automated system that generates prompt drafts at scale. Agents are triggered by admins, execute predefined skills, and produce drafts that enter the review pipeline.

**Characteristics:**
- Operates within defined skill parameters.
- Produces structured output (title, description, content, metadata, previews).
- Cannot publish directly -- all output enters the review queue.
- Execution is logged for traceability.

## Core Features

### 1. Browse and Discover

**User stories:**
- As a user, I want to browse prompts by category so I can find prompts relevant to my domain.
- As a user, I want to search prompts by keyword so I can find specific prompt types.
- As a user, I want to filter prompts by type (text, code, system prompt, chain, image) so I can find the right format.
- As a user, I want to sort prompts by popularity, date, or relevance.
- As a user, I want to see prompt metadata (category, tags, type) at a glance in listing views.

### 2. Preview

**User stories:**
- As a user, I want to see a representative preview of a prompt's output before unlocking so I know what I am getting.
- As a user, I want previews to be clearly marked as samples (not the full output).
- As a user, I want to see multiple preview examples for prompts with varied use cases.

### 3. Unlock via Ad

**User stories:**
- As a user, I want to unlock a prompt by watching a short ad so I can access it for free.
- As a user, I want the unlock to be permanent (or long-lived) so I do not need to watch an ad every time I revisit.
- As a user, I want a clear indication of what I need to do to unlock (watch ad, interact, etc.).
- As a user, I want the unlock process to be fast and not overly intrusive.

### 4. Admin Review

**User stories:**
- As a reviewer, I want to see a queue of prompts awaiting review, sorted by submission date.
- As a reviewer, I want to see the full prompt content, previews, and metadata in a review detail view.
- As a reviewer, I want to approve, reject, or request changes with notes.
- As a reviewer, I want to see the review history for a prompt (previous decisions, notes).
- As an admin, I want to publish approved prompts to make them visible in the catalog.
- As an admin, I want to unpublish or archive prompts when needed.
- As an admin, I want to see an audit trail of all actions.

### 5. Agent Pipeline

**User stories:**
- As an admin, I want to trigger AI agent runs with specific skills and parameters.
- As an admin, I want to monitor agent run status (queued, running, completed, failed).
- As an admin, I want to see the drafts produced by an agent run.
- As an admin, I want agent-generated drafts to automatically enter the review queue.
- As an admin, I want to track the quality of agent-generated prompts over time.

## Success Metrics

| Metric | Target (MVP) | Measurement |
|---|---|---|
| Published prompt catalog size | 100+ prompts | Count of PUBLISHED prompts |
| Daily unique visitors | 500+ | Analytics |
| Prompt unlock rate | 15%+ | Unlocks / unique prompt page views |
| Ad completion rate | 70%+ | Completed ads / initiated ads |
| Review turnaround time | < 24 hours | Time from PENDING_REVIEW to decision |
| Agent draft approval rate | 60%+ | Approved / total agent-generated reviews |
| User return rate (7-day) | 20%+ | Returning visitors / total visitors |

## MVP Scope

### Included in MVP

- Public catalog with category browsing and search.
- Prompt detail page with preview display.
- Ad-gated unlock flow with mock ad provider.
- Admin review queue with approve/reject/request changes.
- Prompt management (create, edit, submit, publish, archive).
- Audit trail for admin actions.
- Agent pipeline with at least one generation skill.
- Credential-based authentication for admins.
- Responsive design for mobile and desktop.

### Excluded from MVP (Future)

- User accounts for public users (unlock is anonymous or session-based in MVP).
- Subscription/premium unlock option.
- Public API for programmatic access.
- Community-submitted prompts.
- Analytics dashboard.
- Prompt rating and feedback.
- OAuth login providers.
- Email notifications.
- Multi-language support.
- Prompt collections or bundles.

## Non-Functional Requirements

- **Performance:** Pages load in under 2 seconds on a standard connection. Prompt detail and unlock flow are prioritized.
- **Accessibility:** WCAG 2.1 AA compliance.
- **Security:** No unapproved content exposed. Input validation on all boundaries. Rate limiting on unlock endpoints.
- **Reliability:** 99.5% uptime target. Graceful error handling with user-friendly messages.
- **Privacy:** IP addresses hashed for rate limiting. No unnecessary PII collection. Compliant with standard privacy expectations.
