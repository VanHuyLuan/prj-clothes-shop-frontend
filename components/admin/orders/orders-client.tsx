"use client";

import { useState, useEffect } from "react";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersHeader } from "@/components/admin/orders/orders-header";
import { useToast } from "@/hooks/use-toast";
import { ApiService, Order } from "@/lib/api";
import { useRouter } from "next/navigation";

export function OrdersClient() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch orders from API
  const fetchOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: pagination.limit,
      };

      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await ApiService.getOrders(params);
      setOrders(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

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
  };

  const handleEdit = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleView = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await ApiService.updateOrderStatus(orderId, status);
      toast({
        title: "Success",
        description: "Order status updated successfully.",
      });
      // Refresh orders list
      fetchOrders(pagination.page);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  // Filter orders by search query (client-side filtering)
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower) ||
      order.user?.username?.toLowerCase().includes(searchLower) ||
      `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <OrdersHeader
        onAddOrder={handleAddOrder}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onUpdateStatus={handleUpdateStatus}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
