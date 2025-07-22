"use client";

import { useState } from "react";
import { InventoryTable } from "@/components/admin/inventory/inventory-table";
import { InventoryHeader } from "@/components/admin/inventory/inventory-header";
import { useToast } from "@/hooks/use-toast";

export function InventoryClient() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddStock = () => {
    toast({
      title: "Add Stock",
      description: "Functionality to add new stock.",
    });
    // Hoặc chuyển hướng đến trang thêm stock nếu có:
    // router.push("/admin/inventory/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Thêm logic lọc cho InventoryTable tại đây nếu cần
  };

  return (
    <div className="space-y-6">
      <InventoryHeader
        onAddStock={handleAddStock}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <InventoryTable />
    </div>
  );
}
