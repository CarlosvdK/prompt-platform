export const ITEMS_PER_PAGE = 12

export const MAX_PREVIEW_LENGTH = 500

export const AD_VIEW_DURATION_MS = 5000

export const UNLOCK_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

export const PROMPT_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEEDS_CHANGES: 'Needs Changes',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

export const PROMPT_TYPE_LABELS: Record<string, string> = {
  TEXT: 'Text',
  CODE: 'Code',
  SYSTEM_PROMPT: 'System Prompt',
  CHAIN: 'Chain',
  IMAGE: 'Image',
}

export const USER_ROLE_LABELS: Record<string, string> = {
  USER: 'User',
  EDITOR: 'Editor',
  REVIEWER: 'Reviewer',
  ADMIN: 'Admin',
}
