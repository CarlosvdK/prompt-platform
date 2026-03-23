import { ReviewAction } from '@prisma/client'
import { db } from '@/lib/db'
import { NotFoundError, WorkflowError } from '@/lib/errors'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { canTransition, REVIEW_ACTION_TO_STATUS } from '@/config/workflow'
import { logAction } from './audit.service'
import { QueueFilters, ReviewQueueItem, ReviewHistoryItem, PaginatedResult } from '@/types'

export async function getReviewQueue(
  filters: QueueFilters,
): Promise<PaginatedResult<ReviewQueueItem>> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? ITEMS_PER_PAGE
  const where: Record<string, unknown> = {
    status: filters.status ?? 'PENDING_REVIEW',
  }

  const [rawData, total] = await Promise.all([
    db.prompt.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { name: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.prompt.count({ where }),
  ])

  const data: ReviewQueueItem[] = rawData.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    type: p.type,
    status: p.status,
    category: p.category,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    reviewCount: p._count.reviews,
  }))

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function submitForReview(promptId: string, userId?: string) {
  const prompt = await db.prompt.findUnique({
    where: { id: promptId },
    select: { id: true, status: true },
  })
  if (!prompt) throw new NotFoundError('Prompt')

  if (!canTransition(prompt.status, 'PENDING_REVIEW')) {
    throw new WorkflowError(
      `Cannot submit for review from status ${prompt.status}`,
    )
  }

  const updated = await db.prompt.update({
    where: { id: promptId },
    data: { status: 'PENDING_REVIEW' },
  })

  await logAction({
    userId,
    promptId,
    action: 'prompt.submitted_for_review',
    details: { from: prompt.status },
  })

  return updated
}

export async function reviewPrompt(
  promptId: string,
  reviewerId: string,
  action: ReviewAction,
  notes?: string,
) {
  const prompt = await db.prompt.findUnique({
    where: { id: promptId },
    select: { id: true, status: true },
  })
  if (!prompt) throw new NotFoundError('Prompt')

  const targetStatus = REVIEW_ACTION_TO_STATUS[action]

  if (!canTransition(prompt.status, targetStatus)) {
    throw new WorkflowError(
      `Cannot apply review action ${action} to prompt in status ${prompt.status}`,
    )
  }

  const [decision] = await db.$transaction([
    db.reviewDecision.create({
      data: {
        promptId,
        reviewerId,
        action,
        notes,
      },
      include: {
        reviewer: { select: { id: true, name: true, email: true } },
      },
    }),
    db.prompt.update({
      where: { id: promptId },
      data: { status: targetStatus },
    }),
  ])

  await logAction({
    userId: reviewerId,
    promptId,
    action: 'prompt.reviewed',
    details: { reviewAction: action, targetStatus, notes },
  })

  return decision
}

export async function getReviewHistory(promptId: string): Promise<ReviewHistoryItem[]> {
  const prompt = await db.prompt.findUnique({
    where: { id: promptId },
    select: { id: true },
  })
  if (!prompt) throw new NotFoundError('Prompt')

  return db.reviewDecision.findMany({
    where: { promptId },
    select: {
      id: true,
      action: true,
      notes: true,
      createdAt: true,
      reviewer: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}
