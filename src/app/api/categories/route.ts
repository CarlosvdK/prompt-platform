import { NextResponse } from 'next/server'
import { listCategories } from '@/services/category.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

export async function GET() {
  try {
    const categories = await listCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return handleApiError(error)
  }
}
