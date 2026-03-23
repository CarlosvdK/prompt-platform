import type { ReviewHistoryItem } from '@/types/review'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDate } from '@/lib/utils'

interface ReviewHistoryProps {
  history: ReviewHistoryItem[]
}

export function ReviewHistory({ history }: ReviewHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No review history yet.</p>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((entry, index) => (
        <div key={entry.id} className="relative flex gap-4">
          {index < history.length - 1 && (
            <div className="absolute left-[7px] top-8 h-[calc(100%-8px)] w-px bg-border" />
          )}
          <div className="relative z-10 mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-primary bg-background" />
          <div className="flex-1 space-y-1 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">
                {entry.reviewer.name ?? entry.reviewer.email}
              </span>
              <StatusBadge status={entry.action} />
            </div>
            {entry.notes && (
              <p className="text-sm text-muted-foreground">{entry.notes}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatDate(new Date(entry.createdAt))}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
