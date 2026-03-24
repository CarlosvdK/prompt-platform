import { Unlock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from './copy-button'

interface PromptContentProps {
  content: string
}

export function PromptContent({ content }: PromptContentProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          <Unlock className="mr-1 h-3 w-3" />
          Unlocked
        </Badge>
        <CopyButton text={content} />
      </div>
      <div className="overflow-hidden rounded-lg border bg-zinc-950 dark:bg-zinc-900">
        <pre className="overflow-x-auto p-4">
          <code className="whitespace-pre-wrap font-mono text-sm text-zinc-100">{content}</code>
        </pre>
      </div>
    </div>
  )
}
