"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { HomeBanner } from "@/types/homepage";

/* ─── Fallback slider data ───────────────────────────────── */
const FALLBACK_SLIDES: HomeBanner[] = [
  {
    id: "f1",
    title: "Premium Furniture\n& Modern Living",
    subtitle: "100% Sustainable",
    description:
      "Handcrafted pieces built to last a lifetime. Explore our curated selection of eco-friendly tables, chairs, and living sets.",
    ctaLabel: "Shop Now",
    ctaHref: "/products",
    toneFrom: "#EBF5FB",
    toneTo: "#EBF5FB",
    discountLabel: "",
    campaignType: "featured",
  },
  {
    id: "f2",
    title: "Discover Our Dining\nCollection",
    subtitle: "New Arrivals 2026",
    description:
      "From compact breakfast nooks to grand dining tables — find your perfect match for every space and style.",
    ctaLabel: "Explore Collection",
    ctaHref: "/products?category=dining",
    toneFrom: "#F0FBF4",
    toneTo: "#F0FBF4",
    discountLabel: "",
    campaignType: "seasonal",
  },
  {
    id: "f3",
    title: "Up To 30% Off\nLiving Room Sets",
    subtitle: "Limited Offer",
    description:
      "Refresh your living space with our seasonal sale. Quality sofas, accent chairs, and coffee tables at unbeatable prices.",
    ctaLabel: "View Deals",
    ctaHref: "/products?sale=true",
    toneFrom: "#FDF3EE",
    toneTo: "#FDF3EE",
    discountLabel: "",
    campaignType: "flash",
  },
];

/* subtitle → accent colour */
const ACCENT_COLORS: Record<string, string> = {
  "100% Sustainable": "#F0A500",
  "New Arrivals 2026": "#3BB77E",
  "Limited Offer": "#E57035",
};

/* ─── Static promo banners ───────────────────────────────── */
const PROMO_BANNERS = [
  {
    discount: "20% Off",
    label: "SALE",
    title: "Dining Tables\n& Chairs",
    href: "/products?category=dining",
    bg: "#F0FBF4",
    image: "/materials.png",
  },
  {
    discount: "15% Off",
    label: "SALE",
    title: "Sofa & Living\nRoom Sets",
    href: "/products?category=living",
    bg: "#FDF3EE",
    image: "/hero.png",
  },
];

/* ─── Slide animation ────────────────────────────────────── */
const textVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
};

interface HeroSectionProps {
  banners: HomeBanner[];
  loading: boolean;
}

export default function HeroSection({ banners, loading }: HeroSectionProps) {
  const slides = banners.length > 0 ? banners.slice(0, 5) : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const go = (idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent((idx + slides.length) % slides.length);
    startTimer();
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <Skeleton className="h-100 rounded-2xl" />
          <div className="grid grid-rows-2 gap-4">
            <Skeleton className="rounded-2xl" />
            <Skeleton className="rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];
  const accentColor = ACCENT_COLORS[slide.subtitle ?? ""] ?? "#3BB77E";
  const bgColor = slide.toneFrom ?? "#EBF5FB";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">

        {/* ── Left: Hero Slider ─────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ backgroundColor: bgColor, minHeight: 400, transition: "background-color 0.6s ease" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="grid min-h-100 grid-cols-[1fr_auto] items-center gap-4 px-8 py-12 md:px-14"
            >
              {/* Text content */}
              <div className="flex flex-col gap-5">
                <p
                  className="font-serif text-lg font-semibold italic"
                  style={{ color: accentColor }}
                >
                  {slide.subtitle}
                </p>

                <h1 className="whitespace-pre-line text-3xl font-extrabold leading-tight tracking-tight text-[#253D4E] md:text-4xl lg:text-[2.5rem]">
                  {slide.title}
                </h1>

                <p className="max-w-xs text-sm leading-relaxed text-[#6E7D8C]">
                  {slide.description}
                </p>

                <Link
                  href={slide.ctaHref}
                  className="inline-block w-fit border-2 border-[#253D4E] px-7 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#253D4E] transition-colors duration-200 hover:bg-[#253D4E] hover:text-white"
                >
                  {slide.ctaLabel}
                </Link>
              </div>

              {/* Hero product image */}
              <div className="relative hidden h-56 w-40 shrink-0 md:block lg:h-64 lg:w-48">
                <Image
                  src="/hero.png"
                  alt={String(slide.title).replace("\n", " ")}
                  fill
                  priority={current === 0}
                  className="object-contain drop-shadow-xl"
                  sizes="192px"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-8 flex items-center gap-2 md:left-14">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 28 : 10,
                  height: 10,
                  backgroundColor: i === current ? accentColor : "#CBD5E1",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Right: Promo Banners ──────────────────────────── */}
        <div className="grid grid-rows-2 gap-4">
          {PROMO_BANNERS.map((banner) => (
            <Link
              key={banner.title}
              href={banner.href}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl px-7 py-6 transition-shadow hover:shadow-md"
              style={{ backgroundColor: banner.bg }}
            >
              {/* Text */}
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-bold text-[#253D4E]">{banner.discount}</p>

                <div className="flex items-center gap-2">
                  <span className="block h-px w-8 bg-[#ADADAD]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADADAD]">
                    {banner.label}
                  </span>
                </div>

                <p className="whitespace-pre-line text-base font-extrabold leading-snug text-[#253D4E]">
                  {banner.title}
                </p>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E7D8C] transition-colors group-hover:text-[#3BB77E]">
                  Shop Collection
                  <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>

              {/* Product image */}
              <div className="relative h-28 w-28 shrink-0">
                <Image
                  src={banner.image}
                  alt={banner.title.replace("\n", " ")}
                  fill
                  className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                  sizes="112px"
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

