"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  role_id: string;
  role?: {
    id: string;
    name: string;
    description: string;
  };
  status: boolean;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

interface UsersTableProps {
  users?: User[];
  loading?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onStatusChange?: (user: User, status: boolean) => void;
}

// Mock data for preview
const mockUsers: User[] = [
  {
    id: "1",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    email: "john@stylish.com",
    phone: "+1234567890",
    role_id: "role-1",
    role: { id: "role-1", name: "Admin", description: "Full system access" },
    status: true,
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2022-01-15T00:00:00Z",
    updated_at: "2023-05-28T09:15:00Z",
  },
  {
    id: "2",
    username: "janesmith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@stylish.com",
    phone: "+1234567891",
    role_id: "role-2",
    role: { id: "role-2", name: "Manager", description: "Manage products and orders" },
    status: true,
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2022-02-10T00:00:00Z",
    updated_at: "2023-05-27T15:22:00Z",
  },
  {
    id: "3",
    username: "robertj",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert@stylish.com",
    phone: "+1234567892",
    role_id: "role-3",
    role: { id: "role-3", name: "Editor", description: "Edit content" },
    status: false,
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2022-03-05T00:00:00Z",
    updated_at: "2023-05-15T11:30:00Z",
  },
  {
    id: "4",
    username: "emilyd",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily@stylish.com",
    phone: "+1234567893",
    role_id: "role-2",
    role: { id: "role-2", name: "Manager", description: "Manage products and orders" },
    status: true,
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2022-04-20T00:00:00Z",
    updated_at: "2023-05-28T08:45:00Z",
  },
  {
    id: "5",
    username: "michaelw",
    firstName: "Michael",
    lastName: "Wilson",
    email: "michael@stylish.com",
    phone: "+1234567894",
    role_id: "role-3",
    role: { id: "role-3", name: "Editor", description: "Edit content" },
    status: false,
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2022-05-12T00:00:00Z",
    updated_at: "2023-05-20T14:15:00Z",
  },
];

export function UsersTable({
  users = [],
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
  onStatusChange = () => {},
}: UsersTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof User>("username");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  if (loading) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No users found.</p>
      </div>
    );
  }

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getRoleBadge = (roleName: string) => {
    const lowerRole = roleName.toLowerCase();
    if (lowerRole.includes("admin")) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <ShieldAlert className="mr-1 h-3 w-3" />
          {roleName}
        </Badge>
      );
    } else if (lowerRole.includes("manager")) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <ShieldCheck className="mr-1 h-3 w-3" />
          {roleName}
        </Badge>
      );
    } else if (lowerRole.includes("editor")) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Shield className="mr-1 h-3 w-3" />
          {roleName}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          {roleName}
        </Badge>
      );
    }
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        Inactive
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("username")}
            >
              Username
              {sortColumn === "username" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("firstName")}
            >
              Full Name
              {sortColumn === "firstName" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email
              {sortColumn === "email" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("role_id")}
            >
              Role
              {sortColumn === "role_id" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status
              {sortColumn === "status" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              Created
              {sortColumn === "created_at" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.lastName || "—"}
              </TableCell>
              <TableCell>{user.email || "—"}</TableCell>
              <TableCell>{user.phone || "—"}</TableCell>
              <TableCell>{getRoleBadge(user.role?.name || "User")}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onStatusChange(user, !user.status)}
                    >
                      {user.status ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(user.id)}
                    >
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
