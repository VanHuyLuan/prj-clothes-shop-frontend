import { ProductForm } from "@/components/admin/products/product-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Edit Product - STYLISH Admin",
  description: "Edit product details for STYLISH clothing store",
};

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/products" />
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        </div>
      </div>
      <ProductForm id={params.id} />
    </div>
  );
}
