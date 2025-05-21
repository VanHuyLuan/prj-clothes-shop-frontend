"use client";

import { useState, useEffect, useCallback } from "react";

// Types for our real-time data
interface SalesDataPoint {
  timestamp: string;
  revenue: number;
  orders: number;
}

interface InventoryAlert {
  id: string;
  product: string;
  type: "low_stock" | "out_of_stock" | "restock" | "overstock";
  quantity: number;
  threshold: number;
  timestamp: string;
  isNew?: boolean;
}

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

interface Order {
  id: string;
  customer: string;
  amount: string;
  items: number;
  status: "completed" | "processing" | "shipped" | "cancelled";
  timestamp: string;
  isNew?: boolean;
}

interface Notification {
  id: string;
  type: "alert" | "success" | "info";
  title: string;
  message: string;
  time: string;
  priority: "low" | "medium" | "high";
}

interface Metrics {
  revenueToday: number;
  revenueTrend: number;
  ordersToday: number;
  ordersTrend: number;
  activeVisitors: number;
  visitorsTrend: number;
  conversionRate: number;
  conversionTrend: number;
}

// Mock data generator functions
const generateMockSalesData = (): SalesDataPoint[] => {
  const now = new Date();
  const data: SalesDataPoint[] = [];

  // Generate data for the past hour in 5-minute intervals
  for (let i = 12; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000).toISOString();
    const baseRevenue = 500 + Math.random() * 300;
    const baseOrders = 5 + Math.floor(Math.random() * 5);

    data.push({
      timestamp,
      revenue: Math.round(baseRevenue),
      orders: baseOrders,
    });
  }

  return data;
};

const generateMockInventoryAlerts = (): InventoryAlert[] => {
  return [
    {
      id: "inv-001",
      product: "Classic White Tee (S)",
      type: "low_stock",
      quantity: 5,
      threshold: 20,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "inv-002",
      product: "Slim Fit Jeans (32)",
      type: "out_of_stock",
      quantity: 0,
      threshold: 15,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "inv-003",
      product: "Summer Dress (M)",
      type: "restock",
      quantity: 25,
      threshold: 10,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "inv-004",
      product: "Casual Blazer (L)",
      type: "overstock",
      quantity: 45,
      threshold: 20,
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  ];
};

const generateMockCustomerActivity = (): CustomerActivity[] => {
  return [
    {
      id: "act-001",
      customer: {
        name: "John Smith",
        email: "john.smith@example.com",
      },
      type: "add_to_cart",
      details: "Added Classic White Tee to cart",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
      id: "act-002",
      customer: {
        name: "Emily Johnson",
        email: "emily.johnson@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      type: "checkout",
      details: "Completed purchase of 3 items ($89.97)",
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: "act-003",
      type: "search",
      details: "Searched for 'summer dress'",
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    {
      id: "act-004",
      customer: {
        name: "Michael Brown",
        email: "michael.brown@example.com",
      },
      type: "view_product",
      details: "Viewed Leather Jacket",
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    },
  ];
};

const generateMockOrders = (): Order[] => {
  return [
    {
      id: "ORD-1234",
      customer: "John Smith",
      amount: "$59.99",
      items: 2,
      status: "completed",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "ORD-1233",
      customer: "Emily Johnson",
      amount: "$89.97",
      items: 3,
      status: "processing",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "ORD-1232",
      customer: "Michael Brown",
      amount: "$129.99",
      items: 1,
      status: "shipped",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "ORD-1231",
      customer: "Sarah Wilson",
      amount: "$45.98",
      items: 2,
      status: "cancelled",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  ];
};

const generateMockMetrics = (): Metrics => {
  return {
    revenueToday: 4250 + Math.floor(Math.random() * 500),
    revenueTrend: 12.5 + Math.random() * 5,
    ordersToday: 42 + Math.floor(Math.random() * 10),
    ordersTrend: 8.3 + Math.random() * 3,
    activeVisitors: 78 + Math.floor(Math.random() * 20),
    visitorsTrend: 5.2 + Math.random() * 4,
    conversionRate: 3.2 + Math.random(),
    conversionTrend: 0.8 + Math.random(),
  };
};

// Custom hook for real-time data
export function useRealTimeData() {
  const [isConnected, setIsConnected] = useState(false);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>(
    generateMockSalesData()
  );
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>(
    generateMockInventoryAlerts()
  );
  const [customerActivity, setCustomerActivity] = useState<CustomerActivity[]>(
    generateMockCustomerActivity()
  );
  const [recentOrders, setRecentOrders] = useState<Order[]>(
    generateMockOrders()
  );
  const [metrics, setMetrics] = useState<Metrics>(generateMockMetrics());
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulate WebSocket connection
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
    }, 1500);

    return () => clearTimeout(connectTimeout);
  }, []);

  // Function to add a new sales data point
  const addSalesDataPoint = useCallback(() => {
    setSalesData((prevData) => {
      const newData = [...prevData];
      const lastPoint = newData[newData.length - 1];

      // Generate a new data point based on the last one
      const newRevenue = Math.max(
        100,
        lastPoint.revenue + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 100
      );
      const newOrders = Math.max(
        1,
        lastPoint.orders +
          (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)
      );

      // Add the new point and remove the oldest one
      newData.push({
        timestamp: new Date().toISOString(),
        revenue: Math.round(newRevenue),
        orders: newOrders,
      });

      if (newData.length > 13) {
        newData.shift();
      }

      return newData;
    });
  }, []);

  // Function to add a new inventory alert
  const addInventoryAlert = useCallback(() => {
    const alertTypes: InventoryAlert["type"][] = [
      "low_stock",
      "out_of_stock",
      "restock",
      "overstock",
    ];
    const products = [
      "Classic White Tee (M)",
      "Slim Fit Jeans (30)",
      "Summer Dress (S)",
      "Leather Jacket (L)",
      "Wool Sweater (XL)",
    ];

    const newAlert: InventoryAlert = {
      id: `inv-${Date.now()}`,
      product: products[Math.floor(Math.random() * products.length)],
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      quantity: Math.floor(Math.random() * 30),
      threshold: 15 + Math.floor(Math.random() * 10),
      timestamp: new Date().toISOString(),
      isNew: true,
    };

    setInventoryAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);

    // Add notification for out of stock or low stock
    if (newAlert.type === "out_of_stock" || newAlert.type === "low_stock") {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        type: "alert",
        title:
          newAlert.type === "out_of_stock"
            ? "Product Out of Stock"
            : "Low Stock Alert",
        message: `${newAlert.product} is ${
          newAlert.type === "out_of_stock" ? "out of stock" : "running low"
        }.`,
        time: new Date().toLocaleTimeString(),
        priority: newAlert.type === "out_of_stock" ? "high" : "medium",
      };

      setNotifications((prev) => [notification, ...prev]);
    }
  }, []);

  // Function to add a new customer activity
  const addCustomerActivity = useCallback(() => {
    const activityTypes: CustomerActivity["type"][] = [
      "view_product",
      "add_to_cart",
      "search",
      "wishlist",
      "login",
      "signup",
      "checkout",
      "support",
      "review",
    ];

    const products = [
      "Classic White Tee",
      "Slim Fit Jeans",
      "Summer Dress",
      "Leather Jacket",
      "Wool Sweater",
    ];

    const customers = [
      {
        name: "John Smith",
        email: "john.smith@example.com",
      },
      {
        name: "Emily Johnson",
        email: "emily.johnson@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        name: "Michael Brown",
        email: "michael.brown@example.com",
      },
      {
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      undefined, // Anonymous user
    ];

    const activityType =
      activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    let details = "";
    switch (activityType) {
      case "view_product":
        details = `Viewed ${product}`;
        break;
      case "add_to_cart":
        details = `Added ${product} to cart`;
        break;
      case "search":
        details = `Searched for '${product.toLowerCase()}'`;
        break;
      case "wishlist":
        details = `Added ${product} to wishlist`;
        break;
      case "login":
        details = "Logged in to account";
        break;
      case "signup":
        details = "Created new account";
        break;
      case "checkout":
        details = `Completed purchase of ${
          1 + Math.floor(Math.random() * 4)
        } items`;
        break;
      case "support":
        details = "Contacted customer support";
        break;
      case "review":
        details = `Left a ${
          1 + Math.floor(Math.random() * 5)
        }-star review for ${product}`;
        break;
    }

    const newActivity: CustomerActivity = {
      id: `act-${Date.now()}`,
      customer,
      type: activityType,
      details,
      timestamp: new Date().toISOString(),
      isNew: true,
    };

    setCustomerActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

    // Add notification for checkout or signup
    if (activityType === "checkout" || activityType === "signup") {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        type: "success",
        title: activityType === "checkout" ? "New Order" : "New Customer",
        message:
          activityType === "checkout"
            ? `${customer?.name || "A customer"} completed a purchase.`
            : `${customer?.name || "A new customer"} signed up.`,
        time: new Date().toLocaleTimeString(),
        priority: "medium",
      };

      setNotifications((prev) => [notification, ...prev]);
    }
  }, []);

  // Function to add a new order
  const addOrder = useCallback(() => {
    const statuses: Order["status"][] = [
      "completed",
      "processing",
      "shipped",
      "cancelled",
    ];
    const customers = [
      "John Smith",
      "Emily Johnson",
      "Michael Brown",
      "Sarah Wilson",
      "David Lee",
    ];

    const newOrder: Order = {
      id: `ORD-${1000 + Math.floor(Math.random() * 9000)}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      amount: `$${(19.99 + Math.random() * 100).toFixed(2)}`,
      items: 1 + Math.floor(Math.random() * 5),
      status: statuses[Math.floor(Math.random() * (statuses.length - 1))], // Bias against cancelled
      timestamp: new Date().toISOString(),
      isNew: true,
    };

    setRecentOrders((prev) => [newOrder, ...prev.slice(0, 9)]);

    // Add notification for new order
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: "success",
      title: "New Order Received",
      message: `${newOrder.customer} placed an order for ${newOrder.amount}.`,
      time: new Date().toLocaleTimeString(),
      priority: "high",
    };

    setNotifications((prev) => [notification, ...prev]);

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      revenueToday:
        prev.revenueToday + Number.parseFloat(newOrder.amount.replace("$", "")),
      ordersToday: prev.ordersToday + 1,
    }));
  }, []);

  // Update metrics periodically
  const updateMetrics = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      activeVisitors: Math.max(
        10,
        prev.activeVisitors +
          (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)
      ),
      visitorsTrend: Math.max(
        0,
        prev.visitorsTrend + (Math.random() > 0.5 ? 0.1 : -0.1) * Math.random()
      ),
      conversionRate: Math.max(
        1,
        Math.min(
          8,
          prev.conversionRate +
            (Math.random() > 0.5 ? 0.05 : -0.05) * Math.random()
        )
      ),
      conversionTrend: Math.max(
        0,
        prev.conversionTrend +
          (Math.random() > 0.5 ? 0.05 : -0.05) * Math.random()
      ),
    }));
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isConnected) return;

    // Update sales data every 5 seconds
    const salesInterval = setInterval(addSalesDataPoint, 5000);

    // Add a new inventory alert randomly (average once every 20 seconds)
    const inventoryInterval = setInterval(() => {
      if (Math.random() < 0.25) {
        addInventoryAlert();
      }
    }, 5000);

    // Add a new customer activity randomly (average once every 8 seconds)
    const activityInterval = setInterval(() => {
      if (Math.random() < 0.6) {
        addCustomerActivity();
      }
    }, 5000);

    // Add a new order randomly (average once every 15 seconds)
    const orderInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        addOrder();
      }
    }, 5000);

    // Update metrics every 10 seconds
    const metricsInterval = setInterval(updateMetrics, 10000);

    return () => {
      clearInterval(salesInterval);
      clearInterval(inventoryInterval);
      clearInterval(activityInterval);
      clearInterval(orderInterval);
      clearInterval(metricsInterval);
    };
  }, [
    isConnected,
    addSalesDataPoint,
    addInventoryAlert,
    addCustomerActivity,
    addOrder,
    updateMetrics,
  ]);

  return {
    isConnected,
    salesData,
    inventoryAlerts,
    customerActivity,
    recentOrders,
    metrics,
    notifications,
  };
}
