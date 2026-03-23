import { cn } from '@/lib/utils'

interface PromptPreviewProps {
  type: string
  content: string
  className?: string
}

export function PromptPreview({ type, content, className }: PromptPreviewProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Preview
      </span>

      {type === 'text_excerpt' && (
        <div className="relative overflow-hidden rounded-lg border p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {type === 'code_snippet' && (
        <div className="overflow-hidden rounded-lg border bg-zinc-950 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            <span className="text-xs text-zinc-400">Code</span>
          </div>
          <pre className="overflow-x-auto p-4">
            <code className="text-sm text-zinc-100">{content}</code>
          </pre>
        </div>
      )}

      {type === 'screenshot' && (
        <div className="overflow-hidden rounded-lg border">
          <img
            src={content}
            alt="Prompt preview"
            className="w-full object-contain"
          />
        </div>
      )}

      {type === 'output_sample' && (
        <div className="relative overflow-hidden rounded-lg border bg-muted/50 p-4">
          <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {content}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {!['text_excerpt', 'code_snippet', 'screenshot', 'output_sample'].includes(type) && (
        <div className="rounded-lg border p-4">
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        </div>
      )}
    </div>
  )
}
