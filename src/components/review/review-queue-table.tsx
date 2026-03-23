'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { ReviewQueueItem } from '@/types/review'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { Pagination } from '@/components/shared/pagination'

interface ReviewQueueTableProps {
  items: ReviewQueueItem[]
  total: number
  page: number
  totalPages: number
}

export function ReviewQueueTable({
  items,
  total,
  page,
  totalPages,
}: ReviewQueueTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Submitted</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/review/${item.id}`}
                    className="font-medium hover:underline"
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{item.type}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.category.name}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(new Date(item.createdAt))}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/review/${item.id}`}
                    className="text-primary hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No items in the review queue.
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
