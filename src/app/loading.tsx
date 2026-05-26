import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
      <Skeleton className="h-14 w-60 rounded-full" />
      <Skeleton className="h-[420px] w-full rounded-[2rem]" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-72 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

