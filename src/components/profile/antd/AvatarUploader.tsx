"use client";

import { memo, useRef } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type AvatarUploaderProps = {
  src?: string;
  name?: string;
  loading?: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => void;
};

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function AvatarUploaderComponent({ src, name, loading = false, onUpload, onDelete }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="h-28 w-28">
        {src ? <AvatarImage src={src} alt={name || "Avatar"} /> : null}
        <AvatarFallback className="bg-[#f3eeff] text-[#5a3ea8] text-2xl font-bold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={loading} onClick={() => inputRef.current?.click()}>
          {loading ? (
            <div className="mr-2 h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <Camera className="mr-2 h-3.5 w-3.5" />
          )}
          Upload
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Remove
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">PNG/JPG up to 5MB. Drag/drop or select to upload.</p>
    </div>
  );
}

export const AvatarUploader = memo(AvatarUploaderComponent);
export default AvatarUploader;
