'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { PromptModalContext } from '@/hooks/use-prompt-modal'
import { PromptModal } from './prompt-modal'
import type { PromptSummary } from '@/types'

interface PromptModalProviderProps {
  children: React.ReactNode
  prompts: PromptSummary[]
}

export function PromptModalProvider({ children, prompts }: PromptModalProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeSlug = searchParams.get('prompt')

  const [promptDetail, setPromptDetail] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const slugs = useMemo(() => prompts.map((p) => p.slug), [prompts])
  const currentIndex = activeSlug ? slugs.indexOf(activeSlug) : -1

  const updateUrl = useCallback((slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('prompt', slug)
    } else {
      params.delete('prompt')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const openPrompt = useCallback((slug: string) => {
    updateUrl(slug)
  }, [updateUrl])

  const closePrompt = useCallback(() => {
    updateUrl(null)
    setPromptDetail(null)
  }, [updateUrl])

  const goNext = useCallback(() => {
    if (currentIndex < slugs.length - 1) {
      updateUrl(slugs[currentIndex + 1])
    }
  }, [currentIndex, slugs, updateUrl])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      updateUrl(slugs[currentIndex - 1])
    }
  }, [currentIndex, slugs, updateUrl])

  // Fetch prompt detail when activeSlug changes
  useEffect(() => {
    if (!activeSlug) {
      setPromptDetail(null)
      return
    }

    const prompt = prompts.find((p) => p.slug === activeSlug)
    if (!prompt) return

    setLoading(true)
    fetch(`/api/prompts/${prompt.id}`)
      .then((r) => r.json())
      .then((data) => {
        setPromptDetail(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeSlug, prompts])

  const contextValue = useMemo(() => ({
    activeSlug,
    openPrompt,
    closePrompt,
    goNext,
    goPrev,
    hasNext: currentIndex < slugs.length - 1,
    hasPrev: currentIndex > 0,
  }), [activeSlug, openPrompt, closePrompt, goNext, goPrev, currentIndex, slugs.length])

  return (
    <PromptModalContext.Provider value={contextValue}>
      {children}
      {activeSlug && (
        <PromptModal
          prompt={promptDetail}
          loading={loading}
          onClose={closePrompt}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < slugs.length - 1}
        />
      )}
    </PromptModalContext.Provider>
  )
}
