'use client'

import { Lock, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdContainer } from './ad-container'
import { UnlockSuccess } from './unlock-success'
import { UnlockProgress } from './unlock-progress'
import { useUnlock } from '@/hooks/use-unlock'
import { PromptContent } from '@/components/prompts/prompt-content'

interface UnlockGateProps {
  promptId: string
  children?: React.ReactNode
}

export function UnlockGate({ promptId, children }: UnlockGateProps) {
  const { state, content, error, session, initiateUnlock, completeAd } =
    useUnlock()

  if (state === 'unlocked' && content) {
    return (
      <div className="space-y-4">
        <UnlockSuccess />
        <PromptContent content={content} />
      </div>
    )
  }

  if (state === 'verifying') {
    return <UnlockProgress />
  }

  if (state === 'ad_playing' && session) {
    return (
      <AdContainer
        sessionId={session.sessionId}
        adConfig={session.adConfig}
        onComplete={() => completeAd(session.sessionId)}
      />
    )
  }

  return (
    <div className="relative">
      {children && (
        <div className="relative overflow-hidden rounded-lg">
          <div className="blur-sm">{children}</div>
          <div className="absolute inset-0 bg-background/60" />
        </div>
      )}

      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Unlock Full Content</h3>
          <p className="text-sm text-muted-foreground">
            Watch a short ad to unlock the full prompt content for free.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          size="lg"
          onClick={() => initiateUnlock(promptId)}
          disabled={state === 'initiating'}
          className="gap-2"
        >
          {state === 'initiating' ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Starting...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Watch a short ad to unlock
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
