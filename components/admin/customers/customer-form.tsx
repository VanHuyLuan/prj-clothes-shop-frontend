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
    firstname: "",
    lastname: "",
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
      // Use predefined customer role ID from backend
      const customerRoleId = '34fa9429-f7ef-4dcc-8b8d-06b3734456cb';
      setCustomerRoleId(customerRoleId);
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
        firstname: customer.firstName || "",
        lastname: customer.lastName || "",
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
    
    if (!customerRoleId && !isEditMode) {
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
        // Use admin update endpoint
        await ApiService.updateUserByAdmin(id, {
          firstName: formData.firstname,
          lastName: formData.lastname,
          phone: formData.phone,
          avatar: formData.avatar,
          email: formData.email,
        });
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        // Use admin create endpoint - backend will send email with default password
        await ApiService.createUserByAdmin({
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          role: 'user',
        });
        toast({
          title: "Success",
          description: "Customer created successfully. Email sent with login credentials.",
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
                  {formData.firstname && formData.lastname
                    ? `${formData.firstname[0]}${formData.lastname[0]}`
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
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                value={formData.firstname}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
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

          {/* Password Info (only for new customers) */}
          {!isEditMode && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                ℹ️ A default password (Clothesshop123@) will be automatically sent to the customer's email address.
                The customer will be able to change it after logging in.
              </p>
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
