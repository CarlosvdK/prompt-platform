import { getReviewQueue } from '@/services/review.service'
import { ReviewQueueTable } from '@/components/review/review-queue-table'
import { Badge } from '@/components/ui/badge'

export default async function ReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const result = await getReviewQueue({ page })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Review Queue</h1>
        {result.total > 0 && <Badge variant="secondary">{result.total} pending</Badge>}
      </div>

      {result.data.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No prompts awaiting review.</p>
      ) : (
        <ReviewQueueTable
          items={result.data}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
        />
      )}
    </div>
  )
}
