import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { NotFoundError, ValidationError } from '@/lib/errors'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { slugify } from '@/lib/utils'
import { getAIProvider } from '@/adapters/ai'
import { logAction } from './audit.service'
import { submitForReview } from './review.service'
import { GenerationRequest, AgentRunDetail, AgentRunSummary, PaginatedResult } from '@/types'

export async function requestGeneration(
  params: GenerationRequest,
  userId?: string,
) {
  const run = await db.agentRun.create({
    data: {
      skill: params.skill,
      input: params.input as unknown as Prisma.InputJsonValue,
      status: 'QUEUED',
      initiatedBy: userId,
    },
  })

  await logAction({
    userId,
    action: 'agent.run_queued',
    details: { runId: run.id, skill: params.skill },
  })

  // Start generation in background
  setTimeout(() => {
    executeGeneration(run.id).catch((err) => {
      console.error(`Agent run ${run.id} failed:`, err)
    })
  }, 0)

  return run
}

export async function executeGeneration(runId: string) {
  // Update status to RUNNING
  await db.agentRun.update({
    where: { id: runId },
    data: { status: 'RUNNING', startedAt: new Date() },
  })

  try {
    const run = await db.agentRun.findUnique({
      where: { id: runId },
      select: { input: true, skill: true, initiatedBy: true },
    })
    if (!run) throw new Error('Agent run not found')

    const input = run.input as Record<string, unknown>
    const aiProvider = getAIProvider()

    // Build prompt from input parameters
    const parts: string[] = [
      `Generate a high-quality prompt for the following:`,
      `Skill: ${run.skill}`,
    ]
    if (input.topic) parts.push(`Topic: ${input.topic}`)
    if (input.category) parts.push(`Category: ${input.category}`)
    if (input.type) parts.push(`Type: ${input.type}`)
    if (input.instructions) parts.push(`Instructions: ${input.instructions}`)

    const result = await aiProvider.generateCompletion({
      prompt: parts.join('\n'),
      systemPrompt:
        'You are a prompt engineering expert. Generate a well-structured prompt based on the given parameters. Return a JSON object with title, description, and content fields.',
      maxTokens: 2000,
      temperature: 0.7,
    })

    // Parse generated content
    let parsed: { title: string; description: string; content: string }
    try {
      parsed = JSON.parse(result.content)
    } catch {
      parsed = {
        title: `Generated prompt for ${input.topic ?? run.skill}`,
        description: `AI-generated prompt about ${input.topic ?? run.skill}`,
        content: result.content,
      }
    }

    // Create the draft
    const draft = await db.promptDraft.create({
      data: {
        agentRunId: runId,
        title: parsed.title,
        description: parsed.description,
        content: parsed.content,
        type: (input.type as 'TEXT' | 'CODE' | 'SYSTEM_PROMPT' | 'CHAIN' | 'IMAGE') ?? 'TEXT',
      },
    })

    // Update run to completed
    await db.agentRun.update({
      where: { id: runId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        output: {
          draftId: draft.id,
          usage: result.usage,
        },
      },
    })

    await logAction({
      userId: run.initiatedBy ?? undefined,
      action: 'agent.run_completed',
      details: { runId, draftId: draft.id },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await db.agentRun.update({
      where: { id: runId },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        error: message,
      },
    })

    await logAction({
      action: 'agent.run_failed',
      details: { runId, error: message },
    })

    throw error
  }
}

export async function getRunStatus(runId: string): Promise<AgentRunDetail> {
  const run = await db.agentRun.findUnique({
    where: { id: runId },
    include: {
      initiator: { select: { id: true, name: true } },
      drafts: {
        select: {
          id: true,
          title: true,
          type: true,
          promptId: true,
        },
      },
    },
  })
  if (!run) throw new NotFoundError('Agent run')

  return {
    id: run.id,
    skill: run.skill,
    status: run.status,
    createdAt: run.createdAt,
    completedAt: run.completedAt,
    draftCount: run.drafts.length,
    input: run.input as Record<string, unknown>,
    output: run.output as Record<string, unknown> | null,
    error: run.error,
    initiator: run.initiator,
    drafts: run.drafts,
  }
}

export async function listRuns(
  page = 1,
  limit = ITEMS_PER_PAGE,
): Promise<PaginatedResult<AgentRunSummary>> {
  const [rawData, total] = await Promise.all([
    db.agentRun.findMany({
      include: {
        _count: { select: { drafts: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.agentRun.count(),
  ])

  const data: AgentRunSummary[] = rawData.map((r) => ({
    id: r.id,
    skill: r.skill,
    status: r.status,
    createdAt: r.createdAt,
    completedAt: r.completedAt,
    draftCount: r._count.drafts,
  }))

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function acceptDraft(draftId: string, userId?: string) {
  const draft = await db.promptDraft.findUnique({
    where: { id: draftId },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      type: true,
      metadata: true,
      promptId: true,
    },
  })
  if (!draft) throw new NotFoundError('Draft')
  if (draft.promptId) {
    throw new ValidationError('Draft has already been accepted')
  }

  // Create a real prompt from the draft
  let slug = slugify(draft.title)
  const existing = await db.prompt.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const [prompt] = await db.$transaction([
    db.prompt.create({
      data: {
        title: draft.title,
        slug,
        description: draft.description,
        content: draft.content,
        type: draft.type,
        categoryId: await getDefaultCategoryId(),
        metadata: draft.metadata ?? undefined,
        versions: {
          create: {
            version: 1,
            content: draft.content,
            changelog: 'Created from AI-generated draft',
          },
        },
      },
    }),
    db.promptDraft.update({
      where: { id: draftId },
      data: { promptId: undefined }, // Will be set after prompt creation
    }),
  ])

  // Link draft to prompt
  await db.promptDraft.update({
    where: { id: draftId },
    data: { promptId: prompt.id },
  })

  // Submit for review
  await submitForReview(prompt.id, userId)

  await logAction({
    userId,
    promptId: prompt.id,
    action: 'agent.draft_accepted',
    details: { draftId, promptId: prompt.id },
  })

  return prompt
}

export async function rejectDraft(draftId: string, userId?: string) {
  const draft = await db.promptDraft.findUnique({
    where: { id: draftId },
    select: { id: true },
  })
  if (!draft) throw new NotFoundError('Draft')

  await db.promptDraft.delete({ where: { id: draftId } })

  await logAction({
    userId,
    action: 'agent.draft_rejected',
    details: { draftId },
  })
}

async function getDefaultCategoryId(): Promise<string> {
  const category = await db.category.findFirst({
    orderBy: { sortOrder: 'asc' },
    select: { id: true },
  })
  if (!category) {
    throw new ValidationError('No categories exist. Please create a category first.')
  }
  return category.id
}
