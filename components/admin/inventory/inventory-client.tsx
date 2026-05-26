"use client";

import { useState, useEffect, useCallback } from "react";
import { InventoryTable } from "@/components/admin/inventory/inventory-table";
import { InventoryHeader } from "@/components/admin/inventory/inventory-header";
import { ApiService, InventoryVariant, InventoryResponse } from "@/lib/api";
import { toast } from "sonner";

const PAGE_SIZE = 20;

export function InventoryClient() {
  const [data, setData] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [searchDebounce, setSearchDebounce] = useState("");

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounce(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchDebounce, statusFilter]);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ApiService.getInventory({
        page,
        limit: PAGE_SIZE,
        search: searchDebounce || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setData(res);
    } catch {
      toast.error("Could not load inventory data");
    } finally {
      setLoading(false);
    }
  }, [page, searchDebounce, statusFilter]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleUpdateStock = async (variantId: string, stock_qty: number) => {
    try {
      await ApiService.updateInventoryStock(variantId, stock_qty);
      toast.success("Inventory updated");
      fetchInventory();
    } catch {
      toast.error("Failed to update inventory");
    }
  };

  return (
    <div className="space-y-6">
      <InventoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        lowStockCount={data?.lowStockCount ?? 0}
        outOfStockCount={data?.outOfStockCount ?? 0}
      />
      <InventoryTable
        items={data?.data ?? []}
        loading={loading}
        total={data?.total ?? 0}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        onUpdateStock={handleUpdateStock}
      />
    </div>
  );
}
