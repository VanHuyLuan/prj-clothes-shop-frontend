import { InventoryTable } from "@/components/admin/inventory/inventory-table";
import { InventoryHeader } from "@/components/admin/inventory/inventory-header";

export const metadata = {
  title: "Inventory Management - STYLISH Admin",
  description: "Manage inventory for STYLISH clothing store",
};

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <InventoryHeader />
      <InventoryTable />
    </div>
  );
}
