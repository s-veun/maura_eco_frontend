import { ENDPOINTS } from "@/lib/endpoints";
import type {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
} from "@/types/auth.types";
import type { AuthenticatedRequest } from "@/services/http";
import { requestJson } from "@/services/http";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";

async function postPublic<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function register(payload: RegisterRequestDto) {
  return postPublic<LoginResponseDto>(ENDPOINTS.auth.register, payload);
}

export async function login(payload: LoginRequestDto) {
  return postPublic<LoginResponseDto>(ENDPOINTS.auth.login, payload);
}

export async function refreshToken(refreshToken?: string) {
  return postPublic<RefreshTokenResponseDto>(ENDPOINTS.auth.refresh, refreshToken ? { refreshToken } : undefined);
}

export async function getGoogleOAuthInfo() {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.auth.googleOAuthInfo}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Unable to fetch Google OAuth info");
  return (await response.json()) as { data?: { authorizationUri?: string } };
}

export async function getFacebookOAuthInfo() {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.auth.facebookOAuthInfo}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Unable to fetch Facebook OAuth info");
  return (await response.json()) as { data?: { authorizationUri?: string } };
}

export async function logout(request: AuthenticatedRequest, refreshToken?: string) {
  return requestJson<{ success?: boolean; message?: string }>(request, ENDPOINTS.auth.logout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refreshToken ? { refreshToken } : {}),
  });
}

