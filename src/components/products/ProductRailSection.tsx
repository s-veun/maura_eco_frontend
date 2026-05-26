"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api";
import FlashSaleCard from "@/components/products/FlashSaleCard";

type ProductRailSectionProps = {
  title: string;
  products: Product[];
  loading: boolean;
  flashMode?: boolean;
  onAddToCart: (id: number) => Promise<void>;
  onWishlist: (id: number) => Promise<void>;
  onQuickView: (product: Product) => void;
};

export function ProductRailSection({
  title,
  products,
  loading,
  flashMode,
  onAddToCart,
  onWishlist,
  onQuickView,
}: ProductRailSectionProps) {
  const [limit, setLimit] = useState(8);
  const visibleItems = products.slice(0, limit);

  return (
    <section>
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-lg font-bold m-0">{title}</h3>
        <Link href="/products" className="text-sm text-purple-600 hover:underline font-medium">View all</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-muted h-[280px]" />
          ))}
        </div>
      ) : !visibleItems.length ? (
        <p className="text-sm text-muted-foreground text-center py-8">No products available</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleItems.map((product) =>
              flashMode ? (
                <FlashSaleCard
                  key={product.proId}
                  product={product}
                  onAddToCart={onAddToCart}
                  onWishlist={onWishlist}
                  onQuickView={onQuickView}
                />
              ) : (
                <div key={product.proId} className="rounded-xl border border-[#f5eff8] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-[160px] bg-[#f7f4ff] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl || product.thumbnailImage || "/materials.png"}
                      alt={product.proName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-1.5">
                    <p className="text-[12.5px] font-semibold line-clamp-2 m-0">{product.proName}</p>
                    <span className="text-sm font-bold text-purple-700">${Number(product.proPrice || 0).toFixed(2)}</span>
                    <div className="flex gap-1 pt-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => void onAddToCart(product.proId)}>
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => void onWishlist(product.proId)}>
                        <Heart className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onQuickView(product)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {limit < products.length && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={() => setLimit((p) => p + 8)} className="rounded-xl">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ProductRailSection;
