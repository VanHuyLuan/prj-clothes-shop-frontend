"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Plus, Edit2, Trash2, Save, X, Mail, Phone, UserCircle, Calendar, Lock, Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApiService, Address } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import { set } from "date-fns";

export default function AccountPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthday: "",
    gender: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Vietnam",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to view your account");
      router.push("/login");
    }
  }, [user, router]);

  // Load addresses and initialize profile data
  useEffect(() => {
    if (user) {
      loadAddresses();
      // Initialize profile data with current user info
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        birthday: user.birthday || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getAddresses();
      setAddresses(data);
    } catch (error: any) {
      console.error("Error loading addresses:", error);
      toast.error("Could not load addresses", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      if (!formData.street || !formData.city || !formData.state || !formData.zip) {
        toast.error("Please fill in all required fields");
        return;
      }

      await ApiService.createAddress(formData);
      toast.success("Address added successfully");
      setIsAddDialogOpen(false);
      setFormData({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "Vietnam",
      });
      loadAddresses();
    } catch (error: any) {
      console.error("Error adding address:", error);
      toast.error("Could not add address", {
        description: error.message || "Please try again later",
      });
    }
  };

  const handleUpdateAddress = async (id: string) => {
    try {
      if (!formData.street || !formData.city || !formData.state || !formData.zip) {
        toast.error("Please fill in all required fields");
        return;
      }

      await ApiService.updateAddress(id, formData);
      toast.success("Address updated successfully");
      setEditingAddressId(null);
      setFormData({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "Vietnam",
      });
      loadAddresses();
    } catch (error: any) {
      console.error("Error updating address:", error);
      toast.error("Could not update address", {
        description: error.message || "Please try again later",
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await ApiService.deleteAddress(id);
      toast.success("Address deleted");
      loadAddresses();
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast.error("Could not delete address", {
        description: error.message || "Please try again later",
      });
    }
  };

  const startEditing = (address: Address) => {
    setEditingAddressId(address.id);
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });
  };

  const cancelEditing = () => {
    setEditingAddressId(null);
    setFormData({
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Vietnam",
    });
  };

  const startEditingProfile = () => {
    setIsEditingProfile(true);
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      birthday: user?.birthday || "",
      gender: user?.gender || "",
    });
  };

  const cancelEditingProfile = () => {
    setIsEditingProfile(false);
    setProfileData({
      firstName: "",
      lastName: "",
      phone: "",
      birthday: "",
      gender: "",
    });
  };

  const handleUpdateProfile = async () => {
    try {
      if (!profileData.firstName || !profileData.lastName) {
        toast.error("Please enter your full name");
        return;
      }

      // Validate phone number format if provided
      if (profileData.phone && !/^[0-9+\s()-]+$/.test(profileData.phone)) {
        toast.error("Invalid phone number");
        return;
      }

      if (!user?.id) return;

      const updateData = {
        firstname: profileData.firstName,
        lastname: profileData.lastName,
        phone: profileData.phone,
        birthday: profileData.birthday,
        gender: profileData.gender,
        email: user.email || "",
      };
      
      console.log(" Updating user with data:", updateData);

      const response = await ApiService.updateUser(updateData);

      console.log(" Update API response:", response);
      console.log(" Birthday in response:", response.birthdate);
      console.log(" Gender in response:", response.gender);
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
      
      // Refresh user data
      console.log(" Calling refreshUser...");
      if (refreshUser) {
        await refreshUser();
        console.log(" RefreshUser completed");
      } else {
        console.warn(" refreshUser is not available");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Could not update profile", {
        description: error.message || "Please try again later",
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }

      // Check if new password is different from current
      if (passwordData.newPassword === passwordData.currentPassword) {
        toast.error("New password must differ from current password");
        return;
      }

      if (!user?.id) return;

      // Call API to change password
      await ApiService.changeUserPassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error("Could not change password", {
        description: error.message || "Current password is incorrect",
      });
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file format", {
        description: "Please choose an image file (JPEG, PNG, GIF or WebP)",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image size must be under 5MB",
      });
      return;
    }

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChangeAvatar = async () => {
    try {
      if (!avatarFile) {
        toast.error("Please select an avatar image");
        return;
      }

      setIsUploadingAvatar(true);

      // Upload to Cloudinary first
      const uploadResult = await ApiService.uploadImage(avatarFile, 'avatars');
      
      // Then save URL to database
      await ApiService.setAvatar(uploadResult.url);
      
      toast.success("Avatar updated successfully");
      setIsAvatarDialogOpen(false);
      setAvatarFile(null);
      setAvatarPreview("");
      
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error: any) {
      console.error("Error changing avatar:", error);
      toast.error("Could not update avatar", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          {/* Avatar Header */}
          <div className="mb-8 flex items-center gap-4">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={user.avatar || ""} alt={user.username} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-primary">
                    <Edit2 className="mr-2 h-3 w-3" />
                    Edit avatar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change avatar</DialogTitle>
                    <DialogDescription>
                      Choose a new profile picture
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex justify-center">
                      <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={avatarPreview || user.avatar || ""} alt="Preview" />
                        <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <Label htmlFor="avatarFile">Choose image</Label>
                      <Input
                        id="avatarFile"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleAvatarFileChange}
                        className="mt-2"
                        disabled={isUploadingAvatar}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        JPEG, PNG, GIF or WebP. Max 5MB
                      </p>
                    </div>
                    <Button 
                      onClick={handleChangeAvatar} 
                      className="w-full"
                      disabled={!avatarFile || isUploadingAvatar}
                    >
                      {isUploadingAvatar ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Uploading...
                        </>
                      ) : (
                        "Update avatar"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="text-base">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="text-base">
                <Lock className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="addresses" className="text-base">
                <MapPin className="mr-2 h-4 w-4" />
                Addresses
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                      <h2 className="text-xl font-bold mb-2">Personal info</h2>
                      <p className="text-sm text-muted-foreground">
                        Your personal details
                      </p>
                    </div>

                    {/* Right Form */}
                    <div className="flex-1 max-w-2xl">
                      <div className="space-y-6">
                        {/* Full Name */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-base font-semibold">
                              First name
                            </Label>
                            <Input
                              id="firstName"
                              placeholder="First name"
                              value={profileData.firstName}
                              onChange={(e) => {
                                setProfileData({
                                  ...profileData,
                                  firstName: e.target.value,
                                });
                              }}
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="class" className="text-base font-semibold">
                              Last name
                            </Label>
                           <Input
                              id="lastName"
                              placeholder=""
                              value={profileData.lastName}
                              onChange={(e) => {
                                setProfileData({
                                  ...profileData,
                                  lastName: e.target.value,
                                });
                              }}
                              className="h-11"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-base font-semibold">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="h-11 bg-muted/50"
                          />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-base font-semibold">
                            Phone number
                          </Label>
                          <Input
                            id="phone"
                            placeholder="0968325837"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({ ...profileData, phone: e.target.value })
                            }
                            className="h-11"
                          />
                        </div>

                        {/* Birthday and Gender */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="birthday" className="text-base font-semibold">
                              Date of birth
                            </Label>
                            <Input
                              id="birthday"
                              type="date"
                              value={profileData.birthday}
                              onChange={(e) =>
                                setProfileData({ ...profileData, birthday: e.target.value })
                              }
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender" className="text-base font-semibold">
                              Gender
                            </Label>
                            <Input
                              id="gender"
                              placeholder="Male/Female/Other"
                              value={profileData.gender}
                              onChange={(e) =>
                                setProfileData({ ...profileData, gender: e.target.value })
                              }
                              className="h-11"
                            />
                          </div>
                        </div>

                        {/* Address - Read Only */}
                        {addresses.length > 0 && (
                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-base font-semibold">
                              Address
                            </Label>
                            <Input
                              id="address"
                              value={`${addresses[0].street}, ${addresses[0].state}, ${addresses[0].city}, ${addresses[0].zip} - ${addresses[0].country}`}
                              disabled
                              className="h-11 bg-muted/50"
                            />
                            <p className="text-xs text-muted-foreground">
                              To change your address, go to the &quot;Addresses&quot; tab
                            </p>
                          </div>
                        )}

                        {/* Save Button */}
                        <div className="flex justify-end pt-4">
                          <Button 
                            onClick={handleUpdateProfile} 
                            size="lg"
                            className="px-8"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                      <h2 className="text-xl font-bold mb-2">Security</h2>
                      <p className="text-sm text-muted-foreground">
                        Change your password to keep your account secure
                      </p>
                    </div>

                    {/* Right Form */}
                    <div className="flex-1 max-w-2xl">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-base font-semibold">
                            Current password *
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPasswords.current ? "text" : "password"}
                              placeholder="Enter current password"
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({ ...passwordData, currentPassword: e.target.value })
                              }
                              className="pr-10 h-11"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() =>
                                setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                              }
                            >
                              {showPasswords.current ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-base font-semibold">
                            New password *
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              placeholder="Enter new password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                              }
                              className="pr-10 h-11"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() =>
                                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                              }
                            >
                              {showPasswords.new ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-base font-semibold">
                            Confirm new password *
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              placeholder="Confirm new password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                              }
                              className="pr-10 h-11"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() =>
                                setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                              }
                            >
                              {showPasswords.confirm ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button 
                            onClick={handleChangePassword} 
                            size="lg"
                            className="px-8"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="h-6 w-6" />
                      Shipping addresses
                    </CardTitle>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add address
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add new address</DialogTitle>
                          <DialogDescription>
                            Enter your shipping address details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="street">Street *</Label>
                            <Input
                              id="street"
                              placeholder="House number, street name..."
                              value={formData.street}
                              onChange={(e) =>
                                setFormData({ ...formData, street: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                placeholder="Ho Chi Minh"
                                value={formData.city}
                                onChange={(e) =>
                                  setFormData({ ...formData, city: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">District *</Label>
                              <Input
                                id="state"
                                placeholder="District 1"
                                value={formData.state}
                                onChange={(e) =>
                                  setFormData({ ...formData, state: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="zip">ZIP code *</Label>
                              <Input
                                id="zip"
                                placeholder="700000"
                                value={formData.zip}
                                onChange={(e) =>
                                  setFormData({ ...formData, zip: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country *</Label>
                              <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) =>
                                  setFormData({ ...formData, country: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <Button onClick={handleAddAddress} className="w-full">
                            Add address
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">
                        You have no saved addresses yet
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add your first address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {addresses.map((address) => (
                        <Card key={address.id} className="border-2 hover:border-primary/50 transition-colors">
                          <CardContent className="p-5">
                            {editingAddressId === address.id ? (
                              <div className="space-y-3">
                                <Input
                                  placeholder="Street"
                                  value={formData.street}
                                  onChange={(e) =>
                                    setFormData({ ...formData, street: e.target.value })
                                  }
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={(e) =>
                                      setFormData({ ...formData, city: e.target.value })
                                    }
                                  />
                                  <Input
                                    placeholder="District"
                                    value={formData.state}
                                    onChange={(e) =>
                                      setFormData({ ...formData, state: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    placeholder="ZIP code"
                                    value={formData.zip}
                                    onChange={(e) =>
                                      setFormData({ ...formData, zip: e.target.value })
                                    }
                                  />
                                  <Input
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={(e) =>
                                      setFormData({ ...formData, country: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateAddress(address.id)}
                                    className="flex-1"
                                  >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEditing}
                                    className="flex-1"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col h-full min-h-[140px]">
                                <div className="flex-1 mb-4 space-y-2">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="font-semibold text-base leading-tight mb-2">
                                        {address.street}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {address.state}, {address.city}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {address.zip} - {address.country}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-3 border-t">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEditing(address)}
                                    className="flex-1"
                                  >
                                    <Edit2 className="mr-1 h-3 w-3" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteAddress(address.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
