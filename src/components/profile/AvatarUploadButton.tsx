"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

interface AvatarUploadButtonProps {
  src?: string | null;
  name?: string | null;
  onUpload: (file: File) => Promise<void>;
  onInvalidFile?: (message: string) => void;
  size?: "lg" | "xl" | "2xl";
  disabled?: boolean;
}

const SIZE_CLASSES = {
  lg: "h-20 w-20",
  xl: "h-28 w-28",
  "2xl": "h-36 w-36",
};

const AVATAR_SIZE_MAP = {
  lg: "lg" as const,
  xl: "xl" as const,
  "2xl": "xl" as const,
};

export default function AvatarUploadButton({
  src,
  name,
  onUpload,
  onInvalidFile,
  size = "xl",
  disabled = false,
}: AvatarUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      onInvalidFile?.("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onInvalidFile?.("Image must be 5MB or smaller.");
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      // Don't clean up objectUrl right away - let it show until the new src loads
    }

    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  const displaySrc = previewUrl || src;

  return (
    <div className="relative inline-block group">
      <div className={`${SIZE_CLASSES[size]} relative rounded-full overflow-hidden ring-4 ring-white shadow-xl`}>
        <UserAvatar
          src={displaySrc}
          name={name}
          size={AVATAR_SIZE_MAP[size]}
          className="w-full h-full"
        />
      </div>

      {/* Upload overlay */}
      {!disabled && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all duration-200 group-hover:bg-black/40 focus:bg-black/40 focus:outline-none"
          aria-label="Change profile photo"
        >
          <span className="flex flex-col items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {uploading ? (
              <Loader2 size={20} className="text-white animate-spin" />
            ) : (
              <>
                <Camera size={20} className="text-white" />
                <span className="text-[10px] font-semibold text-white">Change</span>
              </>
            )}
          </span>
        </button>
      )}

      {/* Small camera badge */}
      {!disabled && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#5b3ea8] text-white shadow-lg transition hover:bg-[#7c5bc4] disabled:opacity-60"
          aria-label="Upload photo"
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Camera size={14} />
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
}
