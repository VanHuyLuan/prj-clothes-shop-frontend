"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InventoryHeaderProps {
  onAddStock: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lowStockCount?: number;
}

export function InventoryHeader({
  onAddStock,
  searchQuery,
  onSearchChange,
  lowStockCount = 5,
}: InventoryHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Monitor stock levels and manage inventory
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={onAddStock} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </div>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <span className="text-sm text-orange-800">
            <Badge variant="destructive" className="mr-2">
              {lowStockCount}
            </Badge>
            products are running low on stock
          </span>
        </div>
      )}
    </div>
  );
}
