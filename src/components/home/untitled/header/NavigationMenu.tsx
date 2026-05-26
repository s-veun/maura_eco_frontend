"use client";

import Link from "next/link";
import ThemeSwitcher from "@/components/home/untitled/header/ThemeSwitcher";

type NavItem = { label: string; href: string };

type NavigationMenuProps = {
  items: NavItem[];
  activePath: string;
  isDark: boolean;
  onThemeToggle: () => void;
};

export default function NavigationMenu({
  items,
  activePath,
  isDark,
  onThemeToggle,
}: NavigationMenuProps) {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
      <ul className="flex items-center gap-6">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? activePath === "/"
              : activePath.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative inline-flex items-center text-sm font-semibold tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:transition-all ${
                  isActive
                    ? "text-white after:bg-white"
                    : "text-white/80 hover:text-white after:bg-transparent hover:after:bg-white/60"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <ThemeSwitcher isDark={isDark} onToggle={onThemeToggle} />
    </nav>
  );
}
