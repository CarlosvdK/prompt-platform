'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearch } from '@/hooks/use-search'

interface PromptFiltersProps {
  categories: { slug: string; name: string }[]
  tags?: { slug: string; name: string }[]
}

export function PromptFilters({ categories, tags = [] }: PromptFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') ?? ''
  const currentSort = searchParams.get('sort') ?? 'newest'
  const currentTime = searchParams.get('time') ?? 'all'
  const currentSearch = searchParams.get('search') ?? ''
  const currentTags = searchParams.get('tags')?.split(',').filter(Boolean) ?? []

  const [searchValue, setSearchValue] = useState(currentSearch)
  const debouncedSearch = useSearch(searchValue, 300)

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    params.delete('prompt') // close modal when filtering
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const toggleTag = (tagSlug: string) => {
    const newTags = currentTags.includes(tagSlug)
      ? currentTags.filter((t) => t !== tagSlug)
      : [...currentTags, tagSlug]
    updateParam('tags', newTags.join(','))
  }

  const clearAll = () => {
    router.replace(pathname, { scroll: false })
    setSearchValue('')
  }

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      updateParam('search', debouncedSearch)
    }
  }, [debouncedSearch])

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most viewed' },
    { value: 'most_unlocked', label: 'Most unlocked' },
  ]

  const timeOptions = [
    { value: 'all', label: 'All time' },
    { value: 'week', label: 'Last week' },
    { value: 'month', label: 'Last month' },
    { value: 'quarter', label: 'Last 3 months' },
  ]

  const hasFilters = currentCategory || currentSearch || currentTags.length > 0 || currentSort !== 'newest' || currentTime !== 'all'

  return (
    <div className="space-y-6 text-sm">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">
            Clear
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs font-medium text-muted-foreground mb-2">Category</h3>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer py-0.5">
            <input
              type="radio"
              name="category"
              checked={!currentCategory}
              onChange={() => updateParam('category', '')}
              className="accent-primary"
            />
            <span className={!currentCategory ? 'text-foreground font-medium' : 'text-muted-foreground'}>All</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer py-0.5">
              <input
                type="radio"
                name="category"
                checked={currentCategory === cat.slug}
                onChange={() => updateParam('category', cat.slug)}
                className="accent-primary"
              />
              <span className={currentCategory === cat.slug ? 'text-foreground font-medium' : 'text-muted-foreground'}>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-xs font-medium text-muted-foreground mb-2">Sort</h3>
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer py-0.5">
              <input
                type="radio"
                name="sort"
                checked={currentSort === opt.value}
                onChange={() => updateParam('sort', opt.value)}
                className="accent-primary"
              />
              <span className={currentSort === opt.value ? 'text-foreground font-medium' : 'text-muted-foreground'}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time */}
      <div>
        <h3 className="text-xs font-medium text-muted-foreground mb-2">Time</h3>
        <div className="space-y-1">
          {timeOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer py-0.5">
              <input
                type="radio"
                name="time"
                checked={currentTime === opt.value}
                onChange={() => updateParam('time', opt.value)}
                className="accent-primary"
              />
              <span className={currentTime === opt.value ? 'text-foreground font-medium' : 'text-muted-foreground'}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">Tags</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {tags.map((tag) => (
              <label key={tag.slug} className="flex items-center gap-2 cursor-pointer py-0.5">
                <input
                  type="checkbox"
                  checked={currentTags.includes(tag.slug)}
                  onChange={() => toggleTag(tag.slug)}
                  className="accent-primary rounded"
                />
                <span className={currentTags.includes(tag.slug) ? 'text-foreground font-medium' : 'text-muted-foreground'}>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
