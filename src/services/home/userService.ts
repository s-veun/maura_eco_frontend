import type { UserProfileResponse } from "@/lib/api";
import type { HeaderNotification } from "@/types/homepage";
import { homeApiClient } from "@/services/home/apiClient";

export const userService = {
  async getProfile(): Promise<UserProfileResponse | null> {
    try {
      return await homeApiClient.get<UserProfileResponse>("/user/profile");
    } catch {
      return null;
    }
  },

  async getNotifications(): Promise<HeaderNotification[]> {
    try {
      const payload = await homeApiClient.get<Array<Record<string, unknown>>>("/notifications");
      return payload.slice(0, 6).map((item, index) => ({
        id: String(item.id || `n-${index}`),
        title: String(item.title || "TableEco update"),
        description: String(item.message || "New activity in your account."),
        createdAt: String(item.createdAt || new Date().toISOString()),
        read: Boolean(item.read),
        href: typeof item.href === "string" ? item.href : undefined,
      }));
    } catch {
      return [
        {
          id: "fallback-1",
          title: "Flash sale started",
          description: "Limited stock deals are now live.",
          createdAt: new Date().toISOString(),
          read: false,
          href: "/products?tab=flash-sale",
        },
      ];
    }
  },
};

export default userService;

