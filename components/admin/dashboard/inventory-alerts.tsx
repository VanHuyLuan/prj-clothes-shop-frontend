"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { DashboardStats } from "@/lib/api";

interface Props {
  alerts: DashboardStats["inventoryAlerts"];
}

export function InventoryAlerts({ alerts }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Inventory Alerts</CardTitle>
        <Link href="/admin/inventory" className="text-xs text-primary hover:underline">
          Manage
        </Link>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
            <CheckCircle className="h-8 w-8 text-green-500 opacity-60" />
            <p className="text-sm">Stock levels are healthy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-2 rounded-lg bg-orange-50 border border-orange-100">
                <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.productName}</p>
                  <code className="text-xs text-muted-foreground">{alert.sku}</code>
                </div>
                <Badge
                  variant="outline"
                  className={`flex-shrink-0 text-xs ${
                    alert.stock_qty === 0
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-orange-100 text-orange-800 border-orange-200"
                  }`}
                >
                  {alert.stock_qty === 0 ? "Out of stock" : `${alert.stock_qty} left`}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
