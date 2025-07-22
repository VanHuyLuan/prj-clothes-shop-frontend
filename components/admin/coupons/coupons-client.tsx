// components/admin/coupons/coupons-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CouponsTable } from "@/components/admin/coupons/coupons-table";
import { CouponsHeader } from "@/components/admin/coupons/coupons-header";

export function CouponsClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddCoupon = () => {
    router.push("/admin/coupons/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Thêm logic lọc cho CouponsTable tại đây nếu cần
  };

  return (
    <div className="space-y-6">
      <CouponsHeader
        onAddCoupon={handleAddCoupon}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <CouponsTable />
    </div>
  );
}
