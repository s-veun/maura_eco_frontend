import StoreLayout from "@/layouts/StoreLayout";

export default function TermsPage() {
  return (
    <StoreLayout>
      <div className="max-w-2xl mx-auto py-8 md:py-12 space-y-4">
        <h1 className="text-3xl font-extrabold">Terms of Service</h1>
        <p className="text-muted-foreground">
          These terms govern business procurement through the TableEco platform, including quote acceptance,
          lead times, payment terms, and cancellation policies.
        </p>
        <p>
          By placing B2B orders, your organization agrees to purchase conditions, service-level timelines,
          and commercial invoice procedures communicated in order confirmations.
        </p>
      </div>
    </StoreLayout>
  );
}

