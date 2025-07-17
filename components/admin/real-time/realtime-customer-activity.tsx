"use client";

import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import {
  ShoppingCart,
  Search,
  Eye,
  Heart,
  User,
  LogIn,
  UserPlus,
  CreditCard,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CustomerActivity {
  id: string;
  customer?: {
    name: string;
    email: string;
    avatar?: string;
  };
  type:
    | "view_product"
    | "add_to_cart"
    | "search"
    | "wishlist"
    | "login"
    | "signup"
    | "checkout"
    | "support"
    | "review";
  details: string;
  timestamp: string;
  isNew?: boolean;
}

interface RealtimeCustomerActivityProps {
  activities: CustomerActivity[];
  detailed?: boolean;
}

export function RealtimeCustomerActivity({
  activities,
  detailed = false,
}: RealtimeCustomerActivityProps) {
  const getActivityIcon = (type: CustomerActivity["type"]) => {
    switch (type) {
      case "view_product":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "add_to_cart":
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case "search":
        return <Search className="h-4 w-4 text-purple-500" />;
      case "wishlist":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "login":
        return <LogIn className="h-4 w-4 text-amber-500" />;
      case "signup":
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case "checkout":
        return <CreditCard className="h-4 w-4 text-indigo-500" />;
      case "support":
        return <HelpCircle className="h-4 w-4 text-orange-500" />;
      case "review":
        return <MessageSquare className="h-4 w-4 text-pink-500" />;
    }
  };

  const getActivityTitle = (type: CustomerActivity["type"]) => {
    switch (type) {
      case "view_product":
        return "Viewed Product";
      case "add_to_cart":
        return "Added to Cart";
      case "search":
        return "Searched";
      case "wishlist":
        return "Added to Wishlist";
      case "login":
        return "Logged In";
      case "signup":
        return "Signed Up";
      case "checkout":
        return "Completed Checkout";
      case "support":
        return "Requested Support";
      case "review":
        return "Left Review";
    }
  };

  const getActivityColor = (type: CustomerActivity["type"]) => {
    switch (type) {
      case "view_product":
        return "bg-blue-100 text-blue-800";
      case "add_to_cart":
        return "bg-green-100 text-green-800";
      case "search":
        return "bg-purple-100 text-purple-800";
      case "wishlist":
        return "bg-red-100 text-red-800";
      case "login":
        return "bg-amber-100 text-amber-800";
      case "signup":
        return "bg-emerald-100 text-emerald-800";
      case "checkout":
        return "bg-indigo-100 text-indigo-800";
      case "support":
        return "bg-orange-100 text-orange-800";
      case "review":
        return "bg-pink-100 text-pink-800";
    }
  };

  return (
    <ScrollArea className={detailed ? "h-[400px]" : "h-[240px]"}>
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={
                activity.isNew ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg border p-3 ${
                activity.isNew ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {activity.customer ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={activity.customer.avatar || "/placeholder.svg"}
                      alt={activity.customer.name}
                    />
                    <AvatarFallback>
                      {activity.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {activity.customer
                        ? activity.customer.name
                        : "Anonymous User"}
                    </p>
                    {activity.isNew && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        New
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getActivityColor(activity.type)}
                    >
                      {getActivityIcon(activity.type)}
                      <span className="ml-1">
                        {getActivityTitle(activity.type)}
                      </span>
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {detailed && activity.customer && (
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="flex h-[100px] items-center justify-center text-center text-sm text-muted-foreground">
            No recent customer activity
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
