"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { useToast } from "@/components/ui/toast-provider";

export default function OAuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeOAuthLogin, refreshSession } = useAuth();
  const { showToast } = useToast();
  const processed = useRef(false);
  const queryString = searchParams?.toString() ?? "";
  const queryParams = useMemo(() => new URLSearchParams(queryString), [queryString]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const run = async () => {
      // -- 1. Handle explicit OAuth error from the backend ------------------
      const oauthError = queryParams.get("error");
      if (oauthError) {
        const msg = queryParams.get("message") || oauthError;
        setErrorMessage(msg);
        showToast({ type: "error", title: "OAuth login failed", message: msg });
        setTimeout(() => router.replace("/login"), 3500);
        return;
      }

      // -- 2. Extract tokens – backend sends ?token=... or ?accessToken=... -
      const accessToken =
        queryParams.get("token") ||        // primary – matches Spring backend
        queryParams.get("accessToken") ||  // alternative names
        queryParams.get("jwt");
      const refreshToken = queryParams.get("refreshToken") || undefined;
      const provider = queryParams.get("provider") || "OAuth";

      try {
        if (accessToken) {
          await completeOAuthLogin({ accessToken, refreshToken, remember: true });
          showToast({
            type: "success",
            title: `Signed in with ${provider}`,
            message: "Redirecting to your dashboard…",
          });
          router.replace("/dashboard");
          return;
        }

        // -- 3. No token in URL – try session recovery via refresh cookie --
        const recovered = await refreshSession();
        if (recovered) {
          showToast({ type: "success", title: "Session restored" });
          router.replace("/dashboard");
          return;
        }

        // -- 4. Nothing worked ---------------------------------------------
        const msg =
          "No authentication token received from the provider. " +
          "Please try again or contact support.";
        setErrorMessage(msg);
        showToast({ type: "error", title: "Login incomplete", message: msg });
        setTimeout(() => router.replace("/login"), 3500);
      } catch (error) {
        const message = error instanceof Error ? error.message : "OAuth callback failed";
        setErrorMessage(message);
        showToast({ type: "error", title: "Callback error", message });
        setTimeout(() => router.replace("/login"), 3500);
      }
    };

    run();
  }, [completeOAuthLogin, queryParams, refreshSession, router, showToast]);

  if (errorMessage) {
    return (
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-200 bg-white p-8 shadow-xl dark:border-red-900/40 dark:bg-slate-900">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Sign-in failed</h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">{errorMessage}</p>
        <p className="text-xs text-slate-400">Redirecting you back to the login page…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Completing sign-in…
      </p>
      <p className="text-xs text-slate-400">Please wait while we verify your account.</p>
    </div>
  );
}
