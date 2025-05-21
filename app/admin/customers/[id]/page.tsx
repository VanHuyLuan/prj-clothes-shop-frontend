import { CustomerDetails } from "@/components/admin/customers/customer-details";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Customer Details - STYLISH Admin",
  description: "View and manage customer details for STYLISH clothing store",
};

export default function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/customers" />
          <h1 className="text-3xl font-bold tracking-tight">
            Customer Profile
          </h1>
        </div>
      </div>
      <CustomerDetails id={params.id} />
    </div>
  );
}
