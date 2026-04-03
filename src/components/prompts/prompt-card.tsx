'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { usePromptModal } from '@/hooks/use-prompt-modal'
import { CardPreview } from './card-preview'
import type { PromptSummary } from '@/types/prompt'

interface PromptCardProps {
  prompt: PromptSummary
}

const categoryGradients: Record<string, string> = {
  'landing-pages': 'from-violet-950/80 to-indigo-950/60',
  'headers': 'from-blue-950/80 to-cyan-950/60',
  'cards': 'from-emerald-950/80 to-teal-950/60',
  'forms': 'from-amber-950/80 to-orange-950/60',
  'authentication': 'from-rose-950/80 to-pink-950/60',
  'checkout': 'from-purple-950/80 to-fuchsia-950/60',
  'animations': 'from-cyan-950/80 to-sky-950/60',
  'backgrounds': 'from-indigo-950/80 to-violet-950/60',
  'footers': 'from-slate-950/80 to-zinc-950/60',
  'dashboards': 'from-blue-950/80 to-indigo-950/60',
  'modals': 'from-fuchsia-950/80 to-purple-950/60',
  'tables': 'from-teal-950/80 to-emerald-950/60',
}

export function PromptCard({ prompt }: PromptCardProps) {
  const { openPrompt } = usePromptModal()
  const [imageError, setImageError] = useState(false)

  const metadata = prompt.metadata as Record<string, any> | null
  const hasPreview = !!(metadata?.previewCode) || prompt.hasCodePreview
  const showImage = prompt.thumbnailUrl && !imageError && !hasPreview
  const gradient = categoryGradients[prompt.category.slug] ?? 'from-zinc-900 to-zinc-800'

  return (
    <div
      onClick={() => openPrompt(prompt.slug)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#111318] transition-all duration-300 ease-out hover:z-10 hover:scale-[1.02]"
    >
      {/* Hover glow */}
      <div className="absolute -inset-px -z-10 rounded-xl opacity-0 blur-[12px] transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/15 to-purple-500/15" />

      {/* Hover border */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-xl border border-indigo-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Preview area */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-[#09090b]">
        {hasPreview ? (
          <CardPreview promptId={prompt.id} />
        ) : showImage ? (
          <img
            src={prompt.thumbnailUrl!}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
            <div className="px-6 text-center">
              <div className="text-5xl font-extrabold text-white/[0.06]">
                {prompt.category.name.charAt(0)}
              </div>
              <div className="mt-2 line-clamp-2 text-xs font-medium leading-tight text-white/20">
                {prompt.title}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.04] px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[10px] font-bold text-indigo-400">
            {prompt.category.name.charAt(0)}
          </div>
          <span className="truncate text-sm font-medium text-white/80">{prompt.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-slate-500">
          <Bookmark className="h-3.5 w-3.5" />
          <span className="text-xs">{prompt.unlockCount}</span>
        </div>
      </div>
    </div>
  )
}
