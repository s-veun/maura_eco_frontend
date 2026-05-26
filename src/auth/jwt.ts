import type { AuthUser } from "@/auth/types";

type JwtPayload = {
  sub?: string;
  exp?: number;
  iat?: number;
  id?: number | string;
  userId?: number | string;
  email?: string;
  role?: string;
  authorities?: string[];
  username?: string;
  preferred_username?: string;
  name?: string;
  [key: string]: unknown;
};

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);

  if (typeof atob === "function") {
    return decodeURIComponent(
      Array.from(atob(padded))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
  }

  return "";
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
}

export function deriveUserFromJwt(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const id = asNumber(payload.userId ?? payload.id ?? payload.sub);
  const role =
    payload.role ||
    (Array.isArray(payload.authorities) ? payload.authorities[0] : undefined) ||
    "USER";
  const username = payload.username || payload.preferred_username || payload.name || payload.email;

  if (!id || !username || !role) {
    return null;
  }

  return {
    id,
    username,
    email: payload.email,
    role,
  };
}

