"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeBanner } from "@/types/homepage";
import bannerService from "@/services/home/bannerService";
import { fallbackHeroSlides } from "@/components/home/hero/fallback-data";
import type { HeroSlide, HeroStat } from "@/components/home/hero/types";

function badgeFromCampaign(type: HomeBanner["campaignType"]): HeroSlide["badge"] {
  if (type === "flash") return "Best Seller";
  if (type === "promotion") return "New Collection";
  return "Premium Furniture";
}

function statsFromIndex(index: number): HeroStat[] {
  const preset = [
    [
      { label: "Curated Designs", value: "120+" },
      { label: "Premium Materials", value: "A+" },
      { label: "Delivery", value: "48h" },
    ],
    [
      { label: "Top Rated", value: "4.9" },
      { label: "Orders", value: "9k" },
      { label: "Support", value: "24/7" },
    ],
    [
      { label: "New Drops", value: "Weekly" },
      { label: "Warranty", value: "2Y" },
      { label: "Returns", value: "Easy" },
    ],
  ] as const;

  return preset[index % preset.length].map((item) => ({ ...item }));
}

function mapBannerToSlide(banner: HomeBanner, index: number): HeroSlide {
  const badge = badgeFromCampaign(banner.campaignType);
  const fallbackImage = fallbackHeroSlides[index % fallbackHeroSlides.length].imageUrl;
  const resolvedImage = banner.imageUrl?.trim() || fallbackImage;

  return {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    description: banner.description,
    ctaLabel: banner.ctaLabel,
    ctaHref: banner.ctaHref,
    imageUrl: resolvedImage,
    badge,
    tags: [badge, "Premium Furniture", banner.discountLabel || "Exclusive"],
    toneFrom: banner.toneFrom,
    toneTo: banner.toneTo,
    stats: statsFromIndex(index),
  };
}

export function useHeroSlides() {
  const query = useQuery({
    queryKey: ["home", "hero", "premium-slides"],
    queryFn: async () => {
      const apiSlides = await bannerService.getHeroBanners();
      if (!apiSlides.length) return fallbackHeroSlides;
      return apiSlides.slice(0, 4).map(mapBannerToSlide);
    },
    staleTime: 1000 * 60,
  });

  return {
    ...query,
    slides: query.data?.length ? query.data : query.isError ? fallbackHeroSlides : [],
    isFallback: query.isError,
  };
}


