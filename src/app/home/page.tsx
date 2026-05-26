import Link from "next/link";
import { Button } from "@/components/ui/button";
import StoreLayout from "@/layouts/StoreLayout";

export default function HomePage() {
  return (
    <StoreLayout>
      <div className="border rounded-lg bg-card shadow-sm p-4">
        <div className="flex flex-col gap-4">
          <h4 className="text-2xl font-bold">TableEco Storefront</h4>
          <p className="text-muted-foreground">Modern premium furniture ecommerce built fully with Tailwind CSS and shadcn/ui.</p>
          <Button asChild>
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    </StoreLayout>
  );
}
