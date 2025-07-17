"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { Pie, Line, Bar } from "react-chartjs-2";
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function CustomerAnalytics() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Customer segmentation data
  const customerSegmentationData = {
    labels: [
      "New Customers",
      "Returning Customers",
      "Loyal Customers",
      "At-Risk Customers",
      "Churned Customers",
    ],
    datasets: [
      {
        label: "Customers",
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Customer acquisition data
  const customerAcquisitionData = {
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
        label: "New Customers",
        data: [65, 78, 82, 75, 90, 95, 88, 100, 110, 115, 120, 130],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Customer retention data
  const customerRetentionData = {
    labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
    datasets: [
      {
        label: "Cohort 1",
        data: [100, 85, 72, 65, 60, 58],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Cohort 2",
        data: [100, 88, 75, 68, 64, 60],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Cohort 3",
        data: [100, 90, 78, 70, 65, 62],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  // Customer lifetime value data
  const customerLTVData = {
    labels: ["0-6 months", "6-12 months", "1-2 years", "2-3 years", "3+ years"],
    datasets: [
      {
        label: "Average LTV",
        data: [120, 250, 450, 780, 1200],
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Age distribution data
  const ageDistributionData = {
    labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    datasets: [
      {
        label: "Customers",
        data: [15, 30, 25, 18, 8, 4],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const retentionChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Retention Rate (%)",
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Average LTV ($)",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Analytics</h2>
          <p className="text-muted-foreground">
            Understand your customer base and behavior
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Customer segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="new">New Customers</SelectItem>
              <SelectItem value="returning">Returning Customers</SelectItem>
              <SelectItem value="loyal">Loyal Customers</SelectItem>
              <SelectItem value="at-risk">At-Risk Customers</SelectItem>
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
              <CardTitle>Customer Segmentation</CardTitle>
              <CardDescription>
                Distribution of customers by segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <Pie
                  data={customerSegmentationData}
                  options={pieChartOptions}
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
              <CardTitle>Customer Acquisition</CardTitle>
              <CardDescription>New customers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Line
                  data={customerAcquisitionData}
                  options={lineChartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Customer Cohort Analysis</CardTitle>
            <CardDescription>
              Retention rates by customer cohort
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="retention">
              <TabsList className="mb-4">
                <TabsTrigger value="retention">Retention</TabsTrigger>
                <TabsTrigger value="ltv">Lifetime Value</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
              </TabsList>
              <TabsContent value="retention" className="h-[350px]">
                <Line
                  data={customerRetentionData}
                  options={retentionChartOptions}
                />
              </TabsContent>
              <TabsContent value="ltv" className="h-[350px]">
                <Bar data={customerLTVData} options={barChartOptions} />
              </TabsContent>
              <TabsContent value="demographics" className="h-[350px]">
                <Bar data={ageDistributionData} options={barChartOptions} />
              </TabsContent>
            </Tabs>
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
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>
              Key metrics about your customer base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Customer Lifetime Value
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">$485.50</p>
                  <span className="text-sm font-medium text-green-500">
                    +15.2%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Repeat Purchase Rate
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">38.5%</p>
                  <span className="text-sm font-medium text-green-500">
                    +3.8%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Customer Acquisition Cost
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">$28.40</p>
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
                  Churn Rate
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">5.2%</p>
                  <span className="text-sm font-medium text-green-500">
                    -0.8%
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
