"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Search, Truck, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { useGetOrderHistoryQuery } from "@/redux/api/orderApi";
import StoreLayout from "@/layouts/StoreLayout";

const PRIMARY = "#5a3ea8";

const STATUSES = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

type StatusFilter = (typeof STATUSES)[number];

export default function MyOrdersPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const { data: orders = [], isLoading, isFetching, refetch } = useGetOrderHistoryQuery(user?.id ?? 0, {
    skip: !user?.id,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      const statusMatch = status === "ALL" || order.status === status;
      const queryMatch =
        !q ||
        String(order.orderId).includes(q) ||
        order.status.toLowerCase().includes(q) ||
        order.items.some((item) => item.productName.toLowerCase().includes(q));
      return statusMatch && queryMatch;
    });
  }, [orders, search, status]);

  if (!isAuthenticated) {
    return (
      <StoreLayout>
        <div className="py-3">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3">
            Please sign in to view your orders.
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="py-3 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <BoxHeader />
          <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>Refresh</Button>
        </div>

        <div className="border rounded-lg bg-card shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by order ID, status, or product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="md:col-span-4">
              <Select value={status} onValueChange={(val) => setStatus(val as StatusFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-muted rounded-xl h-[180px] w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3">
            No matching orders found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((order) => (
              <div key={order.orderId} className="border rounded-xl bg-card shadow-sm p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row justify-between items-center">
                    <span className="text-lg font-extrabold">Order #{order.orderId}</span>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: "#f5f3ff", color: PRIMARY }}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleString()} • {order.items.length} items
                  </p>
                  <p className="font-bold">Total ${order.totalAmount.toFixed(2)}</p>
                  <div className="flex flex-row gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/orders/${order.orderId}`}>
                        <Receipt className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/tracking/${order.orderId}`}>
                        <Truck className="h-4 w-4 mr-1" />
                        Track
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}

function BoxHeader() {
  return (
    <div className="flex flex-col">
      <h4 className="text-2xl font-extrabold">My Orders</h4>
      <p className="text-muted-foreground">Track every purchase, invoice, and shipment from your business account.</p>
    </div>
  );
}
