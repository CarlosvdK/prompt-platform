'use client'

import { createContext, useContext } from 'react'

export interface PromptModalContextType {
  activeSlug: string | null
  openPrompt: (slug: string) => void
  closePrompt: () => void
  goNext: () => void
  goPrev: () => void
  hasNext: boolean
  hasPrev: boolean
}

export const PromptModalContext = createContext<PromptModalContextType | null>(null)

export function usePromptModal() {
  const context = useContext(PromptModalContext)
  if (!context) throw new Error('usePromptModal must be used within PromptModalProvider')
  return context
}
