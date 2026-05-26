"use client";

import { ChevronDown, Moon, Sun } from "lucide-react";

type ThemeSwitcherProps = {
  isDark: boolean;
  onToggle: () => void;
};

export default function ThemeSwitcher({ isDark, onToggle }: ThemeSwitcherProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_20px_rgba(15,23,42,0.12)] transition " +
        (isDark
          ? "bg-[#5a3ea8] text-white ring-1 ring-white/20 hover:bg-[#4b338f]"
          : "border border-white/30 bg-white/10 text-white hover:bg-white/15")
      }
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span>{isDark ? "Dark" : "Light"}</span>
      <ChevronDown className="size-4 opacity-70" />
    </button>
  );
}
