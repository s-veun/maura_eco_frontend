import { Suspense } from "react";
import OAuthCallbackClient from "@/app/auth/callback/OAuthCallbackClient";

function Fallback() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-700 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      Completing OAuth authentication...
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Suspense fallback={<Fallback />}>
        <OAuthCallbackClient />
      </Suspense>
    </div>
  );
}

