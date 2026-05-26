"use client";

import { motion } from "framer-motion";

import ProductCard from "@/components/furniture-home/ProductCard";
import type { Product } from "@/components/furniture-home/types";

type ProductGridProps = {
  id?: string;
  eyebrow: string;
  title: string;
  products: Product[];
  mobileHorizontal?: boolean;
};

export default function ProductGrid({ id, eyebrow, title, products, mobileHorizontal }: ProductGridProps) {
  return (
    <section id={id} className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#5a3ea8] uppercase">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111827] sm:text-3xl">{title}</h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45 }}
        className={
          mobileHorizontal
            ? "flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        }
      >
        {products.map((product) => (
          <div key={product.id} className={mobileHorizontal ? "w-[280px] flex-none md:w-auto" : ""}>
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

