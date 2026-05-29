import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <section className="rounded-[5px] border border-border/60 bg-card p-3">
      <div className="relative overflow-hidden rounded-[5px]">
        <Skeleton className="h-72 w-full md:h-[460px]" />
        <div className="absolute left-5 top-5 space-y-3">
          <Skeleton className="h-6 w-40 rounded-[5px]" />
          <Skeleton className="h-10 w-72 rounded-[5px]" />
          <Skeleton className="h-5 w-96 max-w-[85vw] rounded-[5px]" />
          <Skeleton className="h-10 w-36 rounded-[5px]" />
        </div>
      </div>
    </section>
  );
}

