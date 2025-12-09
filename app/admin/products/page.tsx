import { ProductsClient } from "@/components/admin/products/products-client";

export const metadata = {
  title: "Products Management - STYLISH Admin",
  description: "Manage products for STYLISH clothing store",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
