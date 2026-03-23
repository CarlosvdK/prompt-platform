import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface ActivityEntry {
  id: string
  action: string
  userId: string | null
  createdAt: Date
  user: { id: string; name: string | null; email: string } | null
  prompt: { id: string; title: string } | null
}

interface RecentActivityProps {
  entries: ActivityEntry[]
}

export function RecentActivity({ entries }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/audit"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="max-h-96 space-y-3 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-4 rounded-md border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{entry.action}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {entry.user?.name ?? entry.user?.email ?? 'System'}
                  {entry.prompt && ` — ${entry.prompt.title}`}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(new Date(entry.createdAt))}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
