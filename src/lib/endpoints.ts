export const PUBLIC_API_PREFIX = "/api/v1";

export const ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh-token",
    logout: "/auth/logout",
    googleOAuthInfo: "/auth/oauth2/google",
    facebookOAuthInfo: "/auth/oauth2/facebook",
  },
  products: {
    list: "/products",
    byId: (productId: number | string) => `/products/${productId}`,
    search: "/search/products",
    suggestions: "/search/suggestions",
    filters: "/search/filters",
    byTags: "/search/by-tags",
    newArrivals: "/products/new-arrivals",
    newArrivalsPaginated: "/products/new-arrivals/paginated",
    trending: "/products/popular/trending",
    mostViewed: "/products/popular/most-viewed",
    mostPurchased: "/products/popular/most-purchased",
    topRated: "/products/popular/top-rated",
  },
  categories: {
    list: "/categories",
    byId: (categoryId: number | string) => `/categories/${categoryId}`,
  },
  banners: {
    active: "/banners",
    byId: (bannerId: number | string) => `/banners/${bannerId}`,
  },
  popularity: {
    trackView: (productId: number | string) => `/popularity/view/${productId}`,
    mostViewed: "/popularity/most-viewed",
    mostPurchased: "/popularity/most-purchased",
    topRated: "/popularity/top-rated",
    trending: "/popularity/trending",
    recommendations: "/popularity/user/recommendations",
    recentlyViewed: "/popularity/user/recently-viewed",
  },
  wishlist: {
    list: "/wishlist",
    add: (productId: number | string) => `/wishlist/add/${productId}`,
    remove: (productId: number | string) => `/wishlist/remove/${productId}`,
    check: (productId: number | string) => `/wishlist/check/${productId}`,
    clear: "/wishlist/clear",
  },
  cart: {
    get: (userId: number | string) => `/cart/${userId}`,
    add: (userId: number | string) => `/cart/${userId}/add`,
    update: (userId: number | string) => `/cart/${userId}/update`,
    remove: (userId: number | string, productId: number | string) => `/cart/${userId}/remove/${productId}`,
    clear: (userId: number | string) => `/cart/${userId}/clear`,
  },
  orders: {
    checkout: "/orders/checkout",
    history: (userId: number | string) => `/orders/${userId}/history`,
    cancel: (orderId: number | string) => `/orders/${orderId}/cancel`,
    tracking: (orderId: number | string) => `/orders/${orderId}/tracking`,
    statusHistory: (orderId: number | string) => `/orders/${orderId}/status-history`,
    latestStatus: (orderId: number | string) => `/orders/${orderId}/latest-status`,
    statuses: "/orders/statuses",
  },
  reviews: {
    add: "/reviews/add",
    byProduct: (productId: number | string) => `/reviews/product/${productId}`,
    remove: (reviewId: number | string) => `/reviews/${reviewId}`,
    vote: (reviewId: number | string) => `/reviews/${reviewId}/vote`,
    votes: (reviewId: number | string) => `/reviews/${reviewId}/votes`,
  },
  users: {
    profile: "/users/profile",
    changePassword: "/users/profile/change-password",
    profileImage: "/users/profile/image",
    addresses: "/users/profile/addresses",
    addressById: (addressId: number | string) => `/users/profile/addresses/${addressId}`,
    settings: "/users/profile/settings",
  },
  coupons: {
    validate: "/coupons/validate",
  },
} as const;

const BLOCKED_PATTERNS = [
  /^\/admin(\/|$)/,
  /^\/api\/v1\/admin(\/|$)/,
  /^\/dashboard(\/|$)/,
  /^\/api\/v1\/dashboard(\/|$)/,
  /^\/manage(\/|$)/,
  /^\/api\/v1\/manage(\/|$)/,
  /^\/orders\/by-status(\/|$)/,
  /^\/orders\/count-by-status(\/|$)/,
  /^\/orders\/\d+\/status(\/|$)/,
  /^\/banners\/admin(\/|$)/,
  /^\/banners\/positions(\/|$)/,
  /^\/system\//,
];

export function normalizeEndpoint(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function assertPublicEcommerceEndpoint(path: string) {
  const normalized = normalizeEndpoint(path);
  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(normalized))) {
    throw new Error(`Blocked admin/internal endpoint: ${normalized}`);
  }
  return normalized;
}

