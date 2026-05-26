"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

/* ── Slide data ────────────────────────────────────────────────────────── */
const slides = [
  {
    id: 1,
    badge: "New Collection 2026",
    headline: ["Artisan", "Dining Tables"],
    sub: "Handcrafted from sustainable hardwood. Built for family, crafted for generations.",
    cta: "Shop Dining",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1800&auto=format&fit=crop",
    gradient: "from-violet-950/80 via-slate-950/40 to-transparent",
  },
  {
    id: 2,
    badge: "Best Sellers",
    headline: ["Ergonomic", "Seating"],
    sub: "Premium chairs for every space — home, office, and hospitality.",
    cta: "Shop Chairs",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1800&auto=format&fit=crop",
    gradient: "from-emerald-950/75 via-slate-950/40 to-transparent",
  },
  {
    id: 3,
    badge: "Trending Now",
    headline: ["Living Room", "Essentials"],
    sub: "Elevate your living space with curated sofas, tables, and statement pieces.",
    cta: "Explore Living",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1800&auto=format&fit=crop",
    gradient: "from-amber-950/70 via-slate-950/40 to-transparent",
  },
  {
    id: 4,
    badge: "Eco Certified",
    headline: ["Sustainable", "Office Furniture"],
    sub: "Productive spaces start with the right furniture. Explore our eco-friendly office range.",
    cta: "Shop Office",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1800&auto=format&fit=crop",
    gradient: "from-teal-950/75 via-slate-950/40 to-transparent",
  },
];

/* ── Hero Swiper ───────────────────────────────────────────────────────── */
export function HeroSwiper() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [slideKey, setSlideKey] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIdx(emblaApi.selectedScrollSnap());
      setSlideKey((k) => k + 1);
    };
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950" style={{ height: "clamp(560px, 90vh, 740px)" }}>
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full overflow-hidden">
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-7000 linear"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: activeIdx === idx ? "scale(1.08)" : "scale(1)",
                }}
              />
              <div className={`absolute inset-0 bg-linear-to-r ${slide.gradient}`} />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pb-20">
                  <div className="max-w-xl">
                    <AnimatePresence mode="wait">
                      {activeIdx === idx && (
                        <>
                          <motion.div
                            key={`badge-${slideKey}`}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="mb-5"
                          >
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-white/10 border border-white/15 text-white/90 text-xs font-bold tracking-widest uppercase">
                              ✦ {slide.badge}
                            </span>
                          </motion.div>

                          <div className="mb-5 overflow-hidden">
                            {slide.headline.map((line, li) => (
                              <motion.div
                                key={`line-${li}-${slideKey}`}
                                initial={{ y: 80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                  duration: 0.7,
                                  delay: 0.1 + li * 0.13,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              >
                                <span
                                  className={`block text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight ${
                                    li === 1
                                      ? "text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300"
                                      : "text-white"
                                  }`}
                                >
                                  {line}
                                </span>
                              </motion.div>
                            ))}
                          </div>

                          <motion.p
                            key={`sub-${slideKey}`}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.38 }}
                            className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-md"
                          >
                            {slide.sub}
                          </motion.p>

                          <motion.div
                            key={`cta-${slideKey}`}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.52 }}
                            className="flex flex-wrap gap-3"
                          >
                            <Link
                              href="/products"
                              className="group inline-flex items-center gap-2 px-6 py-3 rounded-[5px] bg-white text-slate-900 font-bold text-sm hover:bg-violet-50 transition-colors duration-200"
                            >
                              {slide.cta}
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                              href="/products"
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-[5px] border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors duration-200"
                            >
                              Browse all
                            </Link>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-7 left-0 z-20 flex items-center gap-2 px-6 sm:px-12">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1 transition-all duration-300 ${
              activeIdx === i ? "w-6 bg-white/85" : "w-2 bg-white/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev arrow */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-[5px] bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next arrow */}
      <button
        onClick={scrollNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-[5px] bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
