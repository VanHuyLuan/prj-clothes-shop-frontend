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
import { MoreHorizontal, Edit, Trash2, Eye, Mail } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "active" | "inactive" | "new";
  dateJoined: string;
}

interface CustomersTableProps {
  customers?: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
  onView?: (customer: Customer) => void;
  onEmail?: (customer: Customer) => void;
}

export function CustomersTable({
  customers = [],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onEmail = () => {},
}: CustomersTableProps) {
  const mockCustomers: Customer[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      totalOrders: 12,
      totalSpent: 1245.67,
      lastOrder: "2024-01-15",
      status: "active",
      dateJoined: "2023-05-12",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      totalOrders: 5,
      totalSpent: 489.32,
      lastOrder: "2024-01-10",
      status: "active",
      dateJoined: "2023-08-23",
    },
    {
      id: "3",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      totalOrders: 1,
      totalSpent: 59.99,
      lastOrder: "2024-01-05",
      status: "new",
      dateJoined: "2024-01-01",
    },
    {
      id: "4",
      name: "James Wilson",
      email: "james.wilson@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: "",
      status: "inactive",
      dateJoined: "2023-06-15",
    },
  ];

  const displayCustomers = customers.length > 0 ? customers : mockCustomers;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "new":
        return <Badge variant="outline">New</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={customer.avatar || "/placeholder.svg"}
                      alt={customer.name}
                    />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{customer.totalOrders} orders</Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  ${customer.totalSpent.toFixed(2)}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {customer.lastOrder
                  ? new Date(customer.lastOrder).toLocaleDateString()
                  : "Never"}
              </TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(customer.dateJoined).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(customer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEmail(customer)}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(customer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(customer.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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
