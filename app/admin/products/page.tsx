import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductsHeader } from "@/components/admin/products/products-header";

export const metadata = {
  title: "Products Management - STYLISH Admin",
  description: "Manage products for STYLISH clothing store",
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <ProductsHeader />
      <ProductsTable />
    </div>
  );
}
