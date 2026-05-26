"use client";

import { Calendar, Mail, Phone, Shield, User } from "lucide-react";
import type { AuthUser } from "@/auth/types";

function formatDate(value?: string) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface ProfileInfoPanelProps {
  user: AuthUser;
  onEdit: () => void;
}

export default function ProfileInfoPanel({ user, onEdit }: ProfileInfoPanelProps) {
  const fields = [
    { label: "Username", value: user.username, icon: User },
    { label: "Email", value: user.email || "Not added", icon: Mail },
    { label: "Phone", value: user.phoneNumber || "Not added", icon: Phone },
    { label: "Role", value: user.role, icon: Shield },
    { label: "Created", value: formatDate(user.createdAt), icon: Calendar },
    { label: "Last login", value: formatDate(user.lastLoginAt), icon: Calendar },
  ];

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            Personal information
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            Account details
          </h2>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Edit information
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.label}
              className="rounded-[24px] bg-slate-50 px-4 py-4 transition hover:bg-slate-100/80"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                <Icon className="size-3.5" />
                {field.label}
              </div>
              <p className="mt-3 text-base font-semibold text-slate-900">{field.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
