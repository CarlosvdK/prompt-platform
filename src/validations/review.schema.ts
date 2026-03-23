import { z } from 'zod'
import { paginationSchema } from './shared.schema'

const reviewActionEnum = z.enum(['APPROVED', 'REJECTED', 'NEEDS_CHANGES', 'ESCALATED'])
const promptStatusEnum = z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_CHANGES', 'PUBLISHED', 'ARCHIVED'])

export const reviewDecisionSchema = z.object({
  action: reviewActionEnum,
  notes: z.string().max(5000).optional(),
}).refine(
  (data) => {
    if (data.action === 'REJECTED' || data.action === 'NEEDS_CHANGES') {
      return !!data.notes && data.notes.length >= 10
    }
    return true
  },
  { message: 'Notes are required (min 10 chars) for rejections and change requests' },
)

export const reviewQueueSchema = paginationSchema.extend({
  status: promptStatusEnum.optional(),
})

export type ReviewDecisionInput = z.infer<typeof reviewDecisionSchema>
export type ReviewQueueInput = z.infer<typeof reviewQueueSchema>
