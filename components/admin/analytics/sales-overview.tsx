"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Chart } from "react-chartjs-2";
import { CalendarIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function SalesOverview() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Revenue by channel data
  const revenueByChannelData = {
    labels: [
      "Online Store",
      "Marketplace",
      "Social Media",
      "Retail Stores",
      "Wholesale",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [45000, 28000, 15000, 32000, 18000],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Revenue vs Orders data
  const revenueVsOrdersData = {
    labels: [
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
    ],
    datasets: [
      {
        type: "line" as const,
        label: "Revenue",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        fill: false,
        data: [
          18000, 22000, 19500, 24000, 25500, 27000, 29500, 32000, 34500, 36000,
          42000, 45000,
        ],
        yAxisID: "y",
      },
      {
        type: "bar" as const,
        label: "Orders",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        data: [150, 180, 160, 200, 210, 220, 240, 260, 280, 290, 340, 360],
        yAxisID: "y1",
      },
    ],
  };

  // Sales by category data
  const salesByCategoryData = {
    labels: [
      "T-Shirts",
      "Pants",
      "Dresses",
      "Outerwear",
      "Sweaters",
      "Accessories",
    ],
    datasets: [
      {
        label: "Sales",
        data: [35, 25, 22, 18, 15, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Hourly sales distribution data
  const hourlySalesData = {
    labels: [
      "12am",
      "1am",
      "2am",
      "3am",
      "4am",
      "5am",
      "6am",
      "7am",
      "8am",
      "9am",
      "10am",
      "11am",
      "12pm",
      "1pm",
      "2pm",
      "3pm",
      "4pm",
      "5pm",
      "6pm",
      "7pm",
      "8pm",
      "9pm",
      "10pm",
      "11pm",
    ],
    datasets: [
      {
        label: "Orders",
        data: [
          5, 3, 2, 1, 1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 38, 35, 42, 45, 48,
          40, 35, 25, 15, 8,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Orders",
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Overview</h2>
          <p className="text-muted-foreground">
            Comprehensive analysis of your store&apos;s sales performance
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left sm:w-auto"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange(range as { from: Date; to: Date })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Select defaultValue="daily">
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Revenue vs Orders</CardTitle>
              <CardDescription>
                Comparison of revenue and order volume over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Chart
                  type="bar"
                  data={revenueVsOrdersData}
                  options={lineChartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>
                Distribution of sales across product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <Doughnut
                  data={salesByCategoryData}
                  options={doughnutChartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Revenue by Channel</CardTitle>
              <CardDescription>
                Revenue distribution across different sales channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Bar data={revenueByChannelData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Hourly Sales Distribution</CardTitle>
              <CardDescription>Order volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Line
                  data={hourlySalesData}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Sales Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators for your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Average Order Value
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">$125.42</p>
                  <span className="text-sm font-medium text-green-500">
                    +12.3%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Conversion Rate
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">3.2%</p>
                  <span className="text-sm font-medium text-green-500">
                    +0.8%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Cart Abandonment Rate
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">68.5%</p>
                  <span className="text-sm font-medium text-red-500">
                    +2.1%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Return Rate
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">5.8%</p>
                  <span className="text-sm font-medium text-green-500">
                    -0.7%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
