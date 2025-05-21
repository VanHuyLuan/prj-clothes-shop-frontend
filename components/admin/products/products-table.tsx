"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, MoreHorizontal, Trash, Eye, Copy } from "lucide-react";

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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for products
const products = [
  {
    id: "PROD-001",
    name: "Classic White Tee",
    image: "/placeholder.svg?height=40&width=40",
    category: "T-Shirts",
    price: "$29.99",
    stock: 120,
    status: "In Stock",
    featured: true,
  },
  {
    id: "PROD-002",
    name: "Slim Fit Jeans",
    image: "/placeholder.svg?height=40&width=40",
    category: "Pants",
    price: "$59.99",
    stock: 85,
    status: "In Stock",
    featured: false,
  },
  {
    id: "PROD-003",
    name: "Casual Blazer",
    image: "/placeholder.svg?height=40&width=40",
    category: "Outerwear",
    price: "$89.99",
    stock: 42,
    status: "In Stock",
    featured: true,
  },
  {
    id: "PROD-004",
    name: "Summer Dress",
    image: "/placeholder.svg?height=40&width=40",
    category: "Dresses",
    price: "$49.99",
    stock: 37,
    status: "In Stock",
    featured: false,
  },
  {
    id: "PROD-005",
    name: "Leather Jacket",
    image: "/placeholder.svg?height=40&width=40",
    category: "Outerwear",
    price: "$199.99",
    stock: 0,
    status: "Out of Stock",
    featured: false,
  },
  {
    id: "PROD-006",
    name: "Wool Sweater",
    image: "/placeholder.svg?height=40&width=40",
    category: "Sweaters",
    price: "$69.99",
    stock: 15,
    status: "Low Stock",
    featured: false,
  },
  {
    id: "PROD-007",
    name: "Floral Blouse",
    image: "/placeholder.svg?height=40&width=40",
    category: "Tops",
    price: "$39.99",
    stock: 28,
    status: "In Stock",
    featured: true,
  },
  {
    id: "PROD-008",
    name: "Denim Shorts",
    image: "/placeholder.svg?height=40&width=40",
    category: "Shorts",
    price: "$34.99",
    stock: 53,
    status: "In Stock",
    featured: false,
  },
  {
    id: "PROD-009",
    name: "Striped Polo",
    image: "/placeholder.svg?height=40&width=40",
    category: "Polos",
    price: "$44.99",
    stock: 67,
    status: "In Stock",
    featured: false,
  },
  {
    id: "PROD-010",
    name: "Pleated Skirt",
    image: "/placeholder.svg?height=40&width=40",
    category: "Skirts",
    price: "$54.99",
    stock: 31,
    status: "In Stock",
    featured: true,
  },
];

export function ProductsTable() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
  };

  const toggleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

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
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all products"
                />
              </TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleSelectProduct(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="hover:underline"
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "In Stock"
                        ? "default"
                        : product.status === "Low Stock"
                        ? "secondary"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {product.featured ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 hover:bg-amber-50"
                    >
                      Featured
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
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
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="flex cursor-pointer items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex cursor-pointer items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex cursor-pointer items-center">
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex cursor-pointer items-center text-red-500 focus:text-red-500">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t px-4 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>42</strong> products
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}
