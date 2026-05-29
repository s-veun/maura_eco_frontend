"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, User } from "lucide-react";

import PremiumHeader from "@/components/header/PremiumHeader";
import { cn } from "@/lib/utils";

const bottomActions = [
  { value: "/", label: "Home", icon: Home, href: "/" },
  { value: "/products", label: "Shop", icon: Package, href: "/products" },
  { value: "/cart", label: "Cart", icon: ShoppingCart, href: "/cart" },
  { value: "/profile", label: "Profile", icon: User, href: "/profile" },
];

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";

  return (
    <div className="min-h-screen bg-[#ECE7D1] text-[#1F2937]">
      <PremiumHeader showHeroOverlay={currentPath === "/"} />

      <main className="mx-auto w-[90vw] px-0 pb-20 pt-34 md:pt-36 md:pb-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-none bg-[#ECE7D1]/95 backdrop-blur md:hidden">
        <div className="mx-auto flex w-[90vw] items-center justify-between py-2">
          {bottomActions.map(({ value, label, href, icon: Icon }) => {
            const active = currentPath === href || (href !== "/" && currentPath.startsWith(href));

            return (
              <Link
                key={value}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-[5px] py-2 text-[11px] transition-colors",
                  active ? "text-[#8A7650]" : "text-[#1F2937]/60",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
