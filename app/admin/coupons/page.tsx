import { CouponsTable } from "@/components/admin/coupons/coupons-table";
import { CouponsHeader } from "@/components/admin/coupons/coupons-header";

export const metadata = {
  title: "Coupons Management - STYLISH Admin",
  description: "Manage promotional coupons for STYLISH clothing store",
};

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <CouponsHeader />
      <CouponsTable />
    </div>
  );
}
