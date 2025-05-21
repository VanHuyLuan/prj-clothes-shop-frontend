import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersHeader } from "@/components/admin/orders/orders-header";

export const metadata = {
  title: "Orders Management - STYLISH Admin",
  description: "Manage orders for STYLISH clothing store",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <OrdersHeader />
      <OrdersTable />
    </div>
  );
}
