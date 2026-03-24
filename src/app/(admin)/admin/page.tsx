import { db } from '@/lib/db'
import { StatsCards } from '@/components/admin/stats-cards'
import { RecentActivity } from '@/components/admin/recent-activity'

export default async function AdminDashboardPage() {
  const [
    totalPrompts,
    publishedCount,
    pendingReviewCount,
    totalUnlocks,
    recentAgentRuns,
    recentAuditEntries,
  ] = await Promise.all([
    db.prompt.count(),
    db.prompt.count({ where: { status: 'PUBLISHED' } }),
    db.prompt.count({ where: { status: 'PENDING_REVIEW' } }),
    db.prompt.aggregate({ _sum: { unlockCount: true } }).then((r) => r._sum.unlockCount ?? 0),
    db.agentRun.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    db.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        prompt: { select: { id: true, title: true } },
      },
    }),
  ])

  const stats = {
    totalPrompts,
    published: publishedCount,
    pendingReview: pendingReviewCount,
    totalUnlocks,
    agentRuns: recentAgentRuns,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <StatsCards stats={stats} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <RecentActivity entries={recentAuditEntries} />
      </div>
    </div>
  )
}
