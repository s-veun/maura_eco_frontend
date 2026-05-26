import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import {
  getStoredRefreshToken,
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
} from "@/lib/auth-storage";
import { logout, setCredentials } from "@/redux/slices/authSlice";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";

const REFRESH_ENDPOINT =
  process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/auth/refresh-token";

const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE || "token";
const USE_COOKIE_AUTH = AUTH_MODE === "cookie";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { token?: string | null } };
    const token = state.auth?.token || getStoredToken();
    if (!USE_COOKIE_AUTH && token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<string | null> | null = null;

function extractTokens(data: unknown): { accessToken: string | null; refreshToken: string | null } {
  if (!data || typeof data !== "object") {
    return { accessToken: null, refreshToken: null };
  }

  const authData = data as Record<string, unknown>;
  const nestedData =
    authData.data && typeof authData.data === "object"
      ? (authData.data as Record<string, unknown>)
      : null;

  const accessToken =
    (authData.token as string | undefined) ||
    (authData.jwt as string | undefined) ||
    (authData.accessToken as string | undefined) ||
    (nestedData?.token as string | undefined) ||
    (nestedData?.jwt as string | undefined) ||
    (nestedData?.accessToken as string | undefined) ||
    null;
  const refreshToken =
    (authData.refreshToken as string | undefined) ||
    (nestedData?.refreshToken as string | undefined) ||
    null;

  return { accessToken, refreshToken };
}

function resolveUrl(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    const requestUrl = resolveUrl(args);
    const isRefreshRequest = requestUrl.includes(REFRESH_ENDPOINT);
    const isAuthRequest = requestUrl.includes("/login") || requestUrl.includes("/register");

    const isAuthStatus =
      result.error?.status === 401 || result.error?.status === 403;

    if (!isAuthStatus || isRefreshRequest || isAuthRequest) {
      return result;
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        const storedRefreshToken = getStoredRefreshToken();

        const refreshResult = await rawBaseQuery(
          {
            url: REFRESH_ENDPOINT,
            method: "POST",
            body: storedRefreshToken ? { refreshToken: storedRefreshToken } : undefined,
          },
          api,
          extraOptions
        );

        if (!refreshResult.data) {
          return USE_COOKIE_AUTH && !refreshResult.error ? "__cookie_session__" : null;
        }

        const tokens = extractTokens(refreshResult.data);
        if (!tokens.accessToken && USE_COOKIE_AUTH && !refreshResult.error) {
          api.dispatch(setCredentials({ authenticated: true }));
          return "__cookie_session__";
        }

        if (!tokens.accessToken) {
          return null;
        }

        setStoredToken(tokens.accessToken);
        if (tokens.refreshToken) {
          setStoredRefreshToken(tokens.refreshToken);
        }

        api.dispatch(
          setCredentials({
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken || undefined,
            authenticated: true,
          })
        );

        return tokens.accessToken;
      })();
    }

    const newToken = await refreshPromise;
    refreshPromise = null;

    if (newToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }

    return result;
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Category", "Profile", "Cart", "Wishlist", "Orders", "Reviews"],
  endpoints: () => ({}),
});
