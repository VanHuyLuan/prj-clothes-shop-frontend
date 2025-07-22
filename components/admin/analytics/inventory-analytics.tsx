"use client";

import { useEffect, useState } from "react";
import { MotionDiv } from "@/components/providers/motion-provider";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ArrowUpDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function InventoryAnalytics() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("turnoverRate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Inventory turnover data
  const inventoryTurnoverData = {
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
        label: "Inventory Turnover Rate",
        data: [3.2, 3.5, 3.8, 3.6, 4.0, 4.2, 4.1, 4.3, 4.5, 4.6, 4.8, 5.0],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Stock level trends data
  const stockLevelTrendsData = {
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
        label: "Average Stock Level",
        data: [850, 820, 780, 800, 750, 720, 700, 680, 650, 630, 600, 580],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Out of stock frequency data
  const outOfStockData = {
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
        label: "Out of Stock Frequency",
        data: [5, 8, 12, 3, 7, 4],
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Inventory performance data
  const inventoryPerformanceData = [
    {
      id: "CAT-001",
      category: "T-Shirts",
      stockLevel: 420,
      turnoverRate: 4.8,
      daysOnHand: 76,
      stockoutRate: 2.1,
      deadStock: 5.2,
    },
    {
      id: "CAT-002",
      category: "Pants",
      stockLevel: 315,
      turnoverRate: 3.9,
      daysOnHand: 94,
      stockoutRate: 3.5,
      deadStock: 8.7,
    },
    {
      id: "CAT-003",
      category: "Outerwear",
      stockLevel: 170,
      turnoverRate: 2.5,
      daysOnHand: 146,
      stockoutRate: 1.8,
      deadStock: 12.3,
    },
    {
      id: "CAT-004",
      category: "Dresses",
      stockLevel: 196,
      turnoverRate: 5.2,
      daysOnHand: 70,
      stockoutRate: 4.2,
      deadStock: 3.8,
    },
    {
      id: "CAT-005",
      category: "Sweaters",
      stockLevel: 112,
      turnoverRate: 2.8,
      daysOnHand: 130,
      stockoutRate: 2.5,
      deadStock: 10.5,
    },
    {
      id: "CAT-006",
      category: "Accessories",
      stockLevel: 580,
      turnoverRate: 3.5,
      daysOnHand: 104,
      stockoutRate: 1.2,
      deadStock: 7.8,
    },
  ];

  // Filter and sort inventory data
  const filteredInventory = inventoryPerformanceData
    .filter((item) =>
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  // Toggle sort direction
  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
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
          text: "Frequency",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Analytics</h2>
          <p className="text-muted-foreground">
            Track and optimize your inventory performance
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[250px]"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="high">High Turnover</SelectItem>
              <SelectItem value="low">Low Turnover</SelectItem>
              <SelectItem value="stockout">Frequent Stockouts</SelectItem>
              <SelectItem value="dead">Dead Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Inventory Turnover Rate</CardTitle>
              <CardDescription>
                Monthly inventory turnover trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Line data={inventoryTurnoverData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Stock Level Trends</CardTitle>
              <CardDescription>Average stock levels over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Line data={stockLevelTrendsData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Out of Stock Frequency</CardTitle>
            <CardDescription>
              Number of stockout events by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Bar data={outOfStockData} options={barChartOptions} />
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Inventory Performance by Category</CardTitle>
            <CardDescription>
              Key inventory metrics across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => toggleSort("category")}
                      >
                        Category
                        {sortColumn === "category" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortDirection === "asc"
                                ? "rotate-180 transform"
                                : ""
                            }`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => toggleSort("stockLevel")}
                      >
                        Stock Level
                        {sortColumn === "stockLevel" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortDirection === "asc"
                                ? "rotate-180 transform"
                                : ""
                            }`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => toggleSort("turnoverRate")}
                      >
                        Turnover Rate
                        {sortColumn === "turnoverRate" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortDirection === "asc"
                                ? "rotate-180 transform"
                                : ""
                            }`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => toggleSort("daysOnHand")}
                      >
                        Days on Hand
                        {sortColumn === "daysOnHand" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortDirection === "asc"
                                ? "rotate-180 transform"
                                : ""
                            }`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => toggleSort("stockoutRate")}
                      >
                        Stockout Rate
                        {sortColumn === "stockoutRate" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortDirection === "asc"
                                ? "rotate-180 transform"
                                : ""
                            }`}
                          />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => toggleSort("deadStock")}
                      >
                        Dead Stock
                        {sortColumn === "deadStock" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortDirection === "asc"
                                ? "rotate-180 transform"
                                : ""
                            }`}
                          />
                        )}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {item.category}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.stockLevel}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.turnoverRate.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.daysOnHand}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.stockoutRate.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{item.deadStock.toFixed(1)}%</span>
                          <Progress
                            value={item.deadStock}
                            max={20}
                            className={`h-2 w-16 [&>div]:${
                              item.deadStock > 10
                                ? "bg-red-500"
                                : item.deadStock > 5
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Inventory Health Metrics</CardTitle>
            <CardDescription>
              Overall inventory performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Average Turnover Rate
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">3.8</p>
                  <span className="text-sm font-medium text-green-500">
                    +0.5
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Average Days on Hand
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">96</p>
                  <span className="text-sm font-medium text-green-500">
                    -12
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Stockout Rate
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">2.5%</p>
                  <span className="text-sm font-medium text-red-500">
                    +0.3%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Dead Stock Percentage
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">8.1%</p>
                  <span className="text-sm font-medium text-green-500">
                    -1.2%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    </div>
  );
}
