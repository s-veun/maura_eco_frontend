"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck, Headphones, Leaf,
  ShieldCheck, Truck, Star, Heart, ShoppingCart,
  ArrowRight, Package, Tag, Zap,
  RotateCcw, Phone, MapPin, Mail, ExternalLink,
  Quote, Clock,
} from "lucide-react";

import { useAuth } from "@/auth/AuthProvider";
import { useToast } from "@/components/ui/toast-provider";
import { useCart } from "@/hooks/useCart";
import { useWishlistMutations } from "@/hooks/use-ecommerce-queries";
import useLandingPageData from "@/hooks/useLandingPageData";
import type { Product } from "@/lib/api";
import Header from "@/components/header";
import { HeroSwiper } from "@/components/home/untitled/HeroSwiper";
import { QuickViewModal } from "@/components/home/products/QuickViewModal";
import { NewArrivalsSection } from "@/components/home/products/NewArrivalsSection";
import { ProductTabsSection } from "@/components/home/products/ProductTabsSection";
import { MostViewedSection } from "@/components/home/products/MostViewedSection";
import { MostPurchasedSection } from "@/components/home/products/MostPurchasedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.4 },
};

const floatLoop = {
  y: [0, -6, 0],
  transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" as const },
};

/* -- Static data ---------------------------------------------------- */
const services = [
  { icon: Truck,       title: "Free Delivery",     description: "Free shipping on all orders over $150. Fast and reliable.", color: "text-violet-600 dark:text-violet-400",  bg: "bg-violet-50 dark:bg-violet-500/10" },
  { icon: ShieldCheck, title: "Secure Payment",    description: "Your transactions are protected with bank-grade encryption.", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: Headphones,  title: "24/7 Support",      description: "Our team is always here — chat, call, or email any time.",  color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-50 dark:bg-blue-500/10" },
  { icon: RotateCcw,   title: "Easy Returns",      description: "30-day hassle-free returns on all eligible products.",       color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10" },
  { icon: Leaf,        title: "Eco Certified",     description: "Sustainably sourced materials and eco-friendly packaging.",  color: "text-teal-600 dark:text-teal-400",     bg: "bg-teal-50 dark:bg-teal-500/10" },
  { icon: BadgeCheck,  title: "Quality Guarantee", description: "Every product is verified by our expert quality team.",      color: "text-rose-600 dark:text-rose-400",     bg: "bg-rose-50 dark:bg-rose-500/10" },
];

const testimonials = [
  { quote: "TableEco helped us source premium table collections in one place. The quality and delivery workflow are excellent.", name: "Amelia Park",    title: "Interior Architect",   rating: 5 },
  { quote: "The curated categories and recommendations saved us hours. We launched our new cafe interior two weeks ahead of plan.", name: "Jordan Cruz",    title: "Cafe Owner",           rating: 5 },
  { quote: "Fast support, modern dashboard, and trusted suppliers. It feels like enterprise tooling with startup speed.", name: "Noah Bennett",  title: "Procurement Lead",     rating: 5 },
  { quote: "Amazing product quality and lightning-fast shipping. The eco-certification gives me confidence in every purchase.", name: "Sarah Kim",     title: "Office Manager",       rating: 5 },
  { quote: "The best eco-friendly furniture platform I've found. The selection and service are truly unmatched.", name: "Marcus Torres", title: "Sustainability Director", rating: 5 },
  { quote: "Smooth ordering experience, transparent tracking, and beautiful products. Highly recommend TableEco.", name: "Priya Nair",    title: "Hotel Interior Designer", rating: 4 },
];

/* -- Product skeleton ----------------------------------------------- */
function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[5px] bg-slate-100/80 dark:bg-slate-900/70">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

/* -- Section header ------------------------------------------------- */
function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-1.5">{eyebrow}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-lg">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}

/* -- Product card --------------------------------------------------- */
function ProductCard({
  product,
  onAddToCart,
  onWishlist,
  badge,
}: {
  product: Product;
  onAddToCart: (id: number) => void;
  onWishlist: (id: number) => void;
  badge?: string;
}) {
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product.proId);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group overflow-hidden rounded-[5px] bg-white dark:bg-slate-900 transition-transform duration-200"
    >
      {/* Image */}
      <div className="relative h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.proName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
        )}
        {badge && (
          <Badge className="absolute top-2.5 left-2.5 rounded-[5px] border-0 bg-violet-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white hover:bg-violet-600">
            {badge}
          </Badge>
        )}
        <button
          onClick={() => onWishlist(product.proId)}
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-[5px] bg-white/90 opacity-0 transition-all duration-200 hover:text-rose-500 group-hover:opacity-100 dark:bg-slate-900/90"
        >
          <Heart className="w-3.5 h-3.5 text-slate-500 hover:text-rose-500 transition-colors" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wide truncate">
          {product.categoryName}
        </p>
        <Link href={`/products/${product.proId}`}>
          <h3 className="text-slate-900 dark:text-white font-semibold text-sm leading-snug line-clamp-2 min-h-10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            {product.proName}
          </h3>
        </Link>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("w-3 h-3", i < 4 ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700")} />
          ))}
          <span className="text-slate-400 text-xs ml-1">(4.0)</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-900 dark:text-white font-bold text-base">${product.proPrice}</span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={adding}
            className={cn(
              "rounded-[5px] text-xs h-8 px-3 transition-all duration-200",
              adding
                ? "bg-violet-600 text-white"
                : "bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white dark:bg-violet-600/15 dark:text-violet-300"
            )}
            variant="ghost"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {adding ? "Adding…" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function HomePageClient() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const wishlist = useWishlistMutations();
  const [email, setEmail] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const landing = useLandingPageData();

  const featuredProducts = landing.featuredProducts.data || [];
  const popularProducts = landing.popularProducts.data || [];
  const newArrivals = landing.newArrivals.data || [];
  const topRated = landing.topRated.data || [];
  const mostViewed = landing.mostViewed.data || [];
  const mostPurchased = landing.mostPurchased.data || [];
  const categories = landing.categories.data || [];

  const handleAddToCart = async (productId: number, qty = 1) => {
    try {
      await addToCart(productId, qty);
      showToast({ type: "success", title: "Added to cart", message: "Item has been added to your cart." });
    } catch {
      showToast({ type: "error", title: "Unable to add item", message: "Please try again in a moment." });
    }
  };

  const handleWishlist = async (productId: number) => {
    if (!isAuthenticated) {
      showToast({ type: "info", title: "Sign in required", message: "Login to save items in your wishlist." });
      return;
    }
    try {
      await wishlist.add.mutateAsync(productId);
      showToast({ type: "success", title: "Saved to wishlist", message: "Item has been added to your wishlist." });
    } catch {
      showToast({ type: "error", title: "Wishlist error", message: "Could not save this item right now." });
    }
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    showToast({ type: "success", title: "Subscribed!", message: `${email.trim()} has been added to product updates.` });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <Header />

      <main>
        {/* ======================================
            HERO — Swiper banner
        ====================================== */}
        <HeroSwiper />

        {/* ======================================
            CATEGORY ROW
        ====================================== */}
        <section className="bg-slate-50 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {landing.categories.isLoading ? (
              <div className="grid grid-cols-2 gap-5 py-7 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-[5px]" />
                    <Skeleton className="h-4 w-24 rounded-[5px]" />
                  </div>
                ))}
              </div>
            ) : landing.categories.isError ? (
              <div className="py-7 text-sm text-slate-500 dark:text-slate-400">
                Failed to load categories right now.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 py-7 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <motion.div key={category.catId} {...fadeUp}>
                    <Link
                      href={`/products?category=${encodeURIComponent(category.catName)}`}
                      className="flex items-center gap-3 rounded-[5px] bg-white/70 px-3 py-2 transition-all duration-200 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-900"
                    >
                      {category.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={category.imageUrl}
                          alt={category.catName}
                          className="h-12 w-12 shrink-0 rounded-[5px] object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] bg-slate-200/70 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {category.catName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {category.catName}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ======================================
            NEW ARRIVALS
        ====================================== */}
        <NewArrivalsSection
          products={newArrivals}
          isLoading={landing.newArrivals.isLoading}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
          onQuickView={setQuickViewProduct}
        />

        {/* ======================================
            FEATURED PRODUCTS
        ====================================== */}
        <section id="featured" className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-8">
          <SectionHeader
            eyebrow="Featured products"
            title="Top picks from our catalog"
            description="Dynamically loaded from our backend APIs with wishlist and cart actions."
            action={
              <Button variant="ghost" size="sm" asChild className="rounded-[5px] text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-500/10 shrink-0">
                <Link href="/products">View all products <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            }
          />
          <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
            {landing.featuredProducts.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : landing.featuredProducts.isError ? (
              <div className="rounded-[5px] bg-red-50 p-5 text-sm text-red-600 dark:bg-red-500/5 dark:text-red-400">
                Failed to load featured products. Please refresh.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {featuredProducts.map((p, i) => (
                  <ProductCard key={p.proId} product={p} onAddToCart={handleAddToCart} onWishlist={handleWishlist}
                    badge={i === 0 ? "FEATURED" : i < 2 ? "NEW" : undefined} />
                ))}
              </div>
            )}
          </motion.div>
        </section>

        {/* ======================================
            CATEGORIES
        ====================================== */}
        <section id="categories" className="bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-8">
            <motion.div {...fadeUp} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Top Categories
                </h2>
                <p className="text-base text-slate-400 dark:text-slate-500">
                  Some of the new products arriving this weeks
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-lg font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                View All
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>

            {landing.categories.isLoading ? (
              <div className="grid gap-4 lg:grid-cols-[2.1fr_1fr]">
                <div className="overflow-hidden rounded-[5px] bg-slate-100/80 dark:bg-slate-900/70">
                  <Skeleton className="h-[520px] w-full rounded-none" />
                </div>
                <div className="grid gap-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="overflow-hidden rounded-[5px] bg-slate-100/80 dark:bg-slate-900/70">
                      <Skeleton className="h-[252px] w-full rounded-none" />
                    </div>
                  ))}
                </div>
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-[5px] bg-slate-100 p-10 text-center text-sm text-slate-400 dark:bg-slate-900/50">
                No categories available right now.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[2.1fr_1fr]">
                <Link href={`/products?category=${encodeURIComponent(categories[0].catName)}`}>
                  <motion.div
                    {...fadeUp}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="group relative min-h-[520px] overflow-hidden rounded-[5px] bg-slate-900"
                  >
                    {categories[0].imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={categories[0].imageUrl}
                          alt={categories[0].catName}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-slate-950/78 via-slate-950/45 to-slate-950/20" />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/72 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-emerald-500 via-teal-500 to-slate-900" />
                    )}

                    <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-[5px] bg-emerald-500 px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-white">
                          Farm To Table
                        </span>
                        <span className="rounded-[5px] bg-white/20 px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                          Stock: {(categories[0].productCount ?? 0) > 0 ? `${categories[0].productCount}+` : "150+"}
                        </span>
                      </div>

                      <div className="max-w-3xl">
                        <h3 className="max-w-2xl text-5xl font-black uppercase leading-[0.95] text-white md:text-6xl">
                          {categories[0].catName}
                        </h3>
                        <p className="mt-6 max-w-2xl text-2xl font-black uppercase leading-tight text-emerald-400 md:text-5xl">
                          Live Better.
                        </p>
                        <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-white/88">
                          {categories[0].description || "Discover our curated collection with fresh arrivals and reliable delivery across the catalog."}
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                          <span className="inline-flex h-16 items-center justify-center rounded-[5px] bg-emerald-500 px-8 text-xl font-bold text-white">
                            Shop {categories[0].catName}
                          </span>
                          <span className="inline-flex h-16 items-center justify-center rounded-[5px] bg-white/10 px-8 text-xl font-bold text-white backdrop-blur-sm">
                            Learn More
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                <div className="grid gap-4">
                  {categories.slice(1, 3).map((category, index) => (
                    <Link
                      key={category.catId}
                      href={`/products?category=${encodeURIComponent(category.catName)}`}
                    >
                      <motion.div
                        {...fadeUp}
                        transition={{ delay: index * 0.06, duration: 0.24 }}
                        whileHover={{ y: -3 }}
                        className="group relative min-h-[252px] overflow-hidden rounded-[5px] bg-slate-900"
                      >
                        {category.imageUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={category.imageUrl}
                              alt={category.catName}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-900/42" />
                          </>
                        ) : (
                          <div className={cn(
                            "absolute inset-0",
                            index === 0
                              ? "bg-linear-to-br from-indigo-400 via-slate-700 to-slate-900"
                              : "bg-linear-to-br from-amber-400 via-orange-500 to-slate-900"
                          )} />
                        )}

                        <div className="relative flex h-full flex-col justify-between p-7">
                          <div>
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/80">
                              {index === 0 ? "Season Favorite" : "Service Update"}
                            </p>
                            <h3 className="mt-3 max-w-[260px] text-4xl font-black uppercase leading-[0.95] text-white">
                              {category.catName}
                            </h3>
                            <p className="mt-3 text-lg font-semibold text-white/78">
                              {index === 0 ? "Juices & Cold Brews" : "Fast delivery & stocked essentials"}
                            </p>
                          </div>

                          <div className="flex items-end justify-between gap-4">
                            <div>
                              <p className={cn(
                                "text-2xl font-black uppercase",
                                index === 0 ? "text-amber-300" : "text-white"
                              )}>
                                {index === 0 ? "Up to -75%" : "24h"}
                              </p>
                              {index === 1 ? (
                                <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em] text-white/76">
                                  Track your order
                                </p>
                              ) : null}
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-[5px] bg-white text-slate-800 transition-transform duration-200 group-hover:translate-x-1">
                              <ArrowRight className="h-6 w-6" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}

                  {categories.length === 2 ? (
                    <div className="hidden lg:block" />
                  ) : null}
                  {categories.length === 1 ? (
                    <div className="hidden lg:block" />
                  ) : null}
                  {categories.length < 3 ? (
                    Array.from({ length: Math.max(0, 2 - (categories.length - 1)) }).map((_, index) => (
                      <div key={`filler-${index}`} className="hidden lg:block rounded-[5px] bg-slate-100/70 dark:bg-slate-900/50" />
                    ))
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ======================================
            PRODUCT TABS
        ====================================== */}
        <ProductTabsSection
          trending={popularProducts}
          topRated={topRated}
          mostViewed={mostViewed}
          newArrivals={newArrivals}
          isLoading={landing.popularProducts.isLoading || landing.topRated.isLoading || landing.mostViewed.isLoading || landing.newArrivals.isLoading}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
          onQuickView={setQuickViewProduct}
        />

        {/* ======================================
            PROMOTIONAL BANNER
        ====================================== */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-[5px] bg-slate-900 dark:bg-slate-900"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&auto=format)" }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-slate-900/95 via-slate-900/80 to-slate-900/50" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
              <div>
                <motion.div
                  animate={floatLoop}
                  className="mb-4 inline-flex items-center gap-2 rounded-[5px] bg-rose-500/15 px-2.5 py-1 text-xs font-bold tracking-widest uppercase text-rose-400"
                >
                  <Zap className="w-3 h-3" /> Limited Time Offer
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                  Up to 40% Off<br />
                  <span className="text-violet-400">Premium Collections</span>
                </h2>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                  End-of-season sale on dining tables, chairs, and home office furniture from verified eco suppliers.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="rounded-[5px] bg-violet-600 hover:bg-violet-500 text-white font-bold px-6">
                    <Link href="/products">Shop the sale <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-[5px] border-0 bg-white/10 text-white hover:bg-white/16 hover:text-white">
                    <Link href="/about">Learn more</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Dining Tables",   pct: "Up to 40% off" },
                  { label: "Premium Chairs",  pct: "Up to 30% off" },
                  { label: "Office Desks",    pct: "Up to 25% off" },
                  { label: "Accessories",     pct: "Up to 20% off" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                    whileHover={{ y: -3 }}
                    className="cursor-default rounded-[5px] bg-white/6 p-4 transition-colors duration-200 hover:bg-violet-500/8"
                  >
                    <Tag className="w-4 h-4 text-violet-400 mb-2" />
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-violet-400 text-xs mt-0.5 font-medium">{item.pct}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ======================================
            MOST VIEWED
        ====================================== */}
        <MostViewedSection
          products={mostViewed}
          isLoading={landing.mostViewed.isLoading}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
          onQuickView={setQuickViewProduct}
        />

        {/* ======================================
            MOST PURCHASED
        ====================================== */}
        <MostPurchasedSection
          products={mostPurchased}
          isLoading={landing.mostPurchased.isLoading}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
          onQuickView={setQuickViewProduct}
        />

        {/* ======================================
            TRENDING PRODUCTS
        ====================================== */}
        <section id="trending" className="bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-8">
            <SectionHeader
              eyebrow="Trending now"
              title="What everyone's buying"
              description="Trending products ranked by real-time popularity and sales data."
              action={
                <Button variant="ghost" size="sm" asChild className="rounded-[5px] text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-500/10 shrink-0">
                  <Link href="/products?tab=trending">View trending <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              }
            />
            <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
              {landing.popularProducts.isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {popularProducts.map((p, i) => (
                    <ProductCard key={p.proId} product={p} onAddToCart={handleAddToCart} onWishlist={handleWishlist}
                      badge={i === 0 ? "🔥 HOT" : i === 1 ? "TRENDING" : undefined} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ======================================
            SERVICE FEATURES
        ====================================== */}
        <section>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-8">
            <motion.div {...fadeUp} className="text-center">
              <p className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-1.5">Why TableEco</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Built for premium commerce</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((item, i) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Card className="rounded-[5px] border-0 ring-0 shadow-none bg-white dark:bg-slate-900 transition-transform duration-200 hover:-translate-y-1">
                    <CardContent className="p-5">
                      <div className={cn("w-9 h-9 rounded-[5px] flex items-center justify-center mb-4", item.bg)}>
                        <item.icon className={cn("w-4.5 h-4.5", item.color)} />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">{item.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================
            TESTIMONIALS
        ====================================== */}
        <section id="testimonials" className="bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-8">
            <motion.div {...fadeUp} className="text-center">
              <p className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-1.5">Testimonials</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">What our customers say</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.06, duration: 0.4 }}>
                  <Card className="h-full rounded-[5px] border-0 ring-0 shadow-none bg-white dark:bg-slate-900 transition-transform duration-200 hover:-translate-y-1">
                    <CardContent className="p-5 flex flex-col h-full">
                      <Quote className="w-5 h-5 text-violet-300 dark:text-violet-500 mb-3 shrink-0" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1 mb-4">&ldquo;{t.quote}&rdquo;</p>
                      <Separator className="mb-4 bg-border/40" />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t.title}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star key={si} className={cn("w-3 h-3", si < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700")} />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================
            NEWSLETTER
        ====================================== */}
        <section>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
            <motion.div {...fadeUp} className="max-w-xl mx-auto text-center space-y-4">
              <p className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400">Newsletter</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Get weekly furniture insights</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Receive launch alerts, supplier updates, and curated collections directly in your inbox. No spam.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 mt-2">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-10 flex-1 rounded-[5px] border-0 bg-slate-100 text-sm placeholder:text-slate-400 dark:bg-slate-900"
                />
                <Button type="submit" className="rounded-[5px] bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 h-10 shrink-0">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-slate-400 dark:text-slate-500">By subscribing you agree to our <Link href="/privacy" className="underline hover:text-violet-600 transition-colors">Privacy Policy</Link>.</p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ======================================
          FOOTER
      ====================================== */}
      <footer className="bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">

            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[5px] bg-violet-600 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-slate-900 dark:text-white text-lg">TableEco</span>
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Premium eco-friendly furniture marketplace. Sustainable sourcing, verified suppliers, modern shopping.
              </p>
              <div className="space-y-2">
                <a href="tel:+11300825323" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> 1300-TABLEECO
                </a>
                <a href="mailto:hello@tableeco.com" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> hello@tableeco.com
                </a>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> Melbourne, Australia
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                {[
                  { href: "https://facebook.com", label: "Facebook" },
                  { href: "https://x.com", label: "X / Twitter" },
                  { href: "https://instagram.com", label: "Instagram" },
                  { href: "https://youtube.com", label: "YouTube" },
                ].map(({ href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-white text-slate-400 transition-colors hover:text-violet-600 dark:bg-slate-900 dark:hover:text-violet-400">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white">Shop</p>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link href="/products" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">All Products</Link></li>
                <li><Link href="/products?tab=trending" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Trending</Link></li>
                <li><Link href="/products?filter=new" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">New Arrivals</Link></li>
                <li><Link href="/products?filter=sale" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Sale</Link></li>
                <li><Link href="/suppliers" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Suppliers</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white">Company</p>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link href="/about" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">FAQ</Link></li>
                <li><Link href="/tracking" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Track Order</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white">Legal</p>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link href="/terms" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/privacy#cookies" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Cookie Policy</Link></li>
              </ul>

              {/* Support hours */}
              <div className="mt-6 pt-4 space-y-1.5">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Support Hours
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mon – Fri: 9am – 6pm AEST</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sat – Sun: 10am – 4pm AEST</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} TableEco Pty Ltd. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <Leaf className="w-3 h-3 text-emerald-500" />
              <span>Carbon-neutral shipping on all orders</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ======================================
          QUICK VIEW MODAL
      ====================================== */}
      <QuickViewModal
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(id, qty) => handleAddToCart(id, qty)}
        onWishlist={handleWishlist}
      />
    </div>
  );
}

export default HomePageClient;
