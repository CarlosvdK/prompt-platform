'use client'

import { useState } from 'react'
import { usePromptModal } from '@/hooks/use-prompt-modal'
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

  const handleClick = () => {
    openPrompt(prompt.slug)
  }

  const gradient = categoryGradients[prompt.category.slug] ?? 'from-zinc-900 to-zinc-800'
  const showImage = prompt.thumbnailUrl && !imageError

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl aspect-[4/3] transition-all duration-300 ease-out hover:scale-[1.04] hover:z-10"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Hover glow effect */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3), rgba(240,147,251,0.2))',
          filter: 'blur(12px)',
        }}
      />

      {/* Hover border */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
        style={{ border: '1px solid rgba(102,126,234,0.4)' }}
      />

      {/* Content */}
      {showImage ? (
        <img
          src={prompt.thumbnailUrl!}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <div className="text-center px-6">
            <div
              className="text-4xl font-extrabold mb-3"
              style={{ color: 'rgba(255,255,255,0.08)' }}
            >
              {prompt.category.name.charAt(0)}
            </div>
            <div
              className="text-xs font-medium leading-tight line-clamp-2"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              {prompt.title}
            </div>
          </div>
        </div>
      )}

      {/* Bottom overlay - always visible */}
      <div
        className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}
      >
        <p className="text-sm font-medium text-white/90 truncate leading-tight">{prompt.title}</p>
        <p className="text-xs text-white/40 mt-1">{prompt.category.name}</p>
      </div>
    </div>
  )
}
