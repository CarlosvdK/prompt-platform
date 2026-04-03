import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getReviewQueueWithPreviews, getLearningStats } from '@/services/review.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN', 'REVIEWER'])

    const url = new URL(request.url)
    const status = url.searchParams.get('status') ?? 'PENDING_REVIEW'
    const page = Number(url.searchParams.get('page')) || 1

    const [queue, learningStats] = await Promise.all([
      getReviewQueueWithPreviews({ status: status as any, page }),
      getLearningStats(),
    ])

    return NextResponse.json({ ...queue, learningStats })
  } catch (error) {
    return handleApiError(error)
  }
}
