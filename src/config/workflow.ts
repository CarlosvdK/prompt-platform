import { PromptStatus, ReviewAction } from '@prisma/client'

// Define valid status transitions
export const VALID_TRANSITIONS: Record<PromptStatus, PromptStatus[]> = {
  DRAFT: ['PENDING_REVIEW'],
  PENDING_REVIEW: ['APPROVED', 'REJECTED', 'NEEDS_CHANGES'],
  APPROVED: ['PUBLISHED', 'ARCHIVED'],
  REJECTED: ['DRAFT', 'ARCHIVED'],
  NEEDS_CHANGES: ['DRAFT', 'PENDING_REVIEW'],
  PUBLISHED: ['ARCHIVED'],
  ARCHIVED: ['DRAFT'],
}

// Map review actions to resulting prompt statuses
export const REVIEW_ACTION_TO_STATUS: Record<ReviewAction, PromptStatus> = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  NEEDS_CHANGES: 'NEEDS_CHANGES',
  ESCALATED: 'PENDING_REVIEW', // stays in review
}

export function canTransition(from: PromptStatus, to: PromptStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}

export function getNextStatuses(current: PromptStatus): PromptStatus[] {
  return VALID_TRANSITIONS[current] ?? []
}
