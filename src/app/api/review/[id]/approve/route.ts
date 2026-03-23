import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { reviewPrompt } from '@/services/review.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole(['REVIEWER', 'ADMIN'])
    const { id } = await params

    let notes: string | undefined
    try {
      const body = await request.json()
      notes = body.notes
    } catch {
      // Body is optional for approvals
    }

    const decision = await reviewPrompt(id, user.id, 'APPROVED', notes)
    return NextResponse.json({ success: true, decision })
  } catch (error) {
    return handleApiError(error)
  }
}
