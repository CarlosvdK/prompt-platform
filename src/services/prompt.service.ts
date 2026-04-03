import { Prisma, PromptStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { NotFoundError, ValidationError, WorkflowError } from '@/lib/errors'
import { slugify } from '@/lib/utils'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { canTransition } from '@/config/workflow'
import { logAction } from './audit.service'
import {
  PromptFilters,
  PromptDetail,
  PromptSummary,
  CreatePromptInput,
  UpdatePromptInput,
  PaginatedResult,
} from '@/types'

const promptSummarySelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  type: true,
  status: true,
  thumbnailUrl: true,
  metadata: true,
  viewCount: true,
  unlockCount: true,
  createdAt: true,
  publishedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  tags: {
    select: {
      tag: { select: { id: true, name: true, slug: true } },
    },
  },
  previews: {
    where: { type: 'code_snippet' },
    select: { id: true },
    take: 1,
  },
}

function mapTags<T extends { tags: { tag: { id: string; name: string; slug: string } }[] }>(
  prompt: T,
): Omit<T, 'tags'> & { tags: { id: string; name: string; slug: string }[] } {
  const { tags, ...rest } = prompt
  return { ...rest, tags: tags.map((t) => t.tag) }
}

export async function listPublishedPrompts(
  filters: PromptFilters,
): Promise<PaginatedResult<PromptSummary>> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? ITEMS_PER_PAGE
  const where: Record<string, unknown> = { status: 'PUBLISHED' as PromptStatus }

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug }
  }
  if (filters.tagSlug) {
    where.tags = { some: { tag: { slug: filters.tagSlug } } }
  }
  if (filters.type) {
    where.type = filters.type
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  const [rawData, total] = await Promise.all([
    db.prompt.findMany({
      where,
      select: promptSummarySelect,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.prompt.count({ where }),
  ])

  const data = rawData.map((p) => {
    const mapped = mapTags(p)
    const { previews, ...rest } = mapped
    return { ...rest, hasCodePreview: previews.length > 0 }
  }) as PromptSummary[]

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPromptById(id: string): Promise<PromptDetail> {
  const prompt = await db.prompt.findUnique({
    where: { id },
    select: {
      ...promptSummarySelect,
      content: true,
      metadata: true,
      previews: {
        select: { id: true, type: true, content: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!prompt) throw new NotFoundError('Prompt')

  // Increment view count in background
  db.prompt.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  return mapTags(prompt) as unknown as PromptDetail
}

export async function getPromptBySlug(slug: string): Promise<PromptDetail> {
  const prompt = await db.prompt.findUnique({
    where: { slug },
    select: {
      ...promptSummarySelect,
      content: true,
      metadata: true,
      previews: {
        select: { id: true, type: true, content: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!prompt) throw new NotFoundError('Prompt')

  // Increment view count in background
  db.prompt.update({ where: { slug }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  return mapTags(prompt) as unknown as PromptDetail
}

export async function getPromptContent(id: string): Promise<string> {
  const prompt = await db.prompt.findUnique({
    where: { id },
    select: { content: true, status: true },
  })

  if (!prompt) throw new NotFoundError('Prompt')
  if (prompt.status !== 'PUBLISHED') {
    throw new ValidationError('Prompt is not published')
  }

  return prompt.content
}

export async function createPrompt(data: CreatePromptInput, userId?: string) {
  let slug = slugify(data.title)

  // Ensure slug uniqueness by appending a suffix if needed
  const existing = await db.prompt.findUnique({ where: { slug } })
  if (existing) {
    const suffix = Date.now().toString(36)
    slug = `${slug}-${suffix}`
  }

  const prompt = await db.prompt.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      content: data.content,
      type: data.type,
      categoryId: data.categoryId,
      metadata: (data.metadata as Prisma.InputJsonValue) ?? undefined,
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
      versions: {
        create: {
          version: 1,
          content: data.content,
          metadata: (data.metadata as Prisma.InputJsonValue) ?? undefined,
          changelog: 'Initial version',
        },
      },
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
    },
  })

  await logAction({
    userId,
    promptId: prompt.id,
    action: 'prompt.created',
    details: { title: data.title, type: data.type },
  })

  return mapTags(prompt)
}

export async function updatePrompt(id: string, data: UpdatePromptInput, userId?: string) {
  const existing = await db.prompt.findUnique({
    where: { id },
    select: { id: true, content: true },
  })
  if (!existing) throw new NotFoundError('Prompt')

  // Get current version number
  const latestVersion = await db.promptVersion.findFirst({
    where: { promptId: id },
    orderBy: { version: 'desc' },
    select: { version: true },
  })
  const nextVersion = (latestVersion?.version ?? 0) + 1

  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.description !== undefined) updateData.description = data.description
  if (data.content !== undefined) updateData.content = data.content
  if (data.type !== undefined) updateData.type = data.type
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
  if (data.metadata !== undefined) updateData.metadata = data.metadata

  const prompt = await db.$transaction(async (tx) => {
    // Update tags if provided
    if (data.tagIds !== undefined) {
      await tx.promptTag.deleteMany({ where: { promptId: id } })
      if (data.tagIds.length > 0) {
        await tx.promptTag.createMany({
          data: data.tagIds.map((tagId) => ({ promptId: id, tagId })),
        })
      }
    }

    // Create new version if content changed
    if (data.content !== undefined) {
      await tx.promptVersion.create({
        data: {
          promptId: id,
          version: nextVersion,
          content: data.content,
          metadata: (data.metadata as Prisma.InputJsonValue) ?? undefined,
          changelog: `Updated to version ${nextVersion}`,
        },
      })
    }

    return tx.prompt.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    })
  })

  await logAction({
    userId,
    promptId: id,
    action: 'prompt.updated',
    details: { version: nextVersion, fields: Object.keys(data) },
  })

  return mapTags(prompt)
}

export async function updatePromptStatus(id: string, newStatus: PromptStatus, userId?: string) {
  const prompt = await db.prompt.findUnique({
    where: { id },
    select: { id: true, status: true },
  })
  if (!prompt) throw new NotFoundError('Prompt')

  if (!canTransition(prompt.status, newStatus)) {
    throw new WorkflowError(`Cannot transition from ${prompt.status} to ${newStatus}`)
  }

  const updateData: Record<string, unknown> = { status: newStatus }
  if (newStatus === 'PUBLISHED') {
    updateData.publishedAt = new Date()
  }

  const updated = await db.prompt.update({
    where: { id },
    data: updateData,
  })

  await logAction({
    userId,
    promptId: id,
    action: 'prompt.status_changed',
    details: { from: prompt.status, to: newStatus },
  })

  return updated
}

export async function searchPrompts(
  query: string,
  filters: PromptFilters,
): Promise<PaginatedResult<PromptSummary>> {
  return listPublishedPrompts({ ...filters, search: query })
}

export async function publishPrompt(id: string, userId?: string) {
  const prompt = await db.prompt.findUnique({
    where: { id },
    select: { id: true, status: true },
  })
  if (!prompt) throw new NotFoundError('Prompt')

  if (prompt.status !== 'APPROVED') {
    throw new WorkflowError('Prompt must be APPROVED before publishing')
  }

  return updatePromptStatus(id, 'PUBLISHED', userId)
}

export async function archivePrompt(id: string, userId?: string) {
  return updatePromptStatus(id, 'ARCHIVED', userId)
}
