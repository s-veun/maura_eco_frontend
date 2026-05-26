import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
} from "@/auth/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "";
// Optional: set this to your deployed frontend URL so OAuth redirect is pre-registered with the backend.
// e.g. NEXT_PUBLIC_APP_URL=https://my-shop.vercel.app
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

const LOGIN_PATH = process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH || "/auth/login";
const REGISTER_PATH = process.env.NEXT_PUBLIC_AUTH_REGISTER_PATH || "/auth/register";
const REFRESH_PATH = process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/auth/refresh-token";
const LOGOUT_PATH = process.env.NEXT_PUBLIC_AUTH_LOGOUT_PATH || "/auth/logout";
const OAUTH_GOOGLE_PATH =
  process.env.NEXT_PUBLIC_OAUTH_GOOGLE_PATH || "/oauth2/authorization/google";
const OAUTH_FACEBOOK_PATH =
  process.env.NEXT_PUBLIC_OAUTH_FACEBOOK_PATH || "/oauth2/authorization/facebook";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function buildApiUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, "")}${normalizePath(path)}`;
}

function getBackendOrigin() {
  if (BACKEND_ORIGIN) {
    return BACKEND_ORIGIN.replace(/\/$/, "");
  }
  try {
    const parsed = new URL(API_BASE_URL);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "";
  }
}

export function getGoogleOAuthUrl(callbackUrl?: string) {
  const base = `${getBackendOrigin()}${normalizePath(OAUTH_GOOGLE_PATH)}`;
  // Use the explicit APP_URL if set; otherwise fall back to the caller-supplied callbackUrl.
  const resolvedCallback = APP_URL ? `${APP_URL.replace(/\/$/, "")}/auth/success` : callbackUrl;
  if (!resolvedCallback) return base;
  return `${base}?frontend_redirect_uri=${encodeURIComponent(resolvedCallback)}`;
}

export function getFacebookOAuthUrl(callbackUrl?: string) {
  const base = `${getBackendOrigin()}${normalizePath(OAUTH_FACEBOOK_PATH)}`;
  const resolvedCallback = APP_URL ? `${APP_URL.replace(/\/$/, "")}/auth/success` : callbackUrl;
  if (!resolvedCallback) return base;
  return `${base}?frontend_redirect_uri=${encodeURIComponent(resolvedCallback)}`;
}

export function extractAccessToken(payload: LoginResponse | RefreshResponse | null | undefined) {
  if (!payload) return undefined;
  return payload.accessToken || payload.token || payload.jwt;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const rawText = await response.text();
  const data = rawText ? (JSON.parse(rawText) as T) : ({} as T);

  if (!response.ok) {
    const message =
      (data as Record<string, unknown>)?.message ||
      (data as Record<string, unknown>)?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(String(message));
  }

  return data;
}

export async function loginWithPassword(payload: LoginRequest) {
  const response = await fetch(buildApiUrl(LOGIN_PATH), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<LoginResponse>(response);
}

export async function registerWithPassword(payload: RegisterRequest) {
  const response = await fetch(buildApiUrl(REGISTER_PATH), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<Record<string, unknown>>(response);
}

export async function refreshToken(refreshToken?: string) {
  const response = await fetch(buildApiUrl(REFRESH_PATH), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
  });

  return parseJsonResponse<RefreshResponse>(response);
}

export async function logoutRequest(accessToken?: string, refreshToken?: string) {
  const response = await fetch(buildApiUrl(LOGOUT_PATH), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
    body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
  });

  if (!response.ok) {
    return;
  }
}


export async function authFetch(
  path: string,
  accessToken: string,
  init?: RequestInit,
) {
  return fetch(buildApiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export { API_BASE_URL };
