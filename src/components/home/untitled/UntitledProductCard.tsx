"use client";

import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type UntitledProductCardProps = {
  product: Product;
  onAddToCart: (productId: number) => void;
  onWishlist: (productId: number) => void;
};

const FALLBACK_IMAGE = "/materials.png";

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function UntitledProductCard({ product, onAddToCart, onWishlist }: UntitledProductCardProps) {
  const image = product.thumbnailImage || product.imageUrl || product.imageUrls?.[0] || FALLBACK_IMAGE;

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/80">
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={image}
          alt={product.proName}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </div>

      <CardContent className="space-y-4 px-5 py-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
            {product.categoryName || "Furniture"}
          </p>
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-slate-100">{product.proName}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span>{(product.rating || 4.5).toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(product.proPrice)}</p>
          <div className="flex items-center gap-2">
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onWishlist(product.proId)}
              aria-label={`Add ${product.proName} to wishlist`}
              className="rounded-full"
            >
              <Heart className="size-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onAddToCart(product.proId)}
              className="rounded-full bg-violet-600 px-4 text-white hover:bg-violet-700"
            >
              <ShoppingBag className="size-4" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UntitledProductCard;

