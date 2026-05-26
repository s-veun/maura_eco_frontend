"use client";

import { useQuery } from "@tanstack/react-query";
import landingService from "@/services/home/landingService";

export function useLandingPageData() {
  const featuredProducts = useQuery({
    queryKey: ["landing", "featured-products"],
    queryFn: landingService.getFeaturedProducts,
  });

  const popularProducts = useQuery({
    queryKey: ["landing", "popular-products"],
    queryFn: landingService.getPopularProducts,
  });

  const newArrivals = useQuery({
    queryKey: ["landing", "new-arrivals"],
    queryFn: landingService.getNewArrivals,
  });

  const topRated = useQuery({
    queryKey: ["landing", "top-rated"],
    queryFn: landingService.getTopRated,
  });

  const mostViewed = useQuery({
    queryKey: ["landing", "most-viewed"],
    queryFn: landingService.getMostViewed,
  });

  const mostPurchased = useQuery({
    queryKey: ["landing", "most-purchased"],
    queryFn: landingService.getMostPurchased,
  });

  const categories = useQuery({
    queryKey: ["landing", "categories"],
    queryFn: landingService.getCategories,
  });

  return {
    featuredProducts,
    popularProducts,
    newArrivals,
    topRated,
    mostViewed,
    mostPurchased,
    categories,
  };
}

export default useLandingPageData;
