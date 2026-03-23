import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { listPublishedPrompts, createPrompt } from '@/services/prompt.service'
import { listPromptsSchema, createPromptSchema } from '@/validations/prompt.schema'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const filters = listPromptsSchema.parse(searchParams)
    const result = await listPublishedPrompts(filters)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(['ADMIN'])
    const body = await request.json()
    const data = createPromptSchema.parse(body)
    const prompt = await createPrompt(data, user.id)
    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
