import type { Metadata } from "next";
import { listPublishedPrompts } from "@/services/prompt.service";
import { listCategories, listTags } from "@/services/category.service";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { PromptFilters } from "@/components/prompts/prompt-filters";
import { Pagination } from "@/components/shared/pagination";
import type { PromptType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Browse Prompts | PromptPlatform",
  description:
    "Explore our collection of high-quality AI prompts for every use case.",
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const tagSlug = typeof params.tag === "string" ? params.tag : undefined;
  const type = typeof params.type === "string" ? (params.type as PromptType) : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;

  const [result, categories, tags] = await Promise.all([
    listPublishedPrompts({ page, categorySlug, tagSlug, type, search }),
    listCategories(),
    listTags(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Browse Prompts</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64 shrink-0">
          <PromptFilters
            categories={categories}
          />
        </aside>

        <div className="flex-1">
          {result.data.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No prompts found. Try adjusting your filters.
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
      </div>
    </div>
  );
}
