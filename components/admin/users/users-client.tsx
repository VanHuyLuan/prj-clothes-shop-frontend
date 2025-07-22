"use client";

import { useState } from "react";
import { UsersTable } from "@/components/admin/users/users-table";
import { UsersHeader } from "@/components/admin/users/users-header";

export function UsersClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Thêm logic lọc cho UsersTable tại đây nếu cần
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    // Thêm logic lọc cho UsersTable tại đây nếu cần
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    // Thêm logic lọc cho UsersTable tại đây nếu cần
  };

  return (
    <div className="space-y-6">
      <UsersHeader
        onSearch={handleSearchChange}
        onFilterRole={handleRoleFilterChange}
        onFilterStatus={handleStatusFilterChange}
      />
      <UsersTable />
    </div>
  );
}
