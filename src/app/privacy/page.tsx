import StoreLayout from "@/layouts/StoreLayout";

export default function PrivacyPage() {
  return (
    <StoreLayout>
      <div className="max-w-2xl mx-auto py-8 md:py-12 space-y-4">
        <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          We process account, order, and logistics data to provide secure ecommerce operations for buyers and suppliers.
        </p>
        <p>
          Business contact details, billing data, and procurement history are stored and handled in accordance with
          applicable privacy regulations and internal security standards.
        </p>
      </div>
    </StoreLayout>
  );
}

