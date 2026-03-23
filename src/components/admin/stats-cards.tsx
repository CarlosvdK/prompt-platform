import {
  FileText,
  Globe,
  ClipboardCheck,
  Unlock,
  Bot,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatItem {
  label: string
  value: number | string
  icon: LucideIcon
}

interface StatsCardsProps {
  stats: {
    totalPrompts?: number
    published?: number
    pendingReview?: number
    totalUnlocks?: number
    agentRuns?: number
    activeUsers?: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items: StatItem[] = [
    {
      label: 'Total Prompts',
      value: stats.totalPrompts ?? 0,
      icon: FileText,
    },
    {
      label: 'Published',
      value: stats.published ?? 0,
      icon: Globe,
    },
    {
      label: 'Pending Review',
      value: stats.pendingReview ?? 0,
      icon: ClipboardCheck,
    },
    {
      label: 'Total Unlocks',
      value: stats.totalUnlocks ?? 0,
      icon: Unlock,
    },
    {
      label: 'Agent Runs',
      value: stats.agentRuns ?? 0,
      icon: Bot,
    },
    {
      label: 'Active Users',
      value: stats.activeUsers ?? 0,
      icon: Activity,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
