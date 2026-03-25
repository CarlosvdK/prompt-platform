export const dynamic = 'force-dynamic'

import { listPublishedPrompts } from '@/services/prompt.service'
import { listCategories } from '@/services/category.service'
import { HomePage } from '@/components/home/home-page'

export default async function Page() {
  let prompts: any[] = []
  let categories: any[] = []

  try {
    const [result, cats] = await Promise.all([
      listPublishedPrompts({ page: 1, limit: 50 }),
      listCategories(),
    ])
    prompts = result.data
    categories = cats
  } catch {
    // DB unavailable
  }

  return <HomePage prompts={prompts} categories={categories} />
}
