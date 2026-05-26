"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  PackageCheck,
  Percent,
  Truck,
  type LucideIcon,
} from "lucide-react";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const SLIDE_INTERVAL = 5 * SECOND;

function getCountdown(targetTime: number) {
  const remaining = Math.max(targetTime - Date.now(), 0);
  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
  };
}

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

type Slide = {
  id: string;
  icon: LucideIcon;
  tone: string; // gradient classes for the small icon chip
  image?: string; // optional thumbnail image URL
  imageAlt?: string;
  tag: string;
  title: string;
  highlight: string;
  cta?: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    id: "delivery",
    icon: Truck,
    tone: "from-amber-400 to-orange-500",
    image:
      "https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=120&q=80",
    imageAlt: "Delivery truck",
    tag: "Delivery campaign",
    title: "FREE delivery on your next",
    highlight: "3 orders",
    cta: { label: "Shop now", href: "/products" },
  },
  {
    id: "discount",
    icon: Percent,
    tone: "from-rose-400 to-pink-600",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=120&q=80",
    imageAlt: "Sale tag",
    tag: "Flash sale",
    title: "Save up to",
    highlight: "40% off",
    cta: { label: "View deals", href: "/products?sort=discount" },
  },
  {
    id: "gift",
    icon: Gift,
    tone: "from-emerald-400 to-teal-500",
    image:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=120&q=80",
    imageAlt: "Wrapped gift",
    tag: "Members perk",
    title: "Free gift with orders over",
    highlight: "$50",
    cta: { label: "Join now", href: "/register" },
  },
  {
    id: "returns",
    icon: PackageCheck,
    tone: "from-sky-400 to-indigo-500",
    image:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=120&q=80",
    imageAlt: "Open package",
    tag: "Worry-free",
    title: "Easy returns within",
    highlight: "30 days",
    cta: { label: "Learn more", href: "/returns" },
  },
];

export default function TopPromoBar() {
  const [timeLeft, setTimeLeft] = useState(ZERO);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const targetTime =
      Date.now() + 37 * DAY + 20 * HOUR + 54 * MINUTE + 23 * SECOND;
    const update = () => setTimeLeft(getCountdown(targetTime));

    const raf = window.requestAnimationFrame(update);
    const timer = window.setInterval(update, SECOND);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [paused]);

  const slide = SLIDES[index];
  const Icon = slide.icon;

  const goPrev = () =>
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const goNext = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <div
      className="relative w-full overflow-hidden bg-linear-to-r from-[#4b2f91] via-[#5a3ea8] to-[#6f52c5] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_55%)]" />

      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 sm:gap-4 md:px-6 lg:px-8">
        {/* Prev */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous offer"
          className="hidden size-7 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Slide */}
        <div className="relative flex min-h-10 flex-1 items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center"
            >
              {slide.image ? (
                <span
                  className={
                    "relative size-8 shrink-0 overflow-hidden rounded-full ring-2 ring-white/30 shadow-[0_6px_16px_rgba(0,0,0,0.25)] bg-linear-to-br " +
                    slide.tone
                  }
                >
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt ?? slide.tag}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
              ) : (
                <span
                  className={
                    "flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-white shadow-[0_6px_16px_rgba(0,0,0,0.25)] " +
                    slide.tone
                  }
                  aria-hidden
                >
                  <Icon className="size-4" />
                </span>
              )}
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                {slide.tag}
              </span>
              <p className="text-sm font-medium sm:text-[15px]">
                {slide.title}{" "}
                <span className="font-bold text-white">{slide.highlight}</span>
              </p>
              {slide.cta && (
                <a
                  href={slide.cta.href}
                  className="inline-flex items-center rounded-full bg-white px-3 py-0.5 text-[11px] font-semibold text-[#5a3ea8] transition hover:bg-slate-100"
                >
                  {slide.cta.label}
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={goNext}
          aria-label="Next offer"
          className="hidden size-7 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex"
        >
          <ChevronRight className="size-4" />
        </button>

        {/* Countdown */}
        <div className="hidden shrink-0 items-center gap-1.5 border-l border-white/15 pl-3 md:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Ends in
          </span>
          <span
            className="font-mono text-[11px] tracking-wider text-white"
            suppressHydrationWarning
          >
            {String(timeLeft.days).padStart(2, "0")}d :{" "}
            {String(timeLeft.hours).padStart(2, "0")}h :{" "}
            {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
            {String(timeLeft.seconds).padStart(2, "0")}s
          </span>
        </div>
      </div>

      {/* Dots */}
      <div className="relative flex items-center justify-center gap-1.5 pb-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={
              "h-1 rounded-full transition-all " +
              (i === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60")
            }
          />
        ))}
      </div>
    </div>
  );
}
