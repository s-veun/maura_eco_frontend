import { Suspense } from "react";
import LoginClient from "@/app/login/LoginClient";

function Fallback() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="mt-2 text-sm text-muted-foreground">Loading login page...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <LoginClient />
    </Suspense>
  );
}
