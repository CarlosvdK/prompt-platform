import type { Metadata } from 'next'
import { listPublishedPrompts } from '@/services/prompt.service'
import { listCategories, listTags } from '@/services/category.service'
import { PromptGrid } from '@/components/prompts/prompt-grid'
import { PromptFilters } from '@/components/prompts/prompt-filters'
import { PromptModalProvider } from '@/components/prompts/prompt-modal-provider'
import { Pagination } from '@/components/shared/pagination'
import type { PromptType } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Browse | Softset',
  description: 'Discover high-quality AI prompts.',
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const categorySlug = typeof params.category === 'string' ? params.category : undefined
  const tagSlug = typeof params.tag === 'string' ? params.tag : undefined
  const type = typeof params.type === 'string' ? (params.type as PromptType) : undefined
  const search = typeof params.search === 'string' ? params.search : undefined

  const [result, categories, tags] = await Promise.all([
    listPublishedPrompts({ page, categorySlug, tagSlug, type, search }),
    listCategories(),
    listTags(),
  ])

  return (
    <PromptModalProvider prompts={result.data}>
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 border-r border-border p-4 overflow-y-auto">
          <PromptFilters categories={categories} tags={tags} />
        </aside>

        {/* Main grid */}
        <main className="flex-1 p-4">
          <PromptGrid prompts={result.data} />

          {result.totalPages > 1 && (
            <div className="mt-6">
              <Pagination page={result.page} totalPages={result.totalPages} />
            </div>
          )}
        </main>
      </div>
    </PromptModalProvider>
  )
}
