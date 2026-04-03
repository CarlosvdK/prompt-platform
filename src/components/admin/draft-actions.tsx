'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export function DraftActions({ draftId }: { draftId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (action: 'accept' | 'reject') => {
    setLoading(action)
    setError(null)

    try {
      const res = await fetch(`/api/agent/drafts/${draftId}/${action}`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Failed to ${action} draft`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button
        onClick={() => handleAction('accept')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-colors"
      >
        {loading === 'accept' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
        Accept
      </button>
      <button
        onClick={() => handleAction('reject')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-medium transition-colors"
      >
        {loading === 'reject' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
        Reject
      </button>
    </div>
  )
}
