"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion/dist/framer-motion";
import Link from "next/link";
import { ArrowUpRight, AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for inventory alerts
const inventoryAlerts = [
  {
    id: "prod-5",
    name: "Leather Jacket",
    sku: "LJ-001-BLK-M",
    stock: 2,
    threshold: 5,
  },
  {
    id: "prod-12",
    name: "Slim Fit Jeans",
    sku: "SFJ-003-BLU-32",
    stock: 3,
    threshold: 10,
  },
  {
    id: "prod-18",
    name: "Summer Dress",
    sku: "SD-007-WHT-S",
    stock: 1,
    threshold: 5,
  },
  {
    id: "prod-24",
    name: "Wool Sweater",
    sku: "WS-002-GRY-L",
    stock: 4,
    threshold: 8,
  },
];

export function InventoryAlerts() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Products with low stock levels</CardDescription>
          </div>
          <Link
            href="/admin/inventory"
            className="flex items-center text-sm text-primary hover:underline"
          >
            View All
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryAlerts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    SKU: {item.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-500">
                    {item.stock} left
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Threshold: {item.threshold}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
