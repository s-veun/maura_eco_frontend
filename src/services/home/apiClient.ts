import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import {
  getStoredRefreshToken,
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
} from "@/lib/auth-storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";

const REFRESH_PATH = process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/auth/refresh-token";

export type HomeApiError = {
  status: number;
  message: string;
};

type ListEnvelope<T> = {
  data?: T[];
  content?: T[];
  items?: T[];
  products?: T[];
};

type EntityEnvelope<T> = {
  data?: T;
  item?: T;
  product?: T;
  user?: T;
};

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

let refreshPromise: Promise<string | null> | null = null;

function toApiError(error: unknown): HomeApiError {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  return {
    status: axiosError.response?.status || 500,
    message:
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Unexpected API error",
  };
}

async function retryableRequest<T>(request: () => Promise<T>, maxRetries = 1): Promise<T> {
  let attempts = 0;
  // Retry once on transient network failures and 5xx responses.
  // This keeps UX smooth on flaky mobile connections.
  while (attempts <= maxRetries) {
    try {
      return await request();
    } catch (error) {
      const parsed = toApiError(error);
      const isRetryable = parsed.status >= 500 || parsed.status === 0;
      if (!isRetryable || attempts === maxRetries) {
        throw parsed;
      }
      attempts += 1;
      await new Promise((resolve) => setTimeout(resolve, 300 * attempts));
    }
  }

  throw { status: 500, message: "Request failed after retries" } satisfies HomeApiError;
}

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getStoredRefreshToken();
    const response = await refreshClient.post(REFRESH_PATH, refreshToken ? { refreshToken } : undefined);
    const payload = response.data as { accessToken?: string; refreshToken?: string; token?: string };
    const token = payload.accessToken || payload.token || null;
    if (!token) return null;
    setStoredToken(token);
    if (payload.refreshToken) setStoredRefreshToken(payload.refreshToken);
    return token;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (!original || original._retry || error.response?.status !== 401) {
      throw toApiError(error);
    }

    original._retry = true;
    const nextToken = await refreshAccessToken();
    if (!nextToken) {
      throw toApiError(error);
    }

    const headers = AxiosHeaders.from(original.headers);
    headers.set("Authorization", `Bearer ${nextToken}`);
    original.headers = headers;
    return client(original);
  },
);

export const homeApiClient = {
  get: async <T>(url: string, params?: Record<string, unknown>) =>
    retryableRequest(async () => (await client.get<T>(url, { params })).data),
  getList: async <T>(url: string, params?: Record<string, unknown>) => {
    const payload = await retryableRequest(async () => (await client.get<unknown>(url, { params })).data);
    if (Array.isArray(payload)) return payload as T[];
    if (!payload || typeof payload !== "object") return [];
    const envelope = payload as ListEnvelope<T>;
    return envelope.data || envelope.content || envelope.items || envelope.products || [];
  },
  getEntity: async <T>(url: string, params?: Record<string, unknown>) => {
    const payload = await retryableRequest(async () => (await client.get<unknown>(url, { params })).data);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return payload as T;
    }
    const envelope = payload as EntityEnvelope<T>;
    return (envelope.data || envelope.item || envelope.product || envelope.user || payload) as T;
  },
};

