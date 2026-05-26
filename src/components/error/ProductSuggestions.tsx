"use client";

import { memo } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api";
import styles from "@/components/error/not-found.module.css";
import { cn } from "@/lib/utils";

type ProductSuggestionsProps = {
  products: Product[];
  loading: boolean;
  onAddToCart: (productId: number) => void | Promise<void>;
  onExplore: (productId: number) => void;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function getImage(product: Product) {
  return product.thumbnailImage || product.imageUrl || product.imageUrls?.[0] || "/hero.png";
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn("h-3.5 w-3.5", star <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
        />
      ))}
    </div>
  );
}

function ProductSuggestionsComponent({ products, loading, onAddToCart, onExplore }: ProductSuggestionsProps) {
  if (!loading && products.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No featured products available right now.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const rating = Number(product.rating || 4.2);
        const discount = Number(product.discount || 0);

        return (
          <div key={product.proId} className="relative">
            <div className="absolute top-3 right-0 z-10">
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-bold text-white rounded-l-md",
                  discount > 0 ? "bg-red-500" : "bg-purple-600"
                )}
              >
                {discount > 0 ? `${discount}% OFF` : "Top Rated"}
              </span>
            </div>

            <div className={cn("border rounded-lg bg-card shadow-sm overflow-hidden h-full flex flex-col", styles.cardHover, styles.fadeIn)}>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getImage(product)} alt={product.proName} className="h-48 w-full object-cover" loading="lazy" />
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{product.proName}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-700">{formatPrice(product.proPrice || 0)}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", product.available === false ? "bg-muted text-muted-foreground" : "bg-green-100 text-green-700")}>
                        {product.available === false ? "Out of stock" : "In stock"}
                      </span>
                    </div>
                    <StarRating value={Math.min(Math.max(rating, 0), 5)} />
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.proDesc || "Premium TableEco furniture crafted for modern spaces."}
                    </p>
                    <div className="flex flex-col gap-2 mt-auto pt-2">
                      <Button variant="outline" className="w-full" onClick={() => onExplore(product.proId)}>
                        View Product
                      </Button>
                      <Button className="w-full" onClick={() => void onAddToCart(product.proId)} disabled={product.available === false}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ProductSuggestions = memo(ProductSuggestionsComponent);
export default ProductSuggestions;
