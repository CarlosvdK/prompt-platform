import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { reviewPrompt } from '@/services/review.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

const requestChangesBodySchema = z.object({
  notes: z.string().min(10).max(5000),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(['REVIEWER', 'ADMIN'])
    const { id } = await params
    const body = await request.json()
    const { notes } = requestChangesBodySchema.parse(body)

    const decision = await reviewPrompt(id, user.id, 'NEEDS_CHANGES', notes)
    return NextResponse.json({ success: true, decision })
  } catch (error) {
    return handleApiError(error)
  }
}
