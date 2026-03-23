import type { PromptSummary } from '@/types/prompt'
import { PromptCard } from './prompt-card'
import { EmptyState } from '@/components/shared/empty-state'
import { FileText } from 'lucide-react'

interface PromptGridProps {
  prompts: PromptSummary[]
}

export function PromptGrid({ prompts }: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <EmptyState
        title="No prompts found"
        description="Try adjusting your filters or search terms."
        icon={FileText}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  )
}
