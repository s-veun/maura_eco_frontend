import type { Product } from "@/lib/api";
import categoryService from "@/services/home/categoryService";
import productService from "@/services/product.service";
import type { LandingCategory } from "@/types/landing";

function getSafeRating(value?: number) {
  if (!value || Number.isNaN(value)) return 4.5;
  return Math.min(5, Math.max(1, value));
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    rating: getSafeRating(product.rating),
    discount: product.discount || 0,
    imageUrl:
      product.imageUrl ||
      product.thumbnailImage ||
      product.thumbnailImageUrl ||
      (product.imageUrls && product.imageUrls[0]) ||
      undefined,
  };
}

export const landingService = {
  async getFeaturedProducts(): Promise<Product[]> {
    const products = await productService.getProducts({ size: 8 }).catch(() => []);
    return products.slice(0, 8).map(normalizeProduct);
  },

  async getPopularProducts(): Promise<Product[]> {
    const fallback = await productService.getProducts({ size: 12 }).catch(() => []);
    const popular = await productService.getTrending(12).catch(() => fallback);

    return popular.slice(0, 12).map(normalizeProduct);
  },

  async getCategories(): Promise<LandingCategory[]> {
    const categories = await categoryService.getAllCategories();
    return categories.map((category) => ({
      ...category,
      description: category.catDesc || "Premium picks tailored to your workspace and home style.",
    }));
  },


  async getNewArrivals(): Promise<Product[]> {
    const products = await productService
      .getNewArrivals(30)
      .catch(() => productService.getProducts({ size: 8 }).catch(() => []));
    return products
      .slice(0, 8)
      .sort((a, b) => Date.parse(b.createdAt || "") - Date.parse(a.createdAt || ""))
      .map(normalizeProduct);
  },

  async getTopRated(): Promise<Product[]> {
    const products = await productService
      .getTopRated(8)
      .catch(() => productService.getProducts({ size: 8 }).catch(() => []));
    return products
      .slice(0, 8)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .map(normalizeProduct);
  },

  async getMostViewed(): Promise<Product[]> {
    const products = await productService
      .getMostViewed(6)
      .catch(() => productService.getProducts({ size: 6 }).catch(() => []));
    return products
      .slice(0, 6)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .map(normalizeProduct);
  },

  async getMostPurchased(): Promise<Product[]> {
    const products = await productService
      .getMostPurchased(10)
      .catch(() => productService.getProducts({ size: 10 }).catch(() => []));
    return products
      .slice(0, 10)
      .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
      .map(normalizeProduct);
  },

  async getRecommendedProducts(): Promise<Product[]> {
    const products = await productService.getRecommendations(10).catch(() => []);
    return products.slice(0, 10).map(normalizeProduct);
  },
};

export default landingService;
