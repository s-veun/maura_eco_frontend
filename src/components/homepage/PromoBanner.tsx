 "use client";

import Image from "next/image";
import { motion } from "framer-motion";

type PromoBannerProps = {
  title: string;
  subtitle: string;
  badge?: string;
  ctaText?: string;
  image: string;
  className: string;
  textClassName?: string;
  compact?: boolean;
};

export default function PromoBanner({
  title,
  subtitle,
  badge,
  ctaText,
  image,
  className,
  textClassName = "text-[#1f2937]",
  compact = false,
}: PromoBannerProps) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl border border-black/5 ${compact ? "p-4" : "min-h-[190px] p-4 sm:p-5 md:min-h-[215px] md:p-6"} ${className}`}
    >
      {badge ? (
        <span className="inline-flex rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#5a3ea8]">
          {badge}
        </span>
      ) : null}
      <h3 className={`mt-2 max-w-[310px] ${compact ? "text-base leading-5" : "text-xl leading-6 sm:text-2xl sm:leading-7"} font-black ${textClassName}`}>{title}</h3>
      <p className={`mt-1 max-w-[310px] text-xs ${textClassName} opacity-85`}>{subtitle}</p>
      {ctaText ? (
        <button className="mt-3 rounded-full bg-[#35206f] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#2a1a55]">
          {ctaText}
        </button>
      ) : null}
      <Image
        src={image}
        alt={title}
        width={compact ? 130 : 220}
        height={compact ? 130 : 220}
        unoptimized
        className={`pointer-events-none absolute ${compact ? "-bottom-2 right-1 h-[95px] w-[95px]" : "bottom-0 right-0 h-[120px] w-[120px] sm:h-[135px] sm:w-[135px] md:h-[175px] md:w-[175px]"} rounded-2xl object-cover opacity-95`}
      />
    </motion.article>
  );
}

