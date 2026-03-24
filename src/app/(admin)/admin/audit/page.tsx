import { getAuditLog } from '@/services/audit.service'
import { AuditLogTable } from '@/components/admin/audit-log-table'

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const action = typeof params.action === 'string' ? params.action : undefined
  const userId = typeof params.userId === 'string' ? params.userId : undefined

  const result = await getAuditLog({ page, action, userId })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {action && (
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">Action:</span>
            <span>{action}</span>
            <a href="/admin/audit" className="ml-1 text-muted-foreground hover:text-foreground">
              x
            </a>
          </div>
        )}
        {userId && (
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">User:</span>
            <span>{userId}</span>
            <a href="/admin/audit" className="ml-1 text-muted-foreground hover:text-foreground">
              x
            </a>
          </div>
        )}
      </div>

      {result.data.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No audit log entries found.</p>
      ) : (
        <>
          <AuditLogTable
            entries={result.data}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
          />
        </>
      )}
    </div>
  )
}
