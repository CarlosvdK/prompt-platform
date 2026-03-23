import { CheckCircle } from 'lucide-react'

export function UnlockSuccess() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 animate-in fade-in-0 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
      <CheckCircle className="h-5 w-5 shrink-0" />
      <p className="text-sm font-medium">Content unlocked!</p>
    </div>
  )
}
