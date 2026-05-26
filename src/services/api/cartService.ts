import { ecommerceApi } from "@/services/api/ecommerce-api";

export const cartService = {
  addItem: (payload: { userId: number; productId: number; quantity?: number }) =>
    ecommerceApi.cart.add(payload),
  updateItem: (payload: { userId: number; productId: number; quantity: number }) =>
    ecommerceApi.cart.updateQuantity(payload),
  removeItem: (payload: { userId: number; productId: number }) =>
    ecommerceApi.cart.remove(payload),
};

export default cartService;

