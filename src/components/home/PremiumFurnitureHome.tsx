"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { animate, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Leaf,
  ShieldCheck,
  Sofa,
  Star,
  Truck,
  Sparkles,
  Trees,
  Plus,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Product as ApiProduct } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useHeroSlides } from "@/components/home/hero/useHeroSlides";
import PremiumHeader from "@/components/header/PremiumHeader";
import categoryService from "@/services/home/categoryService";
import productService from "@/services/home/productService";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import "swiper/css";
import "swiper/css/pagination";

type CounterMetric = {
  label: string;
  value: number;
  suffix: string;
};

type CategoryPreset = {
  title: string;
  image: string;
  query: string;
};

type CollectionStory = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
};

type Testimonial = {
  name: string;
  role: string;
  image: string;
  rating: number;
  quote: string;
};

const counters: CounterMetric[] = [
  { label: "Happy Customers", value: 10000, suffix: "+" },
  { label: "Premium Products", value: 500, suffix: "+" },
  { label: "Years Experience", value: 15, suffix: "+" },
  { label: "Customer Satisfaction", value: 99, suffix: "%" },
];

const categoryPresets: CategoryPreset[] = [
  {
    title: "Dining Tables",
    query: "Dining",
    image:
      "https://images.unsplash.com/photo-1617104551722-3b2d513664c0?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Coffee Tables",
    query: "Coffee",
    image:
      "https://images.unsplash.com/photo-1615875605825-5eb9bb5d52cb?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Office Tables",
    query: "Office",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Outdoor Tables",
    query: "Outdoor",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Living Room",
    query: "Living",
    image:
      "https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Bedroom Furniture",
    query: "Bedroom",
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1400&q=80",
  },
];

const collectionStories: CollectionStory[] = [
  {
    title: "Premium Dining Collection",
    subtitle: "Solid oak heirloom pieces",
    description:
      "Engineered with kiln-dried wood, hand-finished edges, and tailored proportions for warm family dining spaces.",
    image:
      "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1800&q=80",
    href: "/products?collection=dining",
  },
  {
    title: "Modern Workspace Collection",
    subtitle: "Built for focus and calm",
    description:
      "Minimal silhouettes, cable-ready desks, and balanced ergonomics for productive home offices with natural character.",
    image:
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=1800&q=80",
    href: "/products?collection=workspace",
  },
  {
    title: "Luxury Living Collection",
    subtitle: "Layered textures, timeless tones",
    description:
      "Curated lounge essentials blending walnut, boucle, and matte metal accents to create elegant everyday rituals.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80",
    href: "/products?collection=living",
  },
];

const chooseUsItems = [
  {
    title: "Premium Materials",
    description: "Grade-A hardwoods and artisan finishes selected for longevity.",
    icon: Sofa,
  },
  {
    title: "Sustainable Wood",
    description: "Responsible sourcing with low-impact manufacturing practices.",
    icon: Trees,
  },
  {
    title: "Fast Delivery",
    description: "White-glove logistics and clear delivery windows nationwide.",
    icon: Truck,
  },
  {
    title: "Quality Guarantee",
    description: "Extended coverage and dedicated support for every collection.",
    icon: ShieldCheck,
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Olivia Tran",
    role: "Interior Stylist",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    rating: 5,
    quote:
      "The wood grain and joinery details are exceptional. TableEco feels like a true design atelier, not a catalog.",
  },
  {
    name: "Daniel Reed",
    role: "Architect",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    rating: 5,
    quote:
      "Our clients ask where the dining table is from in every reveal. It photographs beautifully and performs even better.",
  },
  {
    name: "Sophia Kim",
    role: "Homeowner",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80",
    rating: 5,
    quote:
      "Delivery was seamless and the quality exceeded expectations. Every piece feels considered and crafted to last.",
  },
];

const heroTrustPoints = [
  "10,000+ Happy Customers",
  "500+ Premium Products",
  "15+ Years Experience",
];

const heroImageFallbacks = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1616594039964-3f40c7cf8f2f?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1617104551722-3b2d513664c0?auto=format&fit=crop&w=1800&q=80",
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function getProductImage(product: ApiProduct) {
  return product.imageUrl || product.thumbnailImage || product.thumbnailImageUrl || product.imageUrls?.[0] ||
    "https://images.unsplash.com/photo-1616594039964-3f40c7cf8f2f?auto=format&fit=crop&w=1200&q=80";
}

function getProductRating(product: ApiProduct) {
  if (typeof product.rating === "number" && product.rating > 0) {
    return product.rating;
  }
  return 4.6;
}

function getProductBadge(product: ApiProduct) {
  if ((product.discount || 0) > 0) return `${product.discount}% OFF`;
  if ((product.purchaseCount || 0) > 100) return "Best Seller";
  return "Curated";
}

function FadeInSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs tracking-[0.2em] uppercase text-[#8A7650]">{eyebrow}</p>
      <h2 className="text-3xl leading-tight font-semibold text-[#1F2937] md:text-4xl">{title}</h2>
      {description ? <p className="max-w-3xl text-sm text-[#1F2937]/75 md:text-base">{description}</p> : null}
    </div>
  );
}

function CounterCard({ metric }: { metric: CounterMetric }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, metric.value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setCount(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, metric.value]);

  return (
    <Card ref={ref} className="rounded-[5px] border-none bg-white/75 shadow-none">
      <CardContent className="space-y-2 p-6">
        <p className="text-3xl font-semibold text-[#1F2937] md:text-4xl">
          {count.toLocaleString()}
          {metric.suffix}
        </p>
        <p className="text-sm text-[#1F2937]/70">{metric.label}</p>
      </CardContent>
    </Card>
  );
}

function ProductCard({
  product,
  onQuickAdd,
  onToggleWishlist,
  wished,
}: {
  product: ApiProduct;
  onQuickAdd: (product: ApiProduct) => void;
  onToggleWishlist: (productId: number) => void;
  wished: boolean;
}) {
  const productRating = getProductRating(product);
  const productImage = getProductImage(product);

  return (
    <motion.article whileHover={{ y: -4 }} className="group rounded-[5px] bg-white/85 p-4">
      <Link href={`/products/${product.proId}`} className="block">
        <div className="relative overflow-hidden rounded-[5px]">
          <Image
            src={productImage}
            alt={product.proName}
            width={900}
            height={760}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 24vw"
            className="h-68 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            unoptimized
          />
          <Badge className="absolute left-3 top-3 rounded-[5px] bg-[#DBCEA5] text-[#1F2937] hover:bg-[#DBCEA5]">
            {getProductBadge(product)}
          </Badge>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onToggleWishlist(product.proId);
            }}
            className="absolute right-3 top-3 rounded-[5px] bg-white/90 p-2 text-[#1F2937] transition-colors hover:text-[#8A7650]"
            aria-label={`Toggle wishlist for ${product.proName}`}
          >
            <Heart className={`h-4 w-4 ${wished ? "fill-[#8A7650] text-[#8A7650]" : ""}`} />
          </button>
        </div>
      </Link>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-[#1F2937]/70">
          <Star className="h-4 w-4 fill-[#8A7650] text-[#8A7650]" />
          <span>{productRating.toFixed(1)}</span>
          <span aria-hidden>•</span>
          <span>{(product.purchaseCount || 0).toLocaleString()} orders</span>
        </div>

        <Link href={`/products/${product.proId}`}>
          <h3 className="line-clamp-2 text-lg font-medium text-[#1F2937]">{product.proName}</h3>
        </Link>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-semibold text-[#1F2937]">{formatPrice(product.proPrice)}</p>
          <Button
            size="sm"
            onClick={() => onQuickAdd(product)}
            className="rounded-[5px] bg-[#8A7650] px-3 text-white hover:bg-[#746445]"
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductsSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[5px] bg-white/70 p-4">
          <div className="h-68 rounded-[5px] bg-[#DBCEA5]/50" />
          <div className="mt-4 h-4 w-16 rounded-[5px] bg-[#DBCEA5]/40" />
          <div className="mt-3 h-5 w-10/12 rounded-[5px] bg-[#DBCEA5]/45" />
          <div className="mt-4 h-5 w-24 rounded-[5px] bg-[#DBCEA5]/45" />
        </div>
      ))}
    </div>
  );
}

export default function PremiumFurnitureHome() {
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { slides, isLoading: slidesLoading } = useHeroSlides();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [brokenHeroImages, setBrokenHeroImages] = useState<Record<string, boolean>>({});

  const { data: categories = [] } = useQuery({
    queryKey: ["premium-home", "categories"],
    queryFn: categoryService.getAllCategories,
    staleTime: 1000 * 60 * 10,
  });

  const {
    data: productCollections,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ["premium-home", "collections"],
    queryFn: productService.getRecommendations,
    staleTime: 1000 * 60 * 5,
  });

  const heroSlides = useMemo(() => {
    if (slides.length > 0) return slides;
    return [
      {
        id: "fallback-premium",
        title: "Crafted wooden tables for modern rituals.",
        subtitle: "Signature Collection 2026",
        description:
          "From intimate coffee moments to grand dining gatherings, every TableEco piece is designed to elevate daily living.",
        ctaLabel: "Explore Collection",
        ctaHref: "/products",
        imageUrl:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80",
        badge: "Premium Furniture",
        tags: ["Premium Wood", "Scandinavian Minimalism", "Timeless Craft"],
        toneFrom: "#8A7650",
        toneTo: "#8E977D",
        stats: [],
      },
    ];
  }, [slides]);

  const featuredProducts = useMemo(
    () => productCollections?.trendingProducts?.slice(0, 8) || [],
    [productCollections?.trendingProducts],
  );
  const bestSellers = useMemo(
    () => productCollections?.bestSellers?.slice(0, 8) || [],
    [productCollections?.bestSellers],
  );
  const newArrivals = useMemo(
    () => productCollections?.newArrivals?.slice(0, 8) || [],
    [productCollections?.newArrivals],
  );

  const categoryCards = useMemo(
    () =>
      categoryPresets.map((preset) => {
        const apiCategory = categories.find((cat) => cat.catName.toLowerCase().includes(preset.query.toLowerCase()));
        return {
          ...preset,
          count: apiCategory?.productCount || 0,
          categoryName: apiCategory?.catName || preset.title,
        };
      }),
    [categories],
  );

  const handleQuickAdd = async (product: ApiProduct) => {
    try {
      await addToCart(product.proId, 1);
      showToast({
        type: "success",
        title: "Added to cart",
        message: `${product.proName} was added successfully.`,
      });
    } catch {
      // Error feedback is handled in useCart.
    }
  };

  const handleWishlistToggle = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast({
      type: "success",
      title: "Subscribed",
      message: "You are now on the TableEco editorial newsletter list.",
    });
    event.currentTarget.reset();
  };

  const activeSlide = heroSlides[activeHeroSlide] || heroSlides[0];

  return (
    <div className="bg-[#ECE7D1] text-[#1F2937]">
      <PremiumHeader showHeroOverlay />
      <div className="mx-auto w-[90vw] space-y-22 pb-20 pt-10">
        <FadeInSection id="hero" className="relative overflow-hidden rounded-[5px] bg-white p-6 md:p-10 lg:p-14">
          <div className="grid min-h-[550px] gap-8 md:min-h-[650px] lg:min-h-[760px] lg:grid-cols-[35fr_65fr] lg:gap-12">
            <div className="flex flex-col justify-center space-y-7">
              <Badge className="rounded-[5px] bg-[#DBCEA5] px-3 py-1 text-xs tracking-[0.14em] text-[#1F2937] uppercase hover:bg-[#DBCEA5]">
                Premium Furniture
              </Badge>
              <h1 className="text-[40px] leading-[1.02] font-extrabold tracking-[-0.02em] md:text-[52px] lg:text-[64px] lg:leading-[0.95]">
                Premium Wooden Tables Designed For Modern Living
              </h1>
              <p className="max-w-xl text-base text-[#1F2937]/75 md:text-lg">
                Discover hand-finished table collections crafted from premium wood, designed to elevate everyday rituals and timeless interiors.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="h-11 rounded-[5px] bg-[#8A7650] px-6 text-white hover:bg-[#746445]">
                  <Link href={activeSlide.ctaHref}>
                    Shop Premium Tables
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-[5px] border-none bg-white px-6 text-[#1F2937] hover:bg-[#DBCEA5]/45">
                  <Link href="/products?collection=premium">Explore Collections</Link>
                </Button>
              </div>
              <div className="grid gap-2 text-sm text-[#1F2937]/75 sm:grid-cols-3">
                {heroTrustPoints.map((point) => (
                  <div key={point} className="rounded-[5px] bg-[#ECE7D1]/55 px-3 py-2.5 font-medium">
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-full">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={heroSlides.length > 1}
                onSlideChange={(swiper) => setActiveHeroSlide(swiper.realIndex)}
                className="overflow-hidden rounded-[5px]"
              >
                {heroSlides.map((slide, index) => (
                  <SwiperSlide key={slide.id}>
                    {/** Use per-slide fallback source to avoid dark empty frames on invalid API image URLs. */}
                    <motion.div
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: index === activeHeroSlide ? 1 : 1.02 }}
                      transition={{ duration: 0.75, ease: "easeOut" }}
                      className="relative h-[550px] w-full md:h-[650px] lg:h-[760px]"
                    >
                      {(() => {
                        const fallbackImage = heroImageFallbacks[index % heroImageFallbacks.length];
                        const slideImageSrc = brokenHeroImages[slide.id] ? fallbackImage : slide.imageUrl?.trim() || fallbackImage;

                        return (
                      <Image
                        src={slideImageSrc}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover"
                        onError={() => {
                          setBrokenHeroImages((prev) => (prev[slide.id] ? prev : { ...prev, [slide.id]: true }));
                        }}
                      />
                        );
                      })()}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0.15))",
                        }}
                      />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 top-8 hidden rounded-[5px] bg-white/95 px-4 py-3 text-xs text-[#1F2937] sm:block"
              >
                <p className="text-xl font-semibold">10,000+</p>
                <p className="text-[#1F2937]/65">Happy Customers</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-28 hidden rounded-[5px] bg-[#8E977D] px-4 py-3 text-xs text-white lg:block"
              >
                <p className="text-xl font-semibold">500+</p>
                <p className="text-white/80">Premium Products</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 right-6 hidden rounded-[5px] bg-[#DBCEA5] px-4 py-3 text-xs text-[#1F2937] sm:block"
              >
                <p className="text-xl font-semibold">15+</p>
                <p className="text-[#1F2937]/70">Years Experience</p>
              </motion.div>
            </div>
          </div>

          {slidesLoading ? <p className="mt-4 text-xs text-[#1F2937]/55">Loading editorial hero stories...</p> : null}
        </FadeInSection>

        <FadeInSection id="stats" className="space-y-7">
          <SectionHeading
            eyebrow="Trust"
            title="Built with care, trusted by modern homes"
            description="Our design-led furniture collections are grounded in quality craftsmanship, responsible materials, and dependable service."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {counters.map((metric) => (
              <CounterCard key={metric.label} metric={metric} />
            ))}
          </div>
        </FadeInSection>

        <FadeInSection id="categories" className="space-y-7">
          <SectionHeading
            eyebrow="Shop By Category"
            title="Furniture for every room and ritual"
            description="Explore curated table and furniture families tailored to dining, work, leisure, and life at home."
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {categoryCards.map((category) => (
              <Link
                key={category.title}
                href={`/products?category=${encodeURIComponent(category.categoryName)}`}
                className="group overflow-hidden rounded-[5px] bg-white/80"
              >
                <div className="relative h-70 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    unoptimized
                  />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-xl font-medium text-[#1F2937]">{category.title}</h3>
                  <p className="text-sm text-[#1F2937]/70">{category.count.toLocaleString()} curated products</p>
                </div>
              </Link>
            ))}
          </div>
        </FadeInSection>

        <FadeInSection id="collections" className="space-y-7">
          <SectionHeading
            eyebrow="Featured Collection"
            title="Editorial collections with a distinct mood"
            description="Each collection is assembled like a magazine story, pairing materials, proportions, and textures into cohesive interiors."
          />
          <div className="space-y-5">
            {collectionStories.map((collection, index) => (
              <motion.article
                key={collection.title}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-[5px] bg-white/80"
              >
                <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                  <div className={`relative h-74 lg:h-full ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className={`flex items-center p-7 md:p-10 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="space-y-4">
                      <p className="text-xs tracking-[0.16em] uppercase text-[#8E977D]">{collection.subtitle}</p>
                      <h3 className="text-3xl leading-tight font-semibold text-[#1F2937]">{collection.title}</h3>
                      <p className="text-sm text-[#1F2937]/75 md:text-base">{collection.description}</p>
                      <Button asChild variant="ghost" className="rounded-[5px] px-0 text-[#8A7650] hover:bg-transparent hover:text-[#746445]">
                        <Link href={collection.href}>
                          Explore story
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </FadeInSection>

        <FadeInSection id="featured-products" className="space-y-7">
          <SectionHeading
            eyebrow="Featured Products"
            title="Premium product picks from our live catalog"
            description="These selections are loaded from the latest product API to keep your homepage inventory fresh and relevant."
          />

          {productLoading ? <ProductsSkeleton /> : null}
          {!productLoading && featuredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.proId}
                  product={product}
                  onQuickAdd={handleQuickAdd}
                  onToggleWishlist={handleWishlistToggle}
                  wished={wishlist.includes(product.proId)}
                />
              ))}
            </div>
          ) : null}
          {productError ? (
            <p className="rounded-[5px] bg-white/70 p-4 text-sm text-[#1F2937]/70">
              We could not load featured products right now. Please try again shortly.
            </p>
          ) : null}
        </FadeInSection>

        <FadeInSection id="best-sellers" className="space-y-7">
          <SectionHeading
            eyebrow="Best Sellers"
            title="Most-loved pieces with quick access actions"
            description="Discover highly purchased tables and lifestyle furniture in a smooth horizontal showcase."
          />

          {bestSellers.length > 0 ? (
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 4300, disableOnInteraction: false }}
              spaceBetween={16}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.1 },
                1024: { slidesPerView: 3.1 },
                1280: { slidesPerView: 4.1 },
              }}
            >
              {bestSellers.map((product) => (
                <SwiperSlide key={product.proId}>
                  <ProductCard
                    product={product}
                    onQuickAdd={handleQuickAdd}
                    onToggleWishlist={handleWishlistToggle}
                    wished={wishlist.includes(product.proId)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <ProductsSkeleton items={4} />
          )}
        </FadeInSection>

        <FadeInSection id="new-arrivals" className="space-y-7">
          <SectionHeading
            eyebrow="New Arrivals"
            title="Fresh designs with modern silhouettes"
            description="Recently released products appear with smooth motion and premium visual spacing."
          />

          {newArrivals.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product, index) => (
                <motion.div
                  key={product.proId}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onQuickAdd={handleQuickAdd}
                    onToggleWishlist={handleWishlistToggle}
                    wished={wishlist.includes(product.proId)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <ProductsSkeleton items={4} />
          )}
        </FadeInSection>

        <FadeInSection id="why-choose" className="space-y-7">
          <SectionHeading
            eyebrow="Why Choose TableEco"
            title="Design excellence backed by responsible craft"
            description="Every detail is intentional: from material sourcing to workshop precision to post-purchase support."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {chooseUsItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="rounded-[5px] border-none bg-white/80 shadow-none">
                  <CardContent className="space-y-4 p-6">
                    <div className="inline-flex rounded-[5px] bg-[#DBCEA5] p-3 text-[#1F2937]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-medium text-[#1F2937]">{item.title}</h3>
                    <p className="text-sm text-[#1F2937]/70">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </FadeInSection>

        <FadeInSection id="inspiration" className="space-y-7">
          <SectionHeading
            eyebrow="Furniture Inspiration"
            title="Lifestyle scenes inspired by modern interiors"
            description="See how warm wood tones and restrained palettes create timeless spaces influenced by Scandinavian living."
          />

          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <article className="overflow-hidden rounded-[5px] bg-white/80">
              <div className="relative h-76 md:h-[460px]">
                <Image
                  src="https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&w=1800&q=80"
                  alt="Minimal living room with wooden coffee table"
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="space-y-3 p-7">
                <h3 className="text-2xl font-semibold text-[#1F2937]">The Warm Modern Living Room</h3>
                <p className="text-sm text-[#1F2937]/70 md:text-base">
                  Layer natural oak tables with soft textiles, matte ceramics, and low-profile seating for an inviting lounge atmosphere.
                </p>
                <Button asChild variant="ghost" className="rounded-[5px] px-0 text-[#8A7650] hover:bg-transparent hover:text-[#746445]">
                  <Link href="/products?space=living-room">
                    Shop this look
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>

            <div className="space-y-5">
              <article className="overflow-hidden rounded-[5px] bg-white/80">
                <div className="relative h-44">
                  <Image
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
                    alt="Elegant dining setup with natural wood table"
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-2 p-5">
                  <h4 className="text-lg font-medium text-[#1F2937]">Elevated dining moments</h4>
                  <p className="text-sm text-[#1F2937]/70">Set the tone with sculpted lighting and hand-finished table surfaces.</p>
                </div>
              </article>

              <article className="overflow-hidden rounded-[5px] bg-white/80">
                <div className="relative h-44">
                  <Image
                    src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80"
                    alt="Calm workspace with minimal desk and chair"
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-2 p-5">
                  <h4 className="text-lg font-medium text-[#1F2937]">Calm productive corners</h4>
                  <p className="text-sm text-[#1F2937]/70">Create visual quiet with neutral tones and practical table geometry.</p>
                </div>
              </article>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection id="testimonials" className="space-y-7">
          <SectionHeading
            eyebrow="Testimonials"
            title="What customers say about the TableEco experience"
          />
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 5200, disableOnInteraction: false }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <Card className="h-full rounded-[5px] border-none bg-white/85 shadow-none">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-3">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={54}
                        height={54}
                        className="h-13 w-13 rounded-[5px] object-cover"
                        unoptimized
                      />
                      <div>
                        <p className="font-medium text-[#1F2937]">{testimonial.name}</p>
                        <p className="text-sm text-[#1F2937]/65">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#1F2937]/75 md:text-base">“{testimonial.quote}”</p>
                    <div className="flex items-center gap-1 text-[#8A7650]" aria-label={`${testimonial.rating} out of 5 stars`}>
                      {Array.from({ length: testimonial.rating }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </FadeInSection>

        <FadeInSection id="newsletter" className="rounded-[5px] bg-white/80 p-7 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-[#8E977D]">Newsletter</p>
              <h2 className="text-3xl leading-tight font-semibold text-[#1F2937] md:text-4xl">
                Get interior stories, collection drops, and design guidance.
              </h2>
              <p className="text-sm text-[#1F2937]/70 md:text-base">
                Join our premium digest for early access to launches, material spotlights, and styling inspiration.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                required
                placeholder="Enter your email"
                className="h-11 rounded-[5px] border-none bg-[#ECE7D1] text-[#1F2937] placeholder:text-[#1F2937]/50"
                aria-label="Email address"
              />
              <Button type="submit" className="h-11 rounded-[5px] bg-[#8A7650] px-6 text-white hover:bg-[#746445]">
                Subscribe
              </Button>
            </form>
          </div>
        </FadeInSection>
      </div>

      <footer id="footer" className="bg-[#1F2937] text-white">
        <div className="mx-auto grid w-[90vw] gap-10 py-14 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-[5px] bg-white/10 px-3 py-2">
              <Leaf className="h-4 w-4 text-[#DBCEA5]" />
              <span className="text-sm tracking-[0.16em] uppercase">TableEco Atelier</span>
            </div>
            <p className="max-w-md text-sm text-white/75 md:text-base">
              Modern furniture rooted in craftsmanship, sustainable materials, and intentional living. Designed for homes that value warmth and precision.
            </p>
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Premium support: support@tableeco.com</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm tracking-[0.16em] uppercase text-[#DBCEA5]">Company</h3>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Our Showrooms</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm tracking-[0.16em] uppercase text-[#DBCEA5]">Categories</h3>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/products?category=Dining" className="hover:text-white">Dining Tables</Link></li>
              <li><Link href="/products?category=Coffee" className="hover:text-white">Coffee Tables</Link></li>
              <li><Link href="/products?category=Office" className="hover:text-white">Office Tables</Link></li>
              <li><Link href="/products?category=Outdoor" className="hover:text-white">Outdoor Tables</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm tracking-[0.16em] uppercase text-[#DBCEA5]">Customer Care</h3>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/faq" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/tracking" className="hover:text-white">Track Orders</Link></li>
              <li><Link href="/register" className="hover:text-white">Trade Program</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-[90vw] flex-col gap-3 py-4 text-xs text-white/60 lg:flex-row lg:items-center lg:justify-between">
            <p>© {new Date().getFullYear()} TableEco. All rights reserved.</p>
            <p>Crafted for modern interiors with sustainable values.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

