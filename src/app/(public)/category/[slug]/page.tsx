import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/services/category.service'
import { listPublishedPrompts } from '@/services/prompt.service'
import { PromptGrid } from '@/components/prompts/prompt-grid'
import { Pagination } from '@/components/shared/pagination'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category Not Found' }

  return {
    title: `${category.name} Prompts | Softset`,
    description: category.description ?? `Browse ${category.name} AI prompts on Softset.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const result = await listPublishedPrompts({
    categorySlug: slug,
    page,
  })

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && <p className="text-muted-foreground mb-8">{category.description}</p>}

      {result.data.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No prompts found in this category yet.
        </p>
      ) : (
        <>
          <PromptGrid prompts={result.data} />
          <div className="mt-8">
            <Pagination page={result.page} totalPages={result.totalPages} />
          </div>
        </>
      )}
    </div>
  )
}
