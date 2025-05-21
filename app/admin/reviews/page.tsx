import { ReviewsTable } from "@/components/admin/reviews/reviews-table";
import { ReviewsHeader } from "@/components/admin/reviews/reviews-header";

export const metadata = {
  title: "Reviews Management - STYLISH Admin",
  description: "Manage product reviews for STYLISH clothing store",
};

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <ReviewsHeader />
      <ReviewsTable />
    </div>
  );
}
