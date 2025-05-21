import { UserForm } from "@/components/admin/users/user-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Edit User - STYLISH Admin",
  description: "Edit user details for STYLISH clothing store",
};

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/users" />
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        </div>
      </div>
      <UserForm id={params.id} />
    </div>
  );
}
