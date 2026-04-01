import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { labelPrompt } from '@/services/training.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

const labelSchema = z.object({
  label: z.enum(['GOOD', 'BAD']),
  notes: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole(['ADMIN'])
    const { id } = await params
    const body = await request.json()
    const { label, notes } = labelSchema.parse(body)

    const result = await labelPrompt(id, user.id, label, notes)
    return NextResponse.json({ success: true, label: result })
  } catch (error) {
    return handleApiError(error)
  }
}
