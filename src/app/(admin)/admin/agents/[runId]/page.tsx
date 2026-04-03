import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRunStatus } from '@/services/agent.service'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DraftActions } from '@/components/admin/draft-actions'
import { DraftPreview } from '@/components/admin/draft-preview'

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
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/agents"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </Link>
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

      {/* Error */}
      {run.error && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Error</h2>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {run.error}
          </div>
        </section>
      )}

      {/* Drafts with Preview */}
      {run.drafts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Generated Drafts</h2>
          <div className="space-y-6">
            {run.drafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{draft.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{draft.type}</Badge>
                      {draft.promptId ? (
                        <Link
                          href={`/admin/prompts/${draft.promptId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View Prompt →
                        </Link>
                      ) : (
                        <DraftActions draftId={draft.id} />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DraftPreview draftId={draft.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Input/Output Debug */}
      <details className="mt-8">
        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          Debug: Input & Output
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Input</h3>
            <pre className="rounded-lg border border-border bg-muted p-4 text-xs overflow-x-auto">
              {JSON.stringify(run.input, null, 2)}
            </pre>
          </div>
          {run.output && (
            <div>
              <h3 className="text-sm font-medium mb-2">Output</h3>
              <pre className="rounded-lg border border-border bg-muted p-4 text-xs overflow-x-auto">
                {JSON.stringify(run.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </details>
    </div>
  )
}
