"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion/dist/framer-motion";
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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export function SalesChart() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mock data for the chart
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const yearData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: [
          18000, 22000, 19500, 24000, 25500, 27000, 29500, 32000, 34500, 36000,
          42000, 45000,
        ],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "rgba(var(--primary), 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const monthData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Revenue",
        data: [9500, 12000, 11500, 14000],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "rgba(var(--primary), 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const weekData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1900, 1700, 2100, 2500, 3200, 2800],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "rgba(var(--primary), 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            View your store&apos;s sales performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="year">
            <TabsList className="mb-4">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="h-[300px]">
              <Line data={weekData} options={options} />
            </TabsContent>
            <TabsContent value="month" className="h-[300px]">
              <Line data={monthData} options={options} />
            </TabsContent>
            <TabsContent value="year" className="h-[300px]">
              <Line data={yearData} options={options} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
