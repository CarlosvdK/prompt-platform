# Data Model Documentation

## Entity Relationship Overview

```
User ──< Account
User ──< Session
User ──< ReviewDecision
User ──< UnlockEvent
User ──< AuditLog
User ──< AgentRun

Category ──< Prompt

Prompt ──< PromptTag >── Tag
Prompt ──< PromptVersion
Prompt ──< PromptPreview
Prompt ──< PromptDraft
Prompt ──< ReviewDecision
Prompt ──< UnlockEvent
Prompt ──< AuditLog

AgentRun ──< PromptDraft

UnlockEvent ──< AdEvent (1:1)
```

Legend: `──<` means "has many", `>──` means "belongs to"

## Models

### User

**Purpose:** Represents a platform user (admin, reviewer, or regular user).

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| email | String | Unique email address |
| name | String? | Display name |
| image | String? | Avatar URL |
| passwordHash | String? | Bcrypt hash for credential auth |
| emailVerified | DateTime? | When email was verified |
| role | UserRole | USER, REVIEWER, or ADMIN |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Table name:** `users`

### Account

**Purpose:** OAuth provider account links (NextAuth adapter requirement).

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| userId | String | FK to User |
| type | String | Account type (oauth, email, credentials) |
| provider | String | Provider name (google, github, credentials) |
| providerAccountId | String | Provider's unique ID |
| refresh_token | String? | OAuth refresh token |
| access_token | String? | OAuth access token |
| expires_at | Int? | Token expiry timestamp |
| token_type | String? | Token type |
| scope | String? | OAuth scope |
| id_token | String? | OIDC ID token |
| session_state | String? | Provider session state |

**Table name:** `accounts`
**Unique constraint:** `[provider, providerAccountId]`

### Session

**Purpose:** Active user sessions (NextAuth adapter requirement).

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| sessionToken | String | Unique session token |
| userId | String | FK to User |
| expires | DateTime | Session expiry |

**Table name:** `sessions`

### VerificationToken

**Purpose:** Email verification and password reset tokens (NextAuth adapter requirement).

| Field | Type | Description |
|---|---|---|
| identifier | String | Email or other identifier |
| token | String | Unique token |
| expires | DateTime | Token expiry |

**Table name:** `verification_tokens`
**Unique constraint:** `[identifier, token]`

### Category

**Purpose:** Top-level classification for prompts. Admin-managed taxonomy.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Display name (unique) |
| slug | String | URL-safe identifier (unique) |
| description | String? | Category description |
| icon | String? | Icon identifier (lucide icon name or emoji) |
| sortOrder | Int | Display order (lower = first) |
| createdAt | DateTime | Creation timestamp |

**Table name:** `categories`

### Tag

**Purpose:** Fine-grained labels for prompt discoverability. Many-to-many with Prompt.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Display name (unique) |
| slug | String | URL-safe identifier (unique) |
| createdAt | DateTime | Creation timestamp |

**Table name:** `tags`

### PromptTag

**Purpose:** Join table for the many-to-many relationship between Prompt and Tag.

| Field | Type | Description |
|---|---|---|
| promptId | String | FK to Prompt |
| tagId | String | FK to Tag |

**Table name:** `prompt_tags`
**Primary key:** `[promptId, tagId]`

### Prompt

**Purpose:** The central content entity. A reusable AI instruction template.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| title | String | Prompt title |
| slug | String | URL-safe identifier (unique) |
| description | String (text) | Summary of what the prompt does |
| type | PromptType | TEXT, CODE, SYSTEM_PROMPT, CHAIN, IMAGE |
| status | PromptStatus | Lifecycle status (DRAFT through ARCHIVED) |
| categoryId | String | FK to Category |
| content | String (text) | The full prompt text (hidden until unlocked) |
| metadata | Json? | Flexible metadata (model compatibility, difficulty, etc.) |
| unlockCount | Int | Total unlock count (denormalized for performance) |
| viewCount | Int | Total view count (denormalized for performance) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| publishedAt | DateTime? | When the prompt was first published |

**Table name:** `prompts`

**Indexes:**
- `status` -- used to filter by lifecycle stage (PUBLISHED for public, PENDING_REVIEW for queue).
- `categoryId` -- used for category-filtered listings.
- `createdAt` -- used for chronological sorting.
- `publishedAt` -- used for "newest published" sorting.

**Metadata JSON schema:**
```json
{
  "models": ["gpt-4", "claude-3", "gemini-pro"],
  "difficulty": "intermediate",
  "estimatedTokens": 500,
  "version": 1
}
```

### PromptVersion

**Purpose:** Immutable snapshot of prompt content. Created each time a published prompt is updated.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| promptId | String | FK to Prompt |
| version | Int | Sequential version number |
| content | String (text) | Prompt content at this version |
| metadata | Json? | Metadata at this version |
| changelog | String? (text) | Description of what changed |
| createdAt | DateTime | Version creation timestamp |

**Table name:** `prompt_versions`
**Unique constraint:** `[promptId, version]`

### PromptPreview

**Purpose:** Sample output shown to users before unlock. Demonstrates the prompt's value.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| promptId | String | FK to Prompt |
| type | String | Preview format: text, code, image, comparison |
| content | String (text) | Preview content (markdown, code, or asset URL) |
| sortOrder | Int | Display order (lower = first) |
| createdAt | DateTime | Creation timestamp |

**Table name:** `prompt_previews`

### PromptDraft

**Purpose:** Agent-generated draft. Links an AI agent's output to the prompt it may become.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| promptId | String? | FK to Prompt (null if creating a new prompt) |
| agentRunId | String | FK to AgentRun that produced this draft |
| title | String | Draft title |
| description | String (text) | Draft description |
| content | String (text) | Draft prompt content |
| type | PromptType | Prompt type |
| metadata | Json? | Draft metadata |
| createdAt | DateTime | Creation timestamp |

**Table name:** `prompt_drafts`

### AgentRun

**Purpose:** Records an AI agent execution. Provides traceability from skill input to generated drafts.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| initiatedBy | String? | FK to User who triggered the run |
| skill | String | Skill identifier (e.g., "prompt-generation") |
| input | Json | Input parameters for the skill |
| output | Json? | Skill output (null until completed) |
| status | AgentRunStatus | QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED |
| error | String? (text) | Error message if FAILED |
| startedAt | DateTime? | When execution began |
| completedAt | DateTime? | When execution finished |
| createdAt | DateTime | Record creation timestamp |

**Table name:** `agent_runs`

**Indexes:**
- `status` -- used to find QUEUED runs for processing.
- `createdAt` -- used for chronological listing.

### ReviewDecision

**Purpose:** Records a reviewer's judgment on a prompt. Multiple decisions per prompt over its lifecycle.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| promptId | String | FK to Prompt |
| reviewerId | String | FK to User (reviewer) |
| action | ReviewAction | APPROVED, REJECTED, NEEDS_CHANGES, ESCALATED |
| notes | String? (text) | Reviewer's feedback and reasoning |
| createdAt | DateTime | Decision timestamp |

**Table name:** `review_decisions`

**Indexes:**
- `promptId` -- used to fetch all decisions for a prompt.
- `reviewerId` -- used for reviewer activity tracking.

### UnlockEvent

**Purpose:** Records that a user unlocked a prompt. Links to the ad event that enabled it.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| promptId | String | FK to Prompt |
| userId | String? | FK to User (null for anonymous unlocks) |
| method | String | Unlock method: "ad", "subscription", "admin_override" |
| ipHash | String? | SHA-256 hash of user's IP (for rate limiting) |
| createdAt | DateTime | Unlock timestamp |

**Table name:** `unlock_events`

**Indexes:**
- `promptId` -- used for per-prompt unlock counts.
- `userId` -- used for per-user unlock history.

### AdEvent

**Purpose:** Records an ad interaction tied to an unlock. One-to-one with UnlockEvent.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| unlockEventId | String | FK to UnlockEvent (unique -- 1:1) |
| provider | String | Ad provider name (mock, google, unity) |
| adUnitId | String? | Provider's ad unit identifier |
| impressionId | String? | Provider's impression identifier |
| completed | Boolean | Whether the ad interaction was completed |
| revenue | Decimal? | Estimated revenue in USD (precision: 10,4) |
| metadata | Json? | Provider-specific event data |
| createdAt | DateTime | Event timestamp |

**Table name:** `ad_events`

### AuditLog

**Purpose:** Append-only log of significant platform actions. Used for accountability, debugging, and compliance.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| userId | String? | FK to User who performed the action |
| promptId | String? | FK to affected Prompt (if applicable) |
| action | String | Action type (see below) |
| details | Json? | Additional context |
| ipAddress | String? | Requester's IP address |
| createdAt | DateTime | Action timestamp |

**Table name:** `audit_logs`

**Indexes:**
- `action` -- used to filter by action type.
- `createdAt` -- used for chronological listing.
- `userId` -- used for per-user activity.
- `promptId` -- used for per-prompt history.

**Action types:**
- `PROMPT_CREATED`, `PROMPT_UPDATED`, `PROMPT_SUBMITTED`
- `REVIEW_APPROVED`, `REVIEW_REJECTED`, `REVIEW_NEEDS_CHANGES`, `REVIEW_ESCALATED`
- `PROMPT_PUBLISHED`, `PROMPT_UNPUBLISHED`, `PROMPT_ARCHIVED`
- `USER_ROLE_CHANGED`
- `AGENT_RUN_TRIGGERED`, `AGENT_RUN_COMPLETED`, `AGENT_RUN_FAILED`
- `PROMPT_UNLOCKED`

## Enum Values

See `memory/domain-glossary.md` for complete enum definitions and their meanings.
