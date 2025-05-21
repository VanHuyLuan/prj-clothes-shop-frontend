import { OrderDetails } from "@/components/admin/orders/order-details";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Order Details - STYLISH Admin",
  description: "View and manage order details for STYLISH clothing store",
};

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/orders" />
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{params.id}
          </h1>
        </div>
      </div>
      <OrderDetails id={params.id} />
    </div>
  );
}
