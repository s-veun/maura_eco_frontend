"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface UserAvatarProps {
  /** The user's profile image URL, if any. */
  src?: string | null;
  /** Used to derive initials when no image is available. */
  name?: string | null;
  /** Pre-computed initials (takes priority over name). */
  initials?: string | null;
  size?: AvatarSize;
  className?: string;
  /** Extra ring/border class, e.g. "ring-2 ring-white" */
  ringClass?: string;
}

const SIZE_MAP: Record<AvatarSize, { wrapper: string; text: string; icon: number }> = {
  xs: { wrapper: "h-7 w-7",   text: "text-[10px]", icon: 14 },
  sm: { wrapper: "h-9 w-9",   text: "text-xs",     icon: 16 },
  md: { wrapper: "h-11 w-11", text: "text-sm",     icon: 20 },
  lg: { wrapper: "h-16 w-16", text: "text-xl",     icon: 28 },
  xl: { wrapper: "h-24 w-24", text: "text-3xl",    icon: 40 },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic hue from a string so the same user always gets the same colour. */
function getHueFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

/**
 * Reusable avatar component.
 *
 * Priority: profile image → initials → generic User icon
 */
export default function UserAvatar({
  src,
  name,
  initials: initialsOverride,
  size = "md",
  className = "",
  ringClass = "",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { wrapper, text, icon } = SIZE_MAP[size];

  const showImage = src && !imgError;

  // Derive initials
  const resolvedInitials =
    initialsOverride ||
    (name ? getInitials(name) : null);

  // Background colour derived from name for consistency
  const hue = name ? getHueFromString(name) : 220;
  const bgStyle = resolvedInitials
    ? { backgroundColor: `hsl(${hue},50%,55%)` }
    : undefined;

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-full ${wrapper} ${ringClass} ${className}`}
      style={!showImage ? bgStyle : undefined}
      aria-label={name || "User avatar"}
    >
      {showImage ? (
        <Image
          src={src}
          alt={name || "avatar"}
          fill
          unoptimized
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : resolvedInitials ? (
        <span className={`font-bold text-white leading-none ${text}`}>
          {resolvedInitials}
        </span>
      ) : (
        <span className="flex items-center justify-center w-full h-full bg-slate-300 dark:bg-slate-600">
          <User size={icon} className="text-slate-500 dark:text-slate-300" />
        </span>
      )}
    </span>
  );
}

