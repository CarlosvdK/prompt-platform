import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { reviewPrompt } from '@/services/review.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

const rejectBodySchema = z.object({
  notes: z.string().min(10).max(5000),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(['REVIEWER', 'ADMIN'])
    const { id } = await params
    const body = await request.json()
    const { notes } = rejectBodySchema.parse(body)
    const { scoreVisual, scoreAlignment, scoreTechnical, scoreAccessibility } = body
    const scores = { scoreVisual, scoreAlignment, scoreTechnical, scoreAccessibility }

    const decision = await reviewPrompt(id, user.id, 'REJECTED', notes, scores)
    return NextResponse.json({ success: true, decision })
  } catch (error) {
    return handleApiError(error)
  }
}
