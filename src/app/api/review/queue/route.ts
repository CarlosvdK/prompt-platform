import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getReviewQueue } from '@/services/review.service'
import { reviewQueueSchema } from '@/validations/review.schema'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(request: NextRequest) {
  try {
    await requireRole(['REVIEWER', 'ADMIN'])
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const filters = reviewQueueSchema.parse(searchParams)
    const result = await getReviewQueue(filters)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
