'use client'

import { useState, useEffect } from 'react'

interface AdContainerProps {
  sessionId: string
  adConfig: Record<string, unknown>
  onComplete: () => void
}

const AD_DURATION = 5

export function AdContainer({ sessionId, adConfig, onComplete }: AdContainerProps) {
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION)
  const progress = ((AD_DURATION - secondsLeft) / AD_DURATION) * 100

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [secondsLeft, onComplete])

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border bg-muted/30 p-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Ad playing...</p>
        <p className="text-2xl font-bold tabular-nums">{secondsLeft}s</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex h-40 items-center justify-center rounded-md border border-dashed bg-muted/50">
        <p className="text-sm text-muted-foreground">[Ad Content Placeholder]</p>
      </div>

      <p className="text-xs text-muted-foreground">
        Content will unlock automatically when the ad finishes.
      </p>
    </div>
  )
}
