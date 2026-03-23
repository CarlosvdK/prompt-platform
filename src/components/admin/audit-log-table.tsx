'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { Select } from '@/components/ui/select'
import { Pagination } from '@/components/shared/pagination'

interface AuditEntry {
  id: string
  createdAt: Date
  userId: string | null
  action: string
  promptId: string | null
  ipAddress: string | null
  details: unknown
  user: { id: string; name: string | null; email: string } | null
  prompt: { id: string; title: string } | null
}

interface AuditLogTableProps {
  entries: AuditEntry[]
  total: number
  page: number
  totalPages: number
  actions?: string[]
}

export function AuditLogTable({
  entries,
  total,
  page,
  totalPages,
  actions = [],
}: AuditLogTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentAction = searchParams.get('action') ?? ''

  const handleActionFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('action', value)
    } else {
      params.delete('action')
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select
          value={currentAction}
          onChange={(e) => handleActionFilter(e.target.value)}
          className="w-48"
        >
          <option value="">All Actions</option>
          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </Select>
        <p className="text-sm text-muted-foreground">
          {total} total entries
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Timestamp</th>
              <th className="px-4 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
              <th className="px-4 py-3 text-left font-medium">Resource</th>
              <th className="px-4 py-3 text-left font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b transition-colors hover:bg-muted/30"
              >
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatDate(new Date(entry.createdAt))}
                </td>
                <td className="px-4 py-3">
                  {entry.user?.name ?? entry.user?.email ?? 'System'}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.prompt?.title ?? (entry.promptId ? `Prompt (${entry.promptId.slice(0, 8)})` : '-')}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                  {entry.details ? JSON.stringify(entry.details) : '-'}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No audit log entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </div>
  )
}
