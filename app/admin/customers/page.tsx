import { CustomersTable } from "@/components/admin/customers/customers-table";
import { CustomersHeader } from "@/components/admin/customers/customers-header";

export const metadata = {
  title: "Customers Management - STYLISH Admin",
  description: "Manage customers for STYLISH clothing store",
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <CustomersHeader />
      <CustomersTable />
    </div>
  );
}
