'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/components/ui/toast'

interface LoadingState {
  approve: boolean
  reject: boolean
  requestChanges: boolean
}

export function useReviewActions() {
  const [loading, setLoading] = useState<LoadingState>({
    approve: false,
    reject: false,
    requestChanges: false,
  })
  const { toast } = useToast()

  const performAction = useCallback(
    async (
      promptId: string,
      action: 'APPROVED' | 'REJECTED' | 'NEEDS_CHANGES',
      notes?: string
    ) => {
      const loadingKey =
        action === 'APPROVED'
          ? 'approve'
          : action === 'REJECTED'
            ? 'reject'
            : 'requestChanges'

      try {
        setLoading((prev) => ({ ...prev, [loadingKey]: true }))

        const res = await fetch(`/api/admin/review/${promptId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, notes }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? 'Review action failed')
        }

        toast({
          title: 'Review submitted',
          description: `Prompt has been ${action.toLowerCase().replace('_', ' ')}.`,
          variant: 'success',
        })
      } catch (err) {
        toast({
          title: 'Error',
          description:
            err instanceof Error ? err.message : 'Review action failed',
          variant: 'destructive',
        })
        throw err
      } finally {
        setLoading((prev) => ({ ...prev, [loadingKey]: false }))
      }
    },
    [toast]
  )

  const approve = useCallback(
    (promptId: string, notes?: string) =>
      performAction(promptId, 'APPROVED', notes),
    [performAction]
  )

  const reject = useCallback(
    (promptId: string, notes: string) =>
      performAction(promptId, 'REJECTED', notes),
    [performAction]
  )

  const requestChanges = useCallback(
    (promptId: string, notes: string) =>
      performAction(promptId, 'NEEDS_CHANGES', notes),
    [performAction]
  )

  return { approve, reject, requestChanges, loading }
}
