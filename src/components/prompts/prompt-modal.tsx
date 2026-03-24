'use client'

import { useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Lock, Copy, Check, Eye, Unlock as UnlockIcon } from 'lucide-react'
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AdContainer } from '@/components/unlock/ad-container'
import { useUnlock } from '@/hooks/use-unlock'
import { useCopy } from '@/hooks/use-copy'
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

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const isUnlocked = state === 'unlocked'

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      {/* Prev arrow */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Modal content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-xl bg-card border border-border overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {loading ? (
              <Skeleton className="h-5 w-48" />
            ) : prompt ? (
              <>
                <span className="text-sm font-medium truncate">{prompt.title}</span>
                {prompt.category && (
                  <Badge variant="secondary" className="shrink-0">{prompt.category.name}</Badge>
                )}
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Copy/Unlock button */}
            {prompt && (
              <Button
                size="sm"
                onClick={handleCopyClick}
                disabled={state === 'initiating' || state === 'verifying'}
                className={isUnlocked ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {isUnlocked ? (
                  copied ? (
                    <><Check className="h-4 w-4" /> Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4" /> Copy prompt</>
                  )
                ) : (
                  <><Lock className="h-4 w-4" /> Copy prompt</>
                )}
              </Button>
            )}
            <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="aspect-video w-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : state === 'ad_playing' && session ? (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
              <AdContainer
                sessionId={session.sessionId}
                adConfig={session.adConfig}
                onComplete={() => completeAd(session.sessionId)}
              />
            </div>
          ) : prompt ? (
            <>
              {/* Preview gallery */}
              {prompt.previews && prompt.previews.length > 0 ? (
                <PromptGallery previews={prompt.previews} />
              ) : prompt.thumbnailUrl ? (
                <div className="aspect-video w-full bg-muted flex items-center justify-center">
                  <img src={prompt.thumbnailUrl} alt={prompt.title} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="aspect-video w-full bg-muted/50 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No preview available</span>
                </div>
              )}

              {/* Unlocked content */}
              {isUnlocked && content && (
                <div className="p-4 border-t border-border">
                  <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {content}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="px-4 py-2 text-sm text-destructive">{error}</div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        {prompt && !loading && (
          <div className="flex items-center gap-4 px-4 py-3 border-t border-border text-xs text-muted-foreground shrink-0">
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {prompt.tags.map((tag: any) => (
                  <span key={tag.id || tag.slug} className="rounded bg-muted px-1.5 py-0.5">{tag.name}</span>
                ))}
              </div>
            )}
            <div className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{prompt.viewCount}</span>
              <span className="flex items-center gap-1"><UnlockIcon className="h-3 w-3" />{prompt.unlockCount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
