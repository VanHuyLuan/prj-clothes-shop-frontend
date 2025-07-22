"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "@/components/providers/motion-provider";
import {
  Bell,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeData } from "@/hooks/use-real-time-data";
import { RealtimeSalesChart } from "@/components/admin/real-time/realtime-sales-chart";
import { RealtimeInventoryAlerts } from "@/components/admin/real-time/realtime-inventory-alerts";
import { RealtimeCustomerActivity } from "@/components/admin/real-time/realtime-customer-activity";
import { RealtimeOrderFeed } from "@/components/admin/real-time/realtime-order-feed";

export function RealTimeDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get real-time data from our custom hook
  const {
    isConnected,
    salesData,
    inventoryAlerts,
    customerActivity,
    recentOrders,
    metrics,
    notifications,
  } = useRealTimeData();

  // Handle new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const newNotification = notifications[0];
      setNotificationCount((prev) => prev + 1);

      // Show toast for important notifications
      if (newNotification.priority === "high") {
        toast({
          title: newNotification.title,
          description: newNotification.message,
          variant: newNotification.type === "alert" ? "destructive" : "default",
        });
      }
    }
  }, [notifications, toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Dashboard</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            {isConnected ? (
              <>
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                Live data connected
              </>
            ) : (
              <>
                <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                Connecting to live data...
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notificationCount}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 z-50 mt-2 w-80 rounded-md border bg-background shadow-lg"
                >
                  <div className="flex items-center justify-between border-b p-3">
                    <h3 className="font-medium">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNotificationCount(0);
                        setShowNotifications(false);
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                  <div className="max-h-[300px] overflow-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="border-b p-3 hover:bg-muted/50"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 rounded-full p-1 ${
                                notification.type === "alert"
                                  ? "bg-red-100 text-red-600"
                                  : notification.type === "success"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {notification.type === "alert" ? (
                                <AlertTriangle className="h-3 w-3" />
                              ) : notification.type === "success" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <Users className="h-3 w-3" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No new notifications
                      </div>
                    )}
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

          <Button>Export Data</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                metrics.revenueTrend > 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.revenueToday.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  metrics.revenueTrend > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {metrics.revenueTrend > 0 ? "+" : ""}
                {metrics.revenueTrend}%
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                metrics.ordersTrend > 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.ordersToday}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  metrics.ordersTrend > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {metrics.ordersTrend > 0 ? "+" : ""}
                {metrics.ordersTrend}%
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeVisitors}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  metrics.visitorsTrend > 0 ? "text-green-500" : "text-red-500"
                }
              >
                {metrics.visitorsTrend > 0 ? "+" : ""}
                {metrics.visitorsTrend}%
              </span>{" "}
              from 1 hour ago
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted/30 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                metrics.conversionTrend > 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  metrics.conversionTrend > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {metrics.conversionTrend > 0 ? "+" : ""}
                {metrics.conversionTrend}%
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Real-Time Sales</CardTitle>
                <CardDescription>
                  Live sales data for the past hour
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <RealtimeSalesChart data={salesData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders as they happen</CardDescription>
              </CardHeader>
              <CardContent>
                <RealtimeOrderFeed orders={recentOrders} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>
                  Real-time inventory status updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RealtimeInventoryAlerts alerts={inventoryAlerts} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Activity</CardTitle>
                <CardDescription>Live customer interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <RealtimeCustomerActivity activities={customerActivity} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Sales Dashboard</CardTitle>
              <CardDescription>Detailed live sales analytics</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <RealtimeSalesChart data={salesData} detailed />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Order Feed</CardTitle>
              <CardDescription>
                Comprehensive order details in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealtimeOrderFeed orders={recentOrders} detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Inventory Management</CardTitle>
              <CardDescription>
                Live inventory tracking and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealtimeInventoryAlerts alerts={inventoryAlerts} detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Customer Activity</CardTitle>
              <CardDescription>
                Real-time customer behavior and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealtimeCustomerActivity
                activities={customerActivity}
                detailed
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
