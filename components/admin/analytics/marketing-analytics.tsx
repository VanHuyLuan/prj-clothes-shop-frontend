"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function MarketingAnalytics() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Marketing channel performance data
  const channelPerformanceData = {
    labels: [
      "Organic Search",
      "Paid Search",
      "Social Media",
      "Email",
      "Direct",
      "Referral",
      "Affiliates",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [45000, 38000, 32000, 28000, 22000, 18000, 12000],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Campaign performance data
  const campaignPerformanceData = [
    {
      name: "Summer Sale",
      channel: "Email",
      revenue: "$28,500",
      orders: 570,
      conversion: "4.8%",
      roi: "320%",
    },
    {
      name: "New Collection Launch",
      channel: "Social Media",
      revenue: "$22,800",
      orders: 456,
      conversion: "3.9%",
      roi: "285%",
    },
    {
      name: "Back to School",
      channel: "Paid Search",
      revenue: "$18,500",
      orders: 370,
      conversion: "3.2%",
      roi: "210%",
    },
    {
      name: "Holiday Preview",
      channel: "Email",
      revenue: "$15,200",
      orders: 304,
      conversion: "4.2%",
      roi: "245%",
    },
    {
      name: "Flash Sale",
      channel: "Social Media",
      revenue: "$12,800",
      orders: 256,
      conversion: "5.1%",
      roi: "310%",
    },
  ];

  // Traffic sources data
  const trafficSourcesData = {
    labels: [
      "Organic Search",
      "Paid Search",
      "Social Media",
      "Email",
      "Direct",
      "Referral",
      "Affiliates",
    ],
    datasets: [
      {
        label: "Traffic",
        data: [35, 25, 15, 10, 8, 5, 2],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.4)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Conversion funnel data
  const conversionFunnelData = {
    labels: ["Visits", "Product Views", "Add to Cart", "Checkout", "Purchase"],
    datasets: [
      {
        label: "Conversion Funnel",
        data: [100, 65, 40, 25, 18],
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

  // Chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  const funnelChartOptions = {
    responsive: true,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Conversion Rate (%)",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Analytics</h2>
          <p className="text-muted-foreground">
            Performance analysis of marketing channels and campaigns
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select defaultValue="30days">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
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
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Revenue by marketing channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Bar data={channelPerformanceData} options={barChartOptions} />
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
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Distribution of website traffic by source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <Pie data={trafficSourcesData} options={pieChartOptions} />
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
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Performance metrics for recent marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">
                      Conversion Rate
                    </TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignPerformanceData.map((campaign) => (
                    <TableRow key={campaign.name} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {campaign.name}
                      </TableCell>
                      <TableCell>{campaign.channel}</TableCell>
                      <TableCell className="text-right">
                        {campaign.revenue}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.orders}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.conversion}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {campaign.roi}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>
              Customer journey through the purchase funnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Bar data={conversionFunnelData} options={funnelChartOptions} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Marketing Performance Metrics</CardTitle>
            <CardDescription>
              Key marketing performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Customer Acquisition Cost
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">$28.50</p>
                  <span className="text-sm font-medium text-green-500">
                    -5.2%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Marketing ROI
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">285%</p>
                  <span className="text-sm font-medium text-green-500">
                    +12.8%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email Open Rate
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">24.5%</p>
                  <span className="text-sm font-medium text-green-500">
                    +2.1%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Social Media Engagement
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">3.8%</p>
                  <span className="text-sm font-medium text-green-500">
                    +0.5%
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
