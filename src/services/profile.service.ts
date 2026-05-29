import type { AuthenticatedRequest } from "@/services/http";
import { requestJson } from "@/services/http";
import type { AuthUser } from "@/auth/types";

type ProfileEnvelope = {
  success?: boolean;
  message?: string;
  data?: AuthUser;
  user?: AuthUser;
} & Partial<AuthUser>;

const PROFILE_PATH = process.env.NEXT_PUBLIC_USER_PROFILE_PATH || "/users/profile";

function normalizeProfilePayload(payload: Partial<AuthUser>): AuthUser {
  const profileImageUrl =
    typeof payload.profileImageUrl === "string"
      ? payload.profileImageUrl
      : typeof payload.profileImage === "string"
        ? payload.profileImage
        : undefined;

  return {
    id: Number(payload.id ?? 0),
    username: String(payload.username || "user"),
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phoneNumber: payload.phoneNumber,
    role: String(payload.role || "USER"),
    provider: payload.provider,
    profileImage: profileImageUrl,
    profileImageUrl,
    createdAt: payload.createdAt,
    lastLoginAt: payload.lastLoginAt,
  };
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

function normalizeUpdatePayload(payload: UpdateProfilePayload): UpdateProfilePayload {
  const normalized: UpdateProfilePayload = {};

  if (typeof payload.username === "string") {
    const value = payload.username.trim();
    if (value) normalized.username = value;
  }
  if (typeof payload.email === "string") {
    const value = payload.email.trim();
    if (value) normalized.email = value;
  }
  if (typeof payload.phoneNumber === "string") {
    const value = payload.phoneNumber.trim();
    if (value) normalized.phoneNumber = value;
  }

  return normalized;
}

export async function getProfile(request: AuthenticatedRequest): Promise<AuthUser> {
  const response = await requestJson<ProfileEnvelope>(request, PROFILE_PATH, { method: "GET" });

  const payload = response.data || response.user || response;
  return normalizeProfilePayload(payload);
}

export async function updateProfile(
  request: AuthenticatedRequest,
  payload: UpdateProfilePayload,
): Promise<AuthUser> {
  const normalizedPayload = normalizeUpdatePayload(payload);
  if (!Object.keys(normalizedPayload).length) {
    throw new Error("Please provide at least one profile field to update.");
  }

  const response = await requestJson<ProfileEnvelope>(request, PROFILE_PATH, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedPayload),
  });

  const data = response.data || response.user || response;
  return normalizeProfilePayload(data);
}

export async function uploadAvatar(
  request: AuthenticatedRequest,
  file: File,
): Promise<{ profileImage?: string; imageUrl?: string; url?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  return requestJson<{ profileImage?: string; imageUrl?: string; url?: string }>(
    request,
    "/users/profile/image",
    { method: "POST", body: formData },
  );
}

export async function changePassword(
  request: AuthenticatedRequest,
  payload: { oldPassword: string; newPassword: string },
) {
  return requestJson<{ message?: string }>(request, "/users/profile/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
