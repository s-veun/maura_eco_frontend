import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getStoredRefreshToken, getStoredToken, setStoredRefreshToken, setStoredToken } from "@/lib/auth-storage";
import { loadSession, saveSession } from "@/auth/token-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";

const REFRESH_PATH = process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/auth/refresh-token";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

let refreshInFlight: Promise<string | null> | null = null;

function getAccessToken() {
  return getStoredToken() || loadSession()?.accessToken || null;
}

function getRefreshToken() {
  return getStoredRefreshToken() || loadSession()?.refreshToken || null;
}

function syncSessionTokens(accessToken: string, refreshToken?: string | null) {
  setStoredToken(accessToken);
  if (refreshToken) {
    setStoredRefreshToken(refreshToken);
  }

  const session = loadSession();
  if (session) {
    saveSession({
      ...session,
      accessToken,
      refreshToken: refreshToken || session.refreshToken,
    });
  }
}

function extractTokens(data: unknown): { accessToken: string | null; refreshToken: string | null } {
  if (!data || typeof data !== "object") {
    return { accessToken: null, refreshToken: null };
  }

  const root = data as Record<string, unknown>;
  const nested = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>) : null;

  const accessToken =
    (root.accessToken as string | undefined) ||
    (root.token as string | undefined) ||
    (root.jwt as string | undefined) ||
    (nested?.accessToken as string | undefined) ||
    (nested?.token as string | undefined) ||
    (nested?.jwt as string | undefined) ||
    null;

  const refreshToken =
    (root.refreshToken as string | undefined) ||
    (nested?.refreshToken as string | undefined) ||
    null;

  return { accessToken, refreshToken };
}

async function refreshAccessToken() {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();

    const response = await refreshClient.post(
      REFRESH_PATH,
      refreshToken ? { refreshToken } : undefined,
      { headers: { "Content-Type": "application/json" } },
    );

    const tokens = extractTokens(response.data);
    if (!tokens.accessToken) {
      return null;
    }

    syncSessionTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!original || original._retry || error.response?.status !== 401) {
      throw error;
    }

    original._retry = true;

    try {
      const nextToken = await refreshAccessToken();
      if (!nextToken) {
        return Promise.reject(error);
      }
      original.headers.Authorization = `Bearer ${nextToken}`;
      return api(original);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export { api, API_BASE_URL };

