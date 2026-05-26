import { AuthUser, StoredSession } from "@/auth/types";

const ACCESS_TOKEN_KEY = "te_auth_access_token";
const REFRESH_TOKEN_KEY = "te_auth_refresh_token";
const USER_KEY = "te_auth_user";
const REMEMBER_KEY = "te_auth_remember";
const AUTH_COOKIE_KEY = "te_access_token";

function canUseBrowserApis() {
  return typeof window !== "undefined";
}

function writeAuthCookie(accessToken: string, remember: boolean) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const maxAge = remember ? 60 * 60 * 24 * 7 : 60 * 60 * 4;
  document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession) {
  if (!canUseBrowserApis()) return;

  const storage = session.remember ? localStorage : sessionStorage;
  const staleStorage = session.remember ? sessionStorage : localStorage;

  staleStorage.removeItem(ACCESS_TOKEN_KEY);
  staleStorage.removeItem(REFRESH_TOKEN_KEY);
  staleStorage.removeItem(USER_KEY);
  staleStorage.removeItem(REMEMBER_KEY);

  storage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  if (session.refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  } else {
    storage.removeItem(REFRESH_TOKEN_KEY);
  }
  storage.setItem(USER_KEY, JSON.stringify(session.user));
  storage.setItem(REMEMBER_KEY, String(session.remember));

  writeAuthCookie(session.accessToken, session.remember);
}

export function loadSession(): StoredSession | null {
  if (!canUseBrowserApis()) return null;

  const localToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const sessionToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);

  const remember = Boolean(localToken);
  const storage = remember ? localStorage : sessionStorage;
  const accessToken = remember ? localToken : sessionToken;
  if (!accessToken) return null;

  const user = parseStoredUser(storage.getItem(USER_KEY));
  if (!user) return null;

  const refreshToken = storage.getItem(REFRESH_TOKEN_KEY) || undefined;

  return { accessToken, refreshToken, user, remember };
}

export function clearSession() {
  if (!canUseBrowserApis()) return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(REMEMBER_KEY);

  clearAuthCookie();
}

