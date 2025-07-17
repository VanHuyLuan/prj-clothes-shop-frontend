"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { CheckCircle2, Clock, Package, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Order {
  id: string;
  customer: string;
  amount: string;
  items: number;
  status: "completed" | "processing" | "shipped" | "cancelled";
  timestamp: string;
  isNew?: boolean;
}

interface RealtimeOrderFeedProps {
  orders: Order[];
  detailed?: boolean;
}

export function RealtimeOrderFeed({
  orders,
  detailed = false,
}: RealtimeOrderFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new orders come in
  useEffect(() => {
    if (scrollRef.current && orders.some((order) => order.isNew)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [orders]);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "shipped":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  //   const getStatusColor = (status: Order["status"]) => {
  //     switch (status) {
  //       case "completed":
  //         return "bg-green-500";
  //       case "processing":
  //         return "bg-amber-500";
  //       case "shipped":
  //         return "bg-blue-500";
  //       case "cancelled":
  //         return "bg-red-500";
  //     }
  //   };

  return (
    <ScrollArea
      className={detailed ? "h-[400px]" : "h-[240px]"}
      ref={scrollRef}
    >
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={
                order.isNew ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                order.isNew ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-1 ${
                    order.status === "completed"
                      ? "bg-green-100"
                      : order.status === "processing"
                      ? "bg-amber-100"
                      : order.status === "shipped"
                      ? "bg-blue-100"
                      : "bg-red-100"
                  }`}
                >
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{order.id}</p>
                    {order.isNew && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.customer} • {order.items}{" "}
                    {order.items === 1 ? "item" : "items"}
                  </p>
                  {detailed && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.amount}</p>
                {!detailed && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {detailed && (
                  <Badge
                    variant="outline"
                    className={`mt-1 ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "processing"
                        ? "bg-amber-100 text-amber-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="flex h-[100px] items-center justify-center text-center text-sm text-muted-foreground">
            No recent orders
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
