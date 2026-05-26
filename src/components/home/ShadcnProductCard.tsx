"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
  onWishlist?: (id: number) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
  imageLoading?: "lazy" | "eager";
}

function ProductCard({ product, onAddToCart, onWishlist, onQuickView, className, imageLoading = "lazy" }: ProductCardProps) {
  const imgSrc = product.imageUrl || product.thumbnailImage;
  const price = product.proPrice;
  const discount = product.discount || 0;
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : null;
  const rating = product.rating || 0;
  const isFavourite = product.favourite;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
        className={cn("group", className)}
      >
        <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white h-full">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={product.proName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={imageLoading}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-purple-50 to-indigo-50">
                🪑
              </div>
            )}

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              {onWishlist && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => { e.preventDefault(); onWishlist(product.proId); }}
                      className={cn(
                        "w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform",
                        isFavourite ? "text-red-500" : "text-gray-500"
                      )}
                    >
                      <Heart className={cn("w-3.5 h-3.5", isFavourite && "fill-current")} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Wishlist</TooltipContent>
                </Tooltip>
              )}
              {onQuickView && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => { e.preventDefault(); onQuickView(product); }}
                      className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:scale-110 transition-transform"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Quick View</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-[10px] px-1.5 py-0.5 h-auto font-bold">
                  -{discount}%
                </Badge>
              )}
              {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                <Badge className="bg-orange-500 text-white border-0 text-[10px] px-1.5 py-0.5 h-auto font-bold">
                  Low Stock
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge className="bg-gray-400 text-white border-0 text-[10px] px-1.5 py-0.5 h-auto font-bold">
                  Sold Out
                </Badge>
              )}
            </div>
          </div>

          {/* Info */}
          <CardContent className="p-3">
            <Link href={`/products/${product.proId}`} className="group/link">
              <p className="text-xs text-gray-400 mb-0.5 truncate">{product.categoryName || product.proBrand}</p>
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5 group-hover/link:text-[#5a3ea8] transition-colors leading-snug">
                {product.proName}
              </h3>
            </Link>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("w-3 h-3", i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200")}
                  />
                ))}
                <span className="text-[10px] text-gray-400 ml-0.5">({rating.toFixed(1)})</span>
              </div>
            )}

            {/* Price + Cart */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-base font-black text-[#5a3ea8]">
                  ${price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through ml-1">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className="h-7 w-7 p-0 rounded-xl bg-[#5a3ea8] hover:bg-[#4a2f98] text-white shadow-md hover:shadow-purple-300/50 transition-all"
                disabled={product.stock === 0}
                onClick={() => onAddToCart(product.proId)}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}

export default memo(ProductCard);

