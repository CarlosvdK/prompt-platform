import { Skeleton } from "@/components/ui/skeleton";

export default function PromptDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Title */}
      <Skeleton className="h-9 w-3/4 mb-3" />
      {/* Description */}
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-5 w-2/3 mb-6" />

      {/* Meta badges */}
      <div className="flex gap-2 mb-8">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Previews */}
      <Skeleton className="h-7 w-24 mb-4" />
      <Skeleton className="h-40 w-full rounded-lg mb-4" />
      <Skeleton className="h-40 w-full rounded-lg mb-8" />

      {/* Unlock area */}
      <Skeleton className="h-7 w-32 mb-4" />
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}
