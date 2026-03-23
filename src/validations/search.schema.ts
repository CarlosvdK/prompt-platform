import { z } from 'zod'
import { paginationSchema } from './shared.schema'

export const searchSchema = paginationSchema.extend({
  q: z.string().min(1).max(200),
  category: z.string().optional(),
  type: z.enum(['TEXT', 'CODE', 'SYSTEM_PROMPT', 'CHAIN', 'IMAGE']).optional(),
  tags: z.string().optional(), // comma-separated tag slugs
})

export type SearchInput = z.infer<typeof searchSchema>
