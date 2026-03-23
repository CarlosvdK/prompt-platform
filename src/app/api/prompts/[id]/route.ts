import { NextRequest, NextResponse } from 'next/server'
import { requireRole, getServerAuth } from '@/lib/auth'
import { getPromptById, updatePrompt } from '@/services/prompt.service'
import { updatePromptSchema } from '@/validations/prompt.schema'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const prompt = await getPromptById(id)

    // Check if user is admin to include full details
    const session = await getServerAuth()
    const isAdmin = session?.user?.role === 'ADMIN'

    if (!isAdmin) {
      // Remove content-level data for non-admins; previews are visible
      const { metadata, ...publicData } = prompt
      return NextResponse.json(publicData)
    }

    return NextResponse.json(prompt)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole(['ADMIN'])
    const { id } = await params
    const body = await request.json()
    const data = updatePromptSchema.parse(body)
    const prompt = await updatePrompt(id, data, user.id)
    return NextResponse.json(prompt)
  } catch (error) {
    return handleApiError(error)
  }
}
