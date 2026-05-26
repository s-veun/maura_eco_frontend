"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";

type AddressItem = {
  addressId?: number;
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  district?: string;
  detailsAddress?: string;
};

type AddressCardProps = {
  address: AddressItem;
  isDefault?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
};

function AddressCardComponent({ address, isDefault = false, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className="border rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{address.fullName || "Address"}</span>
          {isDefault ? (
            <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium">
              Default
            </span>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{address.phoneNumber || "No phone"}</p>
        <p className="text-sm">{`${address.detailsAddress || ""}, ${address.district || ""}, ${address.city || ""}`}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
          {!isDefault ? (
            <Button size="sm" variant="ghost" onClick={onSetDefault}>
              Set default
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const AddressCard = memo(AddressCardComponent);
export default AddressCard;
