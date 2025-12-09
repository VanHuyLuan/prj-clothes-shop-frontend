"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UsersTable } from "@/components/admin/users/users-table";
import { UsersHeader } from "@/components/admin/users/users-header";
import { useToast } from "@/hooks/use-toast";
import ApiService, { User } from "@/lib/api";

export function UsersClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log("Fetching admin users from API...");
      const response = await ApiService.getUsers({
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        page,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      console.log("Admin users API response:", response);
      
      // Handle both paginated response and direct array response
      if (Array.isArray(response)) {
        setUsers(response);
        setTotalPages(1);
      } else {
        setUsers(response.data);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
      toast({
        title: "Error",
        description: "Failed to load admin users. Check console for details.",
        variant: "destructive",
      });
      // Set empty array to show "No users found" instead of keeping old data
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, statusFilter, page]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleDelete = async (userId: string) => {
    try {
      await ApiService.deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (user: User, status: boolean) => {
    try {
      await ApiService.updateUserStatus(user.id, status);
      toast({
        title: "Success",
        description: `User ${status ? "activated" : "deactivated"} successfully`,
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <UsersHeader
        onSearch={handleSearchChange}
        onFilterStatus={handleStatusFilterChange}
      />
      <UsersTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
