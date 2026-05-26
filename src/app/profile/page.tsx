"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Lock, Menu, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast-provider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/auth/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { useProfileWorkspace } from "@/hooks/useProfileWorkspace";
import { useProfileActions } from "@/hooks/useProfileActions";
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
  useAddAddressMutation,
} from "@/redux/api/authApi";
import { useRemoveFromWishlistMutation } from "@/redux/api/productApi";
import ProfileHeroCard from "@/components/profile/antd/ProfileHeroCard";
import StatsGrid from "@/components/profile/antd/StatsGrid";
import OrderHistoryTable from "@/components/profile/antd/OrderHistoryTable";
import AddressCard from "@/components/profile/antd/AddressCard";
import WishlistGrid from "@/components/profile/antd/WishlistGrid";
import ActivityTimeline from "@/components/profile/antd/ActivityTimeline";
import CartSummaryWidget from "@/components/profile/antd/CartSummaryWidget";

type AddressFormValues = {
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  detailsAddress: string;
};

function formatDate(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString();
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileDashboard />
    </ProtectedRoute>
  );
}

function ProfileDashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, sessionStartedAt, logout } = useAuth();
  const { addToCart } = useCart();
  const { handleUploadAvatar, handleUpdateProfile } = useProfileActions();
  const {
    activeTab,
    setActiveTab,
    isProfileLoading,
    isDataLoading,
    isChangingPassword,
    orders,
    wishlist,
    summary,
    handlePasswordChange,
    refreshCollections,
  } = useProfileWorkspace();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [securityModal, setSecurityModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [notificationsState, setNotificationsState] = useState({
    email: true,
    sms: false,
    marketing: true,
    orderUpdates: true,
    security: true,
  });

  // Profile form state
  const [profileDraft, setProfileDraft] = useState({
    firstName: "", lastName: "", username: "", email: "", phoneNumber: "", company: "", gender: "", birthday: "", bio: "",
  });

  // Password form state
  const [passwordDraft, setPasswordDraft] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  // Address form state
  const [addressDraft, setAddressDraft] = useState<AddressFormValues>({
    fullName: "", phoneNumber: "", city: "", district: "", detailsAddress: "",
  });

  const userId = Number(user?.id || 0);

  const {
    data: addresses = [],
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = useGetAddressesQuery(userId, { skip: !userId });
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeletingAddress }] = useDeleteAddressMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "User";
  const joinedDate = formatDate(user?.createdAt);
  const lastLogin = formatDate(user?.lastLoginAt || (sessionStartedAt ? new Date(sessionStartedAt).toISOString() : undefined));

  const activities = useMemo(
    () => [
      `Last login at ${lastLogin}`,
      `Orders in account: ${summary.ordersCount}`,
      `Wishlist products: ${summary.wishlistCount}`,
      `Cart items: ${summary.cartItemsCount}`,
      `Profile completion: ${summary.profileCompletion}%`,
    ],
    [lastLogin, summary.cartItemsCount, summary.ordersCount, summary.profileCompletion, summary.wishlistCount],
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h3 className="text-xl font-bold">Unauthorized</h3>
        <p className="text-muted-foreground">Please login to continue</p>
        <Button onClick={() => router.push("/login")}>Go Login</Button>
      </div>
    );
  }

  const openEditProfile = () => {
    setProfileDraft({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      company: "",
      gender: "",
      birthday: "",
      bio: "",
    });
    setEditingProfile(true);
  };

  const handleProfileSave = async () => {
    const updated = await handleUpdateProfile({
      username: profileDraft.username,
      email: profileDraft.email,
      phoneNumber: profileDraft.phoneNumber,
    });
    if (updated) {
      showToast({ type: "success", title: "Profile updated", message: "Profile updated successfully" });
      setEditingProfile(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("Image must be less than 5MB.");
      await handleUploadAvatar(file);
      showToast({ type: "success", title: "Avatar updated", message: "Avatar uploaded successfully" });
    } catch (error) {
      showToast({ type: "error", title: "Upload failed", message: error instanceof Error ? error.message : "Unknown upload error" });
      throw error;
    }
  };

  const handleAvatarDelete = async () => {
    showToast({ type: "info", title: "Avatar remove", message: "Please upload a new avatar to replace current image." });
  };

  const handleProfileAction = async (action: "edit" | "password" | "upload" | "logout") => {
    if (action === "edit") { openEditProfile(); return; }
    if (action === "password") { setSecurityModal(true); return; }
    if (action === "upload") {
      showToast({ type: "info", title: "Upload avatar", message: "Use the upload button in hero section." });
      return;
    }
    await logout();
    router.replace("/login");
  };

  const submitPasswordChange = async () => {
    if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      showToast({ type: "error", title: "Password mismatch", message: "Passwords do not match" });
      return;
    }
    await handlePasswordChange(passwordDraft);
    showToast({ type: "success", title: "Password changed", message: "Password changed successfully" });
    setPasswordDraft({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setSecurityModal(false);
  };

  const openAddressModal = (address?: Record<string, unknown>) => {
    if (address && typeof address.addressId === "number") {
      setEditingAddressId(address.addressId);
      setAddressDraft({
        fullName: String(address.fullName || ""),
        phoneNumber: String(address.phoneNumber || ""),
        city: String(address.city || ""),
        district: String(address.district || ""),
        detailsAddress: String(address.detailsAddress || ""),
      });
    } else {
      setEditingAddressId(null);
      setAddressDraft({ fullName: "", phoneNumber: "", city: "", district: "", detailsAddress: "" });
    }
    setAddressModal(true);
  };

  const submitAddress = async () => {
    if (editingAddressId) {
      await updateAddress({ addressId: editingAddressId, body: addressDraft }).unwrap();
      showToast({ type: "success", title: "Address updated", message: "Address updated" });
    } else {
      await addAddress({ ...addressDraft, userId }).unwrap();
      showToast({ type: "success", title: "Address added", message: "Address added" });
    }
    setAddressModal(false);
    setEditingAddressId(null);
    setAddressDraft({ fullName: "", phoneNumber: "", city: "", district: "", detailsAddress: "" });
    void refetchAddresses();
  };

  const removeAddress = async (addressId: number) => {
    await deleteAddress(addressId).unwrap();
    showToast({ type: "success", title: "Address removed", message: "Address removed" });
    void refetchAddresses();
  };

  const setDefaultAddress = () => {
    showToast({ type: "info", title: "Default address", message: "Default address feature can be persisted once backend default-address endpoint is available." });
  };

  const removeWishlistItem = async (productId?: number) => {
    if (!productId) return;
    try {
      await removeFromWishlist(productId).unwrap();
      showToast({ type: "success", title: "Removed", message: "Removed from wishlist" });
      void refreshCollections();
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to remove wishlist item" });
    }
  };

  const addWishlistItemToCart = async (productId?: number) => {
    if (!productId) return;
    try {
      await addToCart(productId, 1);
      showToast({ type: "success", title: "Added to cart", message: "Added to cart" });
    } catch {
      showToast({ type: "error", title: "Error", message: "Failed to add to cart" });
    }
  };

  const loading = isProfileLoading || isDataLoading;

  const TAB_KEYS = ["profile", "settings", "orders", "wishlist", "notifications", "addresses", "payment", "preferences"] as const;
  const TAB_LABELS: Record<string, string> = {
    profile: "Personal Information", settings: "Security Settings", orders: "Orders History",
    wishlist: "Wishlist", notifications: "Notifications", addresses: "Address Book",
    payment: "Payment Methods", preferences: "Account Preferences",
  };

  return (
    <div className="min-h-screen" style={{ background: "#f7f8fc" }}>
      <div className="py-5 px-4 pb-7">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-xl font-bold m-0">My Account Dashboard</h3>
            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-4 w-4 mr-1" />Menu
            </Button>
          </div>

          <ProfileHeroCard
            user={user}
            fullName={fullName}
            completion={summary.profileCompletion}
            joinedDate={joinedDate}
            lastLogin={lastLogin}
            uploadingAvatar={false}
            onUploadAvatar={handleAvatarUpload}
            onDeleteAvatar={handleAvatarDelete}
            onAction={(action) => void handleProfileAction(action)}
          />

          <StatsGrid
            orders={summary.ordersCount}
            wishlist={summary.wishlistCount}
            cartItems={summary.cartItemsCount}
            reviews={orders.length}
            addresses={addresses.length}
            completion={summary.profileCompletion}
            rewardPoints={Math.max(0, summary.ordersCount * 25)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-16">
              {loading ? (
                <div className="border rounded-xl bg-card shadow-sm p-8 flex justify-center">
                  <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={(key) => setActiveTab(key as typeof activeTab)}>
                  <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
                    {TAB_KEYS.map((key) => (
                      <TabsTrigger key={key} value={key} className="text-xs">{TAB_LABELS[key]}</TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Personal Information */}
                  <TabsContent value="profile">
                    <div className="border rounded-xl bg-card shadow-sm p-4 mt-2">
                      <div className="grid grid-cols-2 gap-3 divide-y divide-border">
                        {[
                          ["First Name", user.firstName || "-"],
                          ["Last Name", user.lastName || "-"],
                          ["Username", user.username || "-"],
                          ["Email", user.email || "-"],
                          ["Phone", user.phoneNumber || "-"],
                          ["Company", "-"],
                          ["Gender", "-"],
                          ["Birthday", "-"],
                        ].map(([label, value]) => (
                          <div key={label} className="py-2 flex flex-col">
                            <span className="text-xs text-muted-foreground">{label}</span>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ))}
                        <div className="py-2 flex flex-col col-span-2">
                          <span className="text-xs text-muted-foreground">Bio</span>
                          <span className="text-sm font-medium">-</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={openEditProfile}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => void refreshCollections()}>
                          <RefreshCw className="h-4 w-4 mr-1" />Refresh
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Security Settings */}
                  <TabsContent value="settings">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2">
                      <div className="border rounded-xl bg-card shadow-sm p-4">
                        <h6 className="font-semibold mb-3">Security Controls</h6>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Two-factor authentication</span>
                            <input type="checkbox" role="switch" className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary cursor-pointer" />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Security alerts</span>
                            <input type="checkbox" role="switch" defaultChecked className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary cursor-pointer" />
                          </div>
                          <Button size="sm" onClick={() => setSecurityModal(true)}>
                            <Lock className="h-4 w-4 mr-1" />Change Password
                          </Button>
                        </div>
                      </div>
                      <div className="border rounded-xl bg-card shadow-sm p-4">
                        <h6 className="font-semibold mb-3">Login Activity</h6>
                        <div className="flex flex-col gap-3">
                          {activities.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="mt-1 h-2 w-2 rounded-full flex-shrink-0" style={{ background: "#5a3ea8" }} />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Orders History */}
                  <TabsContent value="orders">
                    <div className="mt-2">
                      <OrderHistoryTable orders={orders} loading={loading} />
                    </div>
                  </TabsContent>

                  {/* Wishlist */}
                  <TabsContent value="wishlist">
                    <div className="mt-2">
                      <WishlistGrid items={wishlist} onAddToCart={addWishlistItemToCart} onRemove={removeWishlistItem} />
                    </div>
                  </TabsContent>

                  {/* Notifications */}
                  <TabsContent value="notifications">
                    <div className="border rounded-xl bg-card shadow-sm p-4 mt-2">
                      <div className="flex flex-col gap-3">
                        {(Object.entries(notificationsState) as [keyof typeof notificationsState, boolean][]).map(([key, checked]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()} notifications</span>
                            <input
                              type="checkbox"
                              role="switch"
                              checked={checked}
                              onChange={(e) => setNotificationsState((prev) => ({ ...prev, [key]: e.target.checked }))}
                              className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary cursor-pointer"
                            />
                          </div>
                        ))}
                        <Button size="sm" onClick={() => showToast({ type: "success", title: "Saved", message: "Notification settings saved" })}>
                          <Bell className="h-4 w-4 mr-1" />Save Preferences
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Address Book */}
                  <TabsContent value="addresses">
                    <div className="flex flex-col gap-3 mt-2">
                      <div className="flex justify-between items-center">
                        <h5 className="text-base font-semibold mb-0">Address Management</h5>
                        <Button size="sm" onClick={() => openAddressModal()}>Add Address</Button>
                      </div>

                      {isAddressesLoading ? (
                        <div className="animate-pulse bg-muted rounded h-24 w-full" />
                      ) : addresses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No address found</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {addresses.map((address, index) => (
                            <AddressCard
                              key={String((address as Record<string, unknown>).addressId || index)}
                              address={address as Record<string, unknown>}
                              isDefault={index === 0}
                              onEdit={() => openAddressModal(address as Record<string, unknown>)}
                              onDelete={() => {
                                const id = Number((address as Record<string, unknown>).addressId || 0);
                                if (id) void removeAddress(id);
                              }}
                              onSetDefault={setDefaultAddress}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Payment Methods */}
                  <TabsContent value="payment">
                    <div className="border rounded-xl bg-card shadow-sm p-6 mt-2 text-center">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium mb-3">Coming Soon</span>
                      <h6 className="font-semibold">Payment Methods</h6>
                      <p className="text-sm text-muted-foreground">Enterprise card and invoice method management will appear here.</p>
                    </div>
                  </TabsContent>

                  {/* Account Preferences */}
                  <TabsContent value="preferences">
                    <div className="border rounded-xl bg-card shadow-sm p-4 mt-2">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Dark mode</span>
                          <input type="checkbox" role="switch" className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary cursor-pointer" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Compact dashboard cards</span>
                          <input type="checkbox" role="switch" defaultChecked className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary cursor-pointer" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Auto refresh account widgets</span>
                          <input type="checkbox" role="switch" defaultChecked className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary cursor-pointer" />
                        </div>
                        <Button size="sm" onClick={() => showToast({ type: "success", title: "Saved", message: "Preferences saved" })}>
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <CartSummaryWidget
                items={summary.cartItemsCount}
                total={summary.cartTotal}
                wishlist={summary.wishlistCount}
                orders={summary.ordersCount}
              />
              <ActivityTimeline items={activities} />
              <div className="border rounded-xl bg-card shadow-sm p-4">
                <div className="flex flex-col gap-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium w-fit" style={{ color: "#5a3ea8" }}>
                    Authentication Security
                  </span>
                  <p className="text-xs text-muted-foreground">JWT token lifecycle is managed globally with auto refresh and logout on expiration.</p>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-3 py-2 text-xs">
                    <div className="flex gap-1 items-center font-semibold">
                      <ShieldCheck className="h-3 w-3" />401/403 handling active
                    </div>
                    <p>Unauthorized sessions are redirected to login automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(isDeletingAddress || isAddingAddress || isUpdatingAddress || isChangingPassword) ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 text-sm">
              Saving changes...
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Profile Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-4">
            {TAB_KEYS.map((key) => (
              <Button
                key={key}
                variant={activeTab === key ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(key as typeof activeTab);
                  setMobileOpen(false);
                }}
              >
                {TAB_LABELS[key]}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Profile Modal */}
      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Personal Information</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="space-y-1">
              <Label>First Name</Label>
              <Input value={profileDraft.firstName} onChange={(e) => setProfileDraft((p) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Last Name</Label>
              <Input value={profileDraft.lastName} onChange={(e) => setProfileDraft((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Username *</Label>
              <Input value={profileDraft.username} onChange={(e) => setProfileDraft((p) => ({ ...p, username: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={profileDraft.email} onChange={(e) => setProfileDraft((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={profileDraft.phoneNumber} onChange={(e) => setProfileDraft((p) => ({ ...p, phoneNumber: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Company</Label>
              <Input value={profileDraft.company} onChange={(e) => setProfileDraft((p) => ({ ...p, company: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <Input value={profileDraft.gender} onChange={(e) => setProfileDraft((p) => ({ ...p, gender: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Birthday</Label>
              <Input value={profileDraft.birthday} onChange={(e) => setProfileDraft((p) => ({ ...p, birthday: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Bio</Label>
              <Textarea rows={3} value={profileDraft.bio} onChange={(e) => setProfileDraft((p) => ({ ...p, bio: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
            <Button onClick={() => void handleProfileSave()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={securityModal} onOpenChange={setSecurityModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="space-y-1">
              <Label>Current Password *</Label>
              <Input type="password" value={passwordDraft.oldPassword} onChange={(e) => setPasswordDraft((p) => ({ ...p, oldPassword: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>New Password * (min 6 chars)</Label>
              <Input type="password" value={passwordDraft.newPassword} onChange={(e) => setPasswordDraft((p) => ({ ...p, newPassword: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Confirm Password *</Label>
              <Input type="password" value={passwordDraft.confirmPassword} onChange={(e) => setPasswordDraft((p) => ({ ...p, confirmPassword: e.target.value }))} />
            </div>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-3 py-2 text-xs flex gap-2 items-center">
              <ShieldCheck className="h-4 w-4 flex-shrink-0" />
              Use a strong password with uppercase, lowercase, and numbers.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSecurityModal(false)}>Cancel</Button>
            <Button onClick={() => void submitPasswordChange()}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Address Modal */}
      <Dialog open={addressModal} onOpenChange={setAddressModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddressId ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="space-y-1">
              <Label>Full Name *</Label>
              <Input value={addressDraft.fullName} onChange={(e) => setAddressDraft((p) => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={addressDraft.phoneNumber} onChange={(e) => setAddressDraft((p) => ({ ...p, phoneNumber: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>City *</Label>
              <Input value={addressDraft.city} onChange={(e) => setAddressDraft((p) => ({ ...p, city: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>District *</Label>
              <Input value={addressDraft.district} onChange={(e) => setAddressDraft((p) => ({ ...p, district: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Details Address *</Label>
              <Textarea rows={3} value={addressDraft.detailsAddress} onChange={(e) => setAddressDraft((p) => ({ ...p, detailsAddress: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressModal(false)}>Cancel</Button>
            <Button onClick={() => void submitAddress()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
