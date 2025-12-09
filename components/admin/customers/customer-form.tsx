"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiService, { Role } from "@/lib/api";

interface CustomerFormProps {
  id?: string;
}

export function CustomerForm({ id }: CustomerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [customerRoleId, setCustomerRoleId] = useState<string>("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    avatar: "",
    status: true,
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchCustomerRole();
    if (isEditMode) {
      fetchCustomer();
    }
  }, [isEditMode, id]);

  const fetchCustomerRole = async () => {
    try {
      const roles = await ApiService.getRoles();
      // Find customer/user role
      const customerRole = roles.find((role) => 
        role.name.toLowerCase() === 'customer' || 
        role.name.toLowerCase() === 'user'
      );
      if (customerRole) {
        setCustomerRoleId(customerRole.id);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast({
        title: "Error",
        description: "Failed to load customer role",
        variant: "destructive",
      });
    }
  };

  const fetchCustomer = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const customer = await ApiService.getCustomerById(id);
      setFormData({
        username: customer.username,
        email: customer.email || "",
        phone: customer.phone || "",
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        avatar: customer.avatar || "",
        status: customer.status,
      });
    } catch (error) {
      console.error("Failed to fetch customer:", error);
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditMode && password !== confirmPassword) {
      toast({ 
        title: "Passwords do not match", 
        variant: "destructive" 
      });
      return;
    }

    if (!isEditMode && password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (!customerRoleId) {
      toast({
        title: "Error",
        description: "Customer role not found",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && id) {
        await ApiService.updateUser(id, formData);
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        await ApiService.createUser({
          ...formData,
          role_id: customerRoleId,
          password,
        });
        toast({
          title: "Success",
          description: "Customer created successfully",
        });
      }
      router.push("/admin/customers");
    } catch (error) {
      console.error("Failed to save customer:", error);
      toast({
        title: "Error",
        description: isEditMode ? "Failed to update customer" : "Failed to create customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/admin/customers");
  };

  if (loading && isEditMode) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-muted-foreground">Loading customer data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Customer" : "Add New Customer"}</CardTitle>
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
                  alt={formData.username}
                />
                <AvatarFallback className="text-lg">
                  {formData.firstName && formData.lastName
                    ? `${formData.firstName[0]}${formData.lastName[0]}`
                    : formData.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" disabled>
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
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter username"
                required
                disabled={isEditMode}
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Enter last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Password Fields (only for new customers) */}
          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, status: checked })
              }
            />
            <Label htmlFor="status">Active Customer</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update Customer" : "Create Customer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
