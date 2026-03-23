import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerAuth } from '@/lib/auth'
import { verifyUnlock } from '@/services/unlock.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

const verifyBodySchema = z.object({
  sessionId: z.string().min(1),
  promptId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, promptId } = verifyBodySchema.parse(body)

    const session = await getServerAuth()
    const userId = session?.user?.id

    const content = await verifyUnlock(sessionId, promptId, userId)
    return NextResponse.json({ content, token: sessionId })
  } catch (error) {
    return handleApiError(error)
  }
}
