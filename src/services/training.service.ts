import { TrainingLabelValue } from '@prisma/client'
import { db } from '@/lib/db'
import { NotFoundError } from '@/lib/errors'
import { ITEMS_PER_PAGE } from '@/lib/constants'

export interface TrainingQueueItem {
  id: string
  title: string
  slug: string
  description: string
  content: string
  thumbnailUrl: string | null
  category: { name: string; slug: string }
  viewCount: number
  unlockCount: number
}

export interface TrainingStats {
  totalLabeled: number
  totalGood: number
  totalBad: number
  totalUnlabeled: number
}

/**
 * Returns PUBLISHED prompts that the given admin has NOT yet labeled,
 * oldest-first so the queue is deterministic.
 */
export async function getTrainingQueue(
  adminId: string,
  page = 1,
  limit = ITEMS_PER_PAGE,
): Promise<{ data: TrainingQueueItem[]; total: number; page: number; totalPages: number }> {
  const alreadyLabeled = await db.trainingLabel.findMany({
    where: { adminId },
    select: { promptId: true },
  })
  const excludeIds = alreadyLabeled.map((l) => l.promptId)

  const where = {
    status: 'PUBLISHED' as const,
    ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
  }

  const [rawData, total] = await Promise.all([
    db.prompt.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        thumbnailUrl: true,
        viewCount: true,
        unlockCount: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.prompt.count({ where }),
  ])

  return { data: rawData, total, page, totalPages: Math.ceil(total / limit) }
}

/**
 * Saves (or updates) a training label for a prompt by the given admin.
 */
export async function labelPrompt(
  promptId: string,
  adminId: string,
  label: TrainingLabelValue,
  notes?: string,
) {
  const prompt = await db.prompt.findUnique({ where: { id: promptId }, select: { id: true } })
  if (!prompt) throw new NotFoundError('Prompt')

  return db.trainingLabel.upsert({
    where: { promptId_adminId: { promptId, adminId } },
    create: { promptId, adminId, label, notes },
    update: { label, notes },
  })
}

/**
 * Returns training statistics for the given admin.
 */
export async function getTrainingStats(adminId: string): Promise<TrainingStats> {
  const [totalLabeled, totalGood, totalPublished] = await Promise.all([
    db.trainingLabel.count({ where: { adminId } }),
    db.trainingLabel.count({ where: { adminId, label: 'GOOD' } }),
    db.prompt.count({ where: { status: 'PUBLISHED' } }),
  ])

  return {
    totalLabeled,
    totalGood,
    totalBad: totalLabeled - totalGood,
    totalUnlabeled: Math.max(0, totalPublished - totalLabeled),
  }
}
