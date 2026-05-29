"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import productService from "@/services/product.service";
import type { ProductSearchQuery } from "@/types/product.types";

export function useProductSearch(query: ProductSearchQuery) {
  const stableQuery = useMemo(
    () => ({
      keyword: query.keyword || undefined,
      categoryId: query.categoryId,
      brand: query.brand || undefined,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      available: query.available,
      minRating: query.minRating,
      sortBy: query.sortBy || "popularityScore",
      sortDirection: query.sortDirection || "desc",
      page: query.page ?? 0,
      size: query.size ?? 20,
    }),
    [
      query.available,
      query.brand,
      query.categoryId,
      query.keyword,
      query.maxPrice,
      query.minPrice,
      query.minRating,
      query.page,
      query.size,
      query.sortBy,
      query.sortDirection,
    ],
  );

  return useQuery({
    queryKey: ["products", "search", stableQuery],
    queryFn: () => productService.searchProducts(stableQuery),
    staleTime: 30_000,
  });
}

export default useProductSearch;

