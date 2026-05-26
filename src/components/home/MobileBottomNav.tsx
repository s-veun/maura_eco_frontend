"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Heart, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  isAuthenticated: boolean;
  cartCount: number;
}

export default function MobileBottomNav({ isAuthenticated, cartCount }: MobileBottomNavProps) {
  const pathname = usePathname();

  const NAV = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/products", icon: Grid3X3 },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Cart", href: "/cart", icon: ShoppingCart, badge: cartCount },
    { label: "Account", href: isAuthenticated ? "/profile" : "/login", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV.map(({ label, href, icon: Icon, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 relative",
                  active
                    ? "bg-purple-50 text-[#5a3ea8]"
                    : "text-gray-500 hover:text-[#5a3ea8]"
                )}
              >
                <Icon className={cn("w-5 h-5", active && "stroke-[2.5px]")} />
                <span className="text-[10px] font-semibold">{label}</span>
                {badge && badge > 0 && (
                  <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

