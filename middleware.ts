import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/profile"];
const ADMIN_PREFIXES = ["/admin"];
const AUTH_PAGES = ["/login", "/register"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((path) => pathname.startsWith(path));
}

function isAdminPath(pathname: string) {
  return ADMIN_PREFIXES.some((path) => pathname.startsWith(path));
}

function decodeRoleFromToken(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { role?: string; authorities?: string[] };

    if (typeof payload.role === "string") return payload.role;
    if (Array.isArray(payload.authorities) && typeof payload.authorities[0] === "string") {
      return payload.authorities[0];
    }

    return null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get("te_access_token")?.value;

  if (isProtectedPath(pathname) && !accessToken) {
    const redirect = encodeURIComponent(`${pathname}${search}`);
    return NextResponse.redirect(new URL(`/login?redirect=${redirect}`, request.url));
  }

  if (isAdminPath(pathname)) {
    if (!accessToken) {
      const redirect = encodeURIComponent(`${pathname}${search}`);
      return NextResponse.redirect(new URL(`/login?redirect=${redirect}`, request.url));
    }

    const role = decodeRoleFromToken(accessToken);
    if (!role || !["ADMIN", "ROLE_ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (isAuthPage(pathname) && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/login", "/register"],
};

