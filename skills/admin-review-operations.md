# Admin Review Operations

## Overview

Admin and reviewer users manage the prompt lifecycle through a review workflow. This document defines the operational procedures for each admin action.

## Roles and Permissions

| Action | USER | REVIEWER | ADMIN |
|---|---|---|---|
| View review queue | No | Yes | Yes |
| View prompt detail (review context) | No | Yes | Yes |
| Approve prompt | No | Yes | Yes |
| Reject prompt | No | Yes | Yes |
| Request changes | No | Yes | Yes |
| Escalate prompt | No | Yes | Yes |
| Publish approved prompt | No | No | Yes |
| Unpublish prompt | No | No | Yes |
| Archive prompt | No | No | Yes |
| View audit trail | No | Read own | Read all |
| Manage users and roles | No | No | Yes |
| Trigger agent runs | No | No | Yes |
| View agent run history | No | No | Yes |

## Accessing the Review Queue

The review queue is available at `/admin/reviews` and shows all prompts with status `PENDING_REVIEW`.

### Queue Display

- Sorted by submission date (oldest first -- FIFO).
- Shows: title, category, type, submitted date, agent run ID (if agent-generated).
- Filterable by: category, type, date range.
- Searchable by title and description text.

### Queue Indicators

- **New submissions** (never reviewed) are visually distinct from **resubmissions** (previously returned with NEEDS_CHANGES).
- **Resubmissions** show a link to the previous review decision and notes.

## Reviewing a Prompt

### Review Detail View

When a reviewer opens a prompt from the queue, they see:

1. **Content panel.** Full prompt content with syntax highlighting for code prompts.
2. **Metadata panel.** Title, description, category, tags, type, model compatibility.
3. **Preview panel.** All attached previews rendered as they would appear to end users.
4. **History panel.** Previous versions, review decisions, and audit log entries for this prompt.
5. **Agent context** (if agent-generated). The agent run ID, skill used, input parameters, and generation timestamp.

### Review Actions

#### Approve

- Sets prompt status to `APPROVED`.
- The prompt is now eligible for publishing but is not yet visible to end users.
- Reviewer must provide at least a brief note (even "Looks good" is acceptable).
- Creates a ReviewDecision record and an AuditLog entry.

#### Reject

- Sets prompt status to `REJECTED`.
- The prompt is removed from the review queue and will not be published.
- Reviewer must provide detailed notes explaining why the prompt was rejected.
- Rejection is final -- the prompt must be substantially reworked and resubmitted as a new draft.
- Creates a ReviewDecision record and an AuditLog entry.

#### Request Changes

- Sets prompt status to `NEEDS_CHANGES`.
- The prompt is returned to the draft stage for revision.
- Reviewer must provide specific, actionable feedback: what needs to change and why.
- When the author (or agent) makes changes and resubmits, the prompt returns to `PENDING_REVIEW` and appears in the queue as a resubmission.
- Creates a ReviewDecision record and an AuditLog entry.

#### Escalate

- Flags the prompt for senior review without changing its status.
- Used when the reviewer is uncertain about a policy interpretation or quality judgment.
- Reviewer must provide context for the escalation.
- Creates a ReviewDecision record with action `ESCALATED` and an AuditLog entry.

## Publishing

Only ADMIN users can publish prompts.

### Publish Flow

1. Admin navigates to the approved prompts list (`/admin/prompts?status=APPROVED`).
2. Admin reviews the prompt one final time (lightweight check, not a full re-review).
3. Admin clicks "Publish."
4. System sets status to `PUBLISHED`, sets `publishedAt` timestamp, creates a new PromptVersion if content differs from the last version.
5. The prompt is now visible in the public catalog.
6. An AuditLog entry records the publish action.

### Publish Gate

The system enforces that only prompts with status `APPROVED` can be published. Attempting to publish a prompt in any other status is rejected at the service layer.

## Unpublishing

Used when a published prompt needs to be removed from the public catalog (policy violation discovered post-publish, quality issue reported, content outdated).

1. Admin navigates to the prompt detail page.
2. Admin clicks "Unpublish" and provides a reason.
3. System sets status back to `DRAFT`.
4. The prompt is no longer visible in the public catalog.
5. Existing unlock tokens for this prompt remain valid (users who already unlocked can still access cached content, but the prompt page returns 404 for new visitors).
6. An AuditLog entry records the unpublish action and reason.

## Archiving

Used for prompts that are no longer relevant but should be preserved for historical reference.

1. Admin navigates to the prompt detail page.
2. Admin clicks "Archive."
3. System sets status to `ARCHIVED`.
4. Archived prompts are not visible in the public catalog and do not appear in the review queue.
5. Archived prompts are still visible in admin search and reporting.
6. An AuditLog entry records the archive action.

## Audit Trail Review

All admin actions create AuditLog entries. The audit trail is accessible at `/admin/audit-log` and shows:

- Timestamp.
- User who performed the action.
- Action type (APPROVE, REJECT, PUBLISH, UNPUBLISH, ARCHIVE, etc.).
- Affected prompt (if applicable).
- Details (notes, previous status, etc.).

The audit log is append-only. Entries cannot be edited or deleted.

### Filtering the Audit Log

- By user (who performed the action).
- By action type.
- By prompt.
- By date range.

## Agent Run Monitoring

Admins can view agent run history at `/admin/agent-runs`:

- List of all runs with status, skill, timestamps, and initiator.
- Detail view shows input parameters, output, generated drafts, and error information.
- Admins can cancel queued or running agent runs.
- Admins can trigger new agent runs with specified skills and parameters.

### Monitoring Agent Quality

- Track approval rate of agent-generated prompts vs manually created prompts.
- Review patterns in rejection reasons for agent-generated content.
- Identify skills that produce consistently low-quality drafts for improvement.
