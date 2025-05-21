"use client";

import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesDataPoint {
  timestamp: string;
  revenue: number;
  orders: number;
}

interface RealtimeSalesChartProps {
  data: SalesDataPoint[];
  detailed?: boolean;
}

export function RealtimeSalesChart({
  data,
  detailed = false,
}: RealtimeSalesChartProps) {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      fill?: boolean;
      hidden?: boolean;
      borderDash?: number[];
      yAxisID?: string;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: "Revenue ($)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Orders",
        data: [],
        borderColor: "rgba(53, 162, 235, 1)",
        backgroundColor: "rgba(53, 162, 235, 0)",
        tension: 0.4,
        borderDash: detailed ? [] : [5, 5],
        yAxisID: "y1",
      },
    ],
  });

  const [timeRange, setTimeRange] = useState("1h");
  const [dataType, setDataType] = useState("both");

  // Update chart when data changes
  useEffect(() => {
    if (data.length === 0) return;

    // Format the data for the chart
    const labels = data.map((item) => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    const revenueData = data.map((item) => item.revenue);
    const ordersData = data.map((item) => item.orders);

    setChartData({
      labels,
      datasets: [
        {
          label: "Revenue ($)",
          data: revenueData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
          hidden: dataType === "orders",
        },
        {
          label: "Orders",
          data: ordersData,
          borderColor: "rgba(53, 162, 235, 1)",
          backgroundColor: "rgba(53, 162, 235, 0)",
          tension: 0.4,
          borderDash: detailed ? [] : [5, 5],
          yAxisID: "y1",
          hidden: dataType === "revenue",
        },
      ],
    });

    // Animate the chart when new data comes in
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [data, dataType, detailed]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
    },
    scales: {
      x: {
        grid: {
          display: detailed,
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: detailed,
          text: "Revenue ($)",
        },
        grid: {
          display: true,
        },
      },
      y1: {
        position: "right" as const,
        beginAtZero: true,
        title: {
          display: detailed,
          text: "Orders",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <div className="space-y-4">
      {detailed && (
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">Last 15 min</SelectItem>
              <SelectItem value="30m">Last 30 min</SelectItem>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="4h">Last 4 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Data Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Revenue & Orders</SelectItem>
              <SelectItem value="revenue">Revenue Only</SelectItem>
              <SelectItem value="orders">Orders Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className={detailed ? "h-[400px]" : "h-[300px]"}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>

      {detailed && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                Peak Revenue
              </div>
              <div className="text-xl font-bold">
                $
                {Math.max(...data.map((item) => item.revenue)).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                Peak Orders
              </div>
              <div className="text-xl font-bold">
                {Math.max(...data.map((item) => item.orders))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </div>
              <div className="text-xl font-bold">
                $
                {(
                  data.reduce((sum, item) => sum + item.revenue, 0) /
                  data.reduce((sum, item) => sum + item.orders, 0)
                ).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">
                Total Orders
              </div>
              <div className="text-xl font-bold">
                {data.reduce((sum, item) => sum + item.orders, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
