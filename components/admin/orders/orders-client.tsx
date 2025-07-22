"use client";

import { useState } from "react";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersHeader } from "@/components/admin/orders/orders-header";
import { useToast } from "@/hooks/use-toast";

export function OrdersClient() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAddOrder = () => {
    toast({
      title: "New Order",
      description: "Functionality to add a new order.",
    });
    // Hoặc chuyển hướng đến trang thêm đơn hàng nếu có:
    // router.push("/admin/orders/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Thêm logic lọc cho OrdersTable tại đây nếu cần
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    // Thêm logic lọc cho OrdersTable tại đây nếu cần
  };

  return (
    <div className="space-y-6">
      <OrdersHeader
        onAddOrder={handleAddOrder}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
      <OrdersTable />
    </div>
  );
}
