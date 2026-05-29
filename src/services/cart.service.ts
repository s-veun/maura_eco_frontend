import { ENDPOINTS } from "@/lib/endpoints";
import type { AuthenticatedRequest } from "@/services/http";
import { requestJson } from "@/services/http";
import type { CartResponseDto } from "@/lib/api";

export async function getCart(request: AuthenticatedRequest, userId: number) {
  return requestJson<CartResponseDto>(request, ENDPOINTS.cart.get(userId), {
    method: "GET",
  });
}

export async function addToCart(
  request: AuthenticatedRequest,
  payload: { userId: number; productId: number; quantity?: number },
) {
  const quantity = payload.quantity ?? 1;
  return requestJson<CartResponseDto>(
    request,
    `${ENDPOINTS.cart.add(payload.userId)}?productId=${payload.productId}&quantity=${quantity}`,
    { method: "POST" },
  );
}

export async function updateCartItem(
  request: AuthenticatedRequest,
  payload: { userId: number; productId: number; quantity: number },
) {
  return requestJson<CartResponseDto>(
    request,
    `${ENDPOINTS.cart.update(payload.userId)}?productId=${payload.productId}&quantity=${payload.quantity}`,
    { method: "PUT" },
  );
}

export async function removeCartItem(
  request: AuthenticatedRequest,
  payload: { userId: number; productId: number },
) {
  return requestJson<CartResponseDto>(
    request,
    ENDPOINTS.cart.remove(payload.userId, payload.productId),
    { method: "DELETE" },
  );
}

export async function clearCart(request: AuthenticatedRequest, userId: number) {
  return requestJson<void>(request, ENDPOINTS.cart.clear(userId), {
    method: "DELETE",
  });
}
