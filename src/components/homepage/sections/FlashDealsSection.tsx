"use client";

import { useEffect, useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MuiProductCard, { type MuiProduct } from "@/components/mui/MuiProductCard";

type FlashDealsSectionProps = {
  products: MuiProduct[];
  loading: boolean;
  isError?: boolean;
  onRetryAction?: () => void;
};

export default function FlashDealsSection({ products, loading, isError, onRetryAction }: FlashDealsSectionProps) {
  const [secondsLeft, setSecondsLeft] = useState(6 * 60 * 60 + 29 * 60 + 40);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="border rounded-lg bg-card p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-xl font-bold">Flash Deals</h2>
          <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-primary">
            {hours}:{minutes}:{seconds}
          </span>
        </div>
        <Button size="sm" variant="ghost" className="self-start sm:self-auto">
          View all deals <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      {isError ? (
        <div className="flex items-center gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-3">
          <span className="flex-1">Failed to load flash deals.</span>
          {onRetryAction ? (
            <Button variant="ghost" size="sm" onClick={onRetryAction}>
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-[270px]" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {products.map((product) => (
            <div key={product.id} className="min-w-[220px] md:min-w-[240px] shrink-0">
              <MuiProductCard
                product={{ ...product, compact: true, shippingLabel: "Fast delivery", soldCount: product.soldCount ?? 0 }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
