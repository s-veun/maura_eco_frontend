"use client";

import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useGetTrendingProductsQuery } from "@/redux/api/productApi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TrendingProductsSection() {
  const {
    data: trendingProducts = [],
    isLoading,
    isFetching,
    isError,
  } = useGetTrendingProductsQuery(6, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const featuredIndex = Math.floor(trendingProducts.length / 2);

  const reviewCounts = useMemo(() => {
    return trendingProducts.map((product) => {
      const hash = product.proId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return (hash % 180) + 20;
    });
  }, [trendingProducts]);

  const showLoading = isLoading || isFetching;

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
      className="w-full"
    >
      {/* Section Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#111827]">Trending Products</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Most popular items this week</p>
        </div>
        <Link
          href="/products"
          className="rounded-full bg-[#f5f3ff] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#5a3ea8] transition hover:bg-[#ede9fe]"
        >
          View All
        </Link>
      </div>

      {isError && (
        <div className="rounded-2xl bg-[#f5f3ff] p-6 text-center">
          <p className="text-sm font-medium text-[#6B7280]">
            Unable to load trending products right now. Please try again shortly.
          </p>
        </div>
      )}

      {showLoading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-2xl bg-[#f5f3ff] p-5">
              <div className="mb-4 aspect-square rounded-2xl bg-[#ede9fe]" />
              <div className="mb-2 h-2.5 w-1/3 rounded-full bg-[#ede9fe]" />
              <div className="mb-2 h-4 w-5/6 rounded-full bg-[#ede9fe]" />
              <div className="mb-4 h-4 w-2/5 rounded-full bg-[#ede9fe]" />
              <div className="h-10 w-full rounded-full bg-[#ede9fe]" />
            </div>
          ))}
        </div>
      )}

      {!showLoading && !isError && trendingProducts.length === 0 && (
        <div className="rounded-2xl bg-[#f5f3ff] p-6 text-center">
          <p className="text-sm font-medium text-[#6B7280]">No trending products available yet.</p>
        </div>
      )}

      {!showLoading && !isError && trendingProducts.length > 0 && (
        <div className="grid gap-5">
          {/* Desktop 3-column */}
          <div className="hidden xl:grid xl:grid-cols-3 gap-5">
            {trendingProducts.map((product, idx) => {
              const isFeatured = idx === featuredIndex;
              return (
                <motion.div
                  key={product.proId}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className={`group relative rounded-2xl bg-white flex flex-col overflow-hidden transition-all duration-300 ${
                    isFeatured ? "p-6 bg-[#f5f3ff]" : "p-5"
                  }`}
                >
                  {product.discount && product.discount > 0 && (
                    <div className="absolute left-4 top-4 z-10 rounded-full bg-[#5a3ea8] px-2.5 py-1 text-xs font-bold text-white">
                      -{product.discount}%
                    </div>
                  )}
                  <button className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#9CA3AF] transition hover:bg-[#f5f3ff] hover:text-[#5a3ea8]">
                    <Heart className="h-4 w-4" />
                  </button>

                  <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-[#f8f7ff] flex items-center justify-center">
                    {product.imageName ? (
                      <Image
                        src={product.imageName}
                        alt={product.proName}
                        fill
                        sizes="33vw"
                        unoptimized
                        className="object-contain p-4 transition duration-400 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-5xl">📦</div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                      {product.categoryName || "Product"}
                    </p>
                    <h3 className={`mt-1 font-bold leading-snug text-[#111827] line-clamp-2 transition group-hover:text-[#5a3ea8] ${isFeatured ? "text-xl" : "text-sm"}`}>
                      {product.proName}
                    </h3>
                    <div className={`mt-2 flex items-baseline gap-2`}>
                      <span className={`font-black text-[#5a3ea8] ${isFeatured ? "text-2xl" : "text-lg"}`}>
                        ${product.proPrice.toFixed(2)}
                      </span>
                      {product.discount && product.discount > 0 && (
                        <span className="text-xs text-[#9CA3AF] line-through">
                          ${(product.proPrice * (1 + product.discount / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="mt-2 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating ?? 0) ? "fill-[#FACC15] text-[#FACC15]" : "fill-[#E5E7EB] text-[#E5E7EB]"}`} />
                        ))}
                        <span className="ml-1 text-xs text-[#9CA3AF]">({reviewCounts[idx]})</span>
                      </div>
                    )}
                    {isFeatured && (
                      <div className="mt-4 space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a3ea8]">Running low on stock</p>
                        <div className="h-1.5 w-full rounded-full bg-[#ede9fe]">
                          <div className="h-1.5 w-2/3 rounded-full bg-[#5a3ea8] transition-all duration-500" />
                        </div>
                        <p className="text-xs text-[#6B7280]">Only 4 items left</p>
                      </div>
                    )}
                    <div className="mt-auto" />
                    <button className="mt-4 h-10 w-full rounded-full bg-[#5a3ea8] text-sm font-semibold text-white transition hover:bg-[#4a3190]">
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tablet 2-column */}
          <div className="hidden md:grid xl:hidden md:grid-cols-2 gap-5">
            {trendingProducts.map((product, idx) => (
              <motion.div
                key={product.proId}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.22 }}
                className="group relative rounded-2xl bg-white p-5 flex flex-col overflow-hidden"
              >
                {product.discount && product.discount > 0 && (
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-[#5a3ea8] px-2.5 py-1 text-xs font-bold text-white">
                    -{product.discount}%
                  </div>
                )}
                <button className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f3ff] text-[#9CA3AF] transition hover:text-[#5a3ea8]">
                  <Heart className="h-4 w-4" />
                </button>
                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-[#f8f7ff] flex items-center justify-center">
                  {product.imageName ? (
                    <Image src={product.imageName} alt={product.proName} fill sizes="50vw" unoptimized className="object-contain p-4 transition duration-400 group-hover:scale-105" />
                  ) : <div className="text-4xl">📦</div>}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{product.categoryName || "Product"}</p>
                  <h3 className="mt-1 text-sm font-bold leading-snug text-[#111827] line-clamp-2 transition group-hover:text-[#5a3ea8]">{product.proName}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-black text-[#5a3ea8]">${product.proPrice.toFixed(2)}</span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-xs text-[#9CA3AF] line-through">${(product.proPrice * (1 + product.discount / 100)).toFixed(2)}</span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="mt-1.5 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating ?? 0) ? "fill-[#FACC15] text-[#FACC15]" : "fill-[#E5E7EB] text-[#E5E7EB]"}`} />)}
                      <span className="ml-1 text-xs text-[#9CA3AF]">({reviewCounts[idx]})</span>
                    </div>
                  )}
                  <div className="mt-auto" />
                  <button className="mt-4 h-10 w-full rounded-full bg-[#5a3ea8] text-sm font-semibold text-white transition hover:bg-[#4a3190]">Add to Cart</button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile 1-column */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {trendingProducts.map((product) => (
              <motion.div
                key={product.proId}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-2xl bg-white p-4 flex flex-col overflow-hidden"
              >
                {product.discount && product.discount > 0 && (
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-[#5a3ea8] px-2 py-1 text-[10px] font-bold text-white">
                    -{product.discount}%
                  </div>
                )}
                <button className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f3ff] text-[#9CA3AF] transition hover:text-[#5a3ea8]">
                  <Heart className="h-3.5 w-3.5" />
                </button>
                <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-[#f8f7ff] flex items-center justify-center">
                  {product.imageName ? (
                    <Image src={product.imageName} alt={product.proName} fill sizes="100vw" unoptimized className="object-contain p-3 transition duration-400 group-hover:scale-105" />
                  ) : <div className="text-3xl">📦</div>}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{product.categoryName || "Product"}</p>
                  <h3 className="mt-1 text-sm font-bold leading-snug text-[#111827] line-clamp-2 group-hover:text-[#5a3ea8]">{product.proName}</h3>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-base font-black text-[#5a3ea8]">${product.proPrice.toFixed(2)}</span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-xs text-[#9CA3AF] line-through">${(product.proPrice * (1 + product.discount / 100)).toFixed(2)}</span>
                    )}
                  </div>
                  <div className="mt-auto" />
                  <button className="mt-3 h-9 w-full rounded-full bg-[#5a3ea8] text-xs font-semibold text-white transition hover:bg-[#4a3190]">Add to Cart</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
