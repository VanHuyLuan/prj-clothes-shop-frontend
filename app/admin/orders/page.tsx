import { OrdersClient } from "@/components/admin/orders/orders-client";

export const metadata = {
  title: "Orders Management - STYLISH Admin",
  description: "Manage orders for STYLISH clothing store",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
