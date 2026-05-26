"use client";

import { useQuery } from "@tanstack/react-query";
import type { HomeBanner } from "@/types/homepage";
import bannerService from "@/services/home/bannerService";
import categoryService from "@/services/home/categoryService";
import productService from "@/services/home/productService";
import cartService from "@/services/home/cartService";
import userService from "@/services/home/userService";

export function useHomepageData(userId?: number) {
  const banners = useQuery({
    queryKey: ["home", "banners"],
    queryFn: async () => {
      const [hero, promotions, flash] = await Promise.allSettled([
        bannerService.getHeroBanners(),
        bannerService.getPromotions(),
        bannerService.getFlashCampaigns(),
      ]);
      const merged: HomeBanner[] = [];
      if (hero.status === "fulfilled") merged.push(...hero.value);
      if (promotions.status === "fulfilled") merged.push(...promotions.value);
      if (flash.status === "fulfilled") merged.push(...flash.value);
      return merged;
    },
    // NOTE: Do NOT use initialData here — TanStack Query v5 sets dataUpdatedAt=Date.now()
    // when initialData is provided without initialDataUpdatedAt, causing the query to
    // appear "fresh" for the full staleTime (60s) and never refetch.
    staleTime: 0,
  });

  const categories = useQuery({
    queryKey: ["home", "categories"],
    queryFn: categoryService.getAllCategories,
    staleTime: 0,
  });

  const products = useQuery({
    queryKey: ["home", "products"],
    queryFn: productService.getRecommendations,
    staleTime: 0,
  });

  const notifications = useQuery({
    queryKey: ["home", "notifications"],
    queryFn: userService.getNotifications,
  });

  const wishlistCount = useQuery({
    queryKey: ["home", "wishlist-count"],
    queryFn: cartService.getWishlistCount,
  });

  const cartCount = useQuery({
    queryKey: ["home", "cart-count", userId],
    queryFn: () => cartService.getCartCount(userId),
    enabled: Boolean(userId),
  });

  return {
    banners,
    categories,
    products,
    notifications,
    wishlistCount,
    cartCount,
  };
}

export default useHomepageData;

