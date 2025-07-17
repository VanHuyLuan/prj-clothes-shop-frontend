"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion/dist/framer-motion";
import { Bar, Scatter } from "react-chartjs-2";
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
  TooltipItem,
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

export function ProductPerformance() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("revenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Product performance data
  const productPerformanceData = [
    {
      id: "PROD-001",
      name: "Classic White Tee",
      category: "T-Shirts",
      revenue: 12500,
      units: 420,
      avgRating: 4.8,
      conversionRate: 5.2,
      returnRate: 2.1,
    },
    {
      id: "PROD-002",
      name: "Slim Fit Jeans",
      category: "Pants",
      revenue: 18750,
      units: 315,
      avgRating: 4.5,
      conversionRate: 4.8,
      returnRate: 3.5,
    },
    {
      id: "PROD-003",
      name: "Casual Blazer",
      category: "Outerwear",
      revenue: 15300,
      units: 170,
      avgRating: 4.7,
      conversionRate: 3.9,
      returnRate: 2.8,
    },
    {
      id: "PROD-004",
      name: "Summer Dress",
      category: "Dresses",
      revenue: 9800,
      units: 196,
      avgRating: 4.6,
      conversionRate: 4.5,
      returnRate: 4.2,
    },
    {
      id: "PROD-005",
      name: "Leather Jacket",
      category: "Outerwear",
      revenue: 22400,
      units: 112,
      avgRating: 4.9,
      conversionRate: 3.2,
      returnRate: 1.8,
    },
    {
      id: "PROD-006",
      name: "Wool Sweater",
      category: "Sweaters",
      revenue: 8400,
      units: 120,
      avgRating: 4.3,
      conversionRate: 3.8,
      returnRate: 2.5,
    },
    {
      id: "PROD-007",
      name: "Floral Blouse",
      category: "Tops",
      revenue: 7200,
      units: 180,
      avgRating: 4.4,
      conversionRate: 4.1,
      returnRate: 3.2,
    },
    {
      id: "PROD-008",
      name: "Denim Shorts",
      category: "Shorts",
      revenue: 6300,
      units: 180,
      avgRating: 4.2,
      conversionRate: 3.7,
      returnRate: 2.9,
    },
  ];

  // Filter and sort products
  const filteredProducts = productPerformanceData
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Top categories by revenue data
  const topCategoriesData = {
    labels: [
      "T-Shirts",
      "Pants",
      "Outerwear",
      "Dresses",
      "Sweaters",
      "Tops",
      "Shorts",
      "Accessories",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [35000, 42000, 38000, 25000, 18000, 15000, 12000, 8000],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Product performance scatter plot data
  const scatterData = {
    datasets: [
      {
        label: "Products",
        data: productPerformanceData.map((product) => ({
          x: product.conversionRate,
          y: product.avgRating,
          r: product.revenue / 1000, // Size based on revenue
        })),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
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

  const scatterChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"scatter">) => {
            const product = productPerformanceData[context.dataIndex];
            return `${product.name}: $${product.revenue} (${product.units} units)`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Conversion Rate (%)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Rating",
        },
        min: 3.5,
        max: 5,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Performance</h2>
          <p className="text-muted-foreground">
            Analyze the performance of your products
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[250px]"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="t-shirts">T-Shirts</SelectItem>
              <SelectItem value="pants">Pants</SelectItem>
              <SelectItem value="outerwear">Outerwear</SelectItem>
              <SelectItem value="dresses">Dresses</SelectItem>
              <SelectItem value="sweaters">Sweaters</SelectItem>
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
              <CardTitle>Top Categories by Revenue</CardTitle>
              <CardDescription>
                Revenue distribution across product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Bar data={topCategoriesData} options={barChartOptions} />
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
              <CardTitle>Product Performance Matrix</CardTitle>
              <CardDescription>
                Conversion rate vs. rating (bubble size = revenue)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Scatter data={scatterData} options={scatterChartOptions} />
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
            <CardTitle>Product Performance Details</CardTitle>
            <CardDescription>
              Detailed metrics for individual products
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
                        onClick={() => toggleSort("name")}
                      >
                        Product
                        {sortColumn === "name" && (
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
                        onClick={() => toggleSort("revenue")}
                      >
                        Revenue
                        {sortColumn === "revenue" && (
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
                        onClick={() => toggleSort("units")}
                      >
                        Units Sold
                        {sortColumn === "units" && (
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
                        onClick={() => toggleSort("avgRating")}
                      >
                        Avg. Rating
                        {sortColumn === "avgRating" && (
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
                        onClick={() => toggleSort("conversionRate")}
                      >
                        Conv. Rate
                        {sortColumn === "conversionRate" && (
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
                        onClick={() => toggleSort("returnRate")}
                      >
                        Return Rate
                        {sortColumn === "returnRate" && (
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
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">
                        ${product.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.units}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.avgRating.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.conversionRate.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {product.returnRate.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
