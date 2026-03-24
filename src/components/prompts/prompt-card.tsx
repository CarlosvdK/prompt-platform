'use client'

import { useRef, useState } from 'react'
import { usePromptModal } from '@/hooks/use-prompt-modal'
import type { PromptSummary } from '@/types/prompt'

interface PromptCardProps {
  prompt: PromptSummary
}

export function PromptCard({ prompt }: PromptCardProps) {
  const { openPrompt } = usePromptModal()
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Find video/animation preview for hover playback
  const videoPreview = null // We'll use thumbnailUrl for now

  const handleMouseEnter = () => {
    setIsHovered(true)
    videoRef.current?.play()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    videoRef.current?.pause()
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  const handleClick = () => {
    openPrompt(prompt.slug)
  }

  // Category color map for gradient fallbacks
  const categoryColors: Record<string, string> = {
    coding: 'from-blue-950 to-blue-900',
    writing: 'from-purple-950 to-purple-900',
    marketing: 'from-green-950 to-green-900',
    design: 'from-pink-950 to-pink-900',
    business: 'from-amber-950 to-amber-900',
    education: 'from-cyan-950 to-cyan-900',
    data: 'from-indigo-950 to-indigo-900',
    creative: 'from-rose-950 to-rose-900',
  }

  const gradientClass = categoryColors[prompt.category.slug] ?? 'from-zinc-900 to-zinc-800'

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer overflow-hidden rounded-lg aspect-[4/3] bg-card border border-border transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-lg hover:shadow-white/5 hover:border-white/20"
    >
      {prompt.thumbnailUrl ? (
        <img
          src={prompt.thumbnailUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        /* Gradient fallback with category initial and prompt title hint */
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
          <div className="text-center px-4">
            <div className="text-3xl font-bold text-white/20 mb-2">
              {prompt.category.name.charAt(0)}
            </div>
            <div className="text-xs text-white/30 line-clamp-2">
              {prompt.title}
            </div>
          </div>
        </div>
      )}

      {/* Bottom gradient overlay - shows category on hover */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <span className="text-xs text-white/80 font-medium truncate">{prompt.category.name}</span>
          <span className="text-xs text-white/50">{prompt.title}</span>
        </div>
      </div>
    </div>
  )
}
