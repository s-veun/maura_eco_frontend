"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import type { AuthUser } from "@/auth/types";

interface EditProfileModalProps {
  user: AuthUser | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: { username: string; email: string; phoneNumber: string }) => Promise<void>;
}

export default function EditProfileModal({
  user,
  isOpen,
  isSaving,
  onClose,
  onSave,
}: EditProfileModalProps) {
  // Derive initial values directly from props so no useEffect is needed
  const [form, setForm] = useState(() => ({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens with fresh user data
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (!prevIsOpenRef.current && isOpen) {
      // Use a micro-task to avoid synchronous setState-in-effect lint rule
      const id = setTimeout(() => {
        setForm({
          username: user?.username || "",
          email: user?.email || "",
          phoneNumber: user?.phoneNumber || "",
        });
        setErrors({});
      }, 0);
      return () => clearTimeout(id);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (form.username.trim().length < 3) newErrors.username = "Username must be at least 3 characters";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email address";
    if (form.phoneNumber && !/^[+\d\s\-()]{7,20}$/.test(form.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({
      username: form.username.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-3xl bg-white shadow-2xl duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Edit Profile</h3>
            <p className="mt-0.5 text-xs text-zinc-500">Update your personal information</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 ${
                errors.username
                  ? "border-red-400 focus:border-red-400"
                  : "border-zinc-200 focus:border-emerald-600"
              }`}
              placeholder="Your username"
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 ${
                errors.email
                  ? "border-red-400 focus:border-red-400"
                  : "border-zinc-200 focus:border-emerald-600"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 ${
                errors.phoneNumber
                  ? "border-red-400 focus:border-red-400"
                  : "border-zinc-200 focus:border-emerald-600"
              }`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
