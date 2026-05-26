"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { updateProfile, uploadAvatar, type UpdateProfilePayload } from "@/services/profile.service";
import { useToast } from "@/components/ui/toast-provider";
import type { AuthUser } from "@/auth/types";

export function useProfileActions() {
  const { authenticatedFetch, refreshProfile, user } = useAuth();
  const { showToast } = useToast();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleUpdateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<AuthUser | null> => {
      setIsSavingProfile(true);
      try {
        const updated = await updateProfile(authenticatedFetch, payload);
        // Refresh profile to sync auth context
        await refreshProfile();
        showToast({ title: "Profile updated", type: "success" });
        return updated;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update profile.";
        showToast({ title: "Update failed", message, type: "error" });
        return null;
      } finally {
        setIsSavingProfile(false);
      }
    },
    [authenticatedFetch, refreshProfile, showToast],
  );

  const handleUploadAvatar = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploadingAvatar(true);
      try {
        const res = await uploadAvatar(authenticatedFetch, file);
        const url = res.profileImage || res.imageUrl || res.url || null;
        const refreshedUser = await refreshProfile();
        showToast({ title: "Avatar updated!", type: "success" });
        return url || refreshedUser?.profileImage || null;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to upload avatar.";
        showToast({ title: "Upload failed", message, type: "error" });
        return null;
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [authenticatedFetch, refreshProfile, showToast],
  );

  return {
    user,
    isSavingProfile,
    isUploadingAvatar,
    handleUpdateProfile,
    handleUploadAvatar,
  };
}
