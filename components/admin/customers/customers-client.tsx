"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { CustomersTable } from "@/components/admin/customers/customers-table";
import { CustomersHeader } from "@/components/admin/customers/customers-header";
import { useToast } from "@/hooks/use-toast";

export function CustomersClient() {
  //   const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddCustomer = () => {
    // Logic để thêm khách hàng mới, có thể là mở một modal hoặc chuyển trang
    toast({
      title: "Add Customer",
      description: "Functionality to add a new customer.",
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Thêm logic lọc cho CustomersTable tại đây nếu cần
  };

  return (
    <div className="space-y-6">
      <CustomersHeader
        onAddCustomer={handleAddCustomer}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <CustomersTable />
    </div>
  );
}
