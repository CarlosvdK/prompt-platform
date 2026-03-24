import { notFound } from 'next/navigation'
import { getPromptById } from '@/services/prompt.service'
import { getReviewHistory } from '@/services/review.service'
import { ReviewActions } from '@/components/review/review-actions'
import { ReviewHistory } from '@/components/review/review-history'
import { PromptPreview } from '@/components/prompts/prompt-preview'
import { CodeBlock } from '@/components/shared/code-block'
import { StatusBadge } from '@/components/shared/status-badge'
import { PROMPT_TYPE_LABELS } from '@/lib/constants'

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params

  let prompt
  try {
    prompt = await getPromptById(id)
  } catch {
    notFound()
  }

  const reviewHistory = await getReviewHistory(id)

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
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
        <span>Type: {PROMPT_TYPE_LABELS[prompt.type] ?? prompt.type}</span>
        <span>Category: {prompt.category.name}</span>
        {prompt.tags.length > 0 && <span>Tags: {prompt.tags.map((t) => t.name).join(', ')}</span>}
        <span>Views: {prompt.viewCount}</span>
        <span>Unlocks: {prompt.unlockCount}</span>
      </div>

      {/* Full Content (visible to admin) */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Full Prompt Content</h2>
        <CodeBlock code={prompt.content} />
      </section>

      {/* Previews */}
      {prompt.previews.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Previews</h2>
          <div className="space-y-4">
            {prompt.previews.map((preview) => (
              <PromptPreview key={preview.id} type={preview.type} content={preview.content} />
            ))}
          </div>
        </section>
      )}

      {/* Review Actions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Review Actions</h2>
        <ReviewActions promptId={prompt.id} />
      </section>

      {/* Review History */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Review History</h2>
        {reviewHistory.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reviews yet.</p>
        ) : (
          <ReviewHistory history={reviewHistory} />
        )}
      </section>
    </div>
  )
}
