import { UsersTable } from "@/components/admin/users/users-table";
import { UsersHeader } from "@/components/admin/users/users-header";

export const metadata = {
  title: "User Management - STYLISH Admin",
  description: "Manage admin users for STYLISH clothing store",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <UsersHeader />
      <UsersTable />
    </div>
  );
}
