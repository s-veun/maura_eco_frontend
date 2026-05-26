import { api } from "@/services/api/axios-client";
import type {
  AddReviewDto,
  CartResponseDto,
  CategoryDTO,
  OrderRequestDto,
  OrderResponseDto,
  Product,
  ReviewResponseDto,
  UserProfileResponse,
} from "@/lib/api";
import type {
  ApiEntityResponse,
  ApiListResponse,
  AuthCredentials,
  ForgotPasswordPayload,
  ProductFilterQuery,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/ecommerce";

function unwrapList<T>(payload: ApiListResponse<T> | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.data || payload.content || payload.products || payload.items || [];
}

function unwrapEntity<T>(payload: ApiEntityResponse<T>): T {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const obj = payload as Record<string, unknown>;
    return (obj.data || obj.item || obj.product || obj.user || payload) as T;
  }
  return payload as T;
}

function toQueryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    query.set(key, String(value));
  });
  const raw = query.toString();
  return raw ? `?${raw}` : "";
}

export const ecommerceApi = {
  auth: {
    register: async (body: RegisterPayload) => (await api.post("/register", body)).data,
    login: async (body: AuthCredentials) => (await api.post("/login", body)).data,
    logout: async () => (await api.post("/auth/logout")).data,
    refreshToken: async () => (await api.post("/auth/refresh-token")).data,
    forgotPassword: async (body: ForgotPasswordPayload) => (await api.post("/auth/forgot-password", body)).data,
    resetPassword: async (body: ResetPasswordPayload) => (await api.post("/auth/reset-password", body)).data,
    profile: async () => unwrapEntity<UserProfileResponse>((await api.get("/user/profile")).data),
  },

  products: {
    getAll: async () => unwrapList<Product>((await api.get("/products")).data),
    getById: async (id: number | string) => unwrapEntity<Product>((await api.get(`/products/${id}`)).data),
    search: async (keyword: string) =>
      unwrapList<Product>((await api.get(`/products/search${toQueryString({ keyword })}`)).data),
    filter: async (query: ProductFilterQuery) =>
      unwrapList<Product>(
        (
          await api.get(
            `/search/products${toQueryString({
              keyword: query.keyword,
              categoryId: query.categoryId,
              minPrice: query.minPrice,
              maxPrice: query.maxPrice,
              minRating: query.minRating,
              brand: query.brand,
              page: query.page,
              size: query.size,
              sortBy: query.sortBy,
              sortDirection: query.sortDirection,
            })}`,
          )
        ).data,
      ),
    categories: async () => unwrapList<CategoryDTO>((await api.get("/categories")).data),
    recommendations: async () => unwrapList<Product>((await api.get("/popularity/user/recommendations")).data),
    recentlyViewed: async () => unwrapList<Product>((await api.get("/popularity/user/recently-viewed")).data),
    featured: async () => unwrapList<Product>((await api.get("/products/popular/top-rated?limit=8")).data),
    trending: async () => unwrapList<Product>((await api.get("/products/popular/trending?limit=8")).data),
    newArrivals: async () => unwrapList<Product>((await api.get("/products/new-arrivals?limit=8")).data),
    bestSellers: async () => unwrapList<Product>((await api.get("/products/popular/most-purchased?limit=8")).data),
    discounted: async () => {
      const products = unwrapList<Product>((await api.get("/products")).data);
      return products.filter((item) => (item.discount || 0) > 0);
    },
    flashDeals: async () => {
      const products = unwrapList<Product>((await api.get("/products")).data);
      return products
        .filter((item) => (item.discount || 0) > 0)
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, 12);
    },
    promotions: async () => {
      const products = unwrapList<Product>((await api.get("/products")).data);
      return products
        .filter((item) => (item.discount || 0) > 0)
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, 6);
    },
  },

  cart: {
    get: async (userId: number) => (await api.get(`/cart/${userId}`)).data as CartResponseDto,
    add: async (payload: { userId: number; productId: number; quantity?: number }) =>
      (
        await api.post(`/cart/${payload.userId}/add`, undefined, {
          params: { productId: payload.productId, quantity: payload.quantity ?? 1 },
        })
      ).data as CartResponseDto,
    updateQuantity: async (payload: { userId: number; productId: number; quantity: number }) =>
      (
        await api.put(`/cart/${payload.userId}/update`, undefined, {
          params: { productId: payload.productId, quantity: payload.quantity },
        })
      ).data as CartResponseDto,
    remove: async (payload: { userId: number; productId: number }) =>
      (await api.delete(`/cart/${payload.userId}/remove/${payload.productId}`)).data as CartResponseDto,
    clear: async (userId: number) => (await api.delete(`/cart/${userId}/clear`)).data,
  },

  orders: {
    create: async (body: OrderRequestDto) => (await api.post("/orders/checkout", body)).data,
    history: async (userId: number) => (await api.get(`/orders/${userId}/history`)).data as OrderResponseDto[],
    details: async (orderId: number) => (await api.get(`/orders/${orderId}/tracking`)).data,
    checkout: async (body: OrderRequestDto) => (await api.post("/orders/checkout", body)).data,
  },

  wishlist: {
    getAll: async () => (await api.get("/wishlist")).data,
    check: async (productId: number) => (await api.get(`/wishlist/check/${productId}`)).data,
    add: async (productId: number) => (await api.post(`/wishlist/add/${productId}`)).data,
    remove: async (productId: number) => (await api.delete(`/wishlist/remove/${productId}`)).data,
    clear: async () => (await api.delete("/wishlist/clear")).data,
  },

  reviews: {
    add: async (body: AddReviewDto) => (await api.post("/reviews/add", body)).data as ReviewResponseDto,
    ratings: async (productId: number) => (await api.get(`/reviews/product/${productId}`)).data,
    byProduct: async (productId: number) =>
      unwrapList<ReviewResponseDto>((await api.get(`/reviews/product/${productId}`)).data),
  },
};

