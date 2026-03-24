import Link from 'next/link'
import { listRuns } from '@/services/agent.service'
import { StatusBadge } from '@/components/shared/status-badge'
import { Pagination } from '@/components/shared/pagination'

export default async function AgentRunsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const result = await listRuns(page)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Agent Runs</h1>

      {result.data.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No agent runs found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Skill</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Drafts</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.data.map((run) => (
                  <tr key={run.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{run.skill}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{run.draftCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/agents/${run.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination page={result.page} totalPages={result.totalPages} />
          </div>
        </>
      )}
    </div>
  )
}
