"use client";

import { memo } from "react";
import { Home, ShoppingBag, LayoutGrid, Headphones, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "@/components/error/not-found.module.css";
import { cn } from "@/lib/utils";

type ErrorActionsProps = {
  onBackHome: () => void;
  onContinueShopping: () => void;
  onViewCategories: () => void;
  onContactSupport: () => void;
  onGoBack: () => void;
};

function ErrorActionsComponent({ onBackHome, onContinueShopping, onViewCategories, onContactSupport, onGoBack }: ErrorActionsProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Button size="lg" className={cn("w-full", styles.primaryAction)} onClick={onBackHome}>
          <Home className="h-4 w-4 mr-2" />
          Back Home
        </Button>
        <Button size="lg" variant="outline" className={cn("w-full", styles.secondaryAction)} onClick={onContinueShopping}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
        <Button size="lg" variant="outline" className={cn("w-full", styles.secondaryAction)} onClick={onViewCategories}>
          <LayoutGrid className="h-4 w-4 mr-2" />
          View Categories
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button size="lg" variant="outline" className={cn("w-full", styles.secondaryAction)} onClick={onContactSupport}>
          <Headphones className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
        <Button size="lg" variant="outline" className={cn("w-full", styles.secondaryAction)} onClick={onGoBack}>
          <Undo2 className="h-4 w-4 mr-2" />
          Previous Page
        </Button>
      </div>
    </div>
  );
}

const ErrorActions = memo(ErrorActionsComponent);
export default ErrorActions;
