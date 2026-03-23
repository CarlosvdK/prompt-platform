import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { requestGeneration } from '@/services/agent.service'
import { generateRequestSchema } from '@/validations/agent.schema'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(['ADMIN'])
    const body = await request.json()
    const data = generateRequestSchema.parse(body)
    const run = await requestGeneration(data, user.id)
    return NextResponse.json(run, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
