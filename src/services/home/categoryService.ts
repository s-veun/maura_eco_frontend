import type { CategoryDTO, Product } from "@/lib/api";
import type { CategoryViewModel } from "@/types/homepage";
import { homeApiClient } from "@/services/home/apiClient";

function normalizeSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const categoryService = {
  async getAllCategories(): Promise<CategoryViewModel[]> {
    const products = await homeApiClient.getList<Product>("/products").catch(() => []);
    const categories = await homeApiClient.getList<CategoryDTO>("/categories").catch(() => []);

    const derivedCategories: CategoryDTO[] =
      categories.length > 0
        ? categories
        : Array.from(new Set(products.map((item) => item.categoryName).filter(Boolean))).map((name, index) => ({
            catId: 1000 + index,
            catName: String(name),
            slug: normalizeSlug(String(name)),
          }));

    const topCategories = [...products]
      .filter((item) => item.categoryName)
      .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
      .slice(0, 4)
      .map((item) => item.categoryName?.toLowerCase());

    return derivedCategories.map((category, index) => {
      const productCount = products.filter(
        (product) =>
          product.categoryId === category.catId ||
          product.categoryName?.toLowerCase() === category.catName.toLowerCase(),
      ).length;

      return {
        ...category,
        slug: category.slug || normalizeSlug(category.catName),
        productCount,
        featured: index < 3,
        popular: topCategories.includes(category.catName.toLowerCase()),
      };
    });
  },
};

export default categoryService;

