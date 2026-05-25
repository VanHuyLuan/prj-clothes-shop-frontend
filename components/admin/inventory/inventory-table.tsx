"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Minus, AlertTriangle, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { InventoryVariant } from "@/lib/api";

const LOW_STOCK_THRESHOLD = 10;

interface InventoryTableProps {
  items: InventoryVariant[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUpdateStock: (variantId: string, stock_qty: number) => Promise<void>;
}

export function InventoryTable({
  items,
  loading,
  total,
  page,
  totalPages,
  onPageChange,
  onUpdateStock,
}: InventoryTableProps) {
  const [pendingStock, setPendingStock] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const getStatusBadge = (qty: number) => {
    if (qty === 0) return <Badge variant="destructive">Hết hàng</Badge>;
    if (qty <= LOW_STOCK_THRESHOLD)
      return <Badge className="bg-orange-500 hover:bg-orange-600">Sắp hết</Badge>;
    return <Badge className="bg-green-600 hover:bg-green-700">Còn hàng</Badge>;
  };

  const getStockBarColor = (qty: number) => {
    if (qty === 0) return "bg-red-500";
    if (qty <= LOW_STOCK_THRESHOLD) return "bg-orange-500";
    return "bg-green-500";
  };

  const handleChange = (id: string, value: number) => {
    setPendingStock((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const handleAdjust = (id: string, currentQty: number, delta: number) => {
    const base = pendingStock[id] ?? currentQty;
    setPendingStock((prev) => ({ ...prev, [id]: Math.max(0, base + delta) }));
  };

  const handleSave = async (id: string, currentQty: number) => {
    const newQty = pendingStock[id];
    if (newQty === undefined || newQty === currentQty) return;
    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      await onUpdateStock(id, newQty);
      setPendingStock((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Kích cỡ / Màu</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Mức tồn</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Package className="h-12 w-12 opacity-30" />
          <p className="text-lg font-medium">Không có sản phẩm nào</p>
          <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Kích cỡ / Màu</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Mức tồn</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const displayQty = pendingStock[item.id] ?? item.stock_qty;
              const hasChange =
                pendingStock[item.id] !== undefined &&
                pendingStock[item.id] !== item.stock_qty;
              const barPct = Math.min((displayQty / 100) * 100, 100);
              const category = item.product.categories?.[0]?.name;
              const image = item.product.images?.[0]?.url;

              return (
                <TableRow key={item.id}>
                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                        {image ? (
                          <Image
                            src={image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.updated_at).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* SKU */}
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {item.sku}
                    </code>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    {category ? (
                      <Badge variant="outline">{category}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  {/* Size / Color */}
                  <TableCell>
                    <div className="text-sm">
                      {[item.size, item.color].filter(Boolean).join(" / ") || "—"}
                    </div>
                  </TableCell>

                  {/* Stock control */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleAdjust(item.id, item.stock_qty, -1)}
                        disabled={displayQty <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={displayQty}
                        onChange={(e) =>
                          handleChange(item.id, parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-7 text-center text-sm px-1"
                        min="0"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleAdjust(item.id, item.stock_qty, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      {hasChange && (
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleSave(item.id, item.stock_qty)}
                          disabled={saving[item.id]}
                        >
                          {saving[item.id] ? "..." : "Lưu"}
                        </Button>
                      )}
                    </div>
                  </TableCell>

                  {/* Stock bar */}
                  <TableCell>
                    <div className="space-y-1 w-24">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${getStockBarColor(displayQty)}`}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">{displayQty} / 100</div>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <div className="text-sm font-medium">{formatVND(item.sale_price ?? item.price)}</div>
                    {item.sale_price && (
                      <div className="text-xs text-muted-foreground line-through">
                        {formatVND(item.price)}
                      </div>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(displayQty)}
                      {displayQty > 0 && displayQty <= LOW_STOCK_THRESHOLD && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Hiển thị {items.length} / {total} biến thể
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
