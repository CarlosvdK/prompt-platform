'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface CardPreviewProps {
  promptId: string
}

export function CardPreview({ promptId }: CardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Observe visibility — load iframe when card scrolls into view
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Track container size for scaling
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width > 0 && height > 0) {
        setDimensions({ width, height })
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const iframeWidth = 1280
  const iframeHeight = 900
  const scaleX = dimensions.width / iframeWidth
  const scaleY = dimensions.height / iframeHeight
  const scale = Math.min(scaleX, scaleY) || 0.25

  const handleLoad = useCallback(() => setIsLoaded(true), [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-[#09090b]"
    >
      {shouldLoad && dimensions.width > 0 && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500" />
            </div>
          )}
          <iframe
            src={`/api/preview/${promptId}/render`}
            loading="lazy"
            onLoad={handleLoad}
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
            className="absolute left-0 top-0 origin-top-left border-0"
            style={{
              width: `${iframeWidth}px`,
              height: `${iframeHeight}px`,
              transform: `scale(${scale})`,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </div>
  )
}
