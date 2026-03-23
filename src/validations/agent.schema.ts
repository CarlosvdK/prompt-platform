import { z } from 'zod'

export const generateRequestSchema = z.object({
  skill: z.string().min(1).max(100),
  input: z.object({
    topic: z.string().max(500).optional(),
    category: z.string().max(100).optional(),
    type: z.enum(['TEXT', 'CODE', 'SYSTEM_PROMPT', 'CHAIN', 'IMAGE']).optional(),
    instructions: z.string().max(5000).optional(),
  }),
})

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>
