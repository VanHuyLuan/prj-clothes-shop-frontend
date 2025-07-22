import { UsersClient } from "@/components/admin/users/users-client";

export const metadata = {
  title: "User Management - STYLISH Admin",
  description: "Manage admin users for STYLISH clothing store",
};

export default function UsersPage() {
  return <UsersClient />;
}
