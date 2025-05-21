import { CouponForm } from "@/components/admin/coupons/coupon-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Add New Coupon - STYLISH Admin",
  description: "Add a new promotional coupon to STYLISH clothing store",
};

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/coupons" />
          <h1 className="text-3xl font-bold tracking-tight">Add New Coupon</h1>
        </div>
      </div>
      <CouponForm />
    </div>
  );
}
