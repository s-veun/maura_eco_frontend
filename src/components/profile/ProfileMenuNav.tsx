"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  isDanger?: boolean;
};

interface ProfileMenuNavProps {
  items: NavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export default function ProfileMenuNav({
  items,
  activeKey,
  onSelect,
}: ProfileMenuNavProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_10px_25px_rgba(15,23,42,0.05)] lg:flex-col">
        {items.map((item) => {
          const Icon = item.icon;
          const baseClassName = `inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            item.key === activeKey
              ? "bg-slate-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)]"
              : item.isDanger
                ? "text-red-600 hover:bg-red-50"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`;

          if (item.href) {
            return (
              <Link key={item.key} href={item.href} className={baseClassName}>
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={baseClassName}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
