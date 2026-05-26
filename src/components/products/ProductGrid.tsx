"use client";

import type { Product } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";

type ProductGridProps = {
  products: Product[];
  wishedIds?: Set<number>;
  onAddToCart?: (id: number) => void | Promise<void>;
  onAddToWishlist?: (id: number) => void;
  onToggleWishlist?: (id: number) => Promise<void>;
  onQuickView?: (product: Product) => void;
};

export function ProductGrid({ products, wishedIds, onAddToCart, onAddToWishlist, onToggleWishlist, onQuickView }: ProductGridProps) {
  const handleAddToCart = async (id: number) => { await onAddToCart?.(id); };
  const handleToggleWishlist = async (id: number) => {
    if (onToggleWishlist) await onToggleWishlist(id);
    else onAddToWishlist?.(id);
  };

  if (!products.length) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.proId}
          product={product}
          wished={wishedIds?.has(product.proId) ?? false}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={onQuickView ?? (() => {})}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
