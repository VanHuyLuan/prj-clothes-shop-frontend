"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesOverview } from "@/components/admin/analytics/sales-overview";
import { ProductPerformance } from "@/components/admin/analytics/product-performance";
import { CustomerAnalytics } from "@/components/admin/analytics/customer-analytics";
import { InventoryAnalytics } from "@/components/admin/analytics/inventory-analytics";
import { GeographicSales } from "@/components/admin/analytics/geographic-sales";
import { SalesForecast } from "@/components/admin/analytics/sales-forecast";
import { MarketingAnalytics } from "@/components/admin/analytics/marketing-analytics";

export function AnalyticsTabs() {
  return (
    <Tabs defaultValue="sales" className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="geographic">Geographic</TabsTrigger>
        <TabsTrigger value="forecast">Forecast</TabsTrigger>
        <TabsTrigger value="marketing">Marketing</TabsTrigger>
      </TabsList>
      <TabsContent value="sales" className="space-y-6">
        <SalesOverview />
      </TabsContent>
      <TabsContent value="products" className="space-y-6">
        <ProductPerformance />
      </TabsContent>
      <TabsContent value="customers" className="space-y-6">
        <CustomerAnalytics />
      </TabsContent>
      <TabsContent value="inventory" className="space-y-6">
        <InventoryAnalytics />
      </TabsContent>
      <TabsContent value="geographic" className="space-y-6">
        <GeographicSales />
      </TabsContent>
      <TabsContent value="forecast" className="space-y-6">
        <SalesForecast />
      </TabsContent>
      <TabsContent value="marketing" className="space-y-6">
        <MarketingAnalytics />
      </TabsContent>
    </Tabs>
  );
}
