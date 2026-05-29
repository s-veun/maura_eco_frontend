export type HeroStat = {
  label: string;
  value: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  badge: "New Collection" | "Best Seller" | "Premium Furniture" | string;
  tags: string[];
  toneFrom: string;
  toneTo: string;
  stats: HeroStat[];
};

