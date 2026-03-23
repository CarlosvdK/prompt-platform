# Approval Workflow

## State Machine

```
                         ┌─────────────────┐
                         │                 │
                    ┌────┤  NEEDS_CHANGES  │<────────────────┐
                    │    │                 │                  │
                    │    └─────────────────┘                  │
                    │         │                               │
                    │         │ Author revises                │
                    │         v                               │
              ┌─────────────────┐     Submit      ┌─────────────────────┐
              │                 │ ──────────────> │                     │
   ┌─────────>│     DRAFT       │                 │   PENDING_REVIEW    │
   │          │                 │                 │                     │
   │          └─────────────────┘                 └──────────┬──────────┘
   │               │                                  │      │      │
   │               │ Archive                   Approve │      │      │ Reject
   │               v                                  │      │      │
   │          ┌─────────────────┐                     │      │      v
   │          │                 │                     │      │  ┌──────────┐
   │          │    ARCHIVED     │<────────────┐      │      │  │          │
   │          │                 │              │      │      │  │ REJECTED │
   │          └─────────────────┘              │      │      │  │          │
   │                                          │      │      │  └──────────┘
   │                                          │      v      │
   │   Unpublish                              │  ┌──────────────┐
   │                                          │  │              │
   └──────────────────────────────────────────┤  │   APPROVED   │
                                              │  │              │
                                              │  └──────┬───────┘
                                              │         │
                                              │         │ Publish (Admin only)
                                              │         v
                                              │  ┌──────────────┐
                                              │  │              │
                                              └──│  PUBLISHED   │
                                                 │              │
                                                 └──────────────┘
```

## Transitions

### DRAFT -> PENDING_REVIEW

**Trigger:** Author or agent submits the prompt for review.

**Guard conditions:**
- Prompt has a title, description, and content (non-empty).
- Prompt has a category assigned.
- Prompt has at least one tag.
- Prompt has at least one preview attached.
- Prompt type is set.

**Side effects:**
- AuditLog entry: `PROMPT_SUBMITTED`
- Prompt appears in the review queue.

**Who can perform:** Any user with access to the prompt, or the agent pipeline.

### PENDING_REVIEW -> APPROVED

**Trigger:** Reviewer approves the prompt.

**Guard conditions:**
- Reviewer has REVIEWER or ADMIN role.
- Reviewer provides notes (at minimum a brief approval note).
- Prompt is currently in PENDING_REVIEW status (no stale approvals).

**Side effects:**
- ReviewDecision record created with action APPROVED.
- AuditLog entry: `REVIEW_APPROVED`
- Prompt is now eligible for publishing.

**Who can perform:** REVIEWER, ADMIN.

### PENDING_REVIEW -> REJECTED

**Trigger:** Reviewer rejects the prompt.

**Guard conditions:**
- Reviewer has REVIEWER or ADMIN role.
- Reviewer provides detailed rejection notes.
- Prompt is currently in PENDING_REVIEW status.

**Side effects:**
- ReviewDecision record created with action REJECTED.
- AuditLog entry: `REVIEW_REJECTED`
- Prompt is removed from the review queue.

**Who can perform:** REVIEWER, ADMIN.

**Notes:** Rejection is final. The prompt must be substantially reworked and resubmitted as a new draft (or a revision if linked to an existing prompt).

### PENDING_REVIEW -> NEEDS_CHANGES

**Trigger:** Reviewer requests specific changes.

**Guard conditions:**
- Reviewer has REVIEWER or ADMIN role.
- Reviewer provides specific, actionable feedback in notes.
- Prompt is currently in PENDING_REVIEW status.

**Side effects:**
- ReviewDecision record created with action NEEDS_CHANGES.
- AuditLog entry: `REVIEW_NEEDS_CHANGES`
- Prompt is removed from the review queue.

**Who can perform:** REVIEWER, ADMIN.

### NEEDS_CHANGES -> PENDING_REVIEW

**Trigger:** Author revises the prompt and resubmits.

**Guard conditions:**
- Same as DRAFT -> PENDING_REVIEW (content completeness checks).
- Content must have actually changed since the last review (prevent no-op resubmissions).

**Side effects:**
- AuditLog entry: `PROMPT_SUBMITTED` (with detail indicating resubmission).
- Prompt appears in the review queue marked as a resubmission.
- Previous review decision and notes are visible to the next reviewer.

**Who can perform:** Any user with access to the prompt, or the agent pipeline.

### APPROVED -> PUBLISHED

**Trigger:** Admin publishes the approved prompt.

**Guard conditions:**
- User has ADMIN role (reviewers cannot publish).
- Prompt is currently in APPROVED status.
- Prompt passes a final automated check (all required fields present).

**Side effects:**
- `publishedAt` set to current timestamp (only on first publish; preserved on re-publish).
- New PromptVersion created if content differs from the last version.
- AuditLog entry: `PROMPT_PUBLISHED`
- Prompt becomes visible in the public catalog.

**Who can perform:** ADMIN only.

### PUBLISHED -> DRAFT (Unpublish)

**Trigger:** Admin unpublishes a prompt.

**Guard conditions:**
- User has ADMIN role.
- Prompt is currently in PUBLISHED status.
- Admin provides a reason for unpublishing.

**Side effects:**
- AuditLog entry: `PROMPT_UNPUBLISHED` with reason in details.
- Prompt is removed from the public catalog.
- Prompt detail page returns 404 for public users.
- Existing unlock tokens remain valid (already unlocked users keep their access to cached content).

**Who can perform:** ADMIN only.

### PUBLISHED -> ARCHIVED

**Trigger:** Admin archives a published prompt.

**Guard conditions:**
- User has ADMIN role.
- Prompt is currently in PUBLISHED status.

**Side effects:**
- AuditLog entry: `PROMPT_ARCHIVED`
- Prompt is removed from the public catalog.
- Prompt is retained in admin views and reporting.

**Who can perform:** ADMIN only.

### DRAFT -> ARCHIVED

**Trigger:** Admin archives an unused draft.

**Guard conditions:**
- User has ADMIN role.
- Prompt is currently in DRAFT status.

**Side effects:**
- AuditLog entry: `PROMPT_ARCHIVED`
- Prompt is removed from active views but retained for reference.

**Who can perform:** ADMIN only.

## Escalation

Escalation (PENDING_REVIEW -> ESCALATED flag) does not change the prompt's status. It adds a ReviewDecision record with action ESCALATED and flags the prompt for senior review. The prompt remains in PENDING_REVIEW and stays in the queue.

## Edge Cases

### Re-review After Content Update

If an approved prompt's content is edited before it is published, it must go through review again. The status transitions back to DRAFT, and the author must resubmit for review.

### Version Bump on Published Prompt

If a published prompt needs a content update:
1. Admin unpublishes it (PUBLISHED -> DRAFT).
2. Content is edited.
3. Prompt is resubmitted (DRAFT -> PENDING_REVIEW).
4. Reviewer approves (PENDING_REVIEW -> APPROVED).
5. Admin publishes (APPROVED -> PUBLISHED).
6. A new PromptVersion is created automatically.

### Concurrent Review

If two reviewers attempt to review the same prompt simultaneously:
- The first decision to be submitted takes effect.
- The second submission should detect the status has already changed and return an error (optimistic concurrency check).

## Audit Trail Requirements

Every transition creates an AuditLog entry with:
- The user who performed the action.
- The action type.
- The prompt ID.
- Details including the previous status and the new status.
- Timestamp.

The audit trail is append-only and cannot be modified or deleted.
