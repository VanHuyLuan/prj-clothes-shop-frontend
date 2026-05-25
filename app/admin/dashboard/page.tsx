"use client";

import { useEffect, useState } from "react";
import { ApiService, DashboardStats } from "@/lib/api";
import { DashboardMetrics } from "@/components/admin/dashboard/dashboard-metrics";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";
import { TopProducts } from "@/components/admin/dashboard/top-products";
import { InventoryAlerts } from "@/components/admin/dashboard/inventory-alerts";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardMetrics metrics={stats?.metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart salesChart={stats?.salesChart} />
        <TopProducts topProducts={stats?.topProducts ?? []} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders recentOrders={stats?.recentOrders ?? []} />
        </div>
        <InventoryAlerts alerts={stats?.inventoryAlerts ?? []} />
      </div>
    </div>
  );
}
