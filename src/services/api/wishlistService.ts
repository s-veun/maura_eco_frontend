import { ecommerceApi } from "@/services/api/ecommerce-api";

export const wishlistService = {
  getAll: () => ecommerceApi.wishlist.getAll(),
  add: (productId: number) => ecommerceApi.wishlist.add(productId),
  remove: (productId: number) => ecommerceApi.wishlist.remove(productId),
  check: (productId: number) => ecommerceApi.wishlist.check(productId),
  clear: () => ecommerceApi.wishlist.clear(),
};

export default wishlistService;

