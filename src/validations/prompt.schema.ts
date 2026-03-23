import { z } from 'zod'
import { paginationSchema } from './shared.schema'

const promptTypeEnum = z.enum(['TEXT', 'CODE', 'SYSTEM_PROMPT', 'CHAIN', 'IMAGE'])

export const createPromptSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  content: z.string().min(10).max(50000),
  type: promptTypeEnum.default('TEXT'),
  categoryId: z.string().min(1),
  tagIds: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const updatePromptSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  content: z.string().min(10).max(50000).optional(),
  type: promptTypeEnum.optional(),
  categoryId: z.string().min(1).optional(),
  tagIds: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const listPromptsSchema = paginationSchema.extend({
  categorySlug: z.string().optional(),
  tagSlug: z.string().optional(),
  type: promptTypeEnum.optional(),
  search: z.string().max(200).optional(),
})

export type CreatePromptInput = z.infer<typeof createPromptSchema>
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>
export type ListPromptsInput = z.infer<typeof listPromptsSchema>
