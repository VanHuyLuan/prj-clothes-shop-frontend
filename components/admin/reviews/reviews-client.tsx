"use client";

import { useState } from "react";
import { ReviewsTable } from "@/components/admin/reviews/reviews-table";
import { ReviewsHeader } from "@/components/admin/reviews/reviews-header";

export function ReviewsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Thêm logic lọc cho ReviewsTable tại đây nếu cần
  };

  const handleRatingFilterChange = (rating: string) => {
    setRatingFilter(rating);
    // Thêm logic lọc cho ReviewsTable tại đây nếu cần
  };

  return (
    <div className="space-y-6">
      <ReviewsHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        ratingFilter={ratingFilter}
        onRatingFilterChange={handleRatingFilterChange}
      />
      <ReviewsTable />
    </div>
  );
}
