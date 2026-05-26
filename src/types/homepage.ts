import type { CategoryDTO, Product } from "@/lib/api";

export type HomeBanner = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  discountLabel?: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl?: string;
  toneFrom: string;
  toneTo: string;
  endsAt?: string;
  campaignType: "promotion" | "flash" | "seasonal" | "featured";
};

export type HeaderNotification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read?: boolean;
  href?: string;
};

export type CategoryViewModel = CategoryDTO & {
  productCount: number;
  featured: boolean;
  popular: boolean;
};

export type HomeRecommendations = {
  flashSale: Product[];
  trendingProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  recommendedProducts: Product[];
  recentlyViewed: Product[];
};

export type HeaderCounts = {
  cartCount: number;
  wishlistCount: number;
  notificationCount: number;
};

