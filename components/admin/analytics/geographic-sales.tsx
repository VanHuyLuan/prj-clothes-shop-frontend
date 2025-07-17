"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function GeographicSales() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sales by country data
  const salesByCountryData = {
    labels: [
      "United States",
      "Canada",
      "United Kingdom",
      "Germany",
      "France",
      "Australia",
      "Japan",
      "Other",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [125000, 45000, 38000, 25000, 22000, 18000, 15000, 35000],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Sales by US state data
  const salesByStateData = {
    labels: [
      "California",
      "New York",
      "Texas",
      "Florida",
      "Illinois",
      "Pennsylvania",
      "Ohio",
      "Washington",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [35000, 28000, 22000, 18000, 15000, 12000, 10000, 8000],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Sales by city data
  const salesByCityData = {
    labels: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [18000, 15000, 12000, 9000, 7500, 7000, 6500, 6000],
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Regional performance data
  const regionalPerformanceData = [
    {
      region: "North America",
      revenue: "$170,000",
      orders: 3850,
      avgOrderValue: "$44.16",
      yoyGrowth: "+15.2%",
    },
    {
      region: "Europe",
      revenue: "$95,000",
      orders: 2100,
      avgOrderValue: "$45.24",
      yoyGrowth: "+12.8%",
    },
    {
      region: "Asia Pacific",
      revenue: "$45,000",
      orders: 980,
      avgOrderValue: "$45.92",
      yoyGrowth: "+22.5%",
    },
    {
      region: "Latin America",
      revenue: "$18,000",
      orders: 420,
      avgOrderValue: "$42.86",
      yoyGrowth: "+18.3%",
    },
    {
      region: "Middle East & Africa",
      revenue: "$12,000",
      orders: 280,
      avgOrderValue: "$42.86",
      yoyGrowth: "+25.7%",
    },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Geographic Sales Analysis</h2>
          <p className="text-muted-foreground">
            Sales performance across different geographic regions
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select defaultValue="revenue">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="aov">Avg. Order Value</SelectItem>
              <SelectItem value="growth">YoY Growth</SelectItem>
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
            <CardTitle>Sales by Geographic Region</CardTitle>
            <CardDescription>
              Revenue distribution across different geographic areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="country">
              <TabsList className="mb-4">
                <TabsTrigger value="country">Country</TabsTrigger>
                <TabsTrigger value="state">US State</TabsTrigger>
                <TabsTrigger value="city">City</TabsTrigger>
              </TabsList>
              <TabsContent value="country" className="h-[400px]">
                <Bar data={salesByCountryData} options={barChartOptions} />
              </TabsContent>
              <TabsContent value="state" className="h-[400px]">
                <Bar data={salesByStateData} options={barChartOptions} />
              </TabsContent>
              <TabsContent value="city" className="h-[400px]">
                <Bar data={salesByCityData} options={barChartOptions} />
              </TabsContent>
            </Tabs>
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
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Key metrics by geographic region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">
                      Avg. Order Value
                    </TableHead>
                    <TableHead className="text-right">YoY Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionalPerformanceData.map((region) => (
                    <TableRow key={region.region} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {region.region}
                      </TableCell>
                      <TableCell className="text-right">
                        {region.revenue}
                      </TableCell>
                      <TableCell className="text-right">
                        {region.orders.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {region.avgOrderValue}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          region.yoyGrowth.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {region.yoyGrowth}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>International Shipping Performance</CardTitle>
              <CardDescription>
                Shipping metrics for international orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Avg. Delivery Time
                    </h3>
                    <p className="text-2xl font-bold">8.5 days</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      On-Time Delivery
                    </h3>
                    <p className="text-2xl font-bold">92.3%</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Shipping Cost Ratio
                    </h3>
                    <p className="text-2xl font-bold">12.8%</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Return Rate
                    </h3>
                    <p className="text-2xl font-bold">4.2%</p>
                  </div>
                </div>
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
              <CardTitle>Emerging Markets</CardTitle>
              <CardDescription>
                Fastest growing geographic markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { country: "Brazil", growth: "+42.5%", revenue: "$8,500" },
                  { country: "India", growth: "+38.7%", revenue: "$7,200" },
                  {
                    country: "South Korea",
                    growth: "+35.2%",
                    revenue: "$6,800",
                  },
                  { country: "Mexico", growth: "+32.8%", revenue: "$5,500" },
                  {
                    country: "United Arab Emirates",
                    growth: "+28.3%",
                    revenue: "$4,200",
                  },
                ].map((market, index) => (
                  <div
                    key={market.country}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {index + 1}
                      </div>
                      <span className="font-medium">{market.country}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{market.revenue}</span>
                      <span className="text-green-500 font-medium">
                        {market.growth}
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
