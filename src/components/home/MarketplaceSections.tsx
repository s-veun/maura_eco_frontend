"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Eye, Flame, Heart, Loader2, Minus, Plus, ShoppingBag, Star, TrendingUp } from "lucide-react";
import {
  useGetMostPurchasedProductsQuery,
  useGetMostViewedProductsQuery,
  useGetProductsQuery,
  useGetTopRatedProductsQuery,
  useGetTrendingProductsQuery,
} from "@/redux/api/productApi";
import HomeProductCard from "@/components/home/HomeProductCard";
import { useCart } from "@/hooks/useCart";

type Product = {
  proId: number;
  proName: string;
  proPrice: number;
  categoryName?: string;
  discount?: number;
  rating?: number;
  imageName?: string;
  imageUrl?: string;
  thumbnailImage?: string;
  stock?: number;
  viewCount?: number;
  purchaseCount?: number;
  releaseDate?: string;
};

type SafeFillImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  className: string;
  fallbackSizeClass?: string;
};

function SafeFillImage({
  src,
  alt,
  sizes,
  className,
  fallbackSizeClass = "text-5xl",
}: SafeFillImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [hideImage, setHideImage] = useState(false);
  const resolvedSrc = hideImage
    ? null
    : useFallback
      ? "/materials.png"
      : src || null;

  if (!resolvedSrc) {
    return (
      <div className={`flex h-full w-full items-center justify-center ${fallbackSizeClass}`}>
        📦
      </div>
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={false}
      unoptimized
      onError={() => {
        if (!useFallback) {
          setUseFallback(true);
          return;
        }
        setHideImage(true);
      }}
    />
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const blogPosts = [
  {
    id: 1,
    tag: "Marketplace Insights",
    title: "How grocery apps are raising retention with same-day bundles",
    image:
      "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=1200&q=80",
    date: "May 13, 2026",
  },
  {
    id: 2,
    tag: "Fresh Delivery",
    title: "Cold-chain delivery experience: from shelf to door in 45 minutes",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
    date: "May 10, 2026",
  },
  {
    id: 3,
    tag: "Healthy Living",
    title: "Why smart families choose seasonal produce every week",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    date: "May 08, 2026",
  },
  {
    id: 4,
    tag: "Operations",
    title: "Demand forecasting for modern supermarket marketplaces",
    image:
      "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1200&q=80",
    date: "May 03, 2026",
  },
];

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-[#111827] sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>
      </div>
      <button className="rounded-full bg-[#f5f3ff] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#5a3ea8] transition hover:bg-[#ede9fe] hover:-translate-y-0.5">
        View All
      </button>
    </div>
  );
}

function EmptySectionState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-[#f5f3ff] px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ede9fe] text-[#5a3ea8]">
        <ShoppingBag className="size-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#111827]">{title}</h3>
      <p className="mt-2 text-sm text-[#6B7280]">{description}</p>
    </div>
  );
}

function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="min-w-[220px] animate-pulse rounded-2xl bg-white p-4"
        >
          <div className="mb-3 aspect-square rounded-2xl bg-[#f5f3ff]" />
          <div className="mb-2 h-2.5 w-1/3 rounded-full bg-[#ede9fe]" />
          <div className="mb-2 h-4 w-4/5 rounded-full bg-[#ede9fe]" />
          <div className="mb-3 h-3 w-1/2 rounded-full bg-[#ede9fe]" />
          <div className="h-10 rounded-full bg-[#ede9fe]" />
        </div>
      ))}
    </div>
  );
}

function ProductCard({
  product,
  badge,
  quantity,
  onInc,
  onDec,
}: {
  product: Product;
  badge?: { label: string; className: string };
  quantity: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <HomeProductCard
      product={product}
      badge={badge}
      quantity={quantity}
      onInc={onInc}
      onDec={onDec}
    />
  );
}

function OfferTimer({ seed }: { seed: number }) {
  const h = String((seed % 12) + 1).padStart(2, "0");
  const m = String((seed % 50) + 10).padStart(2, "0");
  const s = String((seed % 40) + 10).padStart(2, "0");

  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f5f3ff] px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-[#5a3ea8]">
      <span>
        {h} : {m} : {s}
      </span>
      <span className="text-[#9CA3AF]">Remaining offer time</span>
    </div>
  );
}

function BestSellingSideCard({ product }: { product: Product }) {
  const { addToCart, isAuthenticated } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const imageSrc = product.thumbnailImage || product.imageUrl;
  const stock = product.stock ?? 12;
  const isOutOfStock = stock <= 0;
  const oldPrice = product.discount
    ? product.proPrice * (1 + product.discount / 100)
    : null;

  const handleAdd = async () => {
    if (isSubmitting || isOutOfStock) return;
    setIsSubmitting(true);
    try {
      await addToCart(product.proId, quantity);
      setIsAdded(true);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => setIsAdded(false), 1600);
    } catch {
      // handled in useCart
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-white p-4"
    >
      <div className="relative mb-3 rounded-2xl bg-[#f8f7ff] p-3">
        <span className="absolute left-2 top-2 rounded-full bg-[#5a3ea8] px-2 py-1 text-[10px] font-bold text-white">
          {product.discount || 17}%
        </span>
        <Link href={isAuthenticated ? "/profile?tab=wishlist" : "/login?redirect=/"} className="absolute right-2 top-2 text-[#C3C8D1] transition hover:text-[#5a3ea8]">
          <Heart className="size-4" />
        </Link>
        <div className="relative mx-auto aspect-[4/3] h-34 w-full">
          <SafeFillImage
            key={imageSrc || `side-${product.proId}`}
            src={imageSrc}
            alt={product.proName}
            sizes="(max-width: 768px) 100vw, 180px"
            className="object-contain"
            fallbackSizeClass="text-4xl"
          />
        </div>
      </div>

      <Link href={`/products/${product.proId}`} className="line-clamp-2 text-[15px] font-bold text-[#1F2937] transition hover:text-[#5a3ea8]">
        {product.proName}
      </Link>
      <p className="mt-1.5 line-clamp-2 text-[12px] text-[#6B7280]">
        {product.categoryName ? `Premium ${product.categoryName}` : "High-quality grocery item"}
      </p>
      <div className="mt-2 flex items-center gap-1 text-[#FACC15]">
        <Star className="size-3 fill-[#FACC15]" />
        <Star className="size-3 fill-[#FACC15]" />
        <Star className="size-3 fill-[#FACC15]" />
        <Star className="size-3 fill-[#FACC15]" />
        <Star className="size-3 fill-[#FACC15]" />
        <span className="text-[11px] text-[#6B7280]">
          {(product.proId % 6) + 1}
        </span>
      </div>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-[30px] leading-none font-black text-[#5a3ea8]">
          ${product.proPrice.toFixed(2)}
        </span>
        {oldPrice ? (
          <span className="text-sm text-[#9CA3AF] line-through">
            ${oldPrice.toFixed(2)}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-slate-50">
          <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="px-2 py-1 text-sm font-bold text-[#6B7280] hover:text-black">
            <Minus className="size-3.5" />
          </button>
          <span className="min-w-6 text-center text-xs font-semibold text-[#111827]">{quantity}</span>
          <button type="button" onClick={() => setQuantity((prev) => Math.min(99, prev + 1))} className="px-2 py-1 text-sm font-bold text-[#6B7280] hover:text-black">
            <Plus className="size-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isSubmitting || isAdded || isOutOfStock}
          className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-xs font-bold uppercase tracking-wide transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]"
              : isAdded
                ? "bg-emerald-500 text-white"
                : "bg-[#5a3ea8] text-white hover:bg-[#4a3190]"
          }`}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : isAdded ? <><Check className="size-4" /> Added</> : <>Add to cart</>}
        </button>
      </div>

      <OfferTimer seed={product.proId} />
    </motion.article>
  );
}

function BestSellingFeaturedCard({ product }: { product: Product }) {
  const { addToCart, isAuthenticated } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const imageSrc = product.thumbnailImage || product.imageUrl;
  const oldPrice = product.discount
    ? product.proPrice * (1 + product.discount / 100)
    : null;
  const stock = product.stock ?? (product.proId % 45) + 20;
  const stockWidth = Math.max(
    18,
    Math.min(100, Math.floor((stock / 80) * 100)),
  );
  const isOutOfStock = stock <= 0;

  const handleAdd = async () => {
    if (isSubmitting || isOutOfStock) return;
    setIsSubmitting(true);
    try {
      await addToCart(product.proId, quantity);
      setIsAdded(true);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => setIsAdded(false), 1600);
    } catch {
      // handled by useCart
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-[#f5f3ff] p-6"
    >
      <div className="relative rounded-2xl bg-white p-4">
        <span className="absolute left-3 top-3 rounded-full bg-[#5a3ea8] px-2.5 py-1 text-[11px] font-bold text-white">
          {product.discount || 31}%
        </span>
        <Link href={isAuthenticated ? "/profile?tab=wishlist" : "/login?redirect=/"} className="absolute right-3 top-3 text-[#C3C8D1] transition hover:text-[#5a3ea8]">
          <Heart className="size-5" />
        </Link>
        <div className="relative mx-auto aspect-square h-66 w-full">
          <SafeFillImage
            key={imageSrc || `feature-${product.proId}`}
            src={imageSrc}
            alt={product.proName}
            sizes="(max-width: 768px) 100vw, 240px"
            className="object-contain"
            fallbackSizeClass="text-5xl"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-[#FACC15]">
        <Star className="size-3.5 fill-[#FACC15]" />
        <Star className="size-3.5 fill-[#FACC15]" />
        <Star className="size-3.5 fill-[#FACC15]" />
        <Star className="size-3.5 fill-[#FACC15]" />
        <Star className="size-3.5 fill-[#FACC15]" />
        <span className="text-xs text-[#6B7280]">
          {(product.proId % 5) + 2}
        </span>
      </div>

      <Link href={`/products/${product.proId}`} className="mt-2 block line-clamp-2 text-[38px] leading-tight font-black text-[#1F2937] transition hover:text-[#5a3ea8]">
        {product.proName}
      </Link>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-[48px] leading-none font-black text-[#5a3ea8]">
          ${product.proPrice.toFixed(2)}
        </span>
        {oldPrice ? (
          <span className="text-xl text-[#9CA3AF] line-through">
            ${oldPrice.toFixed(2)}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-[13px] leading-5 text-[#6B7280]">
        Ready to drink sparkling flavor with refreshing notes and premium
        quality for daily enjoyment.
      </p>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
        This product is about to run out
      </p>
      <div className="mt-2 h-2 w-full rounded-full bg-[#ede9fe]">
        <div
          className="h-2 rounded-full bg-[#5a3ea8]"
          style={{ width: `${stockWidth}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-[#4B5563]">
        available only: <span className="font-bold">{stock}</span>
      </p>

      <div className="mt-4 flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-white">
          <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="px-3 py-2 text-sm font-bold text-[#6B7280] hover:text-black">
            <Minus className="size-4" />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold text-[#111827]">{quantity}</span>
          <button type="button" onClick={() => setQuantity((prev) => Math.min(99, prev + 1))} className="px-3 py-2 text-sm font-bold text-[#6B7280] hover:text-black">
            <Plus className="size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isSubmitting || isAdded || isOutOfStock}
          className={`inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[22px] leading-none font-semibold transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]"
              : isAdded
                ? "bg-emerald-500 text-white"
                : "bg-[#5a3ea8] text-white hover:bg-[#4a3190]"
          }`}
        >
          {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : isAdded ? <><Check className="size-5" /> Added</> : <><ShoppingBag className="size-5" /> Add to cart</>}
        </button>
      </div>
    </motion.article>
  );
}

function BestSellingSection({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) {
  if (loading) return <SkeletonCards count={5} />;
  if (!products.length) {
    return (
      <EmptySectionState
        title="Best sellers are on the way"
        description="We couldn't find any best-selling products to show right now."
      />
    );
  }

  const list = products.slice(0, 5);
  const centerProduct = list[2] || list[0];
  const leftProducts = [list[0], list[1]].filter(Boolean) as Product[];
  const rightProducts = [list[3], list[4]].filter(Boolean) as Product[];

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr_1fr]">
      <div className="space-y-5">
        {leftProducts.map((product) => (
          <BestSellingSideCard
            key={`left-${product.proId}`}
            product={product}
          />
        ))}
      </div>

      {centerProduct ? (
        <BestSellingFeaturedCard product={centerProduct} />
      ) : null}

      <div className="space-y-5">
        {rightProducts.map((product) => (
          <BestSellingSideCard
            key={`right-${product.proId}`}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}


function ProductRow({
  products,
  loading,
  badge,
  quantities,
  onInc,
  onDec,
}: {
  products: Product[];
  loading: boolean;
  badge?: { label: string; className: string };
  quantities: Record<number, number>;
  onInc: (id: number) => void;
  onDec: (id: number) => void;
}) {
  if (loading) return <SkeletonCards count={6} />;
  if (!products.length) {
    return (
      <EmptySectionState
        title="No products available"
        description="This collection is empty at the moment. Please check back soon."
      />
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
      {products.map((product) => (
        <ProductCard
          key={product.proId}
          product={product}
          badge={badge}
          quantity={quantities[product.proId] || 1}
          onInc={() => onInc(product.proId)}
          onDec={() => onDec(product.proId)}
        />
      ))}
    </div>
  );
}

export default function MarketplaceSections() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const { data: allProducts = [], isLoading: loadingProducts } =
    useGetProductsQuery();
  const { data: trending = [], isLoading: loadingTrending } =
    useGetTrendingProductsQuery(12);
  const { data: topRated = [], isLoading: loadingTopRated } =
    useGetTopRatedProductsQuery(10);
  const { data: mostViewed = [], isLoading: loadingMostViewed } =
    useGetMostViewedProductsQuery(10);
  const { data: mostPurchased = [], isLoading: loadingMostPurchased } =
    useGetMostPurchasedProductsQuery(10);

  const bestSelling = useMemo(() => mostPurchased.slice(0, 8), [mostPurchased]);
  const featuredProducts = useMemo(() => allProducts.slice(0, 8), [allProducts]);

  const newArrivals = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => {
        const aDate = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const bDate = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        if (aDate !== bDate) return bDate - aDate;
        return b.proId - a.proId;
      })
      .slice(0, 8);
  }, [allProducts]);

  const dealsOfDay = useMemo(() => {
    const discounted = allProducts.filter((p) => (p.discount || 0) > 0);
    return (discounted.length ? discounted : trending).slice(0, 8);
  }, [allProducts, trending]);

  const inc = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(99, (prev[id] || 1) + 1),
    }));
  };

  const dec = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const trendingAutoList = useMemo(
    () => [...trending, ...trending],
    [trending],
  );

  return (
    <div className="space-y-14">
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="Fresh Picks For Today"
          subtitle="Live products from the backend, ready for quick add-to-cart from the home page"
        />
        <ProductRow
          products={featuredProducts}
          loading={loadingProducts}
          badge={{ label: "Featured", className: "bg-[#5a3ea8]" }}
          quantities={quantities}
          onInc={inc}
          onDec={dec}
        />
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="Best Selling Products"
          subtitle="Customer favorites with proven quality and high satisfaction ratings"
        />
        <BestSellingSection
          products={bestSelling}
          loading={loadingMostPurchased}
        />
      </motion.section>


      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="Trending Products"
          subtitle="Viral picks with fast-moving engagement in the marketplace"
        />
        {loadingTrending ? (
          <SkeletonCards count={4} />
        ) : trending.length ? (
          <div className="overflow-hidden rounded-2xl bg-white p-3">
            <motion.div
              className="hidden gap-4 lg:flex"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 24, ease: "linear", repeat: Infinity }}
            >
              {trendingAutoList.map((product, idx) => (
                <ProductCard
                  key={`${product.proId}-${idx}`}
                  product={product}
                  badge={{ label: "Trending", className: "bg-[#5a3ea8]" }}
                  quantity={quantities[product.proId] || 1}
                  onInc={() => inc(product.proId)}
                  onDec={() => dec(product.proId)}
                />
              ))}
            </motion.div>

            <div className="flex gap-4 overflow-x-auto pb-2 lg:hidden">
              {trending.map((product) => (
                <ProductCard
                  key={product.proId}
                  product={product}
                  badge={{ label: "Trending", className: "bg-[#5a3ea8]" }}
                  quantity={quantities[product.proId] || 1}
                  onInc={() => inc(product.proId)}
                  onDec={() => dec(product.proId)}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptySectionState
            title="Trending products not available"
            description="We couldn't load any trending products from the API right now."
          />
        )}
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="New Arrivals"
          subtitle="Freshly added products to keep your pantry exciting"
        />
        <ProductRow
          products={newArrivals}
          loading={loadingProducts}
          badge={{ label: "New", className: "bg-[#7c3aed]" }}
          quantities={quantities}
          onInc={inc}
          onDec={dec}
        />
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="Top Rated Products"
          subtitle="Highest-rated picks from trusted customer reviews"
        />
        <ProductRow
          products={topRated}
          loading={loadingTopRated}
          quantities={quantities}
          onInc={inc}
          onDec={dec}
        />
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="Most Viewed Products"
          subtitle="Products with the highest discovery and browsing momentum"
        />
        {loadingMostViewed ? (
          <SkeletonCards count={6} />
        ) : mostViewed.length ? (
          <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {mostViewed.map((product) => (
              <div key={product.proId} className="relative">
                <ProductCard
                  product={product}
                  badge={{ label: "Hot", className: "bg-[#5a3ea8]" }}
                  quantity={quantities[product.proId] || 1}
                  onInc={() => inc(product.proId)}
                  onDec={() => dec(product.proId)}
                />
                <div className="pointer-events-none absolute left-5 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-[#111827]">
                  <Eye className="size-3" />
                  {(product.viewCount || product.proId * 3).toLocaleString()}
                  <Flame className="size-3 text-[#FB923C]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptySectionState
            title="No most-viewed products"
            description="Browsing data is still being collected for this section."
          />
        )}
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="Most Purchased Products"
          subtitle="Conversion-focused best performers with strong repeat demand"
        />
        {loadingMostPurchased ? (
          <SkeletonCards count={6} />
        ) : mostPurchased.length ? (
          <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {mostPurchased.map((product) => (
              <div key={product.proId} className="relative">
                <ProductCard
                  product={product}
                  badge={{ label: "Best Seller", className: "bg-[#4a3190]" }}
                  quantity={quantities[product.proId] || 1}
                  onInc={() => inc(product.proId)}
                  onDec={() => dec(product.proId)}
                />
                <div className="pointer-events-none absolute right-5 top-3 inline-flex items-center gap-1 rounded-full bg-black/85 px-2 py-1 text-[10px] font-semibold text-white">
                  <ShoppingBag className="size-3" />
                  {(
                    product.purchaseCount || product.proId * 2
                  ).toLocaleString()}{" "}
                  sold
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptySectionState
            title="No purchase data available"
            description="Best-selling metrics haven't been returned by the API yet."
          />
        )}
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="Deals Of The Day"
          subtitle="Limited-time discounts curated for high-conversion daily shopping"
        />
        <ProductRow
          products={dealsOfDay}
          loading={loadingProducts && loadingTrending}
          badge={{ label: "Deal", className: "bg-[#5a3ea8]" }}
          quantities={quantities}
          onInc={inc}
          onDec={dec}
        />
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionHeader
          title="Our News"
          subtitle="Marketplace trends, customer stories, and grocery growth insights"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {blogPosts.map((post) => (
            <article
            key={post.id}
            className="overflow-hidden rounded-2xl bg-white transition hover:-translate-y-1"
          >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="relative h-full w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover transition duration-300 hover:scale-105"
                    priority={false}
                  />
                </div>
                <span className="absolute left-3 top-3 rounded-full bg-[#5a3ea8]/80 px-2.5 py-1 text-[10px] font-semibold uppercase text-white backdrop-blur-sm">
                  {post.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-bold text-[#111827]">
                  {post.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs text-[#6B7280]">
                  <span>{post.date}</span>
                  <span className="inline-flex items-center gap-1 text-[#5a3ea8]">
                    <TrendingUp className="size-3.5" />
                    Read more
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
