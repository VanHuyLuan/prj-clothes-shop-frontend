"use client";

import { Product } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface ProductViewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductViewDialog({
  product,
  open,
  onOpenChange,
}: ProductViewDialogProps) {
  
  // ⭐ FIX LỚN NHẤT: không return null để tránh lỗi Radix không cleanup body
  // luôn render Dialog để Radix UI hoạt động đúng
  
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);

    if (!open) {
      // ⭐ Quan trọng: reset pointer-events & overflow tránh bị khóa màn hình
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
        document.body.style.overflow = "auto";
      }, 30);
    }
  };

  const variants = product?.variants || [];
  const images = product?.images || [];
  const categories = product?.categories || [];
  const totalStock = variants.reduce((sum, v) => sum + v.stock_qty, 0);
  const prices = variants.map((v) => typeof v.price === 'number' ? v.price : parseFloat(v.price));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            View detailed information about this product
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)] pr-4">
          {product ? (
            <div className="space-y-6">
              {/* Product Images */}
              {images.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Images</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <Image
                          src={img.url}
                          alt={`Product image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Product Name
                  </label>
                  <p className="mt-1 text-lg font-semibold">{product.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Slug
                  </label>
                  <code className="mt-1 block text-sm bg-muted px-2 py-1 rounded">
                    {product.slug}
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Brand
                    </label>
                    <p className="mt-1">{product.brand || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          product.status === "active" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="mt-1 text-sm">{product.description || "—"}</p>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <Badge key={cat.id} variant="secondary">
                        {cat.name}
                      </Badge>
                    ))}
                    {categories.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        No categories
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Price Range
                    </label>
                    <p className="mt-1 text-lg font-semibold">
                      {minPrice === maxPrice
                        ? `$${minPrice.toFixed(2)}`
                        : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Total Stock
                    </label>
                    <p className="mt-1 text-lg font-semibold">{totalStock}</p>
                  </div>
                </div>

                {/* Variants */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Variants ({variants.length})
                  </label>
                  <div className="mt-2 space-y-2">
                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-md"
                      >
                        <div>
                          <div className="font-medium">
                            {variant.size} / {variant.color}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {variant.sku}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${(typeof variant.price === 'number' ? variant.price : parseFloat(variant.price)).toFixed(2)}
                          </div>
                          <Badge
                            variant={
                              variant.stock_qty > 50
                                ? "default"
                                : variant.stock_qty > 0
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            Stock: {variant.stock_qty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p className="mt-1 text-sm">
                      {new Date(product.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Updated At
                    </label>
                    <p className="mt-1 text-sm">
                      {new Date(product.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Product ID */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Product ID
                  </label>
                  <code className="mt-1 block text-xs bg-muted px-2 py-1 rounded break-all">
                    {product.id}
                  </code>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No product selected.</p>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
