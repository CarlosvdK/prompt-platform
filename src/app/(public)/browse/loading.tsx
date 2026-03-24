import { Skeleton } from '@/components/ui/skeleton'

export default function BrowseLoading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="hidden lg:block w-60 shrink-0 border-r border-border p-4">
        <Skeleton className="h-8 w-full mb-6" />
        <Skeleton className="h-4 w-20 mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full mb-1.5" />
        ))}
      </aside>
      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      </main>
    </div>
  )
}
