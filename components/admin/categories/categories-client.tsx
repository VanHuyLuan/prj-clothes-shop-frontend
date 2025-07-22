// components/admin/categories/categories-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoriesHeader } from "@/components/admin/categories/categories-header";

export function CategoriesClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddCategory = () => {
    router.push("/admin/categories/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Bạn có thể thêm logic để lọc `CategoriesTable` dựa trên query ở đây
  };

  return (
    <div className="space-y-6">
      <CategoriesHeader
        onAddCategory={handleAddCategory}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <CategoriesTable />
    </div>
  );
}
