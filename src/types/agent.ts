import { AgentRunStatus, PromptType } from '@prisma/client'

export interface GenerationRequest {
  skill: string
  input: {
    topic?: string
    category?: string
    type?: PromptType
    instructions?: string
  }
}

export interface AgentRunSummary {
  id: string
  skill: string
  status: AgentRunStatus
  createdAt: Date
  completedAt: Date | null
  draftCount: number
}

export interface AgentRunDetail extends AgentRunSummary {
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  error: string | null
  initiator: { id: string; name: string | null } | null
  drafts: {
    id: string
    title: string
    type: PromptType
    promptId: string | null
  }[]
}
