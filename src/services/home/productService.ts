import type { Product } from "@/lib/api";
import type { HomeRecommendations } from "@/types/homepage";
import { homeApiClient } from "@/services/home/apiClient";

export const productService = {
  async getRecommendations(): Promise<HomeRecommendations> {
    const allProducts = await homeApiClient.getList<Product>("/products").catch(() => []);
    const [flashSale, trendingProducts, bestSellers, newArrivals, recommendedProducts, recentlyViewed] =
      await Promise.all([
        homeApiClient.getList<Product>("/products/popular/trending", { limit: 10 }).catch(() => allProducts.slice(0, 10)),
        homeApiClient.getList<Product>("/products/popular/trending", { limit: 12 }).catch(() => allProducts.slice(0, 12)),
        homeApiClient
          .getList<Product>("/products/popular/most-purchased", { limit: 12 })
          .catch(() => [...allProducts].sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0)).slice(0, 12)),
        homeApiClient
          .getList<Product>("/products/new-arrivals", { limit: 12 })
          .catch(() => [...allProducts].sort((a, b) => Date.parse(b.createdAt || "") - Date.parse(a.createdAt || "")).slice(0, 12)),
        homeApiClient.getList<Product>("/popularity/user/recommendations").catch(() => []),
        homeApiClient.getList<Product>("/popularity/user/recently-viewed").catch(() => []),
      ]);

    const normalizedFlash = flashSale
      .filter((item) => (item.discount || 0) > 0)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));

    return {
      flashSale: normalizedFlash.length > 0 ? normalizedFlash : flashSale,
      trendingProducts,
      bestSellers,
      newArrivals,
      recommendedProducts,
      recentlyViewed,
    };
  },

  async searchProducts(keyword: string, categoryId?: number): Promise<Product[]> {
    if (!keyword.trim()) return [];
    return homeApiClient.getList<Product>("/products/search", {
      keyword,
      categoryId,
    });
  },
};

export default productService;

