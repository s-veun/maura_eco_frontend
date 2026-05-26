"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectCurrentUser } from "@/redux/slices/authSlice";
import {
  useUpdateOrderStatusMutation,
  useGetOrderHistoryQuery,
  useGetOrderStatusHistoryQuery,
} from "@/redux/api/orderApi";
import { Receipt, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StoreLayout from "@/layouts/StoreLayout";
import { useAuth } from "@/auth/AuthProvider";
import { cancelOrder } from "@/services/order.service";
import { useToast } from "@/components/ui/toast-provider";

const PRIMARY = "#5a3ea8";
const ORDER_FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

function resolveActiveStep(status: string) {
  const upper = status.toUpperCase();
  const index = ORDER_FLOW.findIndex((item) => item === upper);
  if (index >= 0) return index;
  if (upper === "CANCELLED") return 0;
  return 0;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { authenticatedFetch } = useAuth();
  const { showToast } = useToast();
  const id = params?.id;
  const orderId = Number(id);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const userId = user?.id ?? 0;

  const { data: orders = [] } = useGetOrderHistoryQuery(userId, { skip: !user?.id });
  const { data: statusHistory = [] } = useGetOrderStatusHistoryQuery(orderId, { skip: Number.isNaN(orderId) });
  const order = orders.find(o => o.orderId === orderId);

  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [isCancelling, setIsCancelling] = useState(false);

  const [showStatusConsole, setShowStatusConsole] = useState(false);
  const [newStatus, setNewStatus] = useState("PROCESSING");
  const [note, setNote] = useState("");

  if (!isAuthenticated) {
    return (
      <StoreLayout>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3">
          Please sign in to view order details.
        </div>
      </StoreLayout>
    );
  }

  const handleStatusUpdate = async () => {
    try {
      await updateStatus({
        orderId,
        body: {
          status: newStatus,
          note: note || `Manual override via Command Console`,
          updatedBy: user?.username || "ADMIN"
        }
      }).unwrap();
      setShowStatusConsole(false);
      setNote("");
      showToast({ type: "success", title: "Status updated", message: "Order status updated." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Status synchronization failed.";
      showToast({ type: "error", title: "Status update failed", message });
    }
  };

  const handleCancelOrder = async () => {
    if (!order || order.status === "CANCELLED") return;
    setIsCancelling(true);
    try {
      await cancelOrder(authenticatedFetch, order.orderId);
      showToast({ type: "success", title: "Order cancelled", message: `Order #${order.orderId} has been cancelled.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to cancel order";
      showToast({ type: "error", title: "Cancel failed", message });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    const invoiceLines = [
      `Invoice for Order #${order.orderId}`,
      `Date: ${new Date(order.orderDate).toLocaleString()}`,
      `Status: ${order.status}`,
      "",
      "Items:",
      ...order.items.map((item) => `${item.productName} x${item.quantity} - $${item.subTotal.toFixed(2)}`),
      "",
      `Total: $${order.totalAmount.toFixed(2)}`,
    ];
    const blob = new Blob([invoiceLines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-order-${order.orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!order) {
    return (
      <StoreLayout>
        <div className="border rounded-lg bg-card shadow-sm p-4">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 mb-3">
            Order not found for ID: {String(id)}
          </div>
          <Button onClick={() => window.history.back()}>Back</Button>
        </div>
      </StoreLayout>
    );
  }

  const activeStep = resolveActiveStep(order.status);

  return (
    <StoreLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="border rounded-lg bg-card shadow-sm p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h4 className="text-2xl font-bold">Order #{order.orderId}</h4>
              <p className="text-muted-foreground">Placed on {new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div className="flex flex-row flex-wrap gap-2 items-start">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: "#f5f3ff", color: PRIMARY }}>
                {order.status}
              </span>
              <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                <Receipt className="h-4 w-4 mr-1" />Invoice
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/tracking/${order.orderId}`)}>
                <Truck className="h-4 w-4 mr-1" />Track
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowStatusConsole((c) => !c)}>
                Update status
              </Button>
              <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" disabled={isCancelling || order.status === "CANCELLED"} onClick={handleCancelOrder}>
                <XCircle className="h-4 w-4 mr-1" />Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="border rounded-lg bg-card shadow-sm p-4">
          <h6 className="text-base font-semibold mb-4">Order Status Timeline</h6>
          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-4 overflow-x-auto pb-2">
            {ORDER_FLOW.map((step, idx) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${idx <= activeStep ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-muted-foreground/30 text-muted-foreground"}`}>
                    {idx + 1}
                  </div>
                  <span className="text-xs mt-1 text-center">{step}</span>
                </div>
                {idx < ORDER_FLOW.length - 1 && (
                  <div className={`h-0.5 flex-1 min-w-[20px] ${idx < activeStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <hr className="border-border my-4" />

          <div className="flex flex-col gap-3">
            {(Array.isArray(statusHistory) && statusHistory.length > 0 ? statusHistory : [{ status: order.status, updatedAt: order.orderDate }]).map((row, idx) => {
              const payload = row as Record<string, unknown>;
              return (
                <div key={`${String(payload.status || "status")}-${idx}`}>
                  <p className="font-bold">{String(payload.status || "UPDATED")}</p>
                  <p className="text-sm text-muted-foreground">
                    {payload.updatedAt ? new Date(String(payload.updatedAt)).toLocaleString() : "Time unavailable"}
                  </p>
                  {payload.note ? <p className="text-sm">{String(payload.note)}</p> : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Console */}
        {showStatusConsole ? (
          <div className="border rounded-lg bg-card shadow-sm p-4">
            <div className="flex flex-col gap-4">
              <h6 className="text-base font-semibold">Status Console</h6>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="New status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
              <Button disabled={isUpdating} onClick={handleStatusUpdate}>Save status</Button>
            </div>
          </div>
        ) : null}

        {/* Items table */}
        <div className="border rounded-lg bg-card shadow-sm p-4">
          <h6 className="text-base font-semibold mb-3">Items</h6>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.subTotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="border rounded-lg bg-card shadow-sm p-4">
          <h6 className="text-base font-semibold">Summary</h6>
          <p className="mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
          <p className="text-muted-foreground">Authorized by: {String(user?.username || "System")}</p>
        </div>
      </div>
    </StoreLayout>
  );
}
