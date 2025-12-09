"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Product } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ProductViewDialog } from "./product-view-dialog";
import { ProductDeleteDialog } from "./product-delete-dialog";

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductsTable({
  products,
  loading = false,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: ProductsTableProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  /************************************************************
   *  FIX 1 — View Dialog logic chuẩn Radix
   ************************************************************/
  const openViewDialog = (product: Product) => {
    setViewProduct(product);
    setViewOpen(true);
  };

  const closeViewDialog = () => {
    setViewOpen(false);
    setTimeout(() => {
      setViewProduct(null);
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }, 30);
  };

  /************************************************************
   *  FIX 2 — Delete Dialog logic chuẩn Radix
   ************************************************************/
  const openDeleteDialog = (product: Product) => {
    setDeleteProduct(product);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setTimeout(() => {
      setDeleteProduct(null);
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }, 30);
  };

  /************************************************************
   *  Delete handler
   ************************************************************/
  const handleDelete = async () => {
    if (!deleteProduct) return;

    setDeleting(true);
    try {
      await onDelete?.(deleteProduct.id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      closeDeleteDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  /************************************************************
   *  Loading & Empty State
   ************************************************************/
  if (loading) {
    return (
      <Card className="border-muted/30 p-8 text-center">
        <p className="text-muted-foreground">Loading products...</p>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="border-muted/30 p-8 text-center">
        <p className="text-muted-foreground">No products found.</p>
      </Card>
    );
  }

  /************************************************************
   *  TABLE RENDER
   ************************************************************/
  return (
    <Card className="border-muted/30">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                  onCheckedChange={() => {
                    if (selectedProducts.length === products.length) {
                      setSelectedProducts([]);
                    } else {
                      setSelectedProducts(products.map((p) => p.id));
                    }
                  }}
                />
              </TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Total Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => {
              const variants = product.variants || [];
              const prices = variants.map((v) => parseFloat(v.price));
              const minPrice = prices.length ? Math.min(...prices) : 0;
              const maxPrice = prices.length ? Math.max(...prices) : 0;
              const categories = product.categories || [];
              const images = product.images || [];
              const totalStock = variants.reduce((s, v) => s + v.stock_qty, 0);

              return (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => {
                        if (selectedProducts.includes(product.id)) {
                          setSelectedProducts(
                            selectedProducts.filter((id) => id !== product.id)
                          );
                        } else {
                          setSelectedProducts([...selectedProducts, product.id]);
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={images[0]?.url || "/placeholder.svg"}
                        alt={images[0]?.alt_text || product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    <div
                      onClick={() => router.push(`/admin/products/${product.id}`)}
                      className="cursor-pointer hover:underline"
                    >
                      {product.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.slug}
                    </div>
                  </TableCell>

                  <TableCell>{product.brand || "—"}</TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {categories.map((c) => (
                        <Badge key={c.id} variant="secondary">
                          {c.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{variants.length}</Badge>
                  </TableCell>

                  <TableCell>
                    {minPrice === maxPrice
                      ? `$${minPrice.toFixed(2)}`
                      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        totalStock > 50
                          ? "default"
                          : totalStock > 0
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {totalStock}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active" ? "default" : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-muted/80"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewDialog(product)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/products/${product.id}`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(product)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-4">
          <div className="text-sm text-muted-foreground">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>

          <Pagination>
            <PaginationContent className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <Button
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ⭐ View Dialog */}
      <ProductViewDialog
        product={viewProduct}
        open={viewOpen}
        onOpenChange={(open) => {
          if (open) setViewOpen(true);
          else closeViewDialog();
        }}
      />

      {/* ⭐ Delete Dialog */}
      <ProductDeleteDialog
        product={deleteProduct}
        open={deleteOpen}
        loading={deleting}
        onConfirm={handleDelete}
        onOpenChange={(open) => {
          if (open) setDeleteOpen(true);
          else closeDeleteDialog();
        }}
      />
    </Card>
  );
}
