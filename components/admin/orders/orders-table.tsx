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

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  items: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderDate: string;
  estimatedDelivery: string;
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
      orderNumber: "ORD-2024-001",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      items: 3,
      total: 171.96,
      status: "processing",
      paymentStatus: "paid",
      orderDate: "2024-01-20",
      estimatedDelivery: "2024-01-25",
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      customer: {
        name: "Michael Chen",
        email: "michael.chen@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      items: 2,
      total: 89.98,
      status: "shipped",
      paymentStatus: "paid",
      orderDate: "2024-01-19",
      estimatedDelivery: "2024-01-24",
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      customer: {
        name: "Emily Davis",
        email: "emily.davis@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      items: 1,
      total: 59.99,
      status: "delivered",
      paymentStatus: "paid",
      orderDate: "2024-01-18",
      estimatedDelivery: "2024-01-23",
    },
    {
      id: "4",
      orderNumber: "ORD-2024-004",
      customer: {
        name: "James Wilson",
        email: "james.wilson@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      items: 4,
      total: 245.5,
      status: "pending",
      paymentStatus: "pending",
      orderDate: "2024-01-21",
      estimatedDelivery: "2024-01-26",
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{order.orderNumber}</div>
                  <div className="text-sm text-muted-foreground">
                    Est. delivery:{" "}
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={order.customer.avatar || "/placeholder.svg"}
                      alt={order.customer.name}
                    />
                    <AvatarFallback>
                      {order.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.customer.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{order.items} items</Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">${order.total.toFixed(2)}</div>
              </TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>
                {getPaymentStatusBadge(order.paymentStatus)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(order.orderDate).toLocaleDateString()}
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
                      onClick={() => onUpdateStatus(order.id, "processing")}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Mark Processing
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
