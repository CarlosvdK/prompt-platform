'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Copy, Check, Bookmark, ExternalLink, RotateCcw } from 'lucide-react'
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'
import { useCopy } from '@/hooks/use-copy'

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
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { copy, copied } = useCopy()
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

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

  useEffect(() => {
    setIframeLoaded(false)
  }, [prompt?.id])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const previewCode = prompt?.metadata?.previewCode
    ?? prompt?.previews?.find((p: any) => p.type === 'code_snippet')?.content
    ?? null

  const handleCopyPrompt = () => {
    if (prompt?.content) copy(prompt.content)
  }

  const reloadPreview = () => {
    setIframeLoaded(false)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10 lg:p-14"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      {/* Prev arrow */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-10 rounded-full p-2.5 transition-all hover:scale-110 bg-black/50 hover:bg-black/70 border border-white/10"
        >
          <ChevronLeft className="h-5 w-5 text-white/70" />
        </button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-10 rounded-full p-2.5 transition-all hover:scale-110 bg-black/50 hover:bg-black/70 border border-white/10"
        >
          <ChevronRight className="h-5 w-5 text-white/70" />
        </button>
      )}

      {/* Panel */}
      <div className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-2xl overflow-hidden flex flex-col border border-white/[0.08] shadow-2xl shadow-black/50 bg-[#0f1117]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 shrink-0 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 min-w-0">
            {prompt?.category && (
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-indigo-500/15 text-indigo-400 shrink-0">
                {prompt.category.name.charAt(0)}
              </div>
            )}
            {loading ? (
              <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
            ) : prompt ? (
              <span className="text-sm font-medium text-white/90 truncate">{prompt.title}</span>
            ) : null}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {prompt && (
              <>
                <button
                  onClick={reloadPreview}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Reload"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarked ? 'text-amber-400 hover:bg-amber-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => window.open(`/prompt/${prompt.slug}`, '_blank')}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Open"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>

                <div className="w-px h-5 bg-white/[0.08] mx-1" />

                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy prompt'}
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Interactive preview */}
        <div className="flex-1 relative overflow-hidden bg-[#09090b]">
          {(loading || !iframeLoaded) && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#09090b]">
              <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          )}

          {prompt && previewCode ? (
            <iframe
              ref={iframeRef}
              src={`/api/preview/${prompt.id}/render`}
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title={prompt.title || 'Component Preview'}
            />
          ) : prompt && !loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-5xl font-bold text-white/[0.06] mb-3">
                  {prompt.category?.name?.charAt(0) || 'S'}
                </div>
                <p className="text-sm text-slate-500">No preview available</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
