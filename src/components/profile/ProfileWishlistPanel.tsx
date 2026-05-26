"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { WishlistPreviewItem } from "@/services/account.service";

function formatDate(value?: string) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ProfileWishlistPanelProps {
  items: WishlistPreviewItem[];
}

export default function ProfileWishlistPanel({ items }: ProfileWishlistPanelProps) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            Wishlist
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            Saved items
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {items.length} saved
        </span>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
            <Heart className="size-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">No saved items yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Add products to your wishlist to keep track of favorites and future buys.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const href = item.productId ? `/products/${item.productId}` : "/products";

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[28px] border border-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
              >
                <div className="relative aspect-[4/3] bg-slate-50">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Heart className="size-10" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    {item.categoryName || "Saved item"}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-lg font-black tracking-tight text-slate-900">
                    {item.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xl font-black text-slate-900">
                        {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : "Price unavailable"}
                      </p>
                      {formatDate(item.addedAt) ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Saved {formatDate(item.addedAt)}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href={href}
                      className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
