import { InventoryClient } from "@/components/admin/inventory/inventory-client";

export const metadata = {
  title: "Inventory Management - STYLISH Admin",
  description: "Manage inventory for STYLISH clothing store",
};

export default function InventoryPage() {
  return <InventoryClient />;
}
