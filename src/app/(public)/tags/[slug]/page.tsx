import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTagBySlug } from "@/services/category.service";
import { listPublishedPrompts } from "@/services/prompt.service";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { Pagination } from "@/components/shared/pagination";

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return { title: "Tag Not Found" };

  return {
    title: `#${tag.name} Prompts | PromptPlatform`,
    description: `Browse AI prompts tagged with "${tag.name}" on PromptPlatform.`,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;

  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const result = await listPublishedPrompts({
    tagSlug: slug,
    page,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">#{tag.name}</h1>
      <p className="text-muted-foreground mb-8">
        Prompts tagged with &ldquo;{tag.name}&rdquo;
      </p>

      {result.data.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No prompts found with this tag yet.
        </p>
      ) : (
        <>
          <PromptGrid prompts={result.data} />
          <div className="mt-8">
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
}
