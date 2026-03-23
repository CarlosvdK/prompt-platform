import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET() {
  try {
    await requireRole(['ADMIN', 'REVIEWER'])

    const [
      totalPrompts,
      draftCount,
      pendingReviewCount,
      approvedCount,
      publishedCount,
      rejectedCount,
      archivedCount,
      totalUnlocks,
      totalAgentRuns,
    ] = await Promise.all([
      db.prompt.count(),
      db.prompt.count({ where: { status: 'DRAFT' } }),
      db.prompt.count({ where: { status: 'PENDING_REVIEW' } }),
      db.prompt.count({ where: { status: 'APPROVED' } }),
      db.prompt.count({ where: { status: 'PUBLISHED' } }),
      db.prompt.count({ where: { status: 'REJECTED' } }),
      db.prompt.count({ where: { status: 'ARCHIVED' } }),
      db.unlockEvent.count(),
      db.agentRun.count(),
    ])

    return NextResponse.json({
      totalPrompts,
      byStatus: {
        draft: draftCount,
        pendingReview: pendingReviewCount,
        approved: approvedCount,
        published: publishedCount,
        rejected: rejectedCount,
        archived: archivedCount,
      },
      totalUnlocks,
      totalAgentRuns,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
