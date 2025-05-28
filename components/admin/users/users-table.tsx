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
  name: string;
  email: string;
  role: "admin" | "manager" | "editor";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

interface UsersTableProps {
  users?: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onStatusChange?: (user: User, status: "active" | "inactive") => void;
}

// Mock data for preview
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@stylish.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-28 09:15 AM",
    createdAt: "2022-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@stylish.com",
    role: "manager",
    status: "active",
    lastLogin: "2023-05-27 03:22 PM",
    createdAt: "2022-02-10",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@stylish.com",
    role: "editor",
    status: "inactive",
    lastLogin: "2023-05-15 11:30 AM",
    createdAt: "2022-03-05",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@stylish.com",
    role: "manager",
    status: "active",
    lastLogin: "2023-05-28 08:45 AM",
    createdAt: "2022-04-20",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@stylish.com",
    role: "editor",
    status: "inactive",
    lastLogin: "2023-05-20 02:15 PM",
    createdAt: "2022-05-12",
  },
];

export function UsersTable({
  users = [],
  onEdit = () => {},
  onDelete = () => {},
  onStatusChange = () => {},
}: UsersTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const displayUsers = users.length > 0 ? users : mockUsers;

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...displayUsers].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <ShieldAlert className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        );
      case "manager":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Manager
          </Badge>
        );
      case "editor":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Shield className="mr-1 h-3 w-3" />
            Editor
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {role}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name
              {sortColumn === "name" && (
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
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("role")}
            >
              Role
              {sortColumn === "role" && (
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
              onClick={() => handleSort("lastLogin")}
            >
              Last Login
              {sortColumn === "lastLogin" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Created
              {sortColumn === "createdAt" && (
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
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{user.lastLogin}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
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
                      onClick={() =>
                        onStatusChange(
                          user,
                          user.status === "active" ? "inactive" : "active"
                        )
                      }
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(user)}
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
