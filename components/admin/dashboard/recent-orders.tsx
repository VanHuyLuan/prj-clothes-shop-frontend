"use client";

import { useEffect, useState } from "react";
import { MotionDiv, MotionTR } from "@/components/providers/motion-provider";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-04-15",
    amount: "$125.99",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2023-04-14",
    amount: "$89.50",
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2023-04-14",
    amount: "$254.00",
    status: "completed",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    date: "2023-04-13",
    amount: "$45.25",
    status: "shipped",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    date: "2023-04-12",
    amount: "$189.75",
    status: "cancelled",
  },
];

export function RecentOrders() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center text-sm text-primary hover:underline"
          >
            View All
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order, index) => (
                <MotionTR
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "processing"
                          ? "secondary"
                          : order.status === "shipped"
                          ? "outline"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </MotionTR>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
