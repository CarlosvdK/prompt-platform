import { Prisma, AuditLog } from '@prisma/client'
import { db } from '@/lib/db'
import { PaginatedResult, AuditFilters } from '@/types'
import { ITEMS_PER_PAGE } from '@/lib/constants'

interface AuditContext {
  userId?: string
  promptId?: string
  action: string
  details?: Record<string, unknown>
  ipAddress?: string
}

export async function logAction(context: AuditContext) {
  return db.auditLog.create({
    data: {
      userId: context.userId,
      promptId: context.promptId,
      action: context.action,
      details: (context.details as Prisma.InputJsonValue) ?? undefined,
      ipAddress: context.ipAddress,
    },
  })
}

export async function getAuditLog(
  filters: AuditFilters,
): Promise<PaginatedResult<AuditLog & { user: { id: string; name: string | null; email: string } | null; prompt: { id: string; title: string } | null }>> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? ITEMS_PER_PAGE
  const where: Record<string, unknown> = {}

  if (filters.userId) where.userId = filters.userId
  if (filters.promptId) where.promptId = filters.promptId
  if (filters.action) where.action = { contains: filters.action }

  const [data, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        prompt: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.auditLog.count({ where }),
  ])

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}
