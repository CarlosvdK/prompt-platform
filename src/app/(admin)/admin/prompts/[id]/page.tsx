import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { getPromptById } from '@/services/prompt.service'
import { getReviewHistory } from '@/services/review.service'
import { StatusBadge } from '@/components/shared/status-badge'
import { ReviewHistory } from '@/components/review/review-history'
import { PROMPT_TYPE_LABELS } from '@/lib/constants'

interface AdminPromptDetailProps {
  params: Promise<{ id: string }>
}

export default async function AdminPromptDetailPage({ params }: AdminPromptDetailProps) {
  const { id } = await params

  let prompt
  try {
    prompt = await getPromptById(id)
  } catch {
    notFound()
  }

  const [reviewHistory, versions, auditEntries] = await Promise.all([
    getReviewHistory(id),
    db.promptVersion.findMany({
      where: { promptId: id },
      orderBy: { version: 'desc' },
      select: {
        id: true,
        version: true,
        changelog: true,
        createdAt: true,
      },
    }),
    db.auditLog.findMany({
      where: { promptId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ])

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{prompt.title}</h1>
          <p className="text-muted-foreground mt-1">{prompt.description}</p>
        </div>
        <StatusBadge status={prompt.status} />
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4 mb-8 text-sm">
        <div>
          <span className="text-muted-foreground">Type:</span>{' '}
          {PROMPT_TYPE_LABELS[prompt.type] ?? prompt.type}
        </div>
        <div>
          <span className="text-muted-foreground">Category:</span> {prompt.category.name}
        </div>
        <div>
          <span className="text-muted-foreground">Tags:</span>{' '}
          {prompt.tags.length > 0 ? prompt.tags.map((t) => t.name).join(', ') : 'None'}
        </div>
        <div>
          <span className="text-muted-foreground">Slug:</span> {prompt.slug}
        </div>
        <div>
          <span className="text-muted-foreground">Views:</span> {prompt.viewCount}
        </div>
        <div>
          <span className="text-muted-foreground">Unlocks:</span> {prompt.unlockCount}
        </div>
        <div>
          <span className="text-muted-foreground">Created:</span>{' '}
          {new Date(prompt.createdAt).toLocaleString()}
        </div>
        <div>
          <span className="text-muted-foreground">Published:</span>{' '}
          {prompt.publishedAt ? new Date(prompt.publishedAt).toLocaleString() : 'Not published'}
        </div>
      </div>

      {/* Edit placeholder */}
      <section className="mb-8 rounded-lg border border-border p-6 bg-muted/30">
        <h2 className="text-lg font-semibold mb-2">Edit Prompt</h2>
        <p className="text-sm text-muted-foreground">
          Prompt editing form will be implemented here.
        </p>
      </section>

      {/* Version History */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Version History</h2>
        {versions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No versions recorded.</p>
        ) : (
          <div className="space-y-2">
            {versions.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
              >
                <span className="font-medium">v{v.version}</span>
                <span className="text-muted-foreground">{v.changelog}</span>
                <span className="text-muted-foreground">
                  {new Date(v.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review History */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Review History</h2>
        {reviewHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <ReviewHistory history={reviewHistory} />
        )}
      </section>

      {/* Audit Log */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Audit Log</h2>
        {auditEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audit entries.</p>
        ) : (
          <div className="space-y-2">
            {auditEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
              >
                <span className="font-medium">{entry.action}</span>
                <span className="text-muted-foreground">
                  {entry.user?.name ?? entry.user?.email ?? 'System'}
                </span>
                <span className="text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
