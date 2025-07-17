"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data for top products
const topProducts = [
  {
    id: "prod-1",
    name: "Classic White Tee",
    image: "/placeholder.svg?height=80&width=80",
    sales: 245,
    revenue: "$7,350",
    progress: 100,
  },
  {
    id: "prod-2",
    name: "Slim Fit Jeans",
    image: "/placeholder.svg?height=80&width=80",
    sales: 189,
    revenue: "$11,340",
    progress: 77,
  },
  {
    id: "prod-3",
    name: "Leather Jacket",
    image: "/placeholder.svg?height=80&width=80",
    sales: 124,
    revenue: "$24,800",
    progress: 51,
  },
  {
    id: "prod-4",
    name: "Summer Dress",
    image: "/placeholder.svg?height=80&width=80",
    sales: 98,
    revenue: "$4,900",
    progress: 40,
  },
  {
    id: "prod-5",
    name: "Casual Blazer",
    image: "/placeholder.svg?height=80&width=80",
    sales: 76,
    revenue: "$6,840",
    progress: 31,
  },
];

export function TopProducts() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Your best-selling products this month
            </CardDescription>
          </div>
          <Link
            href="/admin/products"
            className="flex items-center text-sm text-primary hover:underline"
          >
            View All
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm font-medium">{product.revenue}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p>{product.sales} sales</p>
                    <p>{product.progress}%</p>
                  </div>
                  <Progress value={product.progress} className="h-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
