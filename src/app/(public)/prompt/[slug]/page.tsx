import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPromptBySlug } from '@/services/prompt.service'
import { PromptDetail } from '@/components/prompts/prompt-detail'
import { PromptPreview } from '@/components/prompts/prompt-preview'
import { PromptContent } from '@/components/prompts/prompt-content'
import { UnlockGate } from '@/components/unlock/unlock-gate'
import { BackButton } from '@/components/shared/back-button'

interface PromptPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const prompt = await getPromptBySlug(slug)
    if (prompt.status !== 'PUBLISHED') return { title: 'Prompt Not Found' }

    return {
      title: `${prompt.title} | Softset`,
      description: prompt.description,
      openGraph: {
        title: prompt.title,
        description: prompt.description,
        type: 'article',
      },
    }
  } catch {
    return { title: 'Prompt Not Found' }
  }
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { slug } = await params

  let prompt
  try {
    prompt = await getPromptBySlug(slug)
  } catch {
    notFound()
  }

  if (prompt.status !== 'PUBLISHED') {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <BackButton />
      <PromptDetail prompt={prompt} />

      {prompt.previews.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Previews</h2>
          <div className="space-y-4">
            {prompt.previews.map((preview) => (
              <PromptPreview key={preview.id} type={preview.type} content={preview.content} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Full Prompt</h2>
        <UnlockGate promptId={prompt.id}>
          <PromptContent content={prompt.content} />
        </UnlockGate>
      </section>
    </div>
  )
}
