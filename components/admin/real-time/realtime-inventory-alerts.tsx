"use client";

import { AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingDown, TrendingUp, Package } from "lucide-react";
import { MotionDiv } from "@/components/providers/motion-provider";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface InventoryAlert {
  id: string;
  product: string;
  type: "low_stock" | "out_of_stock" | "restock" | "overstock";
  quantity: number;
  threshold: number;
  timestamp: string;
  isNew?: boolean;
}

interface RealtimeInventoryAlertsProps {
  alerts: InventoryAlert[];
  detailed?: boolean;
}

export function RealtimeInventoryAlerts({
  alerts,
  detailed = false,
}: RealtimeInventoryAlertsProps) {
  const getAlertIcon = (type: InventoryAlert["type"]) => {
    switch (type) {
      case "low_stock":
        return <TrendingDown className="h-4 w-4 text-amber-500" />;
      case "out_of_stock":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "restock":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "overstock":
        return <Package className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertTitle = (type: InventoryAlert["type"]) => {
    switch (type) {
      case "low_stock":
        return "Low Stock";
      case "out_of_stock":
        return "Out of Stock";
      case "restock":
        return "Restocked";
      case "overstock":
        return "Overstock";
    }
  };

  const getAlertColor = (type: InventoryAlert["type"]) => {
    switch (type) {
      case "low_stock":
        return "bg-amber-100 text-amber-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      case "restock":
        return "bg-green-100 text-green-800";
      case "overstock":
        return "bg-blue-100 text-blue-800";
    }
  };

  const getProgressColor = (
    type: InventoryAlert["type"]
    // quantity: number,
    // threshold: number
  ) => {
    if (type === "out_of_stock") return "bg-red-500";
    if (type === "low_stock") return "bg-amber-500";
    if (type === "overstock") return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <ScrollArea className={detailed ? "h-[400px]" : "h-[240px]"}>
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <MotionDiv
              key={alert.id}
              initial={
                alert.isNew ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg border p-3 ${
                alert.isNew ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-1 ${
                      alert.type === "low_stock"
                        ? "bg-amber-100"
                        : alert.type === "out_of_stock"
                        ? "bg-red-100"
                        : alert.type === "restock"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{alert.product}</p>
                      {alert.isNew && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getAlertColor(alert.type)}
                      >
                        {getAlertTitle(alert.type)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {detailed && (
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                )}
              </div>

              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>Quantity: {alert.quantity}</span>
                  <span>Threshold: {alert.threshold}</span>
                </div>
                <Progress
                  value={
                    alert.type === "out_of_stock"
                      ? 0
                      : (alert.quantity / alert.threshold) * 100
                  }
                  max={100}
                  className={`h-2 [&>div]:${getProgressColor(alert.type)}`}
                />
              </div>

              {detailed && (
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    View Product
                  </Button>
                  <Button size="sm">Order Stock</Button>
                </div>
              )}
            </MotionDiv>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="flex h-[100px] items-center justify-center text-center text-sm text-muted-foreground">
            No inventory alerts
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
