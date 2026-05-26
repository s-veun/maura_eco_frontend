"use client";

import { Button } from "@/components/ui/button";
import MuiProductCard, { type MuiProduct } from "@/components/mui/MuiProductCard";

type ProductSectionProps = {
  title: string;
  products: MuiProduct[];
  loading: boolean;
  isError?: boolean;
  onRetryAction?: () => void;
  horizontal?: boolean;
  denseGrid?: boolean;
};

export default function ProductSection({
  title,
  products,
  loading,
  isError,
  onRetryAction,
  horizontal = false,
  denseGrid = false,
}: ProductSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {isError ? (
        <div className="flex items-center gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-4">
          <span className="flex-1">Failed to load this section.</span>
          {onRetryAction ? (
            <Button variant="ghost" size="sm" onClick={onRetryAction}>
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div
          className={`grid gap-4 ${
            denseGrid
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-xl h-[280px]" />
          ))}
        </div>
      ) : products.length > 0 ? (
        horizontal ? (
          <div className="flex gap-4 overflow-x-auto pb-2 px-0.5 -mx-0.5">
            {products.slice(0, 10).map((product) => (
              <div key={product.id} className="min-w-[210px] md:min-w-[226px] shrink-0">
                <MuiProductCard product={{ ...product, compact: false }} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              denseGrid
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {products.slice(0, 12).map((product) => (
              <MuiProductCard key={product.id} product={{ ...product, compact: false }} />
            ))}
          </div>
        )
      ) : (
        <div className="p-8 text-center border rounded-2xl bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">No products available for this section.</p>
        </div>
      )}
    </div>
  );
}
