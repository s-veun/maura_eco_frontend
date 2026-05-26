"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

interface ProfileSecurityPanelProps {
  isChangingPassword: boolean;
  onSubmit: (payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

export default function ProfileSecurityPanel({
  isChangingPassword,
  onSubmit,
}: ProfileSecurityPanelProps) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await onSubmit(form);
      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update your password.",
      );
    }
  };

  const fields = [
    { key: "oldPassword", label: "Current password" },
    { key: "newPassword", label: "New password" },
    { key: "confirmPassword", label: "Confirm new password" },
  ] as const;

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            Security
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Change password
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{field.label}</label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-slate-300">
              <LockKeyhole className="size-4 text-slate-400" />
              <input
                type={show[field.key] ? "text" : "password"}
                value={form[field.key]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder={field.label}
              />
              <button
                type="button"
                onClick={() =>
                  setShow((current) => ({
                    ...current,
                    [field.key]: !current[field.key],
                  }))
                }
                className="text-slate-400 transition hover:text-slate-700"
              >
                {show[field.key] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        ))}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-[24px] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
          Use at least 6 characters and avoid reusing passwords from other sites.
        </div>

        <button
          type="submit"
          disabled={isChangingPassword}
          className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {isChangingPassword ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
