"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, ShoppingCart, Heart, Clock,
  Package, TrendingUp, ArrowUpRight, RefreshCw,
  LogOut, User, Bell, CheckCircle, AlertCircle,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/auth/AuthProvider";
import { useToast } from "@/components/ui/toast-provider";
import StoreLayout from "@/layouts/StoreLayout";
import { Spotlight } from "@/components/aceternity/spotlight";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { cn } from "@/lib/utils";
import type { CartResponseDto, OrderResponseDto } from "@/lib/api";
import { getOrderHistory } from "@/services/order.service";
import { getCart } from "@/services/cart.service";
import { getWishlist } from "@/services/wishlist.service";

type WishlistResponse = { count: number; wishlist: Array<Record<string, unknown>> };

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function DashboardPage() {
  const {
    user, logout, isAuthenticated, isLoading, isProfileLoading,
    profileError, sessionStartedAt, refreshProfile, authenticatedFetch,
  } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [cart, setCart] = useState<CartResponseDto | null>(null);
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const notifications = useMemo(() => [
    { id: 1, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", title: "Session active", detail: "JWT authentication is valid" },
    { id: 2, icon: Package, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", title: "Order updates", detail: `${orders.length} order(s) loaded` },
    { id: 3, icon: Heart, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", title: "Wishlist", detail: `${wishlist?.count ?? 0} saved item(s)` },
  ], [orders.length, wishlist?.count]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    let active = true;
    const run = async () => {
      setDataLoading(true);
      setDataError(null);
      const [ordersResult, cartResult, wishlistResult] = await Promise.allSettled([
        getOrderHistory(authenticatedFetch, user.id),
        getCart(authenticatedFetch, user.id),
        getWishlist(authenticatedFetch),
      ]);
      if (!active) return;
      if (ordersResult.status === "fulfilled") setOrders(ordersResult.value);
      if (cartResult.status === "fulfilled") setCart(cartResult.value);
      if (wishlistResult.status === "fulfilled") setWishlist(wishlistResult.value as WishlistResponse);
      const failures = [ordersResult, cartResult, wishlistResult].filter((r) => r.status === "rejected");
      if (failures.length > 0) {
        const message = "Some dashboard sections failed to load.";
        setDataError(message);
        showToast({ type: "error", title: "Dashboard load warning", message });
      }
      setDataLoading(false);
    };
    run();
    return () => { active = false; };
  }, [authenticatedFetch, isAuthenticated, showToast, user?.id]);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "from-violet-500 to-indigo-600", bg: "bg-violet-500/10 border-violet-500/20" },
    { label: "Cart Items", value: cart?.items?.length || 0, icon: ShoppingCart, color: "from-blue-500 to-cyan-600", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Wishlist", value: wishlist?.count || 0, icon: Heart, color: "from-pink-500 to-rose-600", bg: "bg-pink-500/10 border-pink-500/20" },
    { label: "Session", value: sessionStartedAt ? "Active" : "—", icon: Clock, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10 border-emerald-500/20" },
  ];

  const orderStatusColor = (status: string) => {
    if (status?.toLowerCase().includes("complet")) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    if (status?.toLowerCase().includes("cancel")) return "bg-red-500/15 text-red-400 border-red-500/30";
    if (status?.toLowerCase().includes("pend")) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  };

  const isPageLoading = isLoading || isProfileLoading || dataLoading;

  return (
    <ProtectedRoute>
      <StoreLayout>
        <div className="relative min-h-screen bg-slate-950 text-white">
          <Spotlight className="hidden lg:block -top-40 -right-10" fill="indigo" />

          <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-1">My Account</p>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back{user?.firstName ? `, ${user.firstName}` : user?.username ? `, ${user.username}` : ""}
                </h1>
                <p className="text-slate-400 text-sm mt-1">Here&apos;s what&apos;s happening with your account today.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refreshProfile()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white text-sm transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>

            {/* Errors */}
            {profileError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {profileError}
              </div>
            )}
            {dataError && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {dataError}
              </div>
            )}

            {/* Stats cards */}
            {isPageLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl border border-white/5 bg-slate-900/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    custom={i}
                    className={cn("relative rounded-2xl border p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-200 cursor-default", stat.bg)}
                  >
                    <div className={cn("w-10 h-10 rounded-xl bg-linear-to-br flex items-center justify-center mb-3 shadow-lg", stat.color)}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Orders table */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="rounded-2xl border border-white/5 bg-slate-900/50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-violet-400" />
                      <h2 className="font-semibold text-white">Order History</h2>
                    </div>
                    <span className="text-xs text-slate-500">{orders.length} orders</span>
                  </div>
                  {isPageLoading ? (
                    <div className="p-6 space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 rounded-lg bg-slate-800/60 animate-pulse" />)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                      <ShoppingBag className="w-8 h-8 text-slate-600 mb-3" />
                      <p className="text-slate-400 text-sm">No orders yet</p>
                      <a href="/products" className="mt-3 text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors">
                        Start shopping →
                      </a>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Order ID</th>
                            <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Status</th>
                            <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Total</th>
                            <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/4">
                          {orders.map((order) => (
                            <tr key={order.orderId} className="hover:bg-white/2 transition-colors">
                              <td className="px-6 py-3 text-sm font-mono text-slate-300">#{order.orderId}</td>
                              <td className="px-4 py-3">
                                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", orderStatusColor(order.status))}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-white">${order.totalAmount.toFixed(2)}</td>
                              <td className="px-4 py-3 text-xs text-slate-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                {/* Profile card */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="rounded-2xl border border-white/5 bg-slate-900/50 p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
                      {user?.firstName?.[0] ?? user?.username?.[0] ?? "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user?.username}</p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href="/profile" className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all">
                      <span className="flex items-center gap-2"><User className="w-4 h-4 text-violet-400" /> Edit Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                    <a href="/orders" className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all">
                      <span className="flex items-center gap-2"><Package className="w-4 h-4 text-blue-400" /> My Orders</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="rounded-2xl border border-white/5 bg-slate-900/50 overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
                    <Bell className="w-4 h-4 text-violet-400" />
                    <h2 className="font-semibold text-white text-sm">Notifications</h2>
                  </div>
                  <div className="divide-y divide-white/4">
                    {notifications.map((n) => (
                      <div key={n.id} className={cn("flex items-start gap-3 px-5 py-3 border rounded-none", n.bg)}>
                        <n.icon className={cn("w-4 h-4 mt-0.5 shrink-0", n.color)} />
                        <div>
                          <p className="text-white text-xs font-medium">{n.title}</p>
                          <p className="text-slate-400 text-xs">{n.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </ProtectedRoute>
  );
}
