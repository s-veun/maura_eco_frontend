"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { useToast } from "@/components/ui/toast-provider";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { showToast } = useToast();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await forgotPassword({ email }).unwrap();
      setInfo("Reset link sent. Please check your inbox.");
      showToast({
        type: "success",
        title: "Reset link sent",
        message: "Please check your inbox for the password reset instructions.",
      });
      setEmail("");
    } catch (error) {
      showToast({
        type: "error",
        title: "Unable to send reset link",
        message: getApiErrorMessage(error, "Please try again in a few moments."),
      });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-[480px] border rounded-lg bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Forgot password</h1>
        <p className="text-muted-foreground mt-1">Enter your email to receive a reset link.</p>

        {info ? <div className="mt-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-200">{info}</div> : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {isLoading ? "Sending..." : "Send reset email"}
          </Button>
        </form>

        <p className="text-sm mt-5">
          Back to <Link href="/login" className="underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

