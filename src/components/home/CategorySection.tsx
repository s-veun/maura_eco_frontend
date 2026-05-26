"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { CategoryViewModel } from "@/types/homepage";

const CATEGORY_ICONS: Record<string, string> = {
  default: "🪑",
  table: "🪑",
  chair: "🛋️",
  desk: "🖥️",
  sofa: "🛋️",
  bed: "🛏️",
  storage: "📦",
  outdoor: "🌿",
  lighting: "💡",
  decor: "🖼️",
  kitchen: "🍽️",
  office: "💼",
};

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key !== "default" && lower.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

const GRADIENT_PAIRS = [
  ["from-purple-500 to-indigo-600", "bg-purple-50"],
  ["from-orange-400 to-rose-500", "bg-orange-50"],
  ["from-cyan-500 to-blue-600", "bg-cyan-50"],
  ["from-emerald-500 to-teal-600", "bg-emerald-50"],
  ["from-pink-500 to-purple-600", "bg-pink-50"],
  ["from-amber-500 to-orange-600", "bg-amber-50"],
  ["from-sky-500 to-cyan-600", "bg-sky-50"],
  ["from-violet-500 to-purple-600", "bg-violet-50"],
];

interface CategorySectionProps {
  categories: CategoryViewModel[];
  loading: boolean;
}

export default function CategorySection({ categories, loading }: CategorySectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#5a3ea8] to-[#a78bfa]" />
          <div>
            <h2 className="text-xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-xs text-gray-400">Find exactly what you need</p>
          </div>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm font-semibold text-[#5a3ea8] hover:text-[#4a2f98] transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-3">
        <div className="flex gap-3 w-max md:w-full md:grid md:grid-cols-4 lg:grid-cols-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="w-28 h-28 md:w-auto md:h-28 rounded-2xl shrink-0 md:shrink" />
              ))
            : categories.slice(0, 8).map((cat, idx) => {
                const [gradClass, bgClass] = GRADIENT_PAIRS[idx % GRADIENT_PAIRS.length];
                return (
                  <motion.div
                    key={cat.catId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="shrink-0 md:shrink"
                  >
                    <Link href={`/products?categoryId=${cat.catId}`}>
                      <Card
                        className={`group w-28 md:w-auto cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${bgClass}`}
                      >
                        <div className="p-4 flex flex-col items-center gap-2 text-center">
                          {cat.imageUrl ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                              <Image src={cat.imageUrl} alt={cat.catName} fill sizes="48px" className="object-cover" />
                            </div>
                          ) : (
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradClass} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                              {getCategoryIcon(cat.catName)}
                            </div>
                          )}
                          <p className="text-xs font-bold text-gray-800 leading-tight">
                            {cat.catName}
                          </p>
                          {cat.productCount > 0 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto">
                              {cat.productCount}
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

