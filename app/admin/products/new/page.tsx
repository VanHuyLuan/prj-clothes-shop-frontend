import { ProductForm } from "@/components/admin/products/product-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Add New Product - STYLISH Admin",
  description: "Add a new product to STYLISH clothing store",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/products" />
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
