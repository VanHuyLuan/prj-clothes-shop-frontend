"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomersTable } from "@/components/admin/customers/customers-table";
import { CustomersHeader } from "@/components/admin/customers/customers-header";
import { useToast } from "@/hooks/use-toast";
import ApiService, { User } from "@/lib/api";

interface CustomerWithStats extends User {
  totalOrders?: number;
  totalSpent?: number;
  lastOrder?: string;
}

export function CustomersClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      console.log("Fetching customers (non-admin users) from API...");
      const response = await ApiService.getCustomers({
        search: searchQuery || undefined,
        page,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      console.log("Customers API response:", response);
      
      // Handle both paginated response and direct array response
      if (Array.isArray(response)) {
        setCustomers(response as CustomerWithStats[]);
        setTotalPages(1);
      } else {
        setCustomers(response.data as CustomerWithStats[]);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast({
        title: "Error",
        description: "Failed to load customers. Check console for details.",
        variant: "destructive",
      });
      // Set empty array to show "No customers found" instead of keeping old data
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery, page]);

  const handleAddCustomer = () => {
    router.push("/admin/customers/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleView = (customer: CustomerWithStats) => {
    router.push(`/admin/customers/${customer.id}`);
  };

  const handleEdit = (customer: CustomerWithStats) => {
    router.push(`/admin/customers/${customer.id}`);
  };

  const handleDelete = async (customerId: string) => {
    try {
      await ApiService.deleteUser(customerId);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const handleEmail = (customer: CustomerWithStats) => {
    // Open email client or modal
    if (customer.email) {
      window.location.href = `mailto:${customer.email}`;
    } else {
      toast({
        title: "No Email",
        description: "This customer doesn't have an email address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <CustomersHeader
        onAddCustomer={handleAddCustomer}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <CustomersTable
        customers={customers}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onEmail={handleEmail}
      />
    </div>
  );
}
