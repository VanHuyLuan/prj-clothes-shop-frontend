import { DashboardMetrics } from "@/components/admin/dashboard/dashboard-metrics";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";
import { TopProducts } from "@/components/admin/dashboard/top-products";
import { InventoryAlerts } from "@/components/admin/dashboard/inventory-alerts";

export const metadata = {
  title: "Admin Dashboard - STYLISH",
  description: "Admin dashboard for STYLISH clothing store",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopProducts />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <InventoryAlerts />
      </div>
    </div>
  );
}
