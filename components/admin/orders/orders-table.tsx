"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
} from "lucide-react";

interface OrderItem {
  id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  shipping_address: any | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
  } | null;
  items: OrderItem[];
}

interface OrdersTableProps {
  orders?: Order[];
  onEdit?: (order: Order) => void;
  onView?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: string) => void;
}

export function OrdersTable({
  orders = [],
  onEdit = () => {},
  onView = () => {},
  onUpdateStatus = () => {},
}: OrdersTableProps) {
  const mockOrders: Order[] = [
    {
      id: "1",
      user_id: "user-1",
      order_number: "ORD-2024-001",
      status: "confirmed",
      total_amount: 171.96,
      shipping_address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
      },
      created_at: "2024-01-20T10:30:00Z",
      updated_at: "2024-01-20T10:30:00Z",
      user: {
        id: "user-1",
        username: "sarahj",
        email: "sarah.johnson@email.com",
        firstName: "Sarah",
        lastName: "Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      items: [
        {
          id: "item-1",
          product_variant_id: "var-1",
          quantity: 2,
          unit_price: 59.99,
          total_price: 119.98,
        },
        {
          id: "item-2",
          product_variant_id: "var-2",
          quantity: 1,
          unit_price: 51.98,
          total_price: 51.98,
        },
      ],
    },
    {
      id: "2",
      user_id: "user-2",
      order_number: "ORD-2024-002",
      status: "shipped",
      total_amount: 89.98,
      shipping_address: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        country: "USA",
      },
      created_at: "2024-01-19T14:15:00Z",
      updated_at: "2024-01-20T09:00:00Z",
      user: {
        id: "user-2",
        username: "michaelc",
        email: "michael.chen@email.com",
        firstName: "Michael",
        lastName: "Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      items: [
        {
          id: "item-3",
          product_variant_id: "var-3",
          quantity: 2,
          unit_price: 44.99,
          total_price: 89.98,
        },
      ],
    },
    {
      id: "3",
      user_id: "user-3",
      order_number: "ORD-2024-003",
      status: "delivered",
      total_amount: 59.99,
      shipping_address: {
        street: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "USA",
      },
      created_at: "2024-01-18T16:45:00Z",
      updated_at: "2024-01-23T11:20:00Z",
      user: {
        id: "user-3",
        username: "emilyd",
        email: "emily.davis@email.com",
        firstName: "Emily",
        lastName: "Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      items: [
        {
          id: "item-4",
          product_variant_id: "var-4",
          quantity: 1,
          unit_price: 59.99,
          total_price: 59.99,
        },
      ],
    },
    {
      id: "4",
      user_id: null,
      order_number: "ORD-2024-004",
      status: "pending",
      total_amount: 245.5,
      shipping_address: {
        street: "321 Elm St",
        city: "Houston",
        state: "TX",
        zip: "77001",
        country: "USA",
      },
      created_at: "2024-01-21T08:00:00Z",
      updated_at: "2024-01-21T08:00:00Z",
      user: null,
      items: [
        {
          id: "item-5",
          product_variant_id: "var-5",
          quantity: 3,
          unit_price: 81.83,
          total_price: 245.5,
        },
      ],
    },
  ];

  const displayOrders = orders.length > 0 ? orders : mockOrders;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="default">
            <Package className="mr-1 h-3 w-3" />
            Confirmed
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Shipping Address</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayOrders.map((order) => {
            const customerName = order.user
              ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
                order.user.username
              : "Guest";
            const customerEmail = order.user?.email || "—";
            const shippingCity = order.shipping_address?.city || "—";
            const shippingCountry = order.shipping_address?.country || "";
            const shippingDisplay =
              shippingCity !== "—"
                ? `${shippingCity}, ${shippingCountry}`
                : "—";

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.order_number}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {order.id.slice(0, 8)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={order.user?.avatar || "/placeholder.svg"}
                        alt={customerName}
                      />
                      <AvatarFallback>
                        {customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {customerEmail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{order.items.length} items</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    ${order.total_amount.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">{shippingDisplay}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(order)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "confirmed")}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Mark Confirmed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "shipped")}
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Mark Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "delivered")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "cancelled")}
                        className="text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
