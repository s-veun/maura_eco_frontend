"use client";

import Link from "next/link";
import { ChevronRight, Package2 } from "lucide-react";
import type { OrderResponseDto } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SHIPPED: "bg-sky-50 text-sky-700 border-sky-200",
  OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  COMPLETED: "bg-teal-50 text-teal-700 border-teal-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-zinc-50 text-zinc-700 border-zinc-200",
  RETURNED: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ProfileOrdersPanelProps {
  orders: OrderResponseDto[];
}

export default function ProfileOrdersPanel({ orders }: ProfileOrdersPanelProps) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            My orders
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            Recent purchases
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {orders.length} total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
            <Package2 className="size-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">No orders yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Once you place an order, it will appear here with tracking access.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.slice(0, 6).map((order) => (
            <article
              key={order.orderId}
              className="rounded-[28px] border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-black tracking-tight text-slate-900">
                      Order #{order.orderId}
                    </h3>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${
                        STATUS_STYLES[order.status] || "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {formatDate(order.orderDate)} • {order.items.length} items
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xl font-black tracking-tight text-slate-900">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  <Link
                    href={`/orders/${order.orderId}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    View details
                    <ChevronRight className="size-4" />
                  </Link>
                  <Link
                    href={`/tracking/${order.orderId}`}
                    className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Track order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
