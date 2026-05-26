"use client";

export default function ProfileLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-52 animate-pulse rounded-[32px] bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[28px] bg-slate-100" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-[32px] bg-slate-100" />
    </div>
  );
}
