import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getRunStatus } from '@/services/agent.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ runId: string }> },
) {
  try {
    await requireRole(['ADMIN'])
    const { runId } = await params
    const run = await getRunStatus(runId)
    return NextResponse.json(run)
  } catch (error) {
    return handleApiError(error)
  }
}
