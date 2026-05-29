import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Star, Truck } from "lucide-react";

import type { HeroSlide } from "@/components/home/hero/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statIcons = [Sparkles, Star, Truck];

type HeroSlideContentProps = {
  slide: HeroSlide;
};

export default function HeroSlideContent({ slide }: HeroSlideContentProps) {
  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-10 max-w-2xl"
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {slide.tags.slice(0, 3).map((tag, idx) => (
          <Badge
            key={`${slide.id}-${idx}-${tag}`}
            className="rounded-[5px] border border-white/35 bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <p className="mb-2 inline-flex rounded-[5px] bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-earth-light">
        {slide.badge}
      </p>
      <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">{slide.title}</h1>
      <p className="mt-3 max-w-xl text-sm text-white/90 md:text-lg">{slide.subtitle}</p>
      <p className="mt-2 max-w-xl text-xs text-white/80 md:text-sm">{slide.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          asChild
          className="h-11 rounded-[5px] bg-earth-dark px-6 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] hover:bg-[#756447]"
        >
          <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-[5px] border-white/45 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20 hover:text-white"
        >
          <Link href="/products?tag=premium">Explore Premium</Link>
        </Button>
      </div>

      <div className="mt-6 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-3">
        {slide.stats.slice(0, 3).map((stat, idx) => {
          const Icon = statIcons[idx % statIcons.length];
          return (
            <motion.div
              key={`${slide.id}-${stat.label}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 + idx * 0.08 }}
              className="flex items-center gap-2 rounded-[5px] bg-white/12 px-3 py-2 backdrop-blur-sm"
            >
              <Icon className="h-4 w-4 text-earth-light" />
              <div>
                <p className="text-xs font-semibold text-white">{stat.value}</p>
                <p className="text-[11px] text-white/80">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

