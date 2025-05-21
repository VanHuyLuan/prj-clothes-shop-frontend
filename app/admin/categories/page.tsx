import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoriesHeader } from "@/components/admin/categories/categories-header";

export const metadata = {
  title: "Categories Management - STYLISH Admin",
  description: "Manage product categories for STYLISH clothing store",
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <CategoriesHeader />
      <CategoriesTable />
    </div>
  );
}
