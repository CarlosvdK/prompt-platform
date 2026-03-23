'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useSearch } from '@/hooks/use-search'

interface PromptSearchProps {
  defaultValue?: string
  onSearch: (value: string) => void
  placeholder?: string
}

export function PromptSearch({
  defaultValue = '',
  onSearch,
  placeholder = 'Search prompts...',
}: PromptSearchProps) {
  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useSearch(value, 300)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  const handleClear = useCallback(() => {
    setValue('')
  }, [])

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-8 pr-8"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
