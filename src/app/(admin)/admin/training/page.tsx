import { Brain, AlertCircle } from 'lucide-react'
import { getServerAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getTrainingQueue, getTrainingStats } from '@/services/training.service'
import { TrainingLabeler } from '@/components/admin/training-labeler'

export const metadata = { title: 'Model Training | Admin' }

export default async function TrainingPage() {
  const session = await getServerAuth()
  const userId = (session?.user as { id?: string })?.id
  if (!userId) redirect('/auth/signin')

  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') redirect('/admin')

  let queue: Awaited<ReturnType<typeof getTrainingQueue>> | null = null
  let stats: Awaited<ReturnType<typeof getTrainingStats>> | null = null
  let dbError = false

  try {
    ;[queue, stats] = await Promise.all([
      getTrainingQueue(userId, 1),
      getTrainingStats(userId),
    ])
  } catch {
    dbError = true
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Brain className="h-6 w-6" style={{ color: '#667eea' }} />
        <h1 className="text-2xl font-bold">Model Training</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: '#64748b' }}>
        Label each prompt as <strong style={{ color: '#4ade80' }}>good design</strong> or{' '}
        <strong style={{ color: '#f87171' }}>bad design</strong> to build the training dataset.
      </p>

      {dbError || !queue || !stats ? (
        <div
          className="flex items-start gap-3 rounded-xl p-5 text-sm"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-400" />
          <div style={{ color: '#fca5a5' }}>
            <p className="font-medium mb-1">Database unavailable</p>
            <p style={{ color: '#94a3b8' }}>
              Could not connect to the database. Make sure the DB is running and the{' '}
              <code className="rounded px-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                training_labels
              </code>{' '}
              migration has been applied:
            </p>
            <pre
              className="mt-3 rounded-lg p-3 text-xs overflow-x-auto"
              style={{ background: 'rgba(0,0,0,0.3)', color: '#e2e8f0' }}
            >
              {`npx prisma generate\nnpx prisma migrate deploy`}
            </pre>
          </div>
        </div>
      ) : (
        <TrainingLabeler
          initialItems={queue.data}
          initialStats={stats}
          totalPages={queue.totalPages}
        />
      )}
    </div>
  )
}
