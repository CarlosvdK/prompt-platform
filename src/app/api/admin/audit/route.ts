import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { getAuditLog } from '@/services/audit.service'
import { paginationSchema } from '@/validations/shared.schema'
import { handleApiError } from '@/app/api/_helpers/error-handler'

const auditFiltersSchema = paginationSchema.extend({
  userId: z.string().optional(),
  promptId: z.string().optional(),
  action: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN'])
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const filters = auditFiltersSchema.parse(searchParams)
    const result = await getAuditLog(filters)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
