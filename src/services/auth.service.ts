import type { AuthenticatedRequest } from "@/services/http";
import { requestJson } from "@/services/http";

export async function logout(request: AuthenticatedRequest, refreshToken?: string) {
  return requestJson<{ success?: boolean; message?: string }>(request, "/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refreshToken ? { refreshToken } : {}),
  });
}

