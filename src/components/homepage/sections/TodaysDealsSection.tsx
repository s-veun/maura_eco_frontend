"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import MuiProductCard, { type MuiProduct } from "@/components/mui/MuiProductCard";

type TodaysDealsSectionProps = {
  products: MuiProduct[];
  loading: boolean;
  isError?: boolean;
  onRetryAction?: () => void;
};

export default function TodaysDealsSection({ products, loading, isError, onRetryAction }: TodaysDealsSectionProps) {
  const [secondsLeft, setSecondsLeft] = useState(7 * 60 * 60 + 12 * 60 + 22);

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
    <div>
      <h2 className="text-3xl font-bold mb-3">Today&apos;s Deals</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-3">
        <div
          className="p-4 min-h-[330px] rounded-lg flex flex-col gap-3"
          style={{ background: "linear-gradient(130deg,#5a3ea8,#7b62ce)", color: "white" }}
        >
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Flash Sale</span>
          </div>
          <p className="text-sm opacity-95">Limited-time marketplace offers on furniture essentials.</p>
          <span className="inline-flex items-center rounded-full bg-white/20 border border-white/30 px-3 py-0.5 text-sm font-mono font-semibold self-start text-white">
            {hours}:{minutes}:{seconds}
          </span>
          <Button variant="secondary" size="sm" className="self-start">
            View all deals
          </Button>
        </div>

        <div>
          {isError ? (
            <div className="flex items-center gap-3 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-3">
              <span className="flex-1">Failed to load today&apos;s deals.</span>
              {onRetryAction ? (
                <Button variant="ghost" size="sm" onClick={onRetryAction}>
                  Retry
                </Button>
              ) : null}
            </div>
          ) : null}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-muted rounded-lg h-[252px]" />
                ))
              : products.slice(0, 6).map((product) => (
                  <MuiProductCard
                    key={product.id}
                    product={{ ...product, compact: true, shippingLabel: "Fast delivery", soldCount: product.soldCount ?? 0 }}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
