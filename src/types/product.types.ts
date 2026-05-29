export type ProductDto = {
  proId: number;
  proName: string;
  proDesc?: string;
  proPrice: number;
  proBrand?: string;
  quantity?: number;
  discount?: number;
  tags?: string;
  categoryId?: number;
  categoryName?: string;
  imageUrl?: string;
  imageUrls?: string[];
  thumbnailImage?: string;
  thumbnailImageUrl?: string;
  releaseDate?: string;
  rating?: number;
  available?: boolean;
  stock?: number;
  purchaseCount?: number;
  viewCount?: number;
  popularityScore?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductSearchQuery = {
  keyword?: string;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  minRating?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  page?: number;
  size?: number;
};

export type ProductListResponse = {
  products: ProductDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
};

export type PopularProductsResponse = {
  count: number;
  products: ProductDto[];
};

export type NewArrivalsResponse = {
  success: boolean;
  count: number;
  page?: number;
  limit?: number;
  data: ProductDto[];
};

