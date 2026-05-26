"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CategoryViewModel } from "@/types/homepage";

type CategoryCardProps = {
  category: CategoryViewModel;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${encodeURIComponent(category.slug || category.catName)}`}>
      <div className="rounded-[18px] bg-gradient-to-b from-white to-[#f7f4ff] shadow-[0_8px_24px_rgba(90,62,168,0.08)] p-4 flex flex-col gap-3 hover:shadow-[0_12px_32px_rgba(90,62,168,0.16)] transition-shadow cursor-pointer">
        <div className="h-[98px] rounded-[14px] bg-[#ede7ff] flex items-center justify-center overflow-hidden">
          {category.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={category.imageUrl} alt={category.catName} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-[#5a3ea8] text-2xl">
              {category.catName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{category.catName}</span>
          {category.productCount > 0 && (
            <span className="bg-[#5a3ea8] text-white text-xs font-bold rounded-full px-2 py-0.5">
              {category.productCount}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {category.featured ? (
            <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-2.5 py-0.5 text-xs font-medium">Featured</span>
          ) : null}
          {category.popular ? (
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2.5 py-0.5 text-xs font-medium">Popular</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
