import { cn } from '@/lib/utils'
import { CopyButton } from '@/components/prompts/copy-button'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-zinc-950 dark:bg-zinc-900',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        {language && (
          <span className="text-xs text-zinc-400">{language}</span>
        )}
        {!language && <span />}
        <CopyButton
          text={code}
          className="h-7 border-zinc-700 bg-transparent text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
        />
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-sm text-zinc-100">{code}</code>
      </pre>
    </div>
  )
}
