"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion/dist/framer-motion";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock product data
const products = [
  {
    id: "PROD-001",
    name: "Classic White Tee",
    category: "T-Shirts",
    price: "$29.99",
    stock: 120,
    status: "In Stock",
  },
  {
    id: "PROD-002",
    name: "Slim Fit Jeans",
    category: "Pants",
    price: "$59.99",
    stock: 85,
    status: "In Stock",
  },
  {
    id: "PROD-003",
    name: "Casual Blazer",
    category: "Outerwear",
    price: "$89.99",
    stock: 42,
    status: "In Stock",
  },
  {
    id: "PROD-004",
    name: "Summer Dress",
    category: "Dresses",
    price: "$49.99",
    stock: 37,
    status: "In Stock",
  },
  {
    id: "PROD-005",
    name: "Leather Jacket",
    category: "Outerwear",
    price: "$199.99",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "PROD-006",
    name: "Wool Sweater",
    category: "Sweaters",
    price: "$69.99",
    stock: 15,
    status: "Low Stock",
  },
];

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Link href="/admin/products/new">
            <Button
              size="sm"
              className="group relative overflow-hidden rounded-full transition-all duration-300 hover:shadow-md"
            >
              <span className="relative z-10 flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80 opacity-100 transition-all duration-300 group-hover:opacity-80"></span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm rounded-md border-muted/30 focus-visible:ring-primary"
            />
          </div>
          <div className="rounded-md border border-muted/30">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
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
                          <DropdownMenuItem className="flex cursor-pointer items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex cursor-pointer items-center text-red-500 focus:text-red-500">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
