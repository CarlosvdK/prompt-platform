'use client'

import { useState, useEffect, useCallback } from 'react'
import { ThumbsUp, ThumbsDown, SkipForward, Brain, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { LivePreview } from '@/components/prompts/live-preview'

interface TrainingItem {
  id: string
  title: string
  slug: string
  description: string
  content: string
  thumbnailUrl: string | null
  category: { name: string; slug: string }
  viewCount: number
  unlockCount: number
}

interface TrainingStats {
  totalLabeled: number
  totalGood: number
  totalBad: number
  totalUnlabeled: number
}

interface TrainingLabelerProps {
  initialItems: TrainingItem[]
  initialStats: TrainingStats
  totalPages: number
}

const categoryGradients: Record<string, string> = {
  'landing-pages': 'from-violet-950 to-indigo-950',
  headers: 'from-blue-950 to-cyan-950',
  cards: 'from-emerald-950 to-teal-950',
  forms: 'from-amber-950 to-orange-950',
  authentication: 'from-rose-950 to-pink-950',
  checkout: 'from-purple-950 to-fuchsia-950',
  animations: 'from-cyan-950 to-sky-950',
  backgrounds: 'from-indigo-950 to-violet-950',
  footers: 'from-slate-950 to-zinc-950',
  dashboards: 'from-blue-950 to-indigo-950',
  modals: 'from-fuchsia-950 to-purple-950',
  tables: 'from-teal-950 to-emerald-950',
}

export function TrainingLabeler({ initialItems, initialStats, totalPages }: TrainingLabelerProps) {
  const [items, setItems] = useState<TrainingItem[]>(initialItems)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stats, setStats] = useState<TrainingStats>(initialStats)
  const [page, setPage] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [lastAction, setLastAction] = useState<'GOOD' | 'BAD' | null>(null)
  const [imageError, setImageError] = useState(false)
  const [done, setDone] = useState(initialItems.length === 0)
  const [showContent, setShowContent] = useState(false)

  const current = items[currentIndex] ?? null

  // Reset image error and content panel when prompt changes
  useEffect(() => {
    setImageError(false)
    setShowContent(false)
  }, [currentIndex])

  // Keyboard shortcuts: G = good, B = bad, S = skip
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (submitting || !current) return
      if (e.key === 'g' || e.key === 'G') handleLabel('GOOD')
      if (e.key === 'b' || e.key === 'B') handleLabel('BAD')
      if (e.key === 's' || e.key === 'S') handleSkip()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitting, current, currentIndex])

  const advance = useCallback(async () => {
    const nextIndex = currentIndex + 1

    if (nextIndex < items.length) {
      setCurrentIndex(nextIndex)
    } else if (page < totalPages) {
      // Fetch next page
      const nextPage = page + 1
      const res = await fetch(`/api/training/queue?page=${nextPage}`)
      if (res.ok) {
        const json = await res.json()
        if (json.data?.length > 0) {
          setItems(json.data)
          setCurrentIndex(0)
          setPage(nextPage)
        } else {
          setDone(true)
        }
      }
    } else {
      setDone(true)
    }
  }, [currentIndex, items.length, page, totalPages])

  const handleLabel = useCallback(
    async (label: 'GOOD' | 'BAD') => {
      if (!current || submitting) return
      setSubmitting(true)
      setLastAction(label)

      try {
        await fetch(`/api/training/${current.id}/label`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label }),
        })

        setStats((prev) => ({
          ...prev,
          totalLabeled: prev.totalLabeled + 1,
          totalGood: label === 'GOOD' ? prev.totalGood + 1 : prev.totalGood,
          totalBad: label === 'BAD' ? prev.totalBad + 1 : prev.totalBad,
          totalUnlabeled: Math.max(0, prev.totalUnlabeled - 1),
        }))

        await advance()
      } finally {
        setSubmitting(false)
      }
    },
    [current, submitting, advance],
  )

  const handleSkip = useCallback(() => {
    if (!current || submitting) return
    advance()
  }, [current, submitting, advance])

  const total = stats.totalLabeled + stats.totalUnlabeled
  const progress = total > 0 ? Math.round((stats.totalLabeled / total) * 100) : 0

  // ─── All done ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <CheckCircle2 className="h-16 w-16" style={{ color: '#667eea' }} />
        <h2 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
          Queue complete!
        </h2>
        <p className="text-sm" style={{ color: '#64748b' }}>
          You&apos;ve labeled all available prompts. Come back after more are published.
        </p>
        <div className="flex gap-8 mt-4">
          <Stat label="Good" value={stats.totalGood} color="#4ade80" />
          <Stat label="Bad" value={stats.totalBad} color="#f87171" />
          <Stat label="Total" value={stats.totalLabeled} color="#667eea" />
        </div>
      </div>
    )
  }

  const gradient = current
    ? (categoryGradients[current.category.slug] ?? 'from-zinc-900 to-zinc-800')
    : ''

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      {/* ─── Stats bar ─────────────────────────────────── */}
      <div className="flex items-center gap-6 flex-wrap">
        <Stat label="Labeled" value={stats.totalLabeled} color="#667eea" />
        <Stat label="Good" value={stats.totalGood} color="#4ade80" />
        <Stat label="Bad" value={stats.totalBad} color="#f87171" />
        <Stat label="Remaining" value={stats.totalUnlabeled} color="#94a3b8" />

        <div className="flex-1 min-w-[160px]">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#64748b' }}>
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── Card ──────────────────────────────────────── */}
      {current && (
        <div
          key={current.id}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Preview */}
          <div className="relative aspect-video bg-black overflow-hidden">
            {current.thumbnailUrl && !imageError ? (
              <img
                src={current.thumbnailUrl}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <LivePreview promptId={current.id} title={current.title} />
            )}

            {/* Last action flash */}
            {lastAction && submitting && (
              <div
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{
                  background:
                    lastAction === 'GOOD'
                      ? 'rgba(74,222,128,0.18)'
                      : 'rgba(248,113,113,0.18)',
                }}
              >
                {lastAction === 'GOOD' ? (
                  <ThumbsUp className="h-16 w-16 text-green-400 animate-bounce" />
                ) : (
                  <ThumbsDown className="h-16 w-16 text-red-400 animate-bounce" />
                )}
              </div>
            )}
          </div>

          {/* Info + actions */}
          <div className="p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: '#f1f5f9' }}>
                  {current.title}
                </h2>
                <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                  {current.category.name} &middot; {current.viewCount} views &middot;{' '}
                  {current.unlockCount} unlocks
                </p>
              </div>
              <span
                className="shrink-0 text-xs rounded-full px-3 py-1"
                style={{
                  background: 'rgba(102,126,234,0.12)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(102,126,234,0.2)',
                }}
              >
                {currentIndex + 1} / {items.length + (page - 1) * items.length}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLabel('GOOD')}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 disabled:opacity-40"
                style={{
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.25)',
                  color: '#4ade80',
                }}
                onMouseEnter={(e) => {
                  if (!submitting)
                    e.currentTarget.style.background = 'rgba(74,222,128,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(74,222,128,0.1)'
                }}
              >
                <ThumbsUp className="h-4 w-4" />
                Good design
                <kbd
                  className="ml-1 text-xs rounded px-1.5 py-0.5 hidden sm:inline-block"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#64748b' }}
                >
                  G
                </kbd>
              </button>

              <button
                onClick={() => handleLabel('BAD')}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 disabled:opacity-40"
                style={{
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.25)',
                  color: '#f87171',
                }}
                onMouseEnter={(e) => {
                  if (!submitting)
                    e.currentTarget.style.background = 'rgba(248,113,113,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(248,113,113,0.1)'
                }}
              >
                <ThumbsDown className="h-4 w-4" />
                Bad design
                <kbd
                  className="ml-1 text-xs rounded px-1.5 py-0.5 hidden sm:inline-block"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#64748b' }}
                >
                  B
                </kbd>
              </button>

              <button
                onClick={handleSkip}
                disabled={submitting}
                className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 disabled:opacity-40"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b',
                }}
                onMouseEnter={(e) => {
                  if (!submitting) e.currentTarget.style.color = '#94a3b8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b'
                }}
                title="Skip (S)"
              >
                <SkipForward className="h-4 w-4" />
                <span className="hidden sm:inline">Skip</span>
                <kbd
                  className="ml-1 text-xs rounded px-1.5 py-0.5 hidden sm:inline-block"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  S
                </kbd>
              </button>
            </div>

            <p className="text-xs text-center mt-4" style={{ color: '#475569' }}>
              Keyboard shortcuts: <strong style={{ color: '#64748b' }}>G</strong> good &middot;{' '}
              <strong style={{ color: '#64748b' }}>B</strong> bad &middot;{' '}
              <strong style={{ color: '#64748b' }}>S</strong> skip
            </p>
          </div>

          {/* Expandable prompt content */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setShowContent((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-3 text-sm transition-colors"
              style={{ color: '#64748b', background: 'rgba(255,255,255,0.02)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b' }}
            >
              <span>View prompt content</span>
              {showContent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showContent && (
              <div className="px-6 pb-6 flex flex-col gap-3">
                {current.description && (
                  <p className="text-sm" style={{ color: '#94a3b8' }}>{current.description}</p>
                )}
                <pre
                  className="text-xs rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-words"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#cbd5e1',
                    fontFamily: 'ui-monospace, monospace',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  {current.content}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context hint */}
      <div
        className="flex items-start gap-3 rounded-xl p-4 text-sm"
        style={{
          background: 'rgba(102,126,234,0.06)',
          border: '1px solid rgba(102,126,234,0.15)',
        }}
      >
        <Brain className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#667eea' }} />
        <p style={{ color: '#94a3b8' }}>
          Your labels train the model to distinguish high-quality UI/UX designs from poor ones.
          Judge based on visual quality, layout clarity, and design consistency.
        </p>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: '#64748b' }}>
        {label}
      </span>
    </div>
  )
}
