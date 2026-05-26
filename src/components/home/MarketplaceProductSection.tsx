"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Flame, Rocket, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api";
import MarketplaceProductCard from "@/components/home/MarketplaceProductCard";

const PRIMARY = "#7356c2";

type TabKey = "trending" | "bestsellers" | "new" | "foryou";

type MarketplaceProductSectionProps = {
  title: string;
  products: Product[];
  loading: boolean;
  tabs?: boolean;
  viewAllHref?: string;
  onAddToCart?: (id: number) => void | Promise<void>;
  onAddToWishlist?: (id: number) => void;
  onQuickView?: (product: Product) => void;
};

const TAB_CONFIG: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "trending", label: "Trending", icon: <Flame className="h-3.5 w-3.5" /> },
  { key: "bestsellers", label: "Best Sellers", icon: <Star className="h-3.5 w-3.5" /> },
  { key: "new", label: "New Arrivals", icon: <Rocket className="h-3.5 w-3.5" /> },
  { key: "foryou", label: "For You", icon: <Zap className="h-3.5 w-3.5" /> },
];

export function MarketplaceProductSection({
  title,
  products,
  loading,
  tabs = false,
  viewAllHref = "/products",
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: MarketplaceProductSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("trending");

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-[22px] rounded-full" style={{ background: `linear-gradient(180deg, ${PRIMARY}, #a78bfa)` }} />
          <h2 className="text-[20px] font-extrabold text-gray-800 m-0">{title}</h2>
        </div>
        <Link href={viewAllHref}>
          <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold border-purple-200 text-purple-700 hover:bg-purple-50">
            View All
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      {tabs && (
        <div className="flex gap-1 mb-4 border-b border-[#f5f0ff]">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors",
                activeTab === tab.key
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-muted h-[320px]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No products available</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {products.map((product) => (
            <MarketplaceProductCard
              key={product.proId}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MarketplaceProductSection;
