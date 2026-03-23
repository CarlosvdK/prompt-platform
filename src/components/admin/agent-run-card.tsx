import Link from 'next/link'
import { Bot, AlertCircle } from 'lucide-react'
import type { AgentRunSummary } from '@/types/agent'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface AgentRunCardProps {
  run: AgentRunSummary & { error?: string | null }
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  RUNNING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function AgentRunCard({ run }: AgentRunCardProps) {
  return (
    <Link href={`/admin/agents/${run.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4" />
              {run.skill}
            </CardTitle>
            <Badge
              variant="secondary"
              className={statusColors[run.status] ?? ''}
            >
              {run.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Run ID</span>
            <span className="font-mono text-xs">{run.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Created</span>
            <span>{formatDate(new Date(run.createdAt))}</span>
          </div>
          {run.completedAt && (
            <div className="flex justify-between text-muted-foreground">
              <span>Completed</span>
              <span>{formatDate(new Date(run.completedAt))}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Drafts</span>
            <span>{run.draftCount}</span>
          </div>
          {run.error && (
            <div className="flex items-start gap-1.5 rounded-md bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="line-clamp-2">{run.error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
