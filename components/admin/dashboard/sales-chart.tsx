"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/lib/api";
import { formatVND } from "@/lib/utils";

interface Props {
  salesChart?: DashboardStats["salesChart"];
}

type Period = "week" | "month" | "year";

export function SalesChart({ salesChart }: Props) {
  const [period, setPeriod] = useState<Period>("week");

  const current = salesChart?.[period];
  const labels = current?.labels ?? [];
  const data = current?.data ?? [];
  const maxVal = Math.max(...data, 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Revenue</CardTitle>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="h-8">
            <TabsTrigger value="week" className="text-xs px-3">7 days</TabsTrigger>
            <TabsTrigger value="month" className="text-xs px-3">Month</TabsTrigger>
            <TabsTrigger value="year" className="text-xs px-3">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {data.every(v => v === 0) ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            No revenue data yet
          </div>
        ) : (
          <div className="space-y-3">
            {/* Bar chart */}
            <div className="flex items-end gap-1 h-48">
              {data.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex flex-col justify-end" style={{ height: "168px" }}>
                    <div
                      className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all duration-300 cursor-default"
                      style={{ height: `${(val / maxVal) * 100}%`, minHeight: val > 0 ? "4px" : "0" }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {formatVND(val)}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                    {labels[i]}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-muted-foreground">Total this period</span>
              <span className="font-semibold">{formatVND(data.reduce((a, b) => a + b, 0))}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
