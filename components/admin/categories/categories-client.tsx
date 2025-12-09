// components/admin/categories/categories-client.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoriesHeader } from "@/components/admin/categories/categories-header";
import ApiService, { Category } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function CategoriesClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getCategories({
        search: searchQuery || undefined,
      });
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery]);

  const handleAddCategory = () => {
    router.push("/admin/categories/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleDelete = async (id: string) => {
    try {
      await ApiService.deleteCategory(id);
      toast({
        title: "Success",
        description: "Category deleted successfully.",
      });
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. It may be in use.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <CategoriesHeader
        onAddCategory={handleAddCategory}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <CategoriesTable 
        categories={categories} 
        loading={loading} 
        onDelete={handleDelete}
      />
    </div>
  );
}
