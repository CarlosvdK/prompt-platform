import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { listRuns } from '@/services/agent.service'
import { paginationSchema } from '@/validations/shared.schema'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN'])
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const { page, limit } = paginationSchema.parse(searchParams)
    const result = await listRuns(page, limit)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
