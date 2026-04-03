import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { acceptDraft } from '@/services/agent.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> },
) {
  try {
    const user = await requireRole(['ADMIN'])
    const { draftId } = await params
    const prompt = await acceptDraft(draftId, user.id)
    return NextResponse.json({ success: true, promptId: prompt.id })
  } catch (error) {
    return handleApiError(error)
  }
}
