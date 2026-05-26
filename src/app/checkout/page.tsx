"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { useGetCartQuery } from "@/redux/api/productApi";
import { useCheckoutMutation } from "@/redux/api/orderApi";
import { useGetAddressesQuery, useAddAddressMutation } from "@/redux/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoreLayout from "@/layouts/StoreLayout";
import { getApiErrorMessage } from "@/lib/api-error";

const PRIMARY = "#5a3ea8";

type BillingDraft = {
  companyName: string;
  vatNumber: string;
  contactPerson: string;
  email: string;
  sameAsShipping: boolean;
};

type CheckoutSnackbar = {
  open: boolean;
  severity: "success" | "error" | "info";
  message: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const userId = user?.id || 0;
  const { data: cart, isLoading: isCartLoading } = useGetCartQuery(userId, { skip: !user?.id });
  const { data: addressesResponse = [] } = useGetAddressesQuery(userId, { skip: !user?.id });
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("INVOICE_NET_30");
  const [couponCode, setCouponCode] = useState("");
  const [snackbar, setSnackbar] = useState<CheckoutSnackbar>({ open: false, severity: "info", message: "" });
  const [addressForm, setAddressForm] = useState({ fullName: "", phoneNumber: "", city: "", district: "", detailsAddress: "" });
  const [billing, setBilling] = useState<BillingDraft>({
    companyName: "",
    vatNumber: "",
    contactPerson: String(user?.username || ""),
    email: String(user?.email || ""),
    sameAsShipping: true,
  });

  const addresses = useMemo(() => (Array.isArray(addressesResponse) ? addressesResponse : []), [addressesResponse]);
  const effectiveSelectedAddressId = selectedAddressId ?? (addresses[0]?.addressId as number | undefined) ?? null;

  const paymentOptions = [
    { key: "INVOICE_NET_30", label: "Invoice (Net 30)", desc: "Recommended for verified B2B buyers" },
    { key: "BANK_TRANSFER", label: "Bank Transfer", desc: "Process after finance confirmation" },
    { key: "CARD", label: "Corporate Credit Card", desc: "Instant authorization" },
  ] as const;

  if (!isAuthenticated) {
    return (
      <StoreLayout>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3">
          Please sign in to continue checkout.
        </div>
      </StoreLayout>
    );
  }

  const handleCheckout = async () => {
    if (!effectiveSelectedAddressId || !user?.id) return;
    try {
      const result = await checkout({
        userId: user.id,
        couponCode: couponCode || undefined,
      }).unwrap();

      const resultRecord = typeof result === "object" && result ? (result as Record<string, unknown>) : null;
      const orderRef =
        (typeof resultRecord?.orderId === "number" && String(resultRecord.orderId)) ||
        (typeof resultRecord?.id === "number" && String(resultRecord.id)) ||
        "";

      setSnackbar({ open: true, severity: "success", message: "Order submitted. Redirecting to confirmation..." });
      setActiveStep(2);
      router.push(`/checkout/success${orderRef ? `?orderRef=${encodeURIComponent(orderRef)}` : ""}`);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Checkout failed. Please verify your details and retry.");
      setSnackbar({ open: true, severity: "error", message });
      router.push(`/checkout/failure?reason=${encodeURIComponent(message)}`);
    }
  };

  const handleAddAddress = async () => {
    if (!user?.id) return;
    try {
      const res = await addAddress({ ...addressForm, userId: user.id }).unwrap();
      if (res && typeof res === "object" && "addressId" in res) {
        setSelectedAddressId((res as { addressId: number }).addressId);
        setSnackbar({ open: true, severity: "success", message: "Shipping address saved." });
      }
    } catch (err: unknown) {
      setSnackbar({ open: true, severity: "error", message: getApiErrorMessage(err, "Failed to add address.") });
    }
  };

  const isCartEmpty = !cart || !cart.items || cart.items.length === 0;
  const STEPS = ["Shipping", "Payment", "Review"];

  return (
    <StoreLayout>
      <div className="py-3 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h4 className="text-2xl font-extrabold">B2B Checkout</h4>
            <p className="text-muted-foreground">Complete shipping, billing, and procurement payment details.</p>
          </div>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#f5f3ff", color: PRIMARY }}>
            Secure Checkout
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${idx <= activeStep ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-muted-foreground/30 text-muted-foreground"}`}>
                  {idx + 1}
                </div>
                <span className="text-xs mt-1">{step}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 ${idx < activeStep ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {isCheckingOut ? (
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse w-full" />
          </div>
        ) : null}

        {/* Toast notification */}
        {snackbar.open ? (
          <div className={`rounded-lg px-4 py-3 text-sm border ${snackbar.severity === "success" ? "bg-green-50 border-green-200 text-green-800" : snackbar.severity === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
            {snackbar.message}
          </div>
        ) : null}

        {isCartLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-muted rounded-xl h-[220px] w-full" />
            ))}
          </div>
        ) : isCartEmpty ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 text-sm">
            Your cart is empty. Add products before checkout.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Shipping address */}
              <div className="border rounded-xl bg-card shadow-sm p-4">
                <h6 className="text-base font-bold mb-3">Shipping Address</h6>
                <div className="mb-3">
                  <Select
                    value={String(effectiveSelectedAddressId || "")}
                    onValueChange={(val) => setSelectedAddressId(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose existing address" />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={String(address.addressId)} value={String(address.addressId)}>
                          {String(address.fullName)} - {String(address.city)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Full Name</Label>
                    <Input value={addressForm.fullName} onChange={(e) => setAddressForm((c) => ({ ...c, fullName: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Phone</Label>
                    <Input value={addressForm.phoneNumber} onChange={(e) => setAddressForm((c) => ({ ...c, phoneNumber: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>City</Label>
                    <Input value={addressForm.city} onChange={(e) => setAddressForm((c) => ({ ...c, city: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>District</Label>
                    <Input value={addressForm.district} onChange={(e) => setAddressForm((c) => ({ ...c, district: e.target.value }))} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label>Address Details</Label>
                    <Textarea rows={2} value={addressForm.detailsAddress} onChange={(e) => setAddressForm((c) => ({ ...c, detailsAddress: e.target.value }))} />
                  </div>
                </div>
                <Button variant="outline" className="mt-3" disabled={isAdding} onClick={handleAddAddress}>
                  Save Shipping Address
                </Button>
              </div>

              {/* Billing information */}
              <div className="border rounded-xl bg-card shadow-sm p-4">
                <h6 className="text-base font-bold mb-3">Billing Information</h6>
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={billing.sameAsShipping}
                    onChange={(e) => setBilling((prev) => ({ ...prev, sameAsShipping: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Billing address same as shipping</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Company Name</Label>
                    <Input value={billing.companyName} onChange={(e) => setBilling((prev) => ({ ...prev, companyName: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>VAT / Tax Number</Label>
                    <Input value={billing.vatNumber} onChange={(e) => setBilling((prev) => ({ ...prev, vatNumber: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Contact Person</Label>
                    <Input value={billing.contactPerson} onChange={(e) => setBilling((prev) => ({ ...prev, contactPerson: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Billing Email</Label>
                    <Input value={billing.email} onChange={(e) => setBilling((prev) => ({ ...prev, email: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="border rounded-xl bg-card shadow-sm p-4">
                <h6 className="text-base font-bold mb-3">Payment Method</h6>
                <div className="flex flex-col gap-3">
                  {paymentOptions.map((method) => (
                    <button
                      key={method.key}
                      type="button"
                      onClick={() => setPaymentMethod(method.key)}
                      className={`border rounded-xl p-3 text-left transition-colors ${paymentMethod === method.key ? "border-primary" : "border-border"}`}
                    >
                      <div className="flex flex-row items-center justify-between">
                        <div>
                          <p className="font-bold text-sm">{method.label}</p>
                          <p className="text-xs text-muted-foreground">{method.desc}</p>
                        </div>
                        <div className={`h-4 w-4 rounded-full border-2 ${paymentMethod === method.key ? "border-primary bg-primary" : "border-muted-foreground"}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-4 lg:sticky top-24 border rounded-xl bg-card shadow-sm p-4">
              <h6 className="text-base font-bold">Order Summary</h6>
              <div className="flex flex-col gap-2 mt-3">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex flex-row justify-between items-start gap-3">
                    <span className="text-sm text-muted-foreground">{item.productName} x{item.quantity}</span>
                    <span className="text-sm font-bold">${item.subTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-border my-3" />

              <div className="space-y-1">
                <Label>Coupon Code</Label>
                <Input className="h-8" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <div className="flex flex-row justify-between">
                  <span className="text-muted-foreground text-sm">Subtotal</span>
                  <span className="text-sm">${cart?.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-muted-foreground text-sm">Shipping</span>
                  <span className="text-sm">$0.00</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="text-muted-foreground text-sm">Payment</span>
                  <span className="text-sm">{paymentOptions.find((item) => item.key === paymentMethod)?.label}</span>
                </div>
                <hr className="border-border" />
                <div className="flex flex-row justify-between">
                  <span className="font-extrabold">Grand Total</span>
                  <span className="font-extrabold">${cart?.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-4"
                disabled={isCheckingOut}
                style={{ backgroundColor: PRIMARY }}
                onClick={handleCheckout}
              >
                Confirm Order
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                By placing this order you agree to business procurement terms and billing policies.
              </p>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
