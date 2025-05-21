import { UserForm } from "@/components/admin/users/user-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Add New User - STYLISH Admin",
  description: "Add a new admin user to STYLISH clothing store",
};

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/users" />
          <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
        </div>
      </div>
      <UserForm />
    </div>
  );
}
