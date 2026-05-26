"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
      return;
    }

    if (roles && roles.length > 0 && user && !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, pathname, roles, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (roles && roles.length > 0 && user && !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

