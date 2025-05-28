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
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react";
import { format } from "date-fns";

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

interface CouponsTableProps {
  coupons?: Coupon[];
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (couponId: string) => void;
  onView?: (coupon: Coupon) => void;
  onCopy?: (code: string) => void;
}

export function CouponsTable({
  coupons = [],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onCopy = () => {},
}: CouponsTableProps) {
  const mockCoupons: Coupon[] = [
    {
      id: "1",
      code: "SAVE20",
      description: "20% off on all items",
      type: "percentage",
      value: 20,
      minOrderValue: 100,
      usageLimit: 100,
      usedCount: 45,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      isActive: true,
    },
    {
      id: "2",
      code: "WELCOME50",
      description: "$50 off for new customers",
      type: "fixed",
      value: 50,
      minOrderValue: 200,
      usageLimit: 50,
      usedCount: 12,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-30"),
      isActive: true,
    },
    {
      id: "3",
      code: "SUMMER15",
      description: "Summer sale 15% discount",
      type: "percentage",
      value: 15,
      minOrderValue: 75,
      usageLimit: 200,
      usedCount: 189,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-08-31"),
      isActive: false,
    },
  ];

  const displayCoupons = coupons.length > 0 ? coupons : mockCoupons;

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    if (!coupon.isActive) return <Badge variant="secondary">Inactive</Badge>;
    if (now < coupon.startDate)
      return <Badge variant="outline">Scheduled</Badge>;
    if (now > coupon.endDate)
      return <Badge variant="destructive">Expired</Badge>;
    if (coupon.usedCount >= coupon.usageLimit)
      return <Badge variant="destructive">Used Up</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  const getUsageProgress = (used: number, limit: number) => {
    return (used / limit) * 100;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Valid Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayCoupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>
                <div>
                  <div className="font-mono font-medium">{coupon.code}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                    {coupon.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {coupon.type === "percentage" ? "Percentage" : "Fixed Amount"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {coupon.type === "percentage"
                    ? `${coupon.value}%`
                    : `$${coupon.value}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Min: ${coupon.minOrderValue}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </div>
                  <Progress
                    value={getUsageProgress(
                      coupon.usedCount,
                      coupon.usageLimit
                    )}
                    className="h-2"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{format(coupon.startDate, "MMM dd, yyyy")}</div>
                  <div className="text-muted-foreground">
                    to {format(coupon.endDate, "MMM dd, yyyy")}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(coupon)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(coupon)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopy(coupon.code)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(coupon)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(coupon.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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
