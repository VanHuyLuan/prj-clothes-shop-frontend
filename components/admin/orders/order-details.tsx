"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus: (status: string) => void;
  onRefund: () => void;
  onPrint: () => void;
}

export function OrderDetails({
  order,
  onUpdateStatus,
  onRefund,
  onPrint,
}: OrderDetailsProps) {
  const mockOrder: Order = {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    items: [
      {
        id: "1",
        productName: "Classic White T-Shirt",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 2,
        price: 29.99,
        total: 59.98,
      },
      {
        id: "2",
        productName: "Denim Jacket",
        image: "/placeholder.svg?height=60&width=60",
        quantity: 1,
        price: 89.99,
        total: 89.99,
      },
    ],
    subtotal: 149.97,
    tax: 12.0,
    shipping: 9.99,
    total: 171.96,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: {
      street: "123 Fashion Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    orderDate: "2024-01-20",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "TRK123456789",
  };

  const displayOrder = order || mockOrder;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="default">
            <Package className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="secondary">
            <Truck className="mr-1 h-3 w-3" />
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-600">
            Paid
          </Badge>
        );
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Order {displayOrder.orderNumber}
              </CardTitle>
              <p className="text-muted-foreground">
                Placed on{" "}
                {new Date(displayOrder.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={onPrint} variant="outline">
                Print Order
              </Button>
              <Button onClick={onRefund} variant="destructive">
                Process Refund
              </Button>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            {getStatusBadge(displayOrder.status)}
            {getPaymentStatusBadge(displayOrder.paymentStatus)}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                      />
                      <AvatarFallback>
                        {item.productName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${displayOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${displayOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${displayOrder.shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${displayOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Information */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={displayOrder.customer.avatar || "/placeholder.svg"}
                    alt={displayOrder.customer.name}
                  />
                  <AvatarFallback>
                    {displayOrder.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {displayOrder.customer.name}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{displayOrder.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{displayOrder.customer.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="text-sm">
                  <div>{displayOrder.shippingAddress.street}</div>
                  <div>
                    {displayOrder.shippingAddress.city},{" "}
                    {displayOrder.shippingAddress.state}{" "}
                    {displayOrder.shippingAddress.zipCode}
                  </div>
                  <div>{displayOrder.shippingAddress.country}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Status</span>
                  {getStatusBadge(displayOrder.status)}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment</span>
                  {getPaymentStatusBadge(displayOrder.paymentStatus)}
                </div>
                {displayOrder.trackingNumber && (
                  <div className="flex justify-between text-sm">
                    <span>Tracking</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {displayOrder.trackingNumber}
                    </code>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Est. Delivery</span>
                  <span>
                    {new Date(
                      displayOrder.estimatedDelivery
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus("processing")}
                  >
                    Processing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus("shipped")}
                  >
                    Shipped
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus("delivered")}
                  >
                    Delivered
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUpdateStatus("cancelled")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
