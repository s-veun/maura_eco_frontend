'use client';

import React from 'react';
import Image from 'next/image';
import { useGetTopRatedProductsQuery } from "@/redux/api/productApi";
import { ArrowRight, Heart, Star, Loader2 } from "lucide-react";
import Link from 'next/link';
import { Product } from "@/lib/api";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex text-amber-400">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={10} 
          fill={i < Math.floor(rating) ? "currentColor" : "none"} 
          strokeWidth={i < Math.floor(rating) ? 0 : 2} 
          className={i < Math.floor(rating) ? "" : "text-gray-300 dark:text-gray-600"}
        />
      ))}
    </div>
  );
}

function SmallCard({ product }: { product: Product }) {
  return (
    <Link 
      href={`/products/${product.proId}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl p-4 flex gap-4 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-24 h-24 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center shrink-0 overflow-hidden">
        <Image
          src={product.imageUrl || "https://placehold.co/200x200?text=Product"}
          width={160}
          height={160}
          unoptimized
          className="max-h-[80%] max-w-[80%] object-contain group-hover:scale-110 transition-transform duration-500"
          alt={product.proName}
        />
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Stars rating={product.rating || 5}/>
          <span className="text-[10px] text-gray-400 font-medium">{product.viewCount || 0} views</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-2 group-hover:text-[#634c9f] transition-colors">
          {product.proName}
        </h3>
        <span className="text-base font-bold text-[#634c9f] dark:text-purple-400">${product.proPrice.toFixed(2)}</span>
      </div>
    </Link>
  );
}

function FeaturedCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded">
          Hot Selection
        </span>
        <button className="w-10 h-10 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={20} fill={product.favourite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center py-8">
        <Image
          src={product.imageUrl || "https://placehold.co/400x400?text=Featured"}
          width={320}
          height={320}
          unoptimized
          className="max-h-64 object-contain group-hover:scale-105 transition-transform duration-700"
          alt={product.proName}
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[#634c9f] transition-colors">
          {product.proName}
        </h2>

        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-[#634c9f] dark:text-purple-400">${product.proPrice.toFixed(2)}</span>
          <Link 
            href={`/products/${product.proId}`}
            className="flex-1 bg-[#634c9f] hover:bg-[#3c3068] text-white py-3 rounded-xl font-bold text-sm text-center transition-colors"
          >
            Buy Now
          </Link>
        </div>

        <div className="pt-4 border-t dark:border-gray-700">
          <div className="flex justify-between items-center text-xs font-bold text-red-500 mb-2">
            <span>Stock Status</span>
            <span>{product.stock} Left</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#634c9f]" 
              style={{ width: `${Math.min(100, ((product.stock || 0) / 100) * 100)}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BestSellingProducts() {
  const { data: products, isLoading, isError } = useGetTopRatedProductsQuery(5);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-[#634c9f] animate-spin" />
        <p className="text-gray-500 font-bold text-sm">Loading...</p>
      </div>
    );
  }
  
  if (isError || !products) return <div className="text-center py-20 text-red-500">Error loading products</div>;

  const leftCol = [products[0], products[1]];
  const featured = products[2];
  const rightCol = [products[3], products[4]];

  return (
    <section className="container mx-auto px-4 py-16 lg:py-24">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Best Sellers</h2>
          <p className="text-sm text-gray-500">Top rated products from our collection</p>
        </div>
        <Link href="/products" className="text-sm font-bold text-[#634c9f] hover:underline flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="lg:hidden flex flex-col gap-6">
        {featured && <FeaturedCard product={featured} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.filter((_, i) => i !== 2).map((p) => (
            <SmallCard key={p.proId} product={p} />
          ))}
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-[1fr_1.6fr_1fr] gap-6 xl:gap-8 items-stretch">
        <div className="flex flex-col gap-6">
          {leftCol.map((p) => p && <SmallCard key={p.proId} product={p} />)}
        </div>
        <div className="h-full">
          {featured && <FeaturedCard product={featured} />}
        </div>
        <div className="flex flex-col gap-6">
          {rightCol.map((p) => p && <SmallCard key={p.proId} product={p} />)}
        </div>
      </div>
    </section>
  );
}