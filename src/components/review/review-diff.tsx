import { cn } from '@/lib/utils'

interface ReviewDiffProps {
  current: string
  previous?: string
}

export function ReviewDiff({ current, previous }: ReviewDiffProps) {
  return (
    <div className="space-y-4">
      {previous && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Previous Version</h3>
          <div className="max-h-64 overflow-auto rounded-lg border bg-red-50/50 p-4 dark:bg-red-950/20">
            <pre className="whitespace-pre-wrap font-mono text-sm">{previous}</pre>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {previous ? 'Current Version' : 'Content'}
        </h3>
        <div
          className={cn(
            'max-h-96 overflow-auto rounded-lg border p-4',
            previous ? 'bg-green-50/50 dark:bg-green-950/20' : 'bg-muted/30',
          )}
        >
          <pre className="whitespace-pre-wrap font-mono text-sm">{current}</pre>
        </div>
      </div>
    </div>
  )
}
