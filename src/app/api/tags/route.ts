import { NextResponse } from 'next/server'
import { listTags } from '@/services/category.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET() {
  try {
    const tags = await listTags()
    return NextResponse.json(tags)
  } catch (error) {
    return handleApiError(error)
  }
}
