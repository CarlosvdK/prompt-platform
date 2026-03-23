import { PromptStatus, PromptType } from '@prisma/client'

export interface PromptSummary {
  id: string
  title: string
  slug: string
  description: string
  type: PromptType
  status: PromptStatus
  category: { id: string; name: string; slug: string }
  tags: { id: string; name: string; slug: string }[]
  viewCount: number
  unlockCount: number
  createdAt: Date
  publishedAt: Date | null
}

export interface PromptDetail extends PromptSummary {
  content: string
  previews: PromptPreviewData[]
  metadata: Record<string, unknown> | null
}

export interface PromptPreviewData {
  id: string
  type: string
  content: string
  sortOrder: number
}

export interface PromptFilters {
  categorySlug?: string
  tagSlug?: string
  type?: PromptType
  search?: string
  page?: number
  limit?: number
}

export interface CreatePromptInput {
  title: string
  description: string
  content: string
  type: PromptType
  categoryId: string
  tagIds?: string[]
  metadata?: Record<string, unknown>
}

export interface UpdatePromptInput {
  title?: string
  description?: string
  content?: string
  type?: PromptType
  categoryId?: string
  tagIds?: string[]
  metadata?: Record<string, unknown>
}
