import type { AuthUser } from "@/auth/types";

export function hasRole(user: AuthUser | null | undefined, roles: string[]) {
  if (!user) return false;
  return roles.includes(user.role);
}

export function isAdmin(user: AuthUser | null | undefined) {
  return hasRole(user, ["ADMIN"]);
}

export function isBusinessUser(user: AuthUser | null | undefined) {
  return hasRole(user, ["BUSINESS", "ADMIN"]);
}

