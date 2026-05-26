export interface StoredAuthUser {
  id?: number;
  username?: string;
  role?: string;
  [key: string]: unknown;
}

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const ACCESS_TOKEN_COOKIE_DAYS = 1;
const REFRESH_TOKEN_COOKIE_DAYS = 14;
const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE || "token";
const IS_COOKIE_AUTH_MODE = AUTH_MODE === "cookie";

function canUseStorage() {
  return typeof window !== "undefined";
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const encodedName = encodeURIComponent(name);
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${encodedName.replace(/[-.[\]{}()*+?^$|#\s]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const maxAge = Math.max(1, Math.floor(days * 24 * 60 * 60));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getStoredToken(): string | null {
  if (!canUseStorage()) return null;
  if (IS_COOKIE_AUTH_MODE) return null;
  const cookieToken = getCookie(TOKEN_KEY);
  if (cookieToken) return cookieToken;

  const legacyToken = localStorage.getItem(TOKEN_KEY);
  if (legacyToken) {
    setCookie(TOKEN_KEY, legacyToken, ACCESS_TOKEN_COOKIE_DAYS);
    localStorage.removeItem(TOKEN_KEY);
    return legacyToken;
  }

  return null;
}

export function setStoredToken(token: string) {
  if (!canUseStorage()) return;
  if (IS_COOKIE_AUTH_MODE) return;
  setCookie(TOKEN_KEY, token, ACCESS_TOKEN_COOKIE_DAYS);
}

export function clearStoredToken() {
  if (!canUseStorage()) return;
  clearCookie(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (!canUseStorage()) return null;
  if (IS_COOKIE_AUTH_MODE) return null;
  const cookieToken = getCookie(REFRESH_TOKEN_KEY);
  if (cookieToken) return cookieToken;

  const legacyToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (legacyToken) {
    setCookie(REFRESH_TOKEN_KEY, legacyToken, REFRESH_TOKEN_COOKIE_DAYS);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return legacyToken;
  }

  return null;
}

export function setStoredRefreshToken(token: string) {
  if (!canUseStorage()) return;
  if (IS_COOKIE_AUTH_MODE) return;
  setCookie(REFRESH_TOKEN_KEY, token, REFRESH_TOKEN_COOKIE_DAYS);
}

export function clearStoredRefreshToken() {
  if (!canUseStorage()) return;
  clearCookie(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): StoredAuthUser | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user: StoredAuthUser) {
  if (!canUseStorage()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (!canUseStorage()) return;
  localStorage.removeItem(USER_KEY);
}

export function clearStoredAuth() {
  clearStoredToken();
  clearStoredRefreshToken();
  clearStoredUser();
}
