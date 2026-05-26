"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  extractAccessToken,
  getFacebookOAuthUrl,
  getGoogleOAuthUrl,
  loginWithPassword,
  logoutRequest,
  refreshToken,
  registerWithPassword,
} from "@/auth/auth-service";
import { AuthUser, RegisterRequest } from "@/auth/types";
import { clearSession, loadSession, saveSession } from "@/auth/token-store";
import { deriveUserFromJwt, isJwtExpired } from "@/auth/jwt";
import { createApiClient } from "@/lib/api-client";
import { getProfile } from "@/services/profile.service";
import { UserApiError } from "@/services/http";

type LoginInput = {
  username: string;
  password: string;
  remember: boolean;
};

type OAuthTokenPayload = {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
  remember?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  loginError: string | null;
  profileError: string | null;
  sessionStartedAt: number | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  completeOAuthLogin: (payload: OAuthTokenPayload) => Promise<void>;
  refreshSession: () => Promise<boolean>;
  refreshProfile: () => Promise<AuthUser | null>;
  authenticatedFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);

  const refreshInFlight = useRef<Promise<boolean> | null>(null);

  const clearAuthState = useCallback(() => {
    clearSession();
    setUser(null);
    setAccessToken(null);
    setRefreshTokenValue(null);
    setLoginError(null);
    setProfileError(null);
    setSessionStartedAt(null);
  }, []);

  const applySession = useCallback(
    (next: { accessToken: string; refreshToken?: string; user?: AuthUser; remember: boolean }) => {
      const decodedUser = deriveUserFromJwt(next.accessToken);
      const resolvedUser = decodedUser || next.user;

      if (!resolvedUser) {
        throw new Error("Unable to extract user data from JWT token.");
      }

      setAccessToken(next.accessToken);
      setRefreshTokenValue(next.refreshToken || null);
      setUser(resolvedUser);
      setRememberMe(next.remember);
      setProfileError(null);
      setSessionStartedAt((prev) => prev ?? Date.now());
      saveSession({
        accessToken: next.accessToken,
        refreshToken: next.refreshToken,
        user: resolvedUser,
        remember: next.remember,
      });
    },
    [],
  );

  const hardLogout = useCallback(async () => {
    try {
      await logoutRequest(accessToken || undefined, refreshTokenValue || undefined);
    } catch {
      // Ignore network errors while logging out client-side session.
    }

    clearAuthState();
  }, [accessToken, clearAuthState, refreshTokenValue]);

  const refreshSession = useCallback(async () => {
    if (refreshInFlight.current) {
      return refreshInFlight.current;
    }

    refreshInFlight.current = (async () => {
      try {
        const refreshed = await refreshToken(refreshTokenValue || undefined);
        const nextAccess = extractAccessToken(refreshed);
        if (!nextAccess || isJwtExpired(nextAccess)) return false;

        applySession({
          accessToken: nextAccess,
          refreshToken: refreshed.refreshToken || refreshTokenValue || undefined,
          user: loadSession()?.user || undefined,
          remember: rememberMe,
        });

        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight.current = null;
      }
    })();

    return refreshInFlight.current;
  }, [applySession, refreshTokenValue, rememberMe]);

  const authenticatedFetch = useCallback(
    async (path: string, init?: RequestInit) => {
      const request = createApiClient({
        getAccessToken: () => accessToken || loadSession()?.accessToken || null,
        refreshAccessToken: refreshSession,
        onAuthFailure: clearAuthState,
      });

      return request(path, init);
    },
    [accessToken, clearAuthState, refreshSession],
  );

  const refreshProfile = useCallback(async () => {
    const token = accessToken || loadSession()?.accessToken;
    if (!token) return null;

    setIsProfileLoading(true);
    setProfileError(null);

    try {
      const payload = await getProfile(authenticatedFetch);
      const jwtUser = deriveUserFromJwt(token);
      const storedUser = loadSession()?.user;
      const baseUser = storedUser || jwtUser;

      const mergedUser: AuthUser = {
        id: Number(payload.id ?? baseUser?.id ?? 0),
        username: String(payload.username ?? baseUser?.username ?? "user"),
        email:
          typeof payload.email === "string" ? payload.email : baseUser?.email,
        firstName:
          typeof payload.firstName === "string" ? payload.firstName : baseUser?.firstName,
        lastName:
          typeof payload.lastName === "string" ? payload.lastName : baseUser?.lastName,
        phoneNumber:
          typeof payload.phoneNumber === "string"
            ? payload.phoneNumber
            : baseUser?.phoneNumber,
        role: String(payload.role ?? baseUser?.role ?? "USER"),
        provider: typeof payload.provider === "string" ? payload.provider : baseUser?.provider || "LOCAL",
        profileImage:
          typeof payload.profileImageUrl === "string"
            ? payload.profileImageUrl
            : typeof payload.profileImage === "string"
              ? payload.profileImage
              : baseUser?.profileImage,
        profileImageUrl:
          typeof payload.profileImageUrl === "string"
            ? payload.profileImageUrl
            : typeof payload.profileImage === "string"
              ? payload.profileImage
              : baseUser?.profileImageUrl,
        createdAt: typeof payload.createdAt === "string" ? payload.createdAt : baseUser?.createdAt,
        lastLoginAt:
          typeof payload.lastLoginAt === "string"
            ? payload.lastLoginAt
            : baseUser?.lastLoginAt,
      };

      setUser(mergedUser);

      const stored = loadSession();
      if (stored) {
        saveSession({
          ...stored,
          accessToken: token,
          user: mergedUser,
        });
      }

      return mergedUser;
    } catch (error) {
      if (error instanceof UserApiError && (error.status === 401 || error.status === 403)) {
        clearAuthState();
        setProfileError("Session expired. Please sign in again.");
        return null;
      }

      const message = error instanceof Error ? error.message : "Unable to fetch user profile.";
      setProfileError(message);
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  }, [accessToken, authenticatedFetch, clearAuthState]);

  const login = useCallback(
    async (input: LoginInput) => {
      setLoginError(null);
      const result = await loginWithPassword({
        username: input.username,
        password: input.password,
      });

      const token = extractAccessToken(result);
      if (!token || isJwtExpired(token)) {
        throw new Error("No access token returned by backend.");
      }

      applySession({
        accessToken: token,
        refreshToken: result.refreshToken,
        user: result.user,
        remember: input.remember,
      });

      await refreshProfile().catch(() => undefined);
    },
    [applySession, refreshProfile],
  );

  const register = useCallback(async (input: RegisterRequest) => {
    await registerWithPassword(input);
  }, []);

  const completeOAuthLogin = useCallback(
    async ({ accessToken: oauthAccessToken, refreshToken, user: oauthUser, remember }: OAuthTokenPayload) => {
      if (isJwtExpired(oauthAccessToken)) {
        throw new Error("OAuth token is expired.");
      }

      applySession({
        accessToken: oauthAccessToken,
        refreshToken,
        user: oauthUser,
        remember: remember ?? true,
      });

      await refreshProfile().catch(() => undefined);
    },
    [applySession, refreshProfile],
  );

  const loginWithGoogle = useCallback(() => {
    window.location.assign(getGoogleOAuthUrl(`${window.location.origin}/auth/success`));
  }, []);

  const loginWithFacebook = useCallback(() => {
    window.location.assign(getFacebookOAuthUrl(`${window.location.origin}/auth/success`));
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const stored = loadSession();
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        if (isJwtExpired(stored.accessToken)) {
          const refreshed = await refreshToken(stored.refreshToken);
          const nextAccess = extractAccessToken(refreshed);

          if (!nextAccess || isJwtExpired(nextAccess)) {
            clearAuthState();
            return;
          }

          applySession({
            accessToken: nextAccess,
            refreshToken: refreshed.refreshToken || stored.refreshToken,
            user: stored.user,
            remember: stored.remember,
          });
        } else {
          applySession(stored);
        }

        await refreshProfile().catch(() => undefined);
      } catch {
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [applySession, clearAuthState, refreshProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      isLoading,
      isProfileLoading,
      loginError,
      profileError,
      sessionStartedAt,
      login: async (input) => {
        try {
          await login(input);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to login.";
          setLoginError(message);
          throw error;
        }
      },
      register,
      logout: hardLogout,
      loginWithGoogle,
      loginWithFacebook,
      completeOAuthLogin,
      refreshSession,
      refreshProfile,
      authenticatedFetch,
    }),
    [
      user,
      accessToken,
      isLoading,
      isProfileLoading,
      loginError,
      profileError,
      sessionStartedAt,
      login,
      register,
      hardLogout,
      loginWithGoogle,
      loginWithFacebook,
      completeOAuthLogin,
      refreshSession,
      refreshProfile,
      authenticatedFetch,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}

export default AuthProvider;
