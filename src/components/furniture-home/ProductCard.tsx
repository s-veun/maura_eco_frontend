"use client";

import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product } from "@/components/furniture-home/types";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden rounded-2xl border border-[#eeeaf7] bg-white py-0 shadow-[0_12px_30px_rgba(17,24,39,0.06)]">
        <div className="group relative overflow-hidden">
          {product.badge ? (
            <span className="absolute top-3 left-3 z-10 rounded-full bg-[#5a3ea8] px-3 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          ) : null}
          <button
            type="button"
            className="absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-[#5a3ea8] shadow-sm transition hover:bg-white"
            aria-label="Add to wishlist"
          >
            <Heart className="size-4" />
          </button>
          <Image
            src={product.image}
            alt={product.title}
            width={900}
            height={700}
            unoptimized
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-[#1f2937]">{product.title}</h3>
          <div className="flex items-center gap-2 text-sm text-[#6b7280]">
            <Star className="size-4 fill-[#f59e0b] text-[#f59e0b]" />
            <span className="font-medium text-[#374151]">{product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#5a3ea8]">${product.price}</span>
            {product.originalPrice ? (
              <span className="text-sm text-[#9ca3af] line-through">${product.originalPrice}</span>
            ) : null}
          </div>

          <Button className="h-10 w-full rounded-full bg-[#5a3ea8] text-white hover:bg-[#4b3490]">
            <ShoppingBag className="size-4" />
            Add to Cart
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

