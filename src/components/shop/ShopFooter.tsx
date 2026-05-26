import Link from "next/link";

export default function ShopFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#f8fafc]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <p className="text-base font-black tracking-tight text-slate-900">TableEco Market</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
            Curated grocery shopping with faster discovery, fresher delivery, and a cleaner
            storefront experience.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Explore</p>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <Link href="/products" className="transition-colors hover:text-slate-900">Shop</Link>
            <Link href="/about" className="transition-colors hover:text-slate-900">About</Link>
            <Link href="/contact" className="transition-colors hover:text-slate-900">Contact</Link>
            <Link href="/profile" className="transition-colors hover:text-slate-900">Account</Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Support</p>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <p>Freshness guarantee</p>
            <p>Delivery tracking</p>
            <p>Order help</p>
            <p>Returns and refunds</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Weekly note</p>
          <p className="mt-2 text-lg font-black tracking-tight text-slate-900">
            Deals, bundles, and smarter restocks every week.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The storefront is now structured to support richer campaign UI and product storytelling.
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 pb-8 text-xs text-slate-500 sm:px-6 lg:px-8">
        <p>© 2026 TableEco Market. All rights reserved.</p>
        <p>Designed for a cleaner shopping experience.</p>
      </div>
    </footer>
  );
}
