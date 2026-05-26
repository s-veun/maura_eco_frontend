"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoreLayout from "@/layouts/StoreLayout";

const PRIMARY = "#5a3ea8";

export default function BusinessRegistrationPage() {
  const [draft, setDraft] = useState({
    companyName: "",
    businessEmail: "",
    phone: "",
    industry: "",
    annualVolume: "",
    procurementNeeds: "",
  });
  const [submitted, setSubmitted] = useState(false);

  return (
    <StoreLayout>
      <div className="max-w-2xl mx-auto py-8">
        <div className="border rounded-2xl bg-card shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <BoxHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Company Name</Label>
                <Input value={draft.companyName} onChange={(e) => setDraft((prev) => ({ ...prev, companyName: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Business Email</Label>
                <Input type="email" value={draft.businessEmail} onChange={(e) => setDraft((prev) => ({ ...prev, businessEmail: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={draft.phone} onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Industry</Label>
                <Select value={draft.industry} onValueChange={(val) => setDraft((prev) => ({ ...prev, industry: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Estimated Annual Purchase Volume</Label>
                <Input value={draft.annualVolume} onChange={(e) => setDraft((prev) => ({ ...prev, annualVolume: e.target.value }))} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Procurement Requirements</Label>
                <Textarea rows={3} value={draft.procurementNeeds} onChange={(e) => setDraft((prev) => ({ ...prev, procurementNeeds: e.target.value }))} />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 text-sm">
              After review, your team receives business pricing and RFQ dashboard access.
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                Business registration submitted successfully.
              </div>
            ) : null}

            <Button
              style={{ backgroundColor: PRIMARY }}
              onClick={() => setSubmitted(true)}
            >
              Submit Business Application
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

function BoxHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-2xl font-extrabold">Business Registration</h4>
      <p className="text-muted-foreground">Apply for a verified B2B account with bulk pricing and dedicated procurement support.</p>
    </div>
  );
}
