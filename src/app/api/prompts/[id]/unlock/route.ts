import { NextRequest, NextResponse } from 'next/server'
import { getServerAuth } from '@/lib/auth'
import { initiateUnlock } from '@/services/unlock.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerAuth()
    const userId = session?.user?.id

    const unlockSession = await initiateUnlock(id, userId)
    return NextResponse.json(unlockSession)
  } catch (error) {
    return handleApiError(error)
  }
}
