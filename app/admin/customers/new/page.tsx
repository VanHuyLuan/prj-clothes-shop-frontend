import { CustomerForm } from "@/components/admin/customers/customer-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Add New Customer - STYLISH Admin",
  description: "Add a new customer to STYLISH clothing store",
};

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/customers" />
          <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
        </div>
      </div>
      <CustomerForm />
    </div>
  );
}
