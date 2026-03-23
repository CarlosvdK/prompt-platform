'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { X } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PromptSearch } from './prompt-search'

interface PromptFiltersProps {
  categories?: { slug: string; name: string }[]
  types?: string[]
}

export function PromptFilters({ categories = [], types = [] }: PromptFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') ?? ''
  const currentType = searchParams.get('type') ?? ''
  const currentSearch = searchParams.get('search') ?? ''

  const hasFilters = currentCategory || currentType || currentSearch

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <PromptSearch
        defaultValue={currentSearch}
        onSearch={(value) => updateParams('search', value)}
      />

      <Select
        value={currentCategory}
        onChange={(e) => updateParams('category', e.target.value)}
        className="w-full sm:w-44"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </Select>

      <Select
        value={currentType}
        onChange={(e) => updateParams('type', e.target.value)}
        className="w-full sm:w-40"
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
