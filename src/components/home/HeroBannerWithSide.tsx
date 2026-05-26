"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeBanner } from "@/types/homepage";

type HeroBannerProps = {
  banners: HomeBanner[];
  loading: boolean;
};

function CountdownPill({ endsAt }: { endsAt: string }) {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const update = () => {
      const d = new Date(endsAt).getTime() - Date.now();
      if (d <= 0) { setTime("Ended"); return; }
      const h = String(Math.floor(d / 3600000)).padStart(2, "0");
      const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((d % 60000) / 1000)).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return (
    <div className="inline-flex items-center gap-1.5 bg-white/18 backdrop-blur-[10px] rounded-full px-3.5 py-1 border border-white/32">
      <Zap className="h-3.5 w-3.5 text-amber-400" />
      <span className="text-white font-bold text-[13px] font-mono tracking-wide">{time}</span>
    </div>
  );
}

const FALLBACK_BANNERS: HomeBanner[] = [
  { id: "hero-1", title: "Premium Furniture Collection", subtitle: "Quality crafted for modern living", description: "Discover handpicked furniture pieces with exceptional quality and competitive wholesale pricing for every home.", discountLabel: "Up to 40% OFF", ctaLabel: "Shop Collection", ctaHref: "/products?category=furniture", toneFrom: "#7356c2", toneTo: "#3b1f8c", campaignType: "featured" },
  { id: "hero-2", title: "Flash Sale – Today Only", subtitle: "Top deals across all categories", description: "Limited-time pricing on electronics, home goods, and fashion. Don\'t miss out on exclusive savings.", discountLabel: "60% OFF", ctaLabel: "View Flash Deals", ctaHref: "/products?deal=flash", toneFrom: "#c0392b", toneTo: "#7b241c", campaignType: "flash", endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() },
  { id: "hero-3", title: "New Arrivals This Week", subtitle: "Fresh products just landed", description: "Be the first to browse the latest additions to our marketplace. New styles, new savings, daily updates.", discountLabel: "Newest Styles", ctaLabel: "Explore New Arrivals", ctaHref: "/products?sort=newest", toneFrom: "#0564c8", toneTo: "#023e8a", campaignType: "seasonal" },
];

const SIDE_BANNERS = [
  { id: "side-1", title: "Electronics Sale", subtitle: "Up to 45% OFF", href: "/products?category=electronics", gradient: "linear-gradient(135deg, #0569c8 0%, #2196f3 100%)", emoji: "💻", badge: "Hot Deal" },
  { id: "side-2", title: "Fresh Grocery", subtitle: "Free delivery today", href: "/products?category=grocery", gradient: "linear-gradient(135deg, #00945e 0%, #00c17e 100%)", emoji: "🥦", badge: "Free Ship" },
  { id: "side-3", title: "Fashion Week", subtitle: "Exclusive new styles", href: "/products?category=fashion", gradient: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)", emoji: "👗", badge: "New In" },
];

export function HeroBannerWithSide({ banners, loading }: HeroBannerProps) {
  const mainBanners = useMemo(() => (banners.length > 0 ? banners.slice(0, 5) : FALLBACK_BANNERS), [banners]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (mainBanners.length <= 1) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % mainBanners.length), 5000);
    return () => clearInterval(id);
  }, [mainBanners.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
        <div className="h-[420px] rounded-[20px] bg-muted animate-pulse" />
        <div className="flex flex-col gap-2.5 lg:w-[260px]">
          {[0, 1, 2].map((i) => <div key={i} className="h-[130px] rounded-[14px] bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-3 items-stretch">
      {/* Main carousel */}
      <div className="relative rounded-[20px] overflow-hidden" style={{ minHeight: 420 }}>
        {mainBanners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`transition-opacity duration-700 ${idx === current ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"}`}
          >
            <div
              className="relative min-h-[420px] flex items-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${banner.toneFrom} 0%, ${banner.toneTo ?? "#1a0533"} 100%)`, padding: "44px 44px 38px" }}
            >
              {/* Decorative blobs */}
              <div className="absolute -right-[90px] -top-[90px] w-[340px] h-[340px] rounded-full bg-white/7 pointer-events-none" />
              <div className="absolute right-[80px] -bottom-[110px] w-[260px] h-[260px] rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -left-[50px] -bottom-[70px] w-[220px] h-[220px] rounded-full bg-white/4 pointer-events-none" />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-7 w-full">
                <div className="flex flex-col gap-3.5 max-w-[540px] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex px-3 py-0.5 rounded-full text-xs font-bold text-white bg-white/18 border border-white/42 uppercase tracking-wide">
                      {banner.campaignType}
                    </span>
                    {banner.discountLabel && (
                      <span className="inline-flex px-3 py-0.5 rounded-full text-xs font-bold text-white bg-amber-400/20 border border-amber-300/40">
                        {banner.discountLabel}
                      </span>
                    )}
                    {banner.endsAt && <CountdownPill endsAt={banner.endsAt} />}
                  </div>

                  <h1 className="text-white text-3xl font-extrabold leading-tight m-0">{banner.title}</h1>
                  <h4 className="text-white/88 text-lg font-semibold m-0">{banner.subtitle}</h4>
                  <p className="text-white/80 m-0">{banner.description}</p>

                  <div className="flex flex-wrap gap-3 mt-1">
                    <Button asChild size="lg" className="rounded-xl bg-white hover:bg-white/90" style={{ color: banner.toneFrom }}>
                      <Link href={banner.ctaHref}>{banner.ctaLabel}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-xl border-white/60 text-white bg-transparent hover:bg-white/10">
                      <Link href="/products">
                        Explore catalog
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                {banner.imageUrl && (
                  <div className="min-w-[200px] max-w-[320px] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={banner.imageUrl} alt={banner.title} className="rounded-[18px] object-cover w-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Dots */}
        {mainBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {mainBanners.map((_, idx) => (
              <button key={idx} onClick={() => setCurrent(idx)} className={`h-2 rounded-full transition-all ${idx === current ? "w-6 bg-white" : "w-2 bg-white/50"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Side banners */}
      <div className="flex flex-row lg:flex-col gap-2.5">
        {SIDE_BANNERS.map((sb) => (
          <Link key={sb.id} href={sb.href} className="flex-1 lg:flex-none">
            <div
              className="relative rounded-[14px] p-4 text-white overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5 cursor-pointer"
              style={{ background: sb.gradient, minHeight: 128 }}
            >
              <div className="absolute -right-4 -top-4 w-[90px] h-[90px] rounded-full bg-white/10 pointer-events-none" />
              <span className="absolute right-4 bottom-3 text-[52px] opacity-20 pointer-events-none select-none">{sb.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2 py-0.5 w-fit mb-1.5">{sb.badge}</span>
              <h4 className="text-white font-bold text-[15.5px] leading-tight m-0">{sb.title}</h4>
              <span className="text-white/84 text-xs font-medium">{sb.subtitle}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HeroBannerWithSide;
