"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Flag,
  Star,
} from "lucide-react";

interface Review {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  product: {
    name: string;
    image: string;
  };
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  helpful: number;
  verified: boolean;
}

interface ReviewsTableProps {
  reviews?: Review[];
  onView?: (review: Review) => void;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  onFlag?: (reviewId: string) => void;
}

export function ReviewsTable({
  reviews = [],
  onView = () => {},
  onApprove = () => {},
  onReject = () => {},
  onFlag = () => {},
}: ReviewsTableProps) {
  const mockReviews: Review[] = [
    {
      id: "1",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      product: {
        name: "Classic White T-Shirt",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      title: "Perfect fit and quality!",
      comment:
        "This t-shirt is exactly what I was looking for. The fabric is soft and comfortable, and the fit is perfect. Highly recommended!",
      date: "2024-01-20",
      status: "approved",
      helpful: 12,
      verified: true,
    },
    {
      id: "2",
      customer: {
        name: "Michael Chen",
        email: "michael.chen@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      product: {
        name: "Denim Jacket",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      title: "Good quality but runs small",
      comment:
        "The jacket is well-made and looks great, but I would recommend ordering a size up as it runs small.",
      date: "2024-01-19",
      status: "pending",
      helpful: 5,
      verified: true,
    },
    {
      id: "3",
      customer: {
        name: "Emily Davis",
        email: "emily.davis@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      product: {
        name: "Summer Dress",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 2,
      title: "Not as expected",
      comment:
        "The dress arrived with some loose threads and the color was different from the photos. Disappointed with the quality.",
      date: "2024-01-18",
      status: "flagged",
      helpful: 2,
      verified: false,
    },
    {
      id: "4",
      customer: {
        name: "James Wilson",
        email: "james.wilson@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      product: {
        name: "Running Shoes",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      title: "Excellent shoes!",
      comment:
        "These shoes are incredibly comfortable and perfect for running. Great value for money!",
      date: "2024-01-17",
      status: "approved",
      helpful: 18,
      verified: true,
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : mockReviews;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "flagged":
        return <Badge variant="destructive">Flagged</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Helpful</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayReviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.customer.avatar || "/placeholder.svg"}
                      alt={review.customer.name}
                    />
                    <AvatarFallback>
                      {review.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {review.customer.name}
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {review.customer.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.product.image || "/placeholder.svg"}
                      alt={review.product.name}
                    />
                    <AvatarFallback>
                      {review.product.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{review.product.name}</div>
                </div>
              </TableCell>
              <TableCell>{renderStars(review.rating)}</TableCell>
              <TableCell>
                <div className="max-w-[300px]">
                  <div className="font-medium text-sm">{review.title}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {review.comment}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(review.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{getStatusBadge(review.status)}</TableCell>
              <TableCell>
                <Badge variant="outline">{review.helpful} helpful</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(review)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Review
                    </DropdownMenuItem>
                    {review.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => onApprove(review.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReject(review.id)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => onFlag(review.id)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Flag Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
