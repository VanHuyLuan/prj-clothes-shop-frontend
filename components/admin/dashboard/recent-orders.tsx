"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingBag } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { DashboardStats } from "@/lib/api";

interface Props {
  recentOrders: DashboardStats["recentOrders"];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:    { label: "Chờ xử lý",   className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed:  { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800 border-blue-200" },
  processing: { label: "Đang xử lý",  className: "bg-blue-100 text-blue-800 border-blue-200" },
  shipped:    { label: "Đang giao",   className: "bg-purple-100 text-purple-800 border-purple-200" },
  delivered:  { label: "Đã giao",     className: "bg-green-100 text-green-800 border-green-200" },
  cancelled:  { label: "Đã huỷ",      className: "bg-red-100 text-red-800 border-red-200" },
};

export function RecentOrders({ recentOrders }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Đơn hàng gần đây</CardTitle>
        <Link href="/admin/orders" className="text-xs text-primary hover:underline">
          Xem tất cả
        </Link>
      </CardHeader>
      <CardContent>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
            <ShoppingBag className="h-8 w-8 opacity-30" />
            <p className="text-sm">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => {
                const s = statusConfig[order.status] ?? { label: order.status, className: "bg-muted text-muted-foreground" };
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs hover:text-primary">
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{order.customer}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{formatVND(order.total_amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${s.className}`}>
                        {s.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
