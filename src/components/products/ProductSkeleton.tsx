"use client";

type ProductSkeletonProps = {
  count?: number;
};

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl bg-white border border-[#f5eff8] overflow-hidden shadow-sm">
          <div className="h-[200px] bg-muted" />
          <div className="p-3.5 space-y-2">
            <div className="h-3.5 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/3" />
            <div className="h-8 bg-muted rounded-lg mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductSkeleton;
