import { CouponForm } from "@/components/admin/coupons/coupon-form";
import { BackButton } from "@/components/admin/shared/back-button";

export const metadata = {
  title: "Edit Coupon - STYLISH Admin",
  description: "Edit coupon details for STYLISH clothing store",
};

export default function EditCouponPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/admin/coupons" />
          <h1 className="text-3xl font-bold tracking-tight">Edit Coupon</h1>
        </div>
      </div>
      <CouponForm id={params.id} />
    </div>
  );
}
