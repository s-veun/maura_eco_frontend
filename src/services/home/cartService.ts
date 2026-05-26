import { homeApiClient } from "@/services/home/apiClient";

type WishlistResponse = { items?: Array<unknown> } | Array<unknown>;

type CartResponse = {
  items?: Array<{ quantity?: number }>;
};

export const cartService = {
  async getCartCount(userId?: number): Promise<number> {
    if (!userId) return 0;
    const cart = await homeApiClient.get<CartResponse>(`/cart/${userId}`);
    return cart.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
  },

  async getWishlistCount(): Promise<number> {
    const wishlist = await homeApiClient.get<WishlistResponse>("/wishlist");
    if (Array.isArray(wishlist)) return wishlist.length;
    return wishlist.items?.length || 0;
  },
};

export default cartService;

