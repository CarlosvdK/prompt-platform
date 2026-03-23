import { Eye, Unlock, Calendar } from 'lucide-react'
import type { PromptDetail as PromptDetailType } from '@/types/prompt'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PromptPreview } from './prompt-preview'
import { formatDate } from '@/lib/utils'

interface PromptDetailProps {
  prompt: PromptDetailType
  unlockGate?: React.ReactNode
}

export function PromptDetail({ prompt, unlockGate }: PromptDetailProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{prompt.title}</h1>
        <p className="text-lg text-muted-foreground">{prompt.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{prompt.category.name}</Badge>
          <Badge variant="outline">{prompt.type}</Badge>
        </div>

        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {prompt.viewCount} views
          </span>
          <span className="flex items-center gap-1.5">
            <Unlock className="h-4 w-4" />
            {prompt.unlockCount} unlocks
          </span>
          {prompt.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(new Date(prompt.publishedAt))}
            </span>
          )}
        </div>
      </div>

      <Separator />

      {prompt.previews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Preview</h2>
          {prompt.previews
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((preview) => (
              <PromptPreview
                key={preview.id}
                type={preview.type}
                content={preview.content}
              />
            ))}
        </div>
      )}

      {prompt.metadata && Object.keys(prompt.metadata).length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Details</h2>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(prompt.metadata).map(([key, value]) => (
              <div key={key}>
                <dt className="font-medium capitalize text-muted-foreground">
                  {key.replace(/_/g, ' ')}
                </dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {unlockGate && (
        <>
          <Separator />
          <div>{unlockGate}</div>
        </>
      )}
    </div>
  )
}
