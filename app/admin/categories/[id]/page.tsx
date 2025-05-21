import { CategoryForm } from "@/components/admin/categories/category-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Edit Category - STYLISH Admin",
  description: "Edit category details for STYLISH clothing store",
};

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/categories" />
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        </div>
      </div>
      <CategoryForm id={params.id} />
    </div>
  );
}
