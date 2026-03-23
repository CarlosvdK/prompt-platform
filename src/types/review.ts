import { ReviewAction, PromptStatus } from '@prisma/client'

export interface ReviewQueueItem {
  id: string
  title: string
  slug: string
  type: string
  status: PromptStatus
  category: { name: string }
  createdAt: Date
  updatedAt: Date
  reviewCount: number
}

export interface ReviewDecisionInput {
  action: ReviewAction
  notes?: string
}

export interface ReviewHistoryItem {
  id: string
  action: ReviewAction
  notes: string | null
  reviewer: { id: string; name: string | null; email: string }
  createdAt: Date
}

export interface QueueFilters {
  status?: PromptStatus
  page?: number
  limit?: number
}
