"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api";

const PRIMARY = "#7356c2";

function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => setSecs((p) => (p > 0 ? p - 1 : initial)), 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [initial]);
  return {
    h: String(Math.floor(secs / 3600)).padStart(2, "0"),
    m: String(Math.floor((secs % 3600) / 60)).padStart(2, "0"),
    s: String(secs % 60).padStart(2, "0"),
  };
}

function DigitBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="bg-gray-800 text-white rounded-lg px-2.5 py-1 text-lg font-extrabold font-mono min-w-[42px] text-center shadow-[0_2px_8px_rgba(0,0,0,0.20)] tracking-widest">
        {value}
      </div>
      <span className="text-[9.5px] text-gray-400 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function FlashCard({ product, onAddToCart }: { product: Product; onAddToCart: (id: number) => Promise<void> }) {
  const [hover, setHover] = useState(false);
  const [adding, setAdding] = useState(false);
  const stock = Math.max(0, Number(product.stock || 0));
  const sold = Math.max(1, Number(product.purchaseCount || 1));
  const progress = Math.min(90, Math.round((sold / (stock + sold)) * 100));
  const originalPrice = Number(product.proPrice || 0);
  const discount = Number(product.discount || 0);
  const salePrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
  const imgSrc = product.imageUrl || product.thumbnailImage || "/materials.png";

  const handleAdd = async () => {
    setAdding(true);
    try { await onAddToCart(product.proId); }
    finally { setAdding(false); }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rounded-2xl bg-white overflow-hidden border border-[#f5eff8] cursor-pointer transition-all duration-200"
      style={{
        minWidth: 168,
        boxShadow: hover ? "0 10px 32px rgba(115,86,194,0.20)" : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hover ? "translateY(-5px)" : "translateY(0)",
      }}
    >
      <div className="relative h-[168px] overflow-hidden bg-[#faf7ff]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.proName}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hover ? "scale(1.08)" : "scale(1)" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/materials.png"; }}
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white rounded-[9px] px-2.5 py-0.5 text-[11px] font-extrabold shadow-[0_2px_8px_rgba(255,77,79,0.40)]">
            -{discount}%
          </div>
        )}
        {stock > 0 && stock < 15 && (
          <div className="absolute bottom-2 left-2 bg-red-500/90 text-white rounded-lg px-2 py-0.5 text-[9.5px] font-bold">
            Only {stock} left!
          </div>
        )}
      </div>
      <div className="px-3 pt-2.5 pb-3.5">
        <p className="text-[12.5px] font-semibold text-gray-800 mb-1.5 line-clamp-2 leading-[17px]">{product.proName}</p>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="font-bold text-base" style={{ color: PRIMARY }}>${salePrice.toFixed(2)}</span>
          {discount > 0 && <span className="text-[11px] text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>}
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-[#ffe0e0] mb-1 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">{sold} sold · {stock} remaining</p>
        <Button
          size="sm"
          className="w-full h-[34px] text-xs font-semibold rounded-[9px]"
          style={{ background: PRIMARY, border: "none" }}
          disabled={adding}
          onClick={handleAdd}
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          {adding ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

type FlashSaleSectionProps = {
  products: Product[];
  loading: boolean;
  onAddToCart: (id: number) => Promise<void>;
};

export function FlashSaleSection({ products, loading, onAddToCart }: FlashSaleSectionProps) {
  const { h, m, s } = useCountdown(4 * 3600 + 23 * 60 + 45);

  return (
    <div className="rounded-[18px] bg-white shadow-[0_2px_18px_rgba(115,86,194,0.09)] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-400 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-white" />
            <span className="text-white text-[15px] font-black tracking-[0.3px]">FLASH SALE</span>
          </div>
          <div className="w-px h-7 bg-white/35" />
          <div className="flex items-center gap-2">
            <span className="text-white/88 text-xs font-semibold">Ends in:</span>
            <div className="flex items-end gap-1.5">
              <DigitBox value={h} label="HRS" />
              <span className="text-white font-black text-lg leading-8">:</span>
              <DigitBox value={m} label="MIN" />
              <span className="text-white font-black text-lg leading-8">:</span>
              <DigitBox value={s} label="SEC" />
            </div>
          </div>
        </div>
        <Link href="/products?deal=flash">
          <Button size="sm" variant="outline" className="text-white border-white/50 bg-white/22 backdrop-blur-sm hover:bg-white/35 rounded-full text-xs font-bold">
            View All →
          </Button>
        </Link>
      </div>

      {/* Products */}
      <div className="px-5 py-[18px]">
        {loading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-none w-[168px]">
                <div className="h-[168px] rounded-xl bg-muted animate-pulse" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : !products.length ? (
          <p className="text-sm text-muted-foreground text-center py-6">Flash sale products coming soon 🔥</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
            {products.slice(0, 12).map((product) => (
              <div key={product.proId} style={{ minWidth: 168, maxWidth: 184, flex: "0 0 auto", scrollSnapAlign: "start" }}>
                <FlashCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlashSaleSection;
