"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Heart,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { useToast } from "@/components/ui/toast-provider";
import UserAvatar from "@/components/ui/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserDropdownProps = {
  theme?: "dark" | "light";
};

export default function UserDropdown({ theme = "dark" }: UserDropdownProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isAuthenticated, isProfileLoading, profileError, logout } = useAuth();

  const displayName = useMemo(() => {
    if (!user) return "";
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    return fullName || user.username;
  }, [user]);

  useEffect(() => {
    if (!profileError) return;
    showToast({ type: "error", title: "Profile unavailable", message: profileError });
  }, [profileError, showToast]);

  const handleLogout = useCallback(async () => {
    await logout();
    showToast({ type: "success", title: "Logged out", message: "You have been signed out." });
    router.replace("/login");
  }, [logout, router, showToast]);

  const menuItems = [
    { label: "My Profile", href: "/profile", icon: User },
    { label: "My Orders", href: "/profile?tab=orders", icon: Package },
    { label: "Wishlist", href: "/profile?tab=wishlist", icon: Heart },
    { label: "Cart", href: "/cart", icon: ShoppingCart },
    { label: "Settings", href: "/profile?tab=settings", icon: Settings },
  ] as const;

  const triggerClass =
    theme === "dark"
      ? "group flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition hover:bg-white/12"
      : "group flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition hover:bg-[#f5f3ff]";
  const usernameClass = theme === "dark" ? "text-white" : "text-[#1f2937]";
  const ringClass = theme === "dark" ? "ring-2 ring-white/50" : "ring-2 ring-[#5a3ea8]/30";

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className={theme === "dark"
          ? "group inline-flex min-w-18 flex-col items-center rounded-xl px-3 py-2 transition hover:bg-white/12"
          : "group inline-flex min-w-18 flex-col items-center rounded-xl px-3 py-2 text-[#374151] transition hover:bg-[#f5f3ff]"
        }
      >
        <User size={19} className="transition group-hover:-translate-y-0.5" />
        <span className={theme === "dark" ? "mt-1 text-xs text-white/90" : "mt-1 text-xs text-[#6b7280]"}>Account</span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>
        {isProfileLoading ? (
          <span className={theme === "dark" ? "h-9 w-9 animate-pulse rounded-full bg-white/25" : "h-9 w-9 animate-pulse rounded-full bg-slate-200"} />
        ) : (
          <UserAvatar
            src={user.profileImageUrl || user.profileImage}
            name={displayName}
            size="sm"
            ringClass={ringClass}
          />
        )}
        <span className={`hidden max-w-25 truncate text-sm font-semibold md:block ${usernameClass}`}>
          {displayName}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-2xl border border-slate-200 p-2 text-slate-700 shadow-2xl"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex items-center gap-3">
              <UserAvatar
                src={user.profileImageUrl || user.profileImage}
                name={displayName}
                size="md"
                ringClass="ring-2 ring-[#5a3ea8]/30"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                {user.email ? <p className="truncate text-xs text-slate-500">{user.email}</p> : null}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.href}
            className="cursor-pointer rounded-lg px-3 py-2.5 text-sm transition hover:text-[#5a3ea8]"
            onClick={() => router.push(item.href)}
          >
            <item.icon className="size-4 text-slate-400" />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto size-4 text-slate-300" />
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer rounded-lg px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
