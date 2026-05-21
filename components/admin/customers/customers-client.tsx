"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      const response = await ApiService.getCustomers({
        search: searchQuery || undefined,
        page,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc",
      });

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
        description: "Failed to load customers.",
        variant: "destructive",
      });
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
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      await ApiService.deleteUserByAdmin(customerId);
      toast({ title: "Success", description: "Customer deleted successfully." });
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer.",
        variant: "destructive",
      });
    }
  };

  const handleEmail = (customer: CustomerWithStats) => {
    if (customer.email) {
      window.location.href = `mailto:${customer.email}`;
    } else {
      toast({
        title: "No Email",
        description: "This customer doesn't have an email address.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (customerId: string) => {
    try {
      await ApiService.resetPasswordByAdmin(customerId);
      toast({
        title: "Password Reset",
        description: "A new password has been sent to the customer's email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message ?? "Failed to reset password.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (customer: CustomerWithStats) => {
    try {
      await ApiService.setUserStatus(customer.id, !customer.status);
      toast({
        title: "Status Updated",
        description: `Customer has been ${customer.status ? "deactivated" : "activated"}.`,
      });
      fetchCustomers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message ?? "Failed to update status.",
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
        onResetPassword={handleResetPassword}
        onToggleStatus={handleToggleStatus}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
