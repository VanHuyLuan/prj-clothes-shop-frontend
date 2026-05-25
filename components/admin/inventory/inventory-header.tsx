"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, AlertTriangle, XCircle } from "lucide-react";

interface InventoryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  lowStockCount: number;
  outOfStockCount: number;
}

export function InventoryHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  lowStockCount,
  outOfStockCount,
}: InventoryHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tồn kho</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi số lượng tồn kho sản phẩm
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-[280px]"
            />
          </div>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="in_stock">Còn hàng</SelectItem>
              <SelectItem value="low_stock">Sắp hết</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {lowStockCount > 0 && (
            <button
              onClick={() => onStatusChange("low_stock")}
              className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                <Badge variant="destructive" className="mr-1">
                  {lowStockCount}
                </Badge>
                biến thể sắp hết hàng
              </span>
            </button>
          )}
          {outOfStockCount > 0 && (
            <button
              onClick={() => onStatusChange("out_of_stock")}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                <Badge variant="destructive" className="mr-1">
                  {outOfStockCount}
                </Badge>
                biến thể hết hàng
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
