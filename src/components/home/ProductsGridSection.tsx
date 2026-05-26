"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ShadcnProductCard from "@/components/home/ShadcnProductCard";
import type { Product } from "@/lib/api";

interface ProductsGridSectionProps {
  trendingProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  recommendedProducts: Product[];
  loading: boolean;
  onAddToCart: (id: number) => void;
  onWishlist: (id: number) => void;
  onQuickView?: (product: Product) => void;
}

const TAB_CONFIG = [
  { key: "trending", label: "🔥 Trending" },
  { key: "bestsellers", label: "⭐ Best Sellers" },
  { key: "new", label: "✨ New Arrivals" },
  { key: "recommended", label: "💡 For You" },
];

export default function ProductsGridSection({
  trendingProducts, bestSellers, newArrivals, recommendedProducts,
  loading, onAddToCart, onWishlist, onQuickView,
}: ProductsGridSectionProps) {
  const tabData: Record<string, Product[]> = {
    trending: trendingProducts,
    bestsellers: bestSellers,
    new: newArrivals,
    recommended: recommendedProducts,
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#5a3ea8] to-[#a78bfa]" />
        <div>
          <h2 className="text-xl font-black text-gray-900">Today&apos;s Picks</h2>
          <p className="text-xs text-gray-400">Curated just for you</p>
        </div>
      </div>

      <Tabs defaultValue="trending">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="bg-gray-100 rounded-xl p-1 h-auto flex flex-wrap gap-0.5">
            {TAB_CONFIG.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#5a3ea8] data-[state=active]:shadow-sm px-3 py-1.5"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-[#5a3ea8] hover:bg-purple-50 rounded-xl font-semibold text-xs gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {TAB_CONFIG.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-4">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-60 rounded-2xl" />
                ))}
              </div>
            ) : tabData[tab.key]?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {tabData[tab.key].slice(0, 12).map((product) => (
                  <ShadcnProductCard
                    key={product.proId}
                    product={product}
                    onAddToCart={onAddToCart}
                    onWishlist={onWishlist}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-gray-50">
                <p className="text-3xl mb-3">🛍️</p>
                <p className="text-gray-500 font-medium">No products in this tab yet.</p>
                <Link href="/products">
                  <Button className="mt-4 bg-[#5a3ea8] text-white rounded-xl">Browse All Products</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

