"use client";

import { TrendingUp, TrendingDown, ShoppingBag, Users, Package, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatVND } from "@/lib/utils";
import { DashboardStats } from "@/lib/api";

interface Props {
  metrics?: DashboardStats["metrics"];
}

function GrowthBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-xs text-muted-foreground">Chưa có dữ liệu tháng trước</span>;
  const positive = pct >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? "+" : ""}{pct.toFixed(1)}% so với tháng trước
    </span>
  );
}

export function DashboardMetrics({ metrics }: Props) {
  const cards = [
    {
      title: "Doanh thu tháng này",
      value: formatVND(metrics?.thisMonthRevenue ?? 0),
      growth: metrics?.revenueGrowthPct ?? null,
      sub: null,
      icon: DollarSign,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Đơn hàng tháng này",
      value: (metrics?.thisMonthOrders ?? 0).toLocaleString("vi-VN"),
      growth: metrics?.ordersGrowthPct ?? null,
      sub: `Tổng cộng: ${(metrics?.totalOrders ?? 0).toLocaleString("vi-VN")} đơn`,
      icon: ShoppingBag,
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      title: "Khách hàng",
      value: (metrics?.totalCustomers ?? 0).toLocaleString("vi-VN"),
      growth: metrics?.customersGrowthPct ?? null,
      sub: `+${(metrics?.thisMonthCustomers ?? 0)} tháng này`,
      icon: Users,
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Sản phẩm đang bán",
      value: (metrics?.totalProducts ?? 0).toLocaleString("vi-VN"),
      growth: null,
      sub: "Sản phẩm active",
      icon: Package,
      iconBg: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-bold">{card.value}</p>
            <GrowthBadge pct={card.growth} />
            {card.sub && (
              <p className="text-xs text-muted-foreground">{card.sub}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
