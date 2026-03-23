import { NextRequest, NextResponse } from 'next/server'
import { searchPrompts } from '@/services/prompt.service'
import { searchSchema } from '@/validations/search.schema'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const { q, page, limit, category, type } = searchSchema.parse(searchParams)

    const result = await searchPrompts(q, {
      categorySlug: category,
      type,
      page,
      limit,
    })

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
