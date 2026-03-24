import { db } from '@/lib/db'
import { StatsCards } from '@/components/admin/stats-cards'

export default async function AnalyticsPage() {
  const [totalUnlocks, totalViews, publishedCount, topPrompts] = await Promise.all([
    db.prompt.aggregate({ _sum: { unlockCount: true } }).then((r) => r._sum.unlockCount ?? 0),
    db.prompt.aggregate({ _sum: { viewCount: true } }).then((r) => r._sum.viewCount ?? 0),
    db.prompt.count({ where: { status: 'PUBLISHED' } }),
    db.prompt.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { unlockCount: 'desc' },
      take: 5,
      select: { id: true, title: true, unlockCount: true, viewCount: true },
    }),
  ])

  const stats = {
    totalUnlocks,
    published: publishedCount,
    totalPrompts: publishedCount,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <StatsCards stats={stats} />

      {/* Top prompts */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Top Prompts by Unlocks</h2>
        {topPrompts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data available.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Unlocks</th>
                  <th className="px-4 py-3 text-left font-medium">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPrompts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.unlockCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.viewCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6 text-center">
        <p className="text-muted-foreground">Full analytics dashboard coming soon.</p>
      </div>
    </div>
  )
}
