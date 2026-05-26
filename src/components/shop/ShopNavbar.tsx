import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function ShopNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#F3F4F6] bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5a3ea8] text-sm font-black text-white">
            TE
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-[#111827]">TableEco</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9CA3AF]">
              Premium Store
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-[#6B7280] md:flex">
          <Link href="/" className="transition hover:text-[#5a3ea8]">Home</Link>
          <Link href="/products" className="text-[#5a3ea8]">Shop</Link>
          <Link href="/about" className="transition hover:text-[#5a3ea8]">About</Link>
          <Link href="/contact" className="transition hover:text-[#5a3ea8]">Contact</Link>
        </div>

        <div className="hidden rounded-full bg-[#f5f3ff] px-4 py-2 text-xs font-semibold text-[#5a3ea8] lg:block">
          B2B pricing available
        </div>

        <Link
          href="/cart"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5a3ea8] px-4 text-sm font-semibold text-white transition hover:bg-[#4a3190]"
        >
          <ShoppingBag className="size-4" />
          <span>Cart</span>
        </Link>
      </nav>
    </header>
  );
}
