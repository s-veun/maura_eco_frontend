import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/api";

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export default function ProductSection({ title, products }: ProductSectionProps) {
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.proId} product={product} />
        ))}
      </div>
    </section>
  );
}