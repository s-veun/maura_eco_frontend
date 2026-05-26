"use client";

import { CalendarDays, LogOut, Mail, Phone, ShieldCheck } from "lucide-react";
import type { AuthUser } from "@/auth/types";
import AvatarUploadButton from "@/components/profile/AvatarUploadButton";

function formatDate(value?: string) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface ProfileOverviewCardProps {
  user: AuthUser;
  isUploadingAvatar: boolean;
  onAvatarUpload: (file: File) => Promise<void>;
  onAvatarError: (message: string) => void;
  onEditProfile: () => void;
  onLogout: () => Promise<void>;
}

export default function ProfileOverviewCard({
  user,
  isUploadingAvatar,
  onAvatarUpload,
  onAvatarError,
  onEditProfile,
  onLogout,
}: ProfileOverviewCardProps) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <AvatarUploadButton
          src={user.profileImage}
          name={user.username}
          size="2xl"
          disabled={isUploadingAvatar}
          onUpload={onAvatarUpload}
          onInvalidFile={onAvatarError}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-3xl font-black tracking-tight text-slate-900">
              {user.username}
            </h1>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
              {user.role}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Manage your personal details, recent activity, saved items, and account security in one place.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="size-4 text-slate-400" />
              <span className="truncate">{user.email || "No email added yet"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="size-4 text-slate-400" />
              <span>{user.phoneNumber || "No phone number added yet"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CalendarDays className="size-4 text-slate-400" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className="size-4 text-slate-400" />
              <span>{user.provider || "LOCAL"} account</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onEditProfile}
          className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Edit profile
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </section>
  );
}
