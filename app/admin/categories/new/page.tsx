import { CategoryForm } from "@/components/admin/categories/category-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Add New Category - STYLISH Admin",
  description: "Add a new product category to STYLISH clothing store",
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/categories" />
          <h1 className="text-3xl font-bold tracking-tight">
            Add New Category
          </h1>
        </div>
      </div>
      <CategoryForm />
    </div>
  );
}
