import { ENDPOINTS, assertPublicEcommerceEndpoint } from "@/lib/endpoints";
import { homeApiClient } from "@/services/home/apiClient";
import type { CategoryDto } from "@/types/category.types";

function normalizeCategory(category: CategoryDto): CategoryDto {
  return {
    ...category,
    slug:
      category.slug ||
      category.catName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"),
  };
}

export const categoryService = {
  async getAllCategories() {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.categories.list);
    const categories = await homeApiClient.getList<CategoryDto>(path);
    return categories.map(normalizeCategory);
  },

  async getCategoryById(categoryId: number) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.categories.byId(categoryId));
    const category = await homeApiClient.getEntity<CategoryDto>(path);
    return normalizeCategory(category);
  },
};

export default categoryService;

