'use client'

import { useState, useCallback } from 'react'
import type { UnlockSession } from '@/types/api'

type UnlockState = 'idle' | 'initiating' | 'ad_playing' | 'verifying' | 'unlocked' | 'error'

export function useUnlock() {
  const [state, setState] = useState<UnlockState>('idle')
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<UnlockSession | null>(null)

  const initiateUnlock = useCallback(async (promptId: string) => {
    try {
      setState('initiating')
      setError(null)

      const res = await fetch('/api/unlock/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to initiate unlock')
      }

      const data = await res.json()
      setSession(data.data)
      setState('ad_playing')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Failed to initiate unlock')
    }
  }, [])

  const completeAd = useCallback(async (sessionId: string) => {
    try {
      setState('verifying')

      const res = await fetch('/api/unlock/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to verify unlock')
      }

      const data = await res.json()
      setContent(data.data.content)
      setState('unlocked')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Failed to verify unlock')
    }
  }, [])

  return {
    state,
    content,
    error,
    session,
    initiateUnlock,
    completeAd,
  }
}
