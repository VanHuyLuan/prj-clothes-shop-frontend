"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Edit,
  Ban,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  joinDate: string;
  lastOrderDate: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "banned";
  loyaltyPoints: number;
}

// Sửa lại interface để chấp nhận prop 'id'
interface CustomerDetailsProps {
  id: string;
}

export function CustomerDetails({ id }: CustomerDetailsProps) {
  const { toast } = useToast();
  // Dùng state để lưu trữ thông tin customer
  const [customer, setCustomer] = useState<Customer | null>(null);

  // Dữ liệu giả để hiển thị
  const mockCustomer: Customer = {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=80&width=80",
    address: {
      street: "123 Fashion Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    joinDate: "2023-03-15",
    lastOrderDate: "2024-01-20",
    totalOrders: 12,
    totalSpent: 1250.0,
    status: "active",
    loyaltyPoints: 450,
  };

  useEffect(() => {
    // Trong ứng dụng thật, bạn sẽ fetch dữ liệu từ API dựa trên id
    console.log("Fetching data for customer ID:", id);
    setCustomer(mockCustomer);
  }, [id]);

  const handleEdit = () => {
    // Chuyển hướng đến trang chỉnh sửa (nếu có)
    toast({
      title: "Edit Customer",
      description: `Redirecting to edit page for customer ${id}`,
    });
  };

  const handleBan = () => {
    // Xử lý logic cấm khách hàng
    toast({
      title: "Ban Customer",
      description: `Customer ${id} has been banned.`,
    });
  };

  if (!customer) {
    return <div>Loading...</div>; // Hoặc một skeleton loading component
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "banned":
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={customer.avatar || "/placeholder.svg"}
                  alt={customer.name}
                />
                <AvatarFallback className="text-lg">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <p className="text-muted-foreground">
                  Customer ID: {customer.id}
                </p>
                {getStatusBadge(customer.status)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={handleBan} variant="destructive">
                <Ban className="mr-2 h-4 w-4" />
                Ban Customer
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <div>{customer.address.street}</div>
                <div>
                  {customer.address.city}, {customer.address.state}{" "}
                  {customer.address.zipCode}
                </div>
                <div>{customer.address.country}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Member Since</span>
              </div>
              <span>{new Date(customer.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Order</span>
              <span>
                {new Date(customer.lastOrderDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Loyalty Points</span>
              <Badge variant="outline">{customer.loyaltyPoints} points</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{customer.totalOrders}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">
                ${customer.totalSpent.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">
                $
                {(customer.totalSpent / (customer.totalOrders || 1)).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Average Order Value
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
