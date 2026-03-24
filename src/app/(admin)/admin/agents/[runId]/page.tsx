import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRunStatus } from '@/services/agent.service'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AgentRunDetailPageProps {
  params: Promise<{ runId: string }>
}

export default async function AgentRunDetailPage({ params }: AgentRunDetailPageProps) {
  const { runId } = await params

  let run
  try {
    run = await getRunStatus(runId)
  } catch {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Agent Run</h1>
        <StatusBadge status={run.status} />
      </div>

      {/* Run Info */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4 mb-8 text-sm">
        <div>
          <span className="text-muted-foreground">Skill:</span> {run.skill}
        </div>
        <div>
          <span className="text-muted-foreground">Status:</span> {run.status}
        </div>
        <div>
          <span className="text-muted-foreground">Created:</span>{' '}
          {new Date(run.createdAt).toLocaleString()}
        </div>
        <div>
          <span className="text-muted-foreground">Completed:</span>{' '}
          {run.completedAt ? new Date(run.completedAt).toLocaleString() : 'In progress'}
        </div>
        {run.initiator && (
          <div>
            <span className="text-muted-foreground">Initiated by:</span>{' '}
            {run.initiator.name ?? 'Unknown'}
          </div>
        )}
        <div>
          <span className="text-muted-foreground">Drafts:</span> {run.draftCount}
        </div>
      </div>

      {/* Input Parameters */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Input Parameters</h2>
        <pre className="rounded-lg border border-border bg-muted p-4 text-sm overflow-x-auto">
          {JSON.stringify(run.input, null, 2)}
        </pre>
      </section>

      {/* Output / Error */}
      {run.error && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Error</h2>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {run.error}
          </div>
        </section>
      )}

      {run.output && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Output</h2>
          <pre className="rounded-lg border border-border bg-muted p-4 text-sm overflow-x-auto">
            {JSON.stringify(run.output, null, 2)}
          </pre>
        </section>
      )}

      {/* Drafts */}
      {run.drafts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Generated Drafts</h2>
          <div className="space-y-4">
            {run.drafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{draft.title}</CardTitle>
                    <Badge variant="secondary">{draft.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {draft.promptId ? (
                    <Link
                      href={`/admin/prompts/${draft.promptId}`}
                      className="text-primary underline"
                    >
                      View linked prompt
                    </Link>
                  ) : (
                    <span>Not yet linked to a prompt</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
