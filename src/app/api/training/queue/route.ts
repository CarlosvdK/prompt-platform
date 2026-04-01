import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getTrainingQueue, getTrainingStats } from '@/services/training.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(['ADMIN'])
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1

    const [queue, stats] = await Promise.all([
      getTrainingQueue(user.id, page),
      getTrainingStats(user.id),
    ])

    return NextResponse.json({ ...queue, stats })
  } catch (error) {
    return handleApiError(error)
  }
}
