const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";

// ─── Swagger-aligned types ────────────────────────────────────────────────────

export interface Product {
  proId: number;
  proName: string;
  sku?: string;
  proDesc?: string;
  proPrice: number;
  proBrand?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  viewCount?: number;
  purchaseCount?: number;
  popularityScore?: number;
  categoryId?: number;
  categoryName?: string;
  thumbnailImage?: string;
  thumbnailImageUrl ?: string;
  imageUrl?: string;         
  imageUrls?: string[];      
  imageName?: string;       
  releaseDate?: string;
  available?: boolean;
  rating?: number;
  discount?: number;
  stock?: number;
  tags?: string;
  favourite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDTO {
  catId: number;
  catName: string;
  catDesc?: string;
  imageUrl?: string;
  slug?: string;  
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressDto {
  addressId?: number;
  fullName: string;
  phoneNumber?: string;
  city: string;
  district: string;
  detailsAddress: string;
  userId?: number;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email?: string;
  role: "USER" | "ADMIN";
  addresses?: AddressDto[];
  [key: string]: unknown;
}

export interface ReviewResponseDto {
  reviewId: number;
  rating: number;
  comment: string;
  createdAt: string;
  username: string;
}

export interface AddReviewDto {
  productId: number;
  userId: number;
  rating: number;     // 1 – 5
  comment: string;
}

export interface CartItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface CartResponseDto {
  cartId: number;
  userId: number;
  items: CartItemResponseDto[];
  totalPrice: number;
}

export interface OrderItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface OrderResponseDto {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItemResponseDto[];
}

export interface OrderRequestDto {
  userId: number;
  couponCode?: string;
}

export interface OrderSearchRequest {
  keyword?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  userId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface OrderStatusUpdateRequestDto {
  status: string;
  note?: string;
  updatedBy?: string;
}

export interface SearchProductsParams {
  keyword?: string;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  minRating?: number;
  sortBy?: string;
  sortDirection?: string;
  page?: number;
  size?: number;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export type GenericApiResponse = Record<string, unknown>;

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// ─── Popularity ───────────────────────────────────────────────────────────────

export async function getTrendingProducts(limit = 10): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products/popular/trending?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch trending products");
  const data = await res.json();
  // Trending endpoint returns a page object or array based on controller
  return Array.isArray(data) ? data : data.content || [];
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryDTO[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchProducts(keyword: string): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(credentials: AuthCredentials): Promise<GenericApiResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}


// ─── Orders ───────────────────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: number, 
  data: OrderStatusUpdateRequestDto,
  token?: string
): Promise<GenericApiResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export async function addAddress(
  data: AddressDto,
  token?: string
): Promise<GenericApiResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/addresses/add`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add address");
  return res.json();
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function toggleCoupon(
  couponId: number,
  token?: string
): Promise<GenericApiResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/coupons/${couponId}/toggle`, {
    method: "PUT",
    headers,
  });

  if (!res.ok) throw new Error("Failed to toggle coupon status");
  return res.json();
}

// ─── Order Tracking ──────────────────────────────────────────────────────────

export async function trackOrder(
  orderId: number,
  token?: string
): Promise<GenericApiResponse> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/orders/${orderId}/tracking`, { headers });
  if (!res.ok) throw new Error("Failed to track order");
  return res.json();
}

export async function getOrderStatusHistory(
  orderId: number,
  token?: string
): Promise<GenericApiResponse[]> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/orders/${orderId}/status-history`, { headers });
  if (!res.ok) throw new Error("Failed to fetch status history");
  return res.json();
}

export async function getLatestStatus(
  orderId: number,
  token?: string
): Promise<GenericApiResponse> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/orders/${orderId}/latest-status`, { headers });
  if (!res.ok) throw new Error("Failed to fetch latest status");
  return res.json();
}
