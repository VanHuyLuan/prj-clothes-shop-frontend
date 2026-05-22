"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  RefreshCw,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiService, { type User, type Order } from "@/lib/api";

type CustomerProfile = User;

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const ORDER_STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  confirmed: "default",
  processing: "default",
  shipping: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export function CustomerDetails({ id }: { id: string }) {
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState({ total: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, ordersRes] = await Promise.all([
        ApiService.getCustomerById(id),
        ApiService.getCustomerOrders(id, { limit: 100, page: 1 }),
      ]);
      setCustomer(profile as CustomerProfile);
      const orders = ordersRes.data ?? [];
      setRecentOrders(orders.slice(0, 5));
      const totalSpent = orders.reduce(
        (sum: number, o: Order) => sum + Number(o.total_amount ?? 0),
        0
      );
      setOrderStats({ total: ordersRes.total ?? 0, totalSpent });
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: (e as Error).message ?? "Failed to load customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResetPassword = async () => {
    if (
      !window.confirm(
        `Reset password for "${customer?.username}"? A new password will be sent to their email.`
      )
    )
      return;
    setIsResetting(true);
    try {
      await ApiService.resetPasswordByAdmin(id);
      toast({
        title: "Password Reset",
        description: "A new password has been sent to the customer's email.",
      });
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: (e as Error).message ?? "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!customer) return;
    setIsTogglingStatus(true);
    try {
      await ApiService.setUserStatus(id, !customer.status);
      setCustomer((prev) => (prev ? { ...prev, status: !prev.status } : prev));
      toast({
        title: "Status Updated",
        description: `Customer has been ${customer.status ? "deactivated" : "activated"}.`,
      });
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: (e as Error).message ?? "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        Customer not found.
      </div>
    );
  }

  const fullName =
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    customer.username;
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const avgOrderValue =
    orderStats.total > 0 ? orderStats.totalSpent / orderStats.total : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={customer.avatar ?? "/placeholder.svg"}
                  alt={fullName}
                />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="text-sm text-muted-foreground">
                  @{customer.username}
                </p>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {customer.status ? (
                    <Badge>Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  {customer.role && (
                    <Badge variant="outline">{customer.role.name}</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={handleResetPassword}
                disabled={isResetting}
              >
                {isResetting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Reset Password
              </Button>
              <Button
                variant={customer.status ? "destructive" : "default"}
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
              >
                {isTogglingStatus ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : customer.status ? (
                  <UserX className="mr-2 h-4 w-4" />
                ) : (
                  <UserCheck className="mr-2 h-4 w-4" />
                )}
                {customer.status ? "Deactivate" : "Activate"}
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
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{customer.email ?? <span className="text-muted-foreground">No email</span>}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{customer.phone ?? <span className="text-muted-foreground">No phone</span>}</span>
            </div>
            {customer.address && customer.address.length > 0 ? (
              customer.address.map((addr) => (
                <div key={addr.id} className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div>{addr.street}</div>
                    <div className="text-muted-foreground">
                      {[addr.city, addr.state, addr.zip]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <div className="text-muted-foreground">{addr.country}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>No address saved</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member Since</span>
              </div>
              <span className="font-medium">
                {new Date(customer.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            {customer.birthdate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Birthday</span>
                <span className="font-medium">
                  {new Date(customer.birthdate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            )}
            {customer.gender && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium capitalize">{customer.gender}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Customer ID</span>
              <code className="text-xs bg-muted px-2 py-0.5 rounded">
                {customer.id}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold">
              {orderStats.totalSpent.toLocaleString("vi-VN")}₫
            </div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">
              {avgOrderValue.toLocaleString("vi-VN")}₫
            </div>
            <div className="text-sm text-muted-foreground">Avg Order Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">
                        {order.order_number}
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>{order.items?.length ?? 0} items</TableCell>
                    <TableCell className="font-medium">
                      {Number(order.total_amount).toLocaleString("vi-VN")}₫
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ORDER_STATUS_VARIANTS[order.status] ?? "outline"
                        }
                      >
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
