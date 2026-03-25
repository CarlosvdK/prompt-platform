'use client'

import { useState, useRef } from 'react'
import { Maximize2, Minimize2, Monitor, Tablet, Smartphone } from 'lucide-react'

interface LivePreviewProps {
  promptId: string
  title?: string
}

type Viewport = 'desktop' | 'tablet' | 'mobile'

const viewportSizes: Record<Viewport, { width: number; label: string }> = {
  desktop: { width: 1920, label: 'Desktop' },
  tablet: { width: 768, label: 'Tablet' },
  mobile: { width: 375, label: 'Mobile' },
}

export function LivePreview({ promptId, title }: LivePreviewProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const previewUrl = `/api/preview/${promptId}/render`

  const handleLoad = () => {
    setIsLoading(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-[60] bg-[#09090b] flex flex-col'
    : 'relative w-full'

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/6 bg-[#0f1117] shrink-0">
        <div className="flex items-center gap-1">
          {([
            { key: 'desktop' as Viewport, icon: Monitor },
            { key: 'tablet' as Viewport, icon: Tablet },
            { key: 'mobile' as Viewport, icon: Smartphone },
          ]).map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setViewport(key)}
              className={`p-1.5 rounded-md transition-colors ${
                viewport === key
                  ? 'bg-[#667eea]/20 text-[#667eea]'
                  : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-white/5'
              }`}
              title={viewportSizes[key].label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748b] font-mono">
            {viewportSizes[viewport].width}px
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md text-[#64748b] hover:text-[#94a3b8] hover:bg-white/5 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className={`flex-1 overflow-auto flex justify-center ${isFullscreen ? '' : 'aspect-video'}`} style={{ background: '#09090b' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-[#667eea]/20 border-t-[#667eea] rounded-full animate-spin" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={previewUrl}
          onLoad={handleLoad}
          className="border-0 bg-[#09090b] transition-all duration-300"
          style={{
            width: viewport === 'desktop' ? '100%' : `${viewportSizes[viewport].width}px`,
            height: isFullscreen ? '100%' : '100%',
            maxWidth: '100%',
          }}
          sandbox="allow-scripts allow-same-origin"
          title={title || 'Component Preview'}
        />
      </div>

      {/* Fullscreen close hint */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition-colors hover:text-white"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Minimize2 className="h-3 w-3" />
            ESC to close
          </button>
        </div>
      )}
    </div>
  )
}
