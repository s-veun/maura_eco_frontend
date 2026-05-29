"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import HeroSkeleton from "@/components/home/hero/HeroSkeleton";
import HeroSlideContent from "@/components/home/hero/HeroSlideContent";
import { fallbackHeroSlides } from "@/components/home/hero/fallback-data";
import { useHeroSlides } from "@/components/home/hero/useHeroSlides";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

export default function PremiumHeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [autoplayPlugin] = useState(() =>
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const { slides, isLoading } = useHeroSlides();
  const effectiveSlides = slides.length ? slides : fallbackHeroSlides;

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => setActiveSlide(carouselApi.selectedScrollSnap());
    onSelect();

    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  if (isLoading && !slides.length) {
    return <HeroSkeleton />;
  }

  return (
    <section className="relative overflow-hidden rounded-[5px] border border-border/50 bg-card">
      <Carousel
        setApi={setCarouselApi}
        opts={{ loop: effectiveSlides.length > 1 }}
        plugins={[autoplayPlugin]}
        className="h-95 md:h-115"
      >
        <CarouselContent className="ml-0">
          {effectiveSlides.map((slide, idx) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative h-95 w-full overflow-hidden md:h-115">
                <motion.div
                  initial={{ scale: 1.02 }}
                  animate={{ scale: idx === activeSlide ? 1.08 : 1.02, y: idx === activeSlide ? -4 : 0 }}
                  transition={{ duration: 6, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 90vw"
                    className="object-cover"
                  />
                </motion.div>

                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(110deg, ${slide.toneFrom}cc 0%, ${slide.toneTo}99 45%, rgba(16,16,16,0.35) 100%)`,
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10" />

                <div className="relative z-10 flex h-full items-center px-4 py-6 sm:px-6 md:px-10">
                  <HeroSlideContent slide={slide} />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <button
        type="button"
        onClick={() => carouselApi?.scrollPrev()}
        className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[5px] bg-white/85 text-[#2B2B2B] transition-colors hover:bg-white md:inline-flex"
        aria-label="Previous hero banner"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => carouselApi?.scrollNext()}
        className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[5px] bg-white/85 text-[#2B2B2B] transition-colors hover:bg-white md:inline-flex"
        aria-label="Next hero banner"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-[5px] bg-white/90 px-3 py-1.5">
        {effectiveSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => carouselApi?.scrollTo(index)}
            className={`h-2 rounded-[5px] transition-all ${
              index === activeSlide ? "w-7 bg-earth-mid" : "w-2 bg-earth-dark/45 hover:bg-earth-dark/65"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeSlide}
          />
        ))}
      </div>
    </section>
  );
}
