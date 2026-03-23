import Link from "next/link";
import { db } from "@/lib/db";
import { ITEMS_PER_PAGE, PROMPT_STATUS_LABELS, PROMPT_TYPE_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/status-badge";
import { Pagination } from "@/components/shared/pagination";
import type { PromptStatus } from "@prisma/client";

export default async function AdminPromptsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const statusFilter = typeof params.status === "string" ? params.status as PromptStatus : undefined;

  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;

  const [prompts, total] = await Promise.all([
    db.prompt.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        type: true,
        createdAt: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    db.prompt.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const statuses = Object.keys(PROMPT_STATUS_LABELS);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Prompts</h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/prompts"
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
            !statusFilter
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          All
        </Link>
        {statuses.map((status) => (
          <Link
            key={status}
            href={`/admin/prompts?status=${status}`}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              statusFilter === status
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {PROMPT_STATUS_LABELS[status]}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {prompts.map((prompt) => (
              <tr key={prompt.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{prompt.title}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={prompt.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {prompt.category.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {PROMPT_TYPE_LABELS[prompt.type] ?? prompt.type}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/prompts/${prompt.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {prompts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No prompts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
