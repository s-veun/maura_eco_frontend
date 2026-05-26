"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import type { WishlistPreviewItem } from "@/services/account.service";

type WishlistGridProps = {
  items: WishlistPreviewItem[];
  onAddToCart: (productId: number) => void;
  onRemove: (productId: number) => void;
};

function WishlistGridComponent({ items, onAddToCart, onRemove }: WishlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <p>Wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.id} className="border rounded-2xl bg-card p-4 shadow-sm flex flex-col gap-2">
          <span className="font-semibold text-sm">{item.name}</span>
          <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-xs font-medium self-start">
            {item.categoryName || "Wishlist item"}
          </span>
          <span className="text-sm">
            {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : "Price unavailable"}
          </span>
          <div className="flex gap-2 mt-auto">
            <Button
              size="sm"
              disabled={!item.productId}
              onClick={() => item.productId && onAddToCart(item.productId)}
            >
              Add to cart
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={!item.productId}
              onClick={() => item.productId && onRemove(item.productId)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export const WishlistGrid = memo(WishlistGridComponent);
export default WishlistGrid;
