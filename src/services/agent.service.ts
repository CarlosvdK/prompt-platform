import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { NotFoundError, ValidationError } from '@/lib/errors'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { slugify } from '@/lib/utils'
import { getAIProvider } from '@/adapters/ai'
import { logAction } from './audit.service'
import { submitForReview } from './review.service'
import { GenerationRequest, AgentRunDetail, AgentRunSummary, PaginatedResult } from '@/types'
import { logger } from '@/lib/logger'
import { AGENT_CONFIGS, getAgentConfig, buildSystemPrompt, getRandomTopic } from '@/config/agents'

const FALLBACK_SYSTEM_PROMPT = 'You are a prompt engineering expert. Generate a well-structured prompt based on the given parameters. Return a JSON object with title, description, content, previewCode, tags, and categorySlug fields.'

export async function requestGeneration(params: GenerationRequest, userId?: string) {
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

    // Look up specialized agent config
    const agentConfig = getAgentConfig(run.skill)
    const isUIGeneration = !!agentConfig || run.skill === 'ui-component-generation'

    // Build prompt from input parameters
    const parts: string[] = []
    if (agentConfig) {
      const topic = (input.topic as string) ?? getRandomTopic(agentConfig)
      parts.push(`Create a UI component prompt for: "${topic}"`)
      parts.push(`Category: ${agentConfig.categorySlug}`)
      if (input.instructions) parts.push(`Additional instructions: ${input.instructions}`)
      parts.push('Make it visually impressive, production-ready, and unique.')
    } else if (isUIGeneration) {
      parts.push(`Create a UI component prompt for: "${input.topic ?? input.variation ?? 'a modern component'}"`)
      if (input.category) parts.push(`Category: ${input.category}`)
      parts.push('The component should use React and Tailwind CSS. Make it visually impressive and production-ready.')
    } else {
      parts.push(`Generate a high-quality prompt for the following:`)
      parts.push(`Skill: ${run.skill}`)
      if (input.topic) parts.push(`Topic: ${input.topic}`)
      if (input.category) parts.push(`Category: ${input.category}`)
      if (input.type) parts.push(`Type: ${input.type}`)
      if (input.instructions) parts.push(`Instructions: ${input.instructions}`)
    }

    const systemPrompt = agentConfig
      ? buildSystemPrompt(agentConfig)
      : FALLBACK_SYSTEM_PROMPT

    const result = await aiProvider.generateCompletion({
      prompt: parts.join('\n'),
      systemPrompt,
      maxTokens: isUIGeneration ? 4096 : 2000,
      temperature: 0.7,
    })

    // Parse generated content
    let parsed: { title: string; description: string; content: string; previewCode?: string; tags?: string[]; categorySlug?: string }
    try {
      const jsonStr = result.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(jsonStr)
    } catch {
      parsed = {
        title: `Generated prompt for ${input.topic ?? run.skill}`,
        description: `AI-generated prompt about ${input.topic ?? run.skill}`,
        content: result.content,
      }
    }

    // Build metadata with previewCode, tags, and categorySlug if available
    const metadata: Record<string, unknown> = {}
    if (parsed.previewCode) {
      metadata.previewCode = parsed.previewCode
    }
    if (parsed.tags) {
      metadata.tags = parsed.tags
    }
    if (parsed.categorySlug) {
      metadata.categorySlug = parsed.categorySlug
    }

    // Create the draft
    const draft = await db.promptDraft.create({
      data: {
        agentRunId: runId,
        title: parsed.title,
        description: parsed.description,
        content: parsed.content,
        type: isUIGeneration
          ? 'CODE'
          : ((input.type as 'TEXT' | 'CODE' | 'SYSTEM_PROMPT' | 'CHAIN' | 'IMAGE') ?? 'TEXT'),
        metadata: Object.keys(metadata).length > 0 ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    })

    // previewCode is stored in draft.metadata for now
    // It gets created as a PromptPreview when the draft is accepted via acceptDraft()
    if (parsed.previewCode) {
      logger.info('Preview code stored in draft metadata', { draftId: draft.id })
    }

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

  const draftMeta = (draft.metadata as Record<string, any>) ?? {}
  let category = null
  if (draftMeta.categorySlug) {
    category = await db.category.findUnique({ where: { slug: draftMeta.categorySlug } })
  }
  if (!category) {
    category = await db.category.findFirst({ orderBy: { sortOrder: 'asc' } })
  }
  if (!category) throw new ValidationError('No categories exist')

  const [prompt] = await db.$transaction([
    db.prompt.create({
      data: {
        title: draft.title,
        slug,
        description: draft.description,
        content: draft.content,
        type: draft.type,
        categoryId: category.id,
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

  // Create PromptPreview from previewCode if available
  if (draftMeta.previewCode) {
    await db.promptPreview.create({
      data: {
        promptId: prompt.id,
        type: 'code_snippet',
        content: draftMeta.previewCode as string,
        sortOrder: 1,
      },
    })
  }

  // Store tags from generation metadata
  if (Array.isArray(draftMeta.tags) && draftMeta.tags.length > 0) {
    const existingTags = await db.tag.findMany({
      where: { slug: { in: draftMeta.tags } },
    })
    if (existingTags.length > 0) {
      await db.promptTag.createMany({
        data: existingTags.map((tag) => ({ promptId: prompt.id, tagId: tag.id })),
        skipDuplicates: true,
      })
    }
  }

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

export async function getDraft(draftId: string) {
  const draft = await db.promptDraft.findUnique({
    where: { id: draftId },
    include: {
      agentRun: { select: { id: true, skill: true, status: true } },
    },
  })
  if (!draft) throw new NotFoundError('Draft')
  return draft
}

export async function batchGenerate(agentIds: string[], userId?: string, topic?: string) {
  const configs = agentIds.length > 0
    ? AGENT_CONFIGS.filter((c) => agentIds.includes(c.id))
    : AGENT_CONFIGS

  const runs = await Promise.all(
    configs.map((config) =>
      requestGeneration(
        {
          skill: config.id,
          input: {
            topic: topic ?? getRandomTopic(config),
            category: config.categorySlug,
          },
        },
        userId,
      ),
    ),
  )

  return runs
}

export function listAgentConfigs() {
  return AGENT_CONFIGS.map(({ id, name, description, categorySlug, exampleTopics }) => ({
    id,
    name,
    description,
    categorySlug,
    exampleTopics,
  }))
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

