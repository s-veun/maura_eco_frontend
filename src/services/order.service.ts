import type { AuthenticatedRequest } from "@/services/http";
import { requestJson } from "@/services/http";
import type { OrderResponseDto } from "@/lib/api";

export async function getOrderHistory(request: AuthenticatedRequest, userId: number) {
  return requestJson<OrderResponseDto[]>(request, `/orders/${userId}/history`, {
    method: "GET",
  });
}

export async function cancelOrder(request: AuthenticatedRequest, orderId: number) {
  return requestJson<OrderResponseDto>(request, `/orders/${orderId}/cancel`, {
    method: "PUT",
  });
}

