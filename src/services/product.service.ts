import { ENDPOINTS, assertPublicEcommerceEndpoint } from "@/lib/endpoints";
import { homeApiClient } from "@/services/home/apiClient";
import type {
  NewArrivalsResponse,
  PopularProductsResponse,
  ProductDto,
  ProductListResponse,
  ProductSearchQuery,
} from "@/types/product.types";

function normalizeProductImage(product: ProductDto): ProductDto {
  return {
    ...product,
    imageUrl:
      product.imageUrl ||
      product.thumbnailImage ||
      product.thumbnailImageUrl ||
      product.imageUrls?.[0],
  };
}

function mapProducts(list: ProductDto[]) {
  return list.map(normalizeProductImage);
}

function readPopularProducts(payload: unknown): ProductDto[] {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as PopularProductsResponse;
  return Array.isArray(record.products) ? mapProducts(record.products) : [];
}

function readNewArrivals(payload: unknown): ProductDto[] {
  if (Array.isArray(payload)) return mapProducts(payload as ProductDto[]);
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Partial<NewArrivalsResponse> & { products?: ProductDto[] };
  if (Array.isArray(record.data)) return mapProducts(record.data);
  if (Array.isArray(record.products)) return mapProducts(record.products);
  return [];
}

function readSearchPayload(payload: unknown): ProductListResponse {
  if (!payload || typeof payload !== "object") {
    return { products: [], currentPage: 0, totalItems: 0, totalPages: 0, pageSize: 0 };
  }

  const record = payload as Partial<ProductListResponse>;
  return {
    products: mapProducts(Array.isArray(record.products) ? record.products : []),
    currentPage: record.currentPage ?? 0,
    totalItems: record.totalItems ?? 0,
    totalPages: record.totalPages ?? 0,
    pageSize: record.pageSize ?? 0,
  };
}

export const productService = {
  async getProducts(params?: Record<string, unknown>) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.list);
    const products = await homeApiClient.getList<ProductDto>(path, params);
    return mapProducts(products);
  },

  async getProductById(productId: number) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.byId(productId));
    const product = await homeApiClient.getEntity<ProductDto>(path);
    return normalizeProductImage(product);
  },

  async searchProducts(query: ProductSearchQuery) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.search);
    const payload = await homeApiClient.get<unknown>(path, query as Record<string, unknown>);
    return readSearchPayload(payload);
  },

  async getSearchSuggestions(query: string, limit = 10) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.suggestions);
    const payload = await homeApiClient.get<{ suggestions?: string[] }>(path, { query, limit });
    return Array.isArray(payload.suggestions) ? payload.suggestions : [];
  },

  async getTrending(limit = 10) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.trending);
    const payload = await homeApiClient.get<unknown>(path, { limit });
    return readPopularProducts(payload);
  },

  async getMostViewed(limit = 10) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.mostViewed);
    const payload = await homeApiClient.get<unknown>(path, { limit });
    return readPopularProducts(payload);
  },

  async getMostPurchased(limit = 10) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.mostPurchased);
    const payload = await homeApiClient.get<unknown>(path, { limit });
    return readPopularProducts(payload);
  },

  async getTopRated(limit = 10) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.topRated);
    const payload = await homeApiClient.get<unknown>(path, { limit });
    return readPopularProducts(payload);
  },

  async getNewArrivals(days = 30) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.newArrivals);
    const payload = await homeApiClient.get<unknown>(path, { days });
    return readNewArrivals(payload);
  },

  async getNewArrivalsPaginated(page = 1, limit = 10) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.products.newArrivalsPaginated);
    const payload = await homeApiClient.get<unknown>(path, { page, limit });
    return readNewArrivals(payload);
  },

  async getRecommendations(limit = 10) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.popularity.recommendations);
    const payload = await homeApiClient.get<unknown>(path, { limit });
    return readPopularProducts(payload);
  },
};

export default productService;

