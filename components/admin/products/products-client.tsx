"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductsHeader } from "@/components/admin/products/products-header";
import ApiService, { Product } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function ProductsClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProducts({
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        page,
        limit: 10,
      });
      setProducts(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, statusFilter, page]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await ApiService.deleteProduct(id);
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <ProductsHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />
      <ProductsTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
