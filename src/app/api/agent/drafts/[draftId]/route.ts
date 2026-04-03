import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getDraft } from '@/services/agent.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> },
) {
  try {
    await requireRole(['ADMIN'])
    const { draftId } = await params
    const draft = await getDraft(draftId)
    return NextResponse.json(draft)
  } catch (error) {
    return handleApiError(error)
  }
}
