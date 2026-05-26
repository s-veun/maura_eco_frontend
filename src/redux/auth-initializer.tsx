"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { baseApi } from "@/redux/api/baseApi";
import { logout, setCredentials } from "@/redux/slices/authSlice";
import { useAuth } from "@/auth/AuthProvider";
import { StoredAuthUser } from "@/lib/auth-storage";
import { AppDispatch } from "./store";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !accessToken || !user) {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      return;
    }

    dispatch(
      setCredentials({
        token: accessToken,
        user: user as StoredAuthUser,
        authenticated: true,
      }),
    );
  }, [accessToken, dispatch, isAuthenticated, isLoading, user]);

  return <>{children}</>;
}
