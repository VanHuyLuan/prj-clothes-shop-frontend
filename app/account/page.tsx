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
      toast.error("Vui lòng đăng nhập để xem tài khoản");
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
      toast.error("Không thể tải danh sách địa chỉ", {
        description: error.message || "Vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      if (!formData.street || !formData.city || !formData.state || !formData.zip) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      await ApiService.createAddress(formData);
      toast.success("Thêm địa chỉ thành công");
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
      toast.error("Không thể thêm địa chỉ", {
        description: error.message || "Vui lòng thử lại sau",
      });
    }
  };

  const handleUpdateAddress = async (id: string) => {
    try {
      if (!formData.street || !formData.city || !formData.state || !formData.zip) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      await ApiService.updateAddress(id, formData);
      toast.success("Cập nhật địa chỉ thành công");
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
      toast.error("Không thể cập nhật địa chỉ", {
        description: error.message || "Vui lòng thử lại sau",
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      return;
    }

    try {
      await ApiService.deleteAddress(id);
      toast.success("Xóa địa chỉ thành công");
      loadAddresses();
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast.error("Không thể xóa địa chỉ", {
        description: error.message || "Vui lòng thử lại sau",
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
        toast.error("Vui lòng điền đầy đủ họ tên");
        return;
      }

      // Validate phone number format if provided
      if (profileData.phone && !/^[0-9+\s()-]+$/.test(profileData.phone)) {
        toast.error("Số điện thoại không hợp lệ");
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
      toast.success("Cập nhật thông tin thành công");
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
      toast.error("Không thể cập nhật thông tin", {
        description: error.message || "Vui lòng thử lại sau",
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Mật khẩu mới không khớp");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
      }

      // Check if new password is different from current
      if (passwordData.newPassword === passwordData.currentPassword) {
        toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
        return;
      }

      if (!user?.id) return;

      // Call API to change password
      await ApiService.changeUserPassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      
      toast.success("Đổi mật khẩu thành công");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error("Không thể đổi mật khẩu", {
        description: error.message || "Mật khẩu hiện tại không đúng",
      });
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Định dạng file không hợp lệ", {
        description: "Vui lòng chọn file ảnh (JPEG, PNG, GIF hoặc WebP)",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File quá lớn", {
        description: "Kích thước ảnh phải nhỏ hơn 5MB",
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
        toast.error("Vui lòng chọn ảnh đại diện");
        return;
      }

      setIsUploadingAvatar(true);

      // Upload to Cloudinary first
      const uploadResult = await ApiService.uploadImage(avatarFile, 'avatars');
      
      // Then save URL to database
      await ApiService.setAvatar(uploadResult.url);
      
      toast.success("Cập nhật ảnh đại diện thành công");
      setIsAvatarDialogOpen(false);
      setAvatarFile(null);
      setAvatarPreview("");
      
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error: any) {
      console.error("Error changing avatar:", error);
      toast.error("Không thể cập nhật ảnh đại diện", {
        description: error.message || "Vui lòng thử lại sau",
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
                    Chỉnh sửa ảnh đại diện
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
                    <DialogDescription>
                      Chọn ảnh đại diện mới của bạn
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
                      <Label htmlFor="avatarFile">Chọn ảnh</Label>
                      <Input
                        id="avatarFile"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleAvatarFileChange}
                        className="mt-2"
                        disabled={isUploadingAvatar}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        JPEG, PNG, GIF hoặc WebP. Tối đa 5MB
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
                          Đang tải lên...
                        </>
                      ) : (
                        "Cập nhật ảnh đại diện"
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
                Thông tin của bạn
              </TabsTrigger>
              <TabsTrigger value="security" className="text-base">
                <Lock className="mr-2 h-4 w-4" />
                Bảo mật
              </TabsTrigger>
              <TabsTrigger value="addresses" className="text-base">
                <MapPin className="mr-2 h-4 w-4" />
                Địa chỉ
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                      <h2 className="text-xl font-bold mb-2">Thông tin cá nhân</h2>
                      <p className="text-sm text-muted-foreground">
                        Chi tiết thông tin cá nhân của bạn
                      </p>
                    </div>

                    {/* Right Form */}
                    <div className="flex-1 max-w-2xl">
                      <div className="space-y-6">
                        {/* Full Name */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-base font-semibold">
                              Họ và tên đệm
                            </Label>
                            <Input
                              id="firstName"
                              placeholder="hệ"
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
                              Tên
                            </Label>
                           <Input
                              id="lastName"
                              placeholder="hệ"
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
                            Số điện thoại
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
                              Ngày sinh
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
                              Giới tính
                            </Label>
                            <Input
                              id="gender"
                              placeholder="Nam/Nữ/Khác"
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
                              Địa chỉ
                            </Label>
                            <Input
                              id="address"
                              value={`${addresses[0].street}, ${addresses[0].state}, ${addresses[0].city}, ${addresses[0].zip} - ${addresses[0].country}`}
                              disabled
                              className="h-11 bg-muted/50"
                            />
                            <p className="text-xs text-muted-foreground">
                              Để thay đổi địa chỉ, vui lòng chuyển sang tab "Địa chỉ"
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
                            Lưu thông tin
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
                      <h2 className="text-xl font-bold mb-2">Bảo mật</h2>
                      <p className="text-sm text-muted-foreground">
                        Thay đổi mật khẩu để bảo vệ tài khoản của bạn
                      </p>
                    </div>

                    {/* Right Form */}
                    <div className="flex-1 max-w-2xl">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-base font-semibold">
                            Mật khẩu hiện tại *
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPasswords.current ? "text" : "password"}
                              placeholder="Nhập mật khẩu hiện tại"
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
                            Mật khẩu mới *
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              placeholder="Nhập mật khẩu mới"
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
                            Xác nhận mật khẩu *
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              placeholder="Nhập lại mật khẩu mới"
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
                            Lưu thông tin
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
                      Địa chỉ giao hàng
                    </CardTitle>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm địa chỉ
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                          <DialogDescription>
                            Nhập thông tin địa chỉ giao hàng của bạn
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="street">Địa chỉ *</Label>
                            <Input
                              id="street"
                              placeholder="Số nhà, tên đường..."
                              value={formData.street}
                              onChange={(e) =>
                                setFormData({ ...formData, street: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">Thành phố *</Label>
                              <Input
                                id="city"
                                placeholder="Hồ Chí Minh"
                                value={formData.city}
                                onChange={(e) =>
                                  setFormData({ ...formData, city: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">Quận/Huyện *</Label>
                              <Input
                                id="state"
                                placeholder="Quận 1"
                                value={formData.state}
                                onChange={(e) =>
                                  setFormData({ ...formData, state: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="zip">Mã bưu điện *</Label>
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
                              <Label htmlFor="country">Quốc gia *</Label>
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
                            Thêm địa chỉ
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
                      <p className="text-sm text-muted-foreground">Đang tải...</p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">
                        Bạn chưa có địa chỉ giao hàng nào
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm địa chỉ đầu tiên
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
                                  placeholder="Địa chỉ"
                                  value={formData.street}
                                  onChange={(e) =>
                                    setFormData({ ...formData, street: e.target.value })
                                  }
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Thành phố"
                                    value={formData.city}
                                    onChange={(e) =>
                                      setFormData({ ...formData, city: e.target.value })
                                    }
                                  />
                                  <Input
                                    placeholder="Quận/Huyện"
                                    value={formData.state}
                                    onChange={(e) =>
                                      setFormData({ ...formData, state: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Mã bưu điện"
                                    value={formData.zip}
                                    onChange={(e) =>
                                      setFormData({ ...formData, zip: e.target.value })
                                    }
                                  />
                                  <Input
                                    placeholder="Quốc gia"
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
                                    Lưu
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEditing}
                                    className="flex-1"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Hủy
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
                                    Sửa
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
