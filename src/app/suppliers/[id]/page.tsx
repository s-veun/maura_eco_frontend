"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import StoreLayout from "@/layouts/StoreLayout";

const PRIMARY = "#5a3ea8";

export default function SupplierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <StoreLayout>
      <div className="py-3 flex flex-col gap-4">
        <h4 className="text-2xl font-extrabold">Supplier Profile #{id}</h4>
        <p className="text-muted-foreground">Company capabilities, certifications, and fulfillment profile.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <div className="border rounded-xl bg-card shadow-sm p-4">
              <h6 className="font-bold text-base">Company Overview</h6>
              <p className="text-sm text-muted-foreground mt-2">
                ISO-certified B2B supplier specializing in modern table systems for hospitality,
                office, and residential distributors.
              </p>
              <div className="flex flex-row gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">ISO 9001</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium">
                  <CheckCircle2 className="h-3 w-3" />Verified
                </span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "#f5f3ff", color: PRIMARY }}>MOQ 50</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="border rounded-xl bg-card shadow-sm p-4">
              <h6 className="font-bold text-base">Quick Actions</h6>
              <div className="flex flex-col gap-3 mt-3">
                <Button asChild style={{ backgroundColor: PRIMARY }}>
                  <Link href="/suppliers">Request Quote</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Supplier</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <div className="border rounded-xl bg-card shadow-sm p-4">
              <h6 className="font-bold text-base">Production Capability</h6>
              <dl className="mt-2 divide-y divide-border">
                <div className="py-2 flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium text-sm w-48">Lead Time</dt>
                  <dd className="text-sm text-muted-foreground">2-4 weeks based on capacity</dd>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium text-sm w-48">Monthly Output</dt>
                  <dd className="text-sm text-muted-foreground">1,200 units</dd>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-medium text-sm w-48">Custom Branding</dt>
                  <dd className="text-sm text-muted-foreground">Available for orders over MOQ</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
