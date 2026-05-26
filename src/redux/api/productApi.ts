import { baseApi } from "./baseApi";
import {
  Product,
  CategoryDTO,
  ReviewResponseDto,
  AddReviewDto,
  CartResponseDto,
  OrderResponseDto,
  SearchProductsParams,
} from "@/lib/api";



type GenericApiResponse = Record<string, unknown>;

function pickProductArray(res: unknown): Product[] {
  if (Array.isArray(res)) return res as Product[];
  if (res && typeof res === "object") {
    const obj = res as { products?: unknown; content?: unknown; data?: unknown };
    if (Array.isArray(obj.products)) return obj.products as Product[];
    if (Array.isArray(obj.content)) return obj.content as Product[];
    if (Array.isArray(obj.data)) return obj.data as Product[];
  }
  return [];
}

function pickStringArray(res: unknown): string[] {
  if (Array.isArray(res)) return res as string[];
  if (res && typeof res === "object") {
    const obj = res as { suggestions?: unknown; content?: unknown };
    if (Array.isArray(obj.suggestions)) return obj.suggestions as string[];
    if (Array.isArray(obj.content)) return obj.content as string[];
  }
  return [];
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // -- Products ------------------------------------------------------------
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),

    getProductById: builder.query<Product, string | number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    // -- New Arrivals ---------------------------------------------------------
    getNewArrivals: builder.query<Product[], number | void>({
      query: (limit = 10) => `/products/new-arrivals${limit ? `?limit=${limit}` : ""}`,
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    // -- Popularity / Trending -----------------------------------------------
    getTrendingProducts: builder.query<Product[], number | void>({
      query: (limit = 10) => `/products/popular/trending?limit=${limit}`,
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    getTopRatedProducts: builder.query<Product[], number | void>({
      query: (limit = 10) => `/products/popular/top-rated?limit=${limit}`,
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    getFeaturedProducts: builder.query<Product[], number | void>({
      query: (limit = 8) => `/products/popular/top-rated?limit=${limit}`,
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    getMostViewedProducts: builder.query<Product[], number | void>({
      query: (limit = 10) => `/products/popular/most-viewed?limit=${limit}`,
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),

    getMostPurchasedProducts: builder.query<Product[], number | void>({
      query: (limit = 10) => `/products/popular/most-purchased?limit=${limit}`,
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    // Track a product view (fires and forgets)
    trackProductView: builder.mutation<GenericApiResponse, number>({
      query: (productId) => ({
        url: `/popularity/view/${productId}`,
        method: "POST",
      }),
    }),
    // User recommendations & recently viewed
    getUserRecommendations: builder.query<Product[], void>({
      query: () => "/popularity/user/recommendations",
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    getProductRecommendations: builder.query<Product[], void>({
      query: () => "/popularity/user/recommendations",
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    getRecentlyViewedProducts: builder.query<Product[], void>({
      query: () => "/popularity/recently-viewed",
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    // -- Categories ----------------------------------------------------------
    getCategories: builder.query<CategoryDTO[], void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),

    // -- Search --------------------------------------------------------------
    searchProducts: builder.query<Product[], string>({
      query: (keyword) =>
        `/products/search?keyword=${encodeURIComponent(keyword)}`,
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    advancedSearchProducts: builder.query<Product[], SearchProductsParams>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params.keyword) qp.set("keyword", params.keyword);
        if (params.categoryId) qp.set("categoryId", String(params.categoryId));
        if (params.brand) qp.set("brand", params.brand);
        if (params.minPrice != null) qp.set("minPrice", String(params.minPrice));
        if (params.maxPrice != null) qp.set("maxPrice", String(params.maxPrice));
        if (params.minRating != null) qp.set("minRating", String(params.minRating));
        if (params.sortBy) qp.set("sortBy", params.sortBy);
        if (params.sortDirection) qp.set("sortDirection", params.sortDirection);
        if (params.page != null) qp.set("page", String(params.page));
        if (params.size != null) qp.set("size", String(params.size));
        return `/search/products?${qp.toString()}`;
      },
      transformResponse: (res: unknown) => pickProductArray(res),
      providesTags: ["Product"],
    }),
    getSearchSuggestions: builder.query<string[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) =>
        `/search/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`,
      transformResponse: (res: unknown) => pickStringArray(res),
    }),

    // -- Wishlist ------------------------------------------------------------
    getWishlist: builder.query<GenericApiResponse, void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),

    checkWishlist: builder.query<{ inWishlist: boolean }, number>({
      query: (productId) => `/wishlist/check/${productId}`,
      providesTags: (result, error, id) => [{ type: "Wishlist", id }],
    }),

    addToWishlist: builder.mutation<GenericApiResponse, number>({
      query: (productId) => ({
        url: `/wishlist/add/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation<GenericApiResponse, number>({
      query: (productId) => ({
        url: `/wishlist/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    clearWishlist: builder.mutation<GenericApiResponse, void>({
      query: () => ({
        url: "/wishlist/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // -- Cart ----------------------------------------------------------------
    getCart: builder.query<CartResponseDto, number>({
      query: (userId) => `/cart/${userId}`,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      CartResponseDto,
      { userId: number; productId: number; quantity?: number }
    >({
      query: ({ userId, productId, quantity = 1 }) => ({
        url: `/cart/${userId}/add?productId=${productId}&quantity=${quantity}`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartQuantity: builder.mutation<
      CartResponseDto,
      { userId: number; productId: number; quantity: number }
    >({
      query: ({ userId, productId, quantity }) => ({
        url: `/cart/${userId}/update?productId=${productId}&quantity=${quantity}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<
      CartResponseDto,
      { userId: number; productId: number }
    >({
      query: ({ userId, productId }) => ({
        url: `/cart/${userId}/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<string, number>({
      query: (userId) => ({
        url: `/cart/${userId}/clear`,
        method: "DELETE",
        responseHandler: "text",
      }),
      invalidatesTags: ["Cart"],
    }),
    // -- Orders --------------------------------------------------------------
    getOrderHistory: builder.query<OrderResponseDto[], number>({
      query: (userId) => `/orders/${userId}/history`,
      providesTags: ["Orders"],
    }),

    checkout: builder.mutation<
      GenericApiResponse,
      { userId: number; couponCode?: string }
    >({
      query: (body) => ({
        url: "/orders/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),
    // -- Coupons (user-facing) ------------------------------------------------
    validateCoupon: builder.query<{ valid: boolean; discount?: number; message?: string }, string>({
      query: (code) => `/coupons/validate?code=${encodeURIComponent(code)}`,
    }),

    // -- Reviews -------------------------------------------------------------
    /** GET /api/v1/reviews/product/{productId} */
    getProductReviews: builder.query<ReviewResponseDto[], number>({
      query: (productId) => `/reviews/product/${productId}`,
      transformResponse: (res: unknown) => {
        if (Array.isArray(res)) return res as ReviewResponseDto[];
        if (res && typeof res === "object") {
          const obj = res as { reviews?: unknown; content?: unknown };
          if (Array.isArray(obj.reviews)) return obj.reviews as ReviewResponseDto[];
          if (Array.isArray(obj.content)) return obj.content as ReviewResponseDto[];
        }
        return [];
      },
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    /** POST /api/v1/reviews/add */
    addReview: builder.mutation<ReviewResponseDto, AddReviewDto>({
      query: (body) => ({
        url: "/reviews/add",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Product", id: arg.productId },
        "Product",
      ],
    }),

    /** POST /api/v1/reviews/{reviewId}/vote?helpful= */
    voteReview: builder.mutation<
      GenericApiResponse,
      { reviewId: number; helpful: boolean; userId?: number }
    >({
      query: ({ reviewId, helpful }) => ({
        url: `/reviews/${reviewId}/vote?helpful=${helpful}`,
        method: "POST",
      }),
    }),

    /** GET /api/v1/reviews/{reviewId}/votes */
    getReviewVotes: builder.query<GenericApiResponse, number>({
      query: (reviewId) => `/reviews/${reviewId}/votes`,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetNewArrivalsQuery,
  useGetTrendingProductsQuery,
  useGetTopRatedProductsQuery,
  useGetFeaturedProductsQuery,
  useGetMostViewedProductsQuery,
  useGetMostPurchasedProductsQuery,
  useTrackProductViewMutation,
  useGetUserRecommendationsQuery,
  useGetProductRecommendationsQuery,
  useGetRecentlyViewedProductsQuery,
  useGetCategoriesQuery,
  useSearchProductsQuery,
  useAdvancedSearchProductsQuery,
  useGetSearchSuggestionsQuery,
  useGetWishlistQuery,
  useCheckWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useGetOrderHistoryQuery,
  useCheckoutMutation,
  useValidateCouponQuery,
  useGetProductReviewsQuery,
  useAddReviewMutation,
  useVoteReviewMutation,
  useGetReviewVotesQuery,
} = productApi;
