"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

export function SalesForecast() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Overall sales forecast data
  const overallForecastData = {
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
        label: "Historical Sales",
        data: [
          42000, 45000, 48000, 46000, 52000, 58000, 56000, 60000, 65000, 68000,
          72000, 85000,
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0)",
        tension: 0.3,
        pointStyle: "circle",
      },
      {
        label: "Forecast",
        data: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          85000,
          88000,
          92000,
          95000,
          98000,
          105000,
        ],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderDash: [5, 5],
        tension: 0.3,
        fill: true,
        pointStyle: "triangle",
      },
    ],
  };

  // Category forecast data
  const categoryForecastData = {
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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
    ],
    datasets: [
      {
        label: "T-Shirts",
        data: [
          12000, 13000, 14000, 13500, 15000, 17000, 16500, 18000, 19000, 20000,
          21000, 25000, 26000, 27000, 28000, 29000, 31000,
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Pants",
        data: [
          10000, 11000, 12000, 11500, 13000, 14000, 13500, 15000, 16000, 17000,
          18000, 21000, 22000, 23000, 24000, 25000, 26000,
        ],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Outerwear",
        data: [
          8000, 8500, 9000, 8800, 10000, 11000, 10500, 12000, 13000, 14000,
          15000, 18000, 19000, 20000, 21000, 22000, 23000,
        ],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Seasonal forecast data
  const seasonalForecastData = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Week 8",
      "Week 9",
      "Week 10",
      "Week 11",
      "Week 12",
    ],
    datasets: [
      {
        label: "Holiday Season",
        data: [
          15000, 18000, 22000, 25000, 30000, 38000, 45000, 55000, 68000, 85000,
          95000, 105000,
        ],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Previous Year",
        data: [
          14000, 16000, 20000, 22000, 26000, 32000, 38000, 48000, 58000, 72000,
          82000, 90000,
        ],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0)",
        tension: 0.3,
        borderDash: [5, 5],
      },
    ],
  };

  // Chart options
  const forecastChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Forecast</h2>
          <p className="text-muted-foreground">
            Predictive analysis of future sales performance
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select defaultValue="6months">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Forecast period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="12months">12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="revenue">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="units">Units Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Sales Forecast</CardTitle>
            <CardDescription>
              Projected sales for the next 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overall">
              <TabsList className="mb-4">
                <TabsTrigger value="overall">Overall</TabsTrigger>
                <TabsTrigger value="category">By Category</TabsTrigger>
                <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
              </TabsList>
              <TabsContent value="overall" className="h-[400px]">
                <Line
                  data={overallForecastData}
                  options={forecastChartOptions}
                />
              </TabsContent>
              <TabsContent value="category" className="h-[400px]">
                <Line
                  data={categoryForecastData}
                  options={forecastChartOptions}
                />
              </TabsContent>
              <TabsContent value="seasonal" className="h-[400px]">
                <Line
                  data={seasonalForecastData}
                  options={forecastChartOptions}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Forecast Accuracy</CardTitle>
              <CardDescription>
                Historical forecast accuracy metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      MAPE (Mean Absolute Percentage Error)
                    </h3>
                    <p className="text-2xl font-bold">4.8%</p>
                    <p className="text-xs text-muted-foreground">
                      Lower is better
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      MAE (Mean Absolute Error)
                    </h3>
                    <p className="text-2xl font-bold">$2,450</p>
                    <p className="text-xs text-muted-foreground">
                      Lower is better
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Forecast Bias
                    </h3>
                    <p className="text-2xl font-bold">+1.2%</p>
                    <p className="text-xs text-muted-foreground">
                      Closer to 0% is better
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      R² (Coefficient of Determination)
                    </h3>
                    <p className="text-2xl font-bold">0.92</p>
                    <p className="text-xs text-muted-foreground">
                      Higher is better
                    </p>
                  </div>
                </div>
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
              <CardTitle>Growth Opportunities</CardTitle>
              <CardDescription>
                Categories with highest growth potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    category: "Outerwear",
                    forecast: "+28.5%",
                    confidence: "High",
                    revenue: "$32,500",
                  },
                  {
                    category: "Accessories",
                    forecast: "+24.7%",
                    confidence: "Medium",
                    revenue: "$18,200",
                  },
                  {
                    category: "Dresses",
                    forecast: "+22.2%",
                    confidence: "High",
                    revenue: "$27,800",
                  },
                  {
                    category: "Activewear",
                    forecast: "+19.8%",
                    confidence: "Medium",
                    revenue: "$15,500",
                  },
                  {
                    category: "Footwear",
                    forecast: "+18.3%",
                    confidence: "Low",
                    revenue: "$12,200",
                  },
                ].map((item, index) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {index + 1}
                      </div>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.confidence === "High"
                            ? "bg-green-100 text-green-800"
                            : item.confidence === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.confidence}
                      </span>
                      <span>{item.revenue}</span>
                      <span className="text-green-500 font-medium">
                        {item.forecast}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
