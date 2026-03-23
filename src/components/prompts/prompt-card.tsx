import Link from 'next/link'
import { Eye, Unlock } from 'lucide-react'
import type { PromptSummary } from '@/types/prompt'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { truncate } from '@/lib/utils'

interface PromptCardProps {
  prompt: PromptSummary
}

const categoryColors: Record<string, string> = {
  coding: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  writing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  marketing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  business: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  education: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
}

export function PromptCard({ prompt }: PromptCardProps) {
  const categoryColor =
    categoryColors[prompt.category.slug] ??
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'

  return (
    <Link href={`/prompt/${prompt.slug}`}>
      <Card className="group h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 text-base">
              {prompt.title}
            </CardTitle>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {truncate(prompt.description, 120)}
          </p>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className={categoryColor}
            >
              {prompt.category.name}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {prompt.type}
            </Badge>
          </div>
          {prompt.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {prompt.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Unlock className="h-3.5 w-3.5" />
              {prompt.unlockCount}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
