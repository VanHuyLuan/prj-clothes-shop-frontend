"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ReviewsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  ratingFilter: string;
  onRatingFilterChange: (rating: string) => void;
  pendingReviewsCount?: number;
}

export function ReviewsHeader({
  searchQuery,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  pendingReviewsCount = 3,
}: ReviewsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Monitor and manage customer product reviews
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>

          <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {pendingReviewsCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Star className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            <Badge variant="default" className="mr-2">
              {pendingReviewsCount}
            </Badge>
            reviews are pending moderation
          </span>
        </div>
      )}
    </div>
  );
}
