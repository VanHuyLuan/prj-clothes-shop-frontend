"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dữ liệu giả để hiển thị trong chế độ chỉnh sửa
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@stylish.com",
  role: "admin" as "admin" | "manager" | "staff",
  avatar: "/placeholder.svg?height=80&width=80",
  isActive: true,
  permissions: [
    "products.read",
    "products.write",
    "orders.read",
    "orders.write",
    "customers.read",
    "customers.write",
    "analytics.read",
    "settings.write",
    "users.read",
    "users.write",
  ],
};

// Sửa lại interface để chấp nhận prop 'id'
interface UserFormProps {
  id?: string;
}

export function UserForm({ id }: UserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "staff" as "admin" | "manager" | "staff",
    avatar: "",
    isActive: true,
    permissions: [] as string[],
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (isEditMode) {
      // Trong ứng dụng thật, bạn sẽ fetch dữ liệu từ API dựa trên id
      console.log("Fetching data for user ID:", id);
      setFormData(mockUser);
    }
  }, [isEditMode, id]);

  const availablePermissions = [
    { id: "products.read", label: "View Products" },
    { id: "products.write", label: "Manage Products" },
    { id: "orders.read", label: "View Orders" },
    { id: "orders.write", label: "Manage Orders" },
    { id: "customers.read", label: "View Customers" },
    { id: "customers.write", label: "Manage Customers" },
    { id: "analytics.read", label: "View Analytics" },
    { id: "settings.write", label: "Manage Settings" },
    { id: "users.read", label: "View Users" },
    { id: "users.write", label: "Manage Users" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditMode && password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    console.log("Submitting:", formData);
    toast({
      title: `User ${isEditMode ? "updated" : "created"}`,
      description: `The user has been ${
        isEditMode ? "updated" : "created"
      } successfully.`,
    });
    router.push("/admin/users");
  };

  const onCancel = () => {
    router.push("/admin/users");
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId],
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permissionId),
      });
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case "admin":
        return availablePermissions.map((p) => p.id);
      case "manager":
        return availablePermissions
          .filter((p) => !p.id.includes("users.write"))
          .map((p) => p.id);
      case "staff":
        return availablePermissions
          .filter((p) => p.id.includes("read") || p.id.includes("orders.write"))
          .map((p) => p.id);
      default:
        return [];
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData({
      ...formData,
      role: role as "admin" | "manager" | "staff",
      permissions: getRolePermissions(role),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit User" : "Add New User"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={formData.avatar || "/placeholder.svg"}
                  alt={formData.name}
                />
                <AvatarFallback className="text-lg">
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                {formData.avatar && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, avatar: "" })}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Password Fields (only for new users) */}
          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {formData.role === "admin" &&
                "Full access to all features and settings"}
              {formData.role === "manager" &&
                "Access to most features except user management"}
              {formData.role === "staff" &&
                "Limited access to basic operations"}
            </p>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePermissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <Switch
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission.id, checked)
                    }
                  />
                  <Label htmlFor={permission.id} className="text-sm">
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive">Active User</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {isEditMode ? "Update User" : "Create User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
