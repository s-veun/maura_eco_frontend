"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { useToast } from "@/components/ui/toast-provider";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") || "";
  }, []);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { showToast } = useToast();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!token) {
      showToast({
        type: "error",
        title: "Missing token",
        message: "Open this page from the email link to reset your password.",
      });
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      setSuccess("Password updated successfully. You can now log in.");
      showToast({ type: "success", title: "Password reset", message: "You can now sign in with your new password." });
      setNewPassword("");
    } catch (error) {
      showToast({
        type: "error",
        title: "Reset failed",
        message: getApiErrorMessage(error, "Please retry with a valid reset link."),
      });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-[480px] border rounded-lg bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="text-muted-foreground mt-1">Set a strong new password for your account.</p>

        {success ? <div className="mt-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-200">{success}</div> : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="space-y-1">
            <label htmlFor="new-password" className="text-sm font-medium">New password</label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((c) => !c)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            <LockKeyhole className="mr-2 h-4 w-4" />
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        <p className="text-sm mt-5">
          Return to <Link href="/login" className="underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

