import { ENDPOINTS } from "@/lib/endpoints";
import type { AuthenticatedRequest } from "@/services/http";
import { requestJson } from "@/services/http";

type WishlistItem = Record<string, unknown>;

type WishlistResponse = {
  count: number;
  wishlist: WishlistItem[];
};

export async function getWishlist(request: AuthenticatedRequest) {
  return requestJson<WishlistResponse>(request, ENDPOINTS.wishlist.list, {
    method: "GET",
  });
}

export async function addToWishlist(request: AuthenticatedRequest, productId: number) {
  return requestJson<Record<string, unknown>>(request, ENDPOINTS.wishlist.add(productId), {
    method: "POST",
  });
}

export async function checkWishlist(request: AuthenticatedRequest, productId: number) {
  return requestJson<{ inWishlist?: boolean }>(request, ENDPOINTS.wishlist.check(productId), {
    method: "GET",
  });
}

export async function removeFromWishlist(request: AuthenticatedRequest, productId: number) {
  return requestJson<Record<string, unknown>>(request, ENDPOINTS.wishlist.remove(productId), {
    method: "DELETE",
  });
}

export async function clearWishlist(request: AuthenticatedRequest) {
  return requestJson<Record<string, unknown>>(request, ENDPOINTS.wishlist.clear, {
    method: "DELETE",
  });
}

