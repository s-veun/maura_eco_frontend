"use client";

import { memo, useState } from "react";
import { Edit, Lock, LogOut, Camera, ChevronDown } from "lucide-react";
import type { AuthUser } from "@/auth/types";
import AvatarUploader from "@/components/profile/antd/AvatarUploader";

type ProfileHeroCardProps = {
  user: AuthUser;
  fullName: string;
  completion: number;
  joinedDate: string;
  lastLogin: string;
  uploadingAvatar: boolean;
  onUploadAvatar: (file: File) => Promise<void>;
  onDeleteAvatar: () => void;
  onAction: (action: "edit" | "password" | "upload" | "logout") => void;
};

function ProfileHeroCardComponent({
  user,
  fullName,
  completion,
  joinedDate,
  lastLogin,
  uploadingAvatar,
  onUploadAvatar,
  onDeleteAvatar,
  onAction,
}: ProfileHeroCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="rounded-[18px] p-5 text-white"
      style={{ background: "linear-gradient(135deg, #5a3ea8 0%, #7a62c0 100%)" }}
    >
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex flex-wrap items-start gap-4">
          <AvatarUploader
            src={user.profileImageUrl || user.profileImage}
            name={fullName}
            loading={uploadingAvatar}
            onUpload={onUploadAvatar}
            onDelete={onDeleteAvatar}
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold text-white">{fullName}</h3>
            <p className="text-white/90">@{user.username}</p>
            <p className="text-white/85">{user.email || "No email"}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-xs font-medium text-white">
                {user.role}
              </span>
              <span className="inline-flex items-center text-xs text-white/90">
                <span className="mr-1 h-2 w-2 rounded-full bg-[#d7c9ff] inline-block" />
                Joined: {joinedDate}
              </span>
              <span className="inline-flex items-center text-xs text-white/90">
                <span className="mr-1 h-2 w-2 rounded-full bg-[#b4ffca] inline-block" />
                Last login: {lastLogin}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-1 text-sm font-bold text-white hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Account Actions <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 z-50 min-w-[180px] rounded-lg border bg-white shadow-xl text-foreground">
              {(
                [
                  { key: "edit", label: "Edit Profile", icon: Edit },
                  { key: "password", label: "Change Password", icon: Lock },
                  { key: "upload", label: "Upload Avatar", icon: Camera },
                ] as const
              ).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                  onClick={() => {
                    onAction(key);
                    setMenuOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
              <hr className="border-border" />
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                onClick={() => {
                  onAction("logout");
                  setMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-4 w-full">
        <div className="flex justify-between text-sm">
          <span className="text-white/90">Profile Completion</span>
          <span className="font-bold text-white">{completion}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full">
          <div
            className="h-full bg-[#efe8ff] rounded-full transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export const ProfileHeroCard = memo(ProfileHeroCardComponent);
export default ProfileHeroCard;
