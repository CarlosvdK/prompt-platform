'use client'

import { useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Lock, Copy, Check, Eye, Unlock as UnlockIcon, ExternalLink } from 'lucide-react'
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AdContainer } from '@/components/unlock/ad-container'
import { useUnlock } from '@/hooks/use-unlock'
import { useCopy } from '@/hooks/use-copy'
import { LivePreview } from './live-preview'
import { PromptGallery } from './prompt-gallery'

interface PromptModalProps {
  prompt: any | null
  loading: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function PromptModal({ prompt, loading, onClose, onPrev, onNext, hasPrev, hasNext }: PromptModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { copy, copied } = useCopy()
  const { state, content, error, session, initiateUnlock, completeAd } = useUnlock()

  useKeyboardNavigation({
    onEscape: onClose,
    onLeft: hasPrev ? onPrev : undefined,
    onRight: hasNext ? onNext : undefined,
    enabled: true,
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const isUnlocked = state === 'unlocked'
  const hasPreviewCode = prompt?.metadata?.previewCode

  const handleCopyClick = () => {
    if (isUnlocked && content) {
      copy(content)
    } else if (prompt && state === 'idle') {
      initiateUnlock(prompt.id)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      {/* Prev arrow */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full p-2.5 transition-all hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ChevronLeft className="h-5 w-5 text-white/70" />
        </button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full p-2.5 transition-all hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ChevronRight className="h-5 w-5 text-white/70" />
        </button>
      )}

      {/* Modal */}
      <div
        className="relative w-full max-w-6xl max-h-[92vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-bold gradient-text shrink-0">Softset</span>
            {loading ? (
              <Skeleton className="h-5 w-48" />
            ) : prompt ? (
              <>
                <span className="text-sm font-medium text-white/90 truncate">{prompt.title}</span>
                {prompt.category && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: 'rgba(102,126,234,0.15)', color: '#667eea' }}
                  >
                    {prompt.category.name}
                  </span>
                )}
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {prompt && (
              <button
                onClick={handleCopyClick}
                disabled={state === 'initiating' || state === 'verifying'}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50"
                style={isUnlocked ? {
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                } : {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                {isUnlocked ? (
                  copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy prompt</>
                ) : (
                  <><Lock className="h-4 w-4" /> Copy prompt</>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[#64748b] hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="aspect-video w-full p-8">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          ) : state === 'ad_playing' && session ? (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
              <AdContainer
                sessionId={session.sessionId}
                adConfig={session.adConfig ?? {}}
                onComplete={() => completeAd(session.sessionId)}
              />
            </div>
          ) : prompt ? (
            <>
              {/* Live Preview or Gallery fallback */}
              {hasPreviewCode ? (
                <LivePreview promptId={prompt.id} title={prompt.title} />
              ) : prompt.previews && prompt.previews.length > 0 ? (
                <PromptGallery previews={prompt.previews} />
              ) : (
                <div className="aspect-video w-full flex items-center justify-center" style={{ background: '#09090b' }}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white/10 mb-2">{prompt.category?.name?.charAt(0) || 'S'}</div>
                    <p className="text-sm text-[#64748b]">No preview available</p>
                  </div>
                </div>
              )}

              {/* Unlocked content */}
              {isUnlocked && content && (
                <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#22c55e]">Prompt Unlocked</span>
                    <button
                      onClick={() => copy(content)}
                      className="flex items-center gap-1 text-xs text-[#94a3b8] hover:text-white transition-colors"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre
                    className="rounded-xl p-4 text-sm font-mono leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap"
                    style={{ background: '#09090b', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {content}
                  </pre>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="px-5 py-3 text-sm text-red-400">{error}</div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        {prompt && !loading && (
          <div
            className="flex items-center justify-between px-5 py-3 shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {prompt.tags?.map((tag: any) => (
                <span
                  key={tag.id || tag.slug}
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-[#64748b]">
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{prompt.viewCount ?? 0}</span>
              <span className="flex items-center gap-1"><UnlockIcon className="h-3.5 w-3.5" />{prompt.unlockCount ?? 0}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
