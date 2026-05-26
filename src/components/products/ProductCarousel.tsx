"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";

const CHUNK = 4;

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}

type ProductCarouselProps = {
  title?: string;
  products: Product[];
};

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const slides = chunkArray(products, CHUNK);
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
  const next = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));

  if (!products.length) return null;

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold m-0">{title}</h3>
          <div className="flex gap-1">
            <button onClick={prev} className="w-8 h-8 rounded-full flex items-center justify-center border border-muted-foreground/20 hover:bg-muted transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={next} className="w-8 h-8 rounded-full flex items-center justify-center border border-muted-foreground/20 hover:bg-muted transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <div className="overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {slides[current]?.map((product) => (
            <ProductCard key={product.proId} product={product} />
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-purple-600" : "w-1.5 bg-muted"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCarousel;
