"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { useToast } from "@/components/ui/toast-provider";
import { useProfileActions } from "@/hooks/useProfileActions";
import {
  getAccountCollections,
  type WishlistPreviewItem,
} from "@/services/account.service";
import { changePassword } from "@/services/profile.service";
import type { CartResponseDto, OrderResponseDto } from "@/lib/api";
import { UserApiError } from "@/services/http";

export type ProfileTab =
  | "profile"
  | "orders"
  | "wishlist"
  | "settings"
  | "notifications"
  | "preferences";

type AccountState = {
  orders: OrderResponseDto[];
  wishlist: WishlistPreviewItem[];
  wishlistCount: number;
  cart: CartResponseDto | null;
  failures: string[];
};

const VALID_TABS: ProfileTab[] = [
  "profile",
  "orders",
  "wishlist",
  "settings",
  "notifications",
  "preferences",
];

function resolveProfileTab(value: string | null): ProfileTab {
  return VALID_TABS.includes(value as ProfileTab) ? (value as ProfileTab) : "profile";
}

function profileCompletion(user: {
  username?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
}) {
  const fields = [user.username, user.email, user.phoneNumber, user.profileImage];
  const filled = fields.filter((value) => typeof value === "string" && value.trim()).length;
  return Math.round((filled / fields.length) * 100);
}

function passwordErrorMessage(error: unknown) {
  if (error instanceof UserApiError) {
    if (error.status === 401 || error.status === 403) {
      return "Your session expired. Please sign in again.";
    }
    if (error.status >= 500) {
      return "Server error while changing your password.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to change password.";
}

export function useProfileWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, authenticatedFetch, logout, isProfileLoading } = useAuth();
  const { showToast } = useToast();
  const {
    handleUpdateProfile,
    handleUploadAvatar,
    isSavingProfile,
    isUploadingAvatar,
  } = useProfileActions();

  const [accountState, setAccountState] = useState<AccountState>({
    orders: [],
    wishlist: [],
    wishlistCount: 0,
    cart: null,
    failures: [],
  });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const activeTab = resolveProfileTab(searchParams?.get("tab") ?? null);

  const setActiveTab = useCallback(
    (tab: ProfileTab) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (tab === "profile") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      const query = params.toString();
      const path = pathname ?? "/profile";
      router.replace(query ? `${path}?${query}` : path, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const refreshCollections = useCallback(async () => {
    if (!user?.id) {
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    setDataError(null);

    try {
      const result = await getAccountCollections(authenticatedFetch, user.id);
      setAccountState(result);
      if (result.failures.length >= 3) {
        setDataError("We couldn't load your account activity right now.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't load your account activity right now.";
      setDataError(message);
    } finally {
      setIsDataLoading(false);
    }
  }, [authenticatedFetch, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshCollections();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshCollections]);

  const handleSaveProfile = useCallback(
    async (payload: { username: string; email: string; phoneNumber: string }) => {
      const updated = await handleUpdateProfile(payload);
      if (updated) {
        await refreshCollections();
      }
      return updated;
    },
    [handleUpdateProfile, refreshCollections],
  );

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      const result = await handleUploadAvatar(file);
      if (result) {
        await refreshCollections();
      }
    },
    [handleUploadAvatar, refreshCollections],
  );

  const handlePasswordChange = useCallback(
    async (payload: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
      if (!payload.oldPassword || !payload.newPassword || !payload.confirmPassword) {
        throw new Error("Please complete all password fields.");
      }
      if (payload.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters.");
      }
      if (payload.newPassword !== payload.confirmPassword) {
        throw new Error("New password and confirmation do not match.");
      }

      setIsChangingPassword(true);
      try {
        await changePassword(authenticatedFetch, {
          oldPassword: payload.oldPassword,
          newPassword: payload.newPassword,
        });
        showToast({ title: "Password updated", type: "success" });
      } catch (error) {
        const message = passwordErrorMessage(error);
        showToast({ title: "Password update failed", message, type: "error" });
        throw new Error(message);
      } finally {
        setIsChangingPassword(false);
      }
    },
    [authenticatedFetch, showToast],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace("/login");
  }, [logout, router]);

  const summary = useMemo(() => {
    const cartItems = accountState.cart?.items?.length ?? 0;
    return {
      ordersCount: accountState.orders.length,
      wishlistCount: accountState.wishlistCount,
      cartItemsCount: cartItems,
      cartTotal: accountState.cart?.totalPrice ?? 0,
      profileCompletion: profileCompletion({
        username: user?.username,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        profileImage: user?.profileImage,
      }),
    };
  }, [accountState.cart, accountState.orders.length, accountState.wishlistCount, user]);

  return {
    user,
    activeTab,
    setActiveTab,
    isProfileLoading,
    isSavingProfile,
    isUploadingAvatar,
    isChangingPassword,
    isDataLoading,
    dataError,
    failures: accountState.failures,
    orders: accountState.orders,
    wishlist: accountState.wishlist,
    cart: accountState.cart,
    summary,
    refreshCollections,
    handleSaveProfile,
    handleAvatarUpload,
    handlePasswordChange,
    handleLogout,
  };
}
