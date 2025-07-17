"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion/dist/framer-motion";
import {
  BarChart3,
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardMetrics() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Orders",
      value: "+2350",
      change: "+12.2%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: "+573",
      change: "+8.4%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-1.1%",
      trend: "down",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden border-muted/30 transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="rounded-full bg-muted/50 p-1.5">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`flex items-center ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {stat.change} from last month
                </span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
