'use client'

import { useState } from 'react'

interface Preview {
  id: string
  type: string
  content: string
  sortOrder: number
}

interface PromptGalleryProps {
  previews: Preview[]
}

export function PromptGallery({ previews }: PromptGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = previews[activeIndex]

  if (!current) return null

  return (
    <div className="relative">
      {/* Preview display */}
      <div className="aspect-video w-full bg-muted/30 flex items-center justify-center overflow-hidden">
        {current.type === 'screenshot' || current.type === 'thumbnail' ? (
          <img src={current.content} alt="" className="w-full h-full object-contain" />
        ) : current.type === 'video' || current.type === 'animation' ? (
          <video src={current.content} autoPlay loop muted playsInline className="w-full h-full object-contain" />
        ) : current.type === 'code_snippet' || current.type === 'code_render' ? (
          <pre className="w-full h-full p-6 overflow-auto font-mono text-sm text-zinc-300 bg-zinc-950">
            {current.content}
          </pre>
        ) : (
          <div className="w-full h-full p-6 overflow-auto text-sm text-zinc-300 whitespace-pre-wrap">
            {current.content}
          </div>
        )}
      </div>

      {/* Dots navigation */}
      {previews.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3">
          {previews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
