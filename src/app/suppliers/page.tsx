"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Factory, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StoreLayout from "@/layouts/StoreLayout";

const PRIMARY = "#5a3ea8";

type Supplier = {
  id: number;
  name: string;
  category: string;
  moq: number;
  verified: boolean;
  rating: number;
};

const SUPPLIERS: Supplier[] = [
  { id: 101, name: "Nordic Surface Works", category: "Dining Tables", moq: 20, verified: true, rating: 4.9 },
  { id: 102, name: "UrbanPro Furnitech", category: "Office Furniture", moq: 50, verified: true, rating: 4.7 },
  { id: 103, name: "RawWood Global", category: "Solid Wood", moq: 30, verified: false, rating: 4.3 },
  { id: 104, name: "Prime Contract Interiors", category: "Hospitality", moq: 80, verified: true, rating: 4.8 },
];

export default function SuppliersPage() {
  const [rfqOpen, setRfqOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [rfqDraft, setRfqDraft] = useState({ quantity: "", specs: "", delivery: "", company: "" });

  const wholesaleTiers = useMemo(
    () => [
      { qty: "10-49", discount: "5%", support: "Standard" },
      { qty: "50-199", discount: "12%", support: "Priority" },
      { qty: "200+", discount: "18%", support: "Dedicated" },
    ],
    [],
  );

  return (
    <StoreLayout>
      <div className="py-3 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h4 className="text-2xl font-extrabold">Supplier Showcase</h4>
            <p className="text-muted-foreground">Discover verified manufacturers and request bulk quotes for your business procurement.</p>
          </div>
          <Button asChild style={{ backgroundColor: PRIMARY }}>
            <Link href="/business-registration">Register Business Account</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUPPLIERS.map((supplier) => (
            <div key={supplier.id} className="border rounded-xl bg-card shadow-sm p-4 flex flex-col gap-3 h-full">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "#f5f3ff" }}>
                <Factory className="h-5 w-5" style={{ color: PRIMARY }} />
              </div>
              <h6 className="font-bold text-base">{supplier.name}</h6>
              <p className="text-sm text-muted-foreground">Category: {supplier.category}</p>
              <div className="flex flex-row gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">MOQ {supplier.moq}</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "#f5f3ff", color: PRIMARY }}>{supplier.rating}★</span>
                {supplier.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium">
                    <CheckCircle2 className="h-3 w-3" />Verified
                  </span>
                ) : null}
              </div>
              <div className="flex flex-row gap-2 pt-2 mt-auto">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/suppliers/${supplier.id}`}>View Profile</Link>
                </Button>
                <Button
                  size="sm"
                  style={{ backgroundColor: PRIMARY }}
                  onClick={() => {
                    setSelectedSupplier(supplier);
                    setRfqOpen(true);
                  }}
                >
                  Request Quote
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border rounded-xl bg-card shadow-sm p-4">
          <h6 className="font-bold text-base">Wholesale Pricing Table</h6>
          <p className="text-sm text-muted-foreground mb-4">Volume pricing tiers for B2B buyers.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Quantity</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Support Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wholesaleTiers.map((tier) => (
                <TableRow key={tier.qty}>
                  <TableCell>{tier.qty}</TableCell>
                  <TableCell>{tier.discount}</TableCell>
                  <TableCell>{tier.support}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={rfqOpen} onOpenChange={setRfqOpen}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>RFQ - {selectedSupplier?.name || "Supplier"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="space-y-1">
              <Label>Company</Label>
              <Input value={rfqDraft.company} onChange={(e) => setRfqDraft((prev) => ({ ...prev, company: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Requested Quantity</Label>
              <Input value={rfqDraft.quantity} onChange={(e) => setRfqDraft((prev) => ({ ...prev, quantity: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Delivery Timeline</Label>
              <Input value={rfqDraft.delivery} onChange={(e) => setRfqDraft((prev) => ({ ...prev, delivery: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Specifications</Label>
              <Textarea rows={3} value={rfqDraft.specs} onChange={(e) => setRfqDraft((prev) => ({ ...prev, specs: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRfqOpen(false)}>Cancel</Button>
            <Button onClick={() => setRfqOpen(false)}>Submit RFQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StoreLayout>
  );
}
