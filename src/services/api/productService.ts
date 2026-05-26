import type { Product, CategoryDTO } from "@/lib/api";
import { ecommerceApi } from "@/services/api/ecommerce-api";

export const productService = {
  getAll: (): Promise<Product[]> => ecommerceApi.products.getAll(),
  getFeatured: (): Promise<Product[]> => ecommerceApi.products.featured(),
  getPopular: (): Promise<Product[]> => ecommerceApi.products.trending(),
  getCategories: (): Promise<CategoryDTO[]> => ecommerceApi.products.categories(),
  getDiscounted: (): Promise<Product[]> => ecommerceApi.products.discounted(),
  getRecommendations: (): Promise<Product[]> => ecommerceApi.products.recommendations(),
  getRecentlyViewed: (): Promise<Product[]> => ecommerceApi.products.recentlyViewed(),
};

export default productService;

