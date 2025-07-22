import { ReviewsClient } from "@/components/admin/reviews/reviews-client";

export const metadata = {
  title: "Reviews Management - STYLISH Admin",
  description: "Manage product reviews for STYLISH clothing store",
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
