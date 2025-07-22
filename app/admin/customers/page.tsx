import { CustomersClient } from "@/components/admin/customers/customers-client";

export const metadata = {
  title: "Customers Management - STYLISH Admin",
  description: "Manage customers for STYLISH clothing store",
};

export default function CustomersPage() {
  return <CustomersClient />;
}
