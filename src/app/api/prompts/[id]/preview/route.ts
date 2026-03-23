import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NotFoundError } from '@/lib/errors'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const prompt = await db.prompt.findUnique({
      where: { id },
      select: {
        id: true,
        previews: {
          select: { id: true, type: true, content: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!prompt) throw new NotFoundError('Prompt')

    return NextResponse.json(prompt.previews)
  } catch (error) {
    return handleApiError(error)
  }
}
