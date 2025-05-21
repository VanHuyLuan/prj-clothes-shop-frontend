import { AnalyticsTabs } from "@/components/admin/analytics/analytics-tabs";

export const metadata = {
  title: "Sales Analytics - STYLISH Admin",
  description:
    "Advanced sales analytics and reporting for STYLISH clothing store",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive sales analytics and reporting
          </p>
        </div>
      </div>
      <AnalyticsTabs />
    </div>
  );
}
