'use client'

import { useEffect } from 'react'

interface KeyboardNavigationOptions {
  onEscape?: () => void
  onLeft?: () => void
  onRight?: () => void
  enabled?: boolean
}

export function useKeyboardNavigation({ onEscape, onLeft, onRight, enabled = true }: KeyboardNavigationOptions) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape?.()
      if (e.key === 'ArrowLeft') onLeft?.()
      if (e.key === 'ArrowRight') onRight?.()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEscape, onLeft, onRight, enabled])
}
