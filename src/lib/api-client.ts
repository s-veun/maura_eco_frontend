import { assertPublicEcommerceEndpoint } from "@/lib/endpoints";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";

type ApiClientOptions = {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<boolean>;
  onAuthFailure?: () => void;
};

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function buildApiUrl(path: string) {
  const safePath = assertPublicEcommerceEndpoint(normalizePath(path));
  return `${API_BASE_URL.replace(/\/$/, "")}${safePath}`;
}

function withAuthorizationHeader(init: RequestInit | undefined, token: string) {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

function isUnauthorizedStatus(status: number) {
  return status === 401 || status === 403;
}

export function createApiClient(options: ApiClientOptions) {
  return async function request(path: string, init?: RequestInit) {
    const currentToken = options.getAccessToken();
    if (!currentToken) {
      throw new Error("Missing access token. Please sign in first.");
    }

    let response = await fetch(buildApiUrl(path), {
      ...init,
      credentials: "include",
      headers: withAuthorizationHeader(init, currentToken),
    });

    if (!isUnauthorizedStatus(response.status)) {
      return response;
    }

    const recovered = await options.refreshAccessToken();
    if (!recovered) {
      options.onAuthFailure?.();
      throw new Error("Session expired. Please sign in again.");
    }

    const refreshedToken = options.getAccessToken();
    if (!refreshedToken) {
      options.onAuthFailure?.();
      throw new Error("Session expired. Please sign in again.");
    }

    response = await fetch(buildApiUrl(path), {
      ...init,
      credentials: "include",
      headers: withAuthorizationHeader(init, refreshedToken),
    });

    if (isUnauthorizedStatus(response.status)) {
      options.onAuthFailure?.();
      throw new Error("Session expired. Please sign in again.");
    }

    return response;
  };
}

export { API_BASE_URL };

