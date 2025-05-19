import { ProductList } from "@/components/admin/product-list";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
      </div>
      <ProductList />
    </div>
  );
}
