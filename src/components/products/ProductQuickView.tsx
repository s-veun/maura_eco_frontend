"use client";

import { Share2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import type { Product } from "@/lib/api";

type ProductQuickViewProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (id: number) => Promise<void>;
  onWishlist: (id: number) => Promise<void>;
};

export function ProductQuickView({ product, open, onClose, onAddToCart, onWishlist }: ProductQuickViewProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product?.proName || "Quick View"}</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl || product.thumbnailImage || "/materials.png"}
              alt={product.proName}
              className="w-full rounded-xl object-cover max-h-64"
            />
            <h3 className="font-semibold text-base m-0">{product.proName}</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={cn("h-3.5 w-3.5", star <= Math.round(Number(product.rating || 0)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground m-0">
              {product.proDesc || "Premium build quality with modern aesthetics for home and office spaces."}
            </p>
            <div className="flex items-center gap-2">
              <span className={cn("inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5", (product.stock || 0) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                {(product.stock || 0) > 0 ? "In stock" : "Out of stock"}
              </span>
              <span className="font-bold text-purple-700 text-base">${Number(product.proPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void onAddToCart(product.proId)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to cart
              </Button>
              <Button variant="outline" onClick={() => void onWishlist(product.proId)}>Wishlist</Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProductQuickView;
