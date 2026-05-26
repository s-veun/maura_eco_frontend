"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShadcnProductCard from "@/components/home/ShadcnProductCard";
import type { Product } from "@/lib/api";

interface FlashSaleSectionProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (id: number) => void;
}

function useCountdown(targetMs: number) {
  const getRemaining = useCallback(() => {
    const diff = targetMs - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    const total = Math.floor(diff / 1000);
    return { h: Math.floor(total / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
  }, [targetMs]);
  const [time, setTime] = useState(getRemaining);
  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, [getRemaining]);
  return time;
}

const PAD = (n: number) => String(n).padStart(2, "0");

export default function FlashSaleSection({ products, loading, onAddToCart }: FlashSaleSectionProps) {
  const [endTime] = useState(() => Date.now() + 6 * 3600 * 1000);
  const { h, m, s } = useCountdown(endTime);

  const items = products.slice(0, 10);

  return (
    <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a0533] via-[#3b1f8c] to-[#5a3ea8] p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Flash Sale
              <Badge className="bg-red-500 text-white border-0 animate-pulse text-xs">LIVE</Badge>
            </h2>
            <p className="text-white/60 text-xs">Hurry, limited stock available!</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-white/60 hidden sm:block" />
          <div className="flex items-center gap-1">
            {[PAD(h), PAD(m), PAD(s)].map((unit, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="bg-white/15 backdrop-blur-sm rounded-lg w-9 h-9 flex items-center justify-center">
                  <span className="text-white font-black text-sm tabular-nums">{unit}</span>
                </div>
                {idx < 2 && <span className="text-white/60 font-bold text-sm">:</span>}
              </div>
            ))}
          </div>
          <Link href="/products?tab=flash">
            <Button size="sm" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl hidden sm:flex gap-1 text-xs">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-44 h-64 rounded-2xl shrink-0 bg-white/10" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {items.map((product, idx) => (
              <motion.div
                key={product.proId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="w-44 shrink-0"
              >
                <ShadcnProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  imageLoading={idx === 0 ? "eager" : "lazy"}
                />
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-white/50 text-sm">
          Flash deals will appear here soon. Stay tuned!
        </div>
      )}
    </section>
  );
}

