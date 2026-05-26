"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { HomeBanner } from "@/types/homepage";

type HeroBannerProps = {
  banners: HomeBanner[];
  loading: boolean;
};

function getCountdown(endsAt?: string) {
  if (!endsAt) return "";
  const distance = new Date(endsAt).getTime() - Date.now();
  if (distance <= 0) return "Ended";
  const hours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  return `${hours}h ${minutes}m`;
}

export function HeroBanner({ banners, loading }: HeroBannerProps) {
  const items = useMemo(() => banners.slice(0, 6), [banners]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % items.length), 4800);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items.length]);

  if (loading) {
    return <div className="animate-pulse rounded-3xl bg-muted" style={{ minHeight: 360 }} />;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 360 }}>
      {items.map((banner, idx) => (
        <div
          key={banner.id}
          className={`transition-all duration-700 ${idx === current ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              minHeight: 360,
              background: `linear-gradient(135deg, ${banner.toneFrom}, ${banner.toneTo})`,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-5 p-8">
              <div className="flex flex-col gap-4 max-w-xl flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-purple-700 text-white text-xs font-bold uppercase px-3 py-0.5 rounded-full">
                    {banner.campaignType}
                  </span>
                  {banner.discountLabel && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                      {banner.discountLabel}
                    </span>
                  )}
                  {banner.endsAt && (
                    <span className="text-white text-xs font-semibold">
                      Deal ends in: {getCountdown(banner.endsAt)}
                    </span>
                  )}
                </div>
                <h1 className="text-white font-bold text-3xl m-0">{banner.title}</h1>
                <h4 className="text-white/88 font-semibold text-lg m-0">{banner.subtitle}</h4>
                <p className="text-white/84 m-0">{banner.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" style={{ borderRadius: 12, background: "#fff", color: banner.toneFrom }}>
                    <Link href={banner.ctaHref}>{banner.ctaLabel}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" style={{ borderRadius: 12, color: "#fff", borderColor: "rgba(255,255,255,0.6)", background: "transparent" }}>
                    <Link href="/products">Explore catalog</Link>
                  </Button>
                </div>
              </div>

              {banner.imageUrl && (
                <div className="min-w-[240px] max-w-[360px] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={banner.imageUrl} alt={banner.title} className="rounded-[18px] object-cover w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${idx === current ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroBanner;
