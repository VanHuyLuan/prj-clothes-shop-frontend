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
  username: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  role_id: string;
  avatar: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrder?: string;
}

interface CustomersTableProps {
  customers?: Customer[];
  loading?: boolean;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
  onView?: (customer: Customer) => void;
  onEmail?: (customer: Customer) => void;
}

export function CustomersTable({
  customers = [],
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onEmail = () => {},
}: CustomersTableProps) {

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  if (loading) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">Loading customers...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => {
            const fullName =
              customer.firstName && customer.lastName
                ? `${customer.firstName} ${customer.lastName}`
                : customer.firstName || customer.lastName || customer.username;

            return (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={customer.avatar || "/placeholder.svg"}
                        alt={fullName}
                      />
                      <AvatarFallback>
                        {fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.email || "—"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {customer.username}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.phone || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {customer.totalOrders || 0} orders
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    ${(customer.totalSpent || 0).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.lastOrder
                    ? new Date(customer.lastOrder).toLocaleDateString()
                    : "Never"}
                </TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(customer.created_at).toLocaleDateString()}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
