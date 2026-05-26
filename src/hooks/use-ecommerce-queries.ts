"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AddReviewDto, OrderRequestDto } from "@/lib/api";
import { ecommerceApi } from "@/services/api/ecommerce-api";
import type { ProductFilterQuery } from "@/types/ecommerce";

const keys = {
  categories: ["categories"] as const,
  featured: ["featured-products"] as const,
  trending: ["trending-products"] as const,
  newArrivals: ["new-arrivals-products"] as const,
  bestSellers: ["best-sellers-products"] as const,
  recommendations: ["recommended-products"] as const,
  discounted: ["discounted-products"] as const,
  flashDeals: ["flash-deals-products"] as const,
  promotions: ["promotional-products"] as const,
  products: ["products"] as const,
  product: (id: number | string) => ["products", id] as const,
  productSearch: (keyword: string) => ["product-search", keyword] as const,
  productFilter: (query: ProductFilterQuery) => ["product-filter", query] as const,
  cart: (userId: number) => ["cart", userId] as const,
  wishlist: ["wishlist"] as const,
  orderHistory: (userId: number) => ["order-history", userId] as const,
  reviews: (productId: number) => ["reviews", productId] as const,
};

export function useHomeCatalogQueries() {
  const allProducts = useQuery({ queryKey: keys.products, queryFn: ecommerceApi.products.getAll });
  const categories = useQuery({ queryKey: keys.categories, queryFn: ecommerceApi.products.categories });
  const featured = useQuery({ queryKey: keys.featured, queryFn: ecommerceApi.products.featured });
  const trending = useQuery({ queryKey: keys.trending, queryFn: ecommerceApi.products.trending });
  const newArrivals = useQuery({ queryKey: keys.newArrivals, queryFn: ecommerceApi.products.newArrivals });
  const bestSellers = useQuery({ queryKey: keys.bestSellers, queryFn: ecommerceApi.products.bestSellers });
  const recommendations = useQuery({
    queryKey: keys.recommendations,
    queryFn: ecommerceApi.products.recommendations,
  });
  const discounted = useQuery({ queryKey: keys.discounted, queryFn: ecommerceApi.products.discounted });
  const flashDeals = useQuery({ queryKey: keys.flashDeals, queryFn: ecommerceApi.products.flashDeals });
  const promotions = useQuery({ queryKey: keys.promotions, queryFn: ecommerceApi.products.promotions });

  return {
    allProducts,
    categories,
    featured,
    trending,
    newArrivals,
    bestSellers,
    recommendations,
    discounted,
    flashDeals,
    promotions,
  };
}

export function useProductDetailQuery(productId: number | string) {
  return useQuery({
    queryKey: keys.product(productId),
    queryFn: () => ecommerceApi.products.getById(productId),
    enabled: !!productId,
  });
}

export function useFilteredProductsQuery(query: ProductFilterQuery, enabled = true) {
  return useQuery({
    queryKey: keys.productFilter(query),
    queryFn: () => ecommerceApi.products.filter(query),
    enabled,
  });
}

export function useProductSearchQuery(keyword: string, enabled = true) {
  return useQuery({
    queryKey: keys.productSearch(keyword),
    queryFn: () => ecommerceApi.products.search(keyword),
    enabled,
  });
}

export function useCartMutations(userId: number) {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: ecommerceApi.cart.add,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.cart(userId) }),
  });

  const update = useMutation({
    mutationFn: ecommerceApi.cart.updateQuantity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.cart(userId) }),
  });

  const remove = useMutation({
    mutationFn: ecommerceApi.cart.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.cart(userId) }),
  });

  const clear = useMutation({
    mutationFn: () => ecommerceApi.cart.clear(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.cart(userId) }),
  });

  return { add, update, remove, clear };
}

export function useWishlistMutations() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: ecommerceApi.wishlist.add,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.wishlist }),
  });

  const remove = useMutation({
    mutationFn: ecommerceApi.wishlist.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.wishlist }),
  });

  const clear = useMutation({
    mutationFn: ecommerceApi.wishlist.clear,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.wishlist }),
  });

  return { add, remove, clear };
}

export function useOrderMutations(userId: number) {
  const queryClient = useQueryClient();
  const checkout = useMutation({
    mutationFn: (body: OrderRequestDto) => ecommerceApi.orders.checkout(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.orderHistory(userId) });
      queryClient.invalidateQueries({ queryKey: keys.cart(userId) });
    },
  });

  return { checkout };
}

export function useReviewMutations(productId: number) {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: (payload: AddReviewDto) => ecommerceApi.reviews.add(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.reviews(productId) }),
  });

  return { add };
}

