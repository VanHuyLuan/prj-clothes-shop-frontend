"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Eye, Search, Filter } from "lucide-react";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiService, Order } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import { formatVND } from "@/lib/utils";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-700 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
};

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to view your orders");
      router.push("/login");
    }
  }, [user, router]);

  // Load orders
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, currentPage, statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await ApiService.getMyOrders(params);
      setOrders(response.data);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      toast.error("Could not load orders", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders by search query (order number)
  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Manage and track your orders
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            /* Empty state */
            <Card>
              <CardContent className="py-20">
                <div className="text-center space-y-4">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto" />
                  <h2 className="text-2xl font-bold">
                    {searchQuery
                      ? "No orders found"
                      : "No orders yet"}
                  </h2>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try searching with a different keyword"
                      : "Start shopping to place your first order"}
                  </p>
                  <Link href="/client/products">
                    <Button>Explore products</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Orders list */
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const status = order.status as keyof typeof statusColors;
                const firstItem = order.items?.[0];
                const totalItems = order.items?.length || 0;

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Product Image - Left Side */}
                        {order.items && order.items.length > 0 && (
                          <div className="flex-shrink-0">
                            {(() => {
                              const firstItem = order.items[0];
                              const variant = firstItem.variant ;
                              const product = variant?.product;
                              const image = product?.images?.[0]?.url || "";

                              return (
                                <div className="relative w-full h-48 sm:w-40 sm:h-full rounded-lg overflow-hidden bg-muted border-2 border-background shadow-sm">
                                  {image ? (
                                    <Image
                                      src={image}
                                      alt={product?.name || "Product"}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                  )}
                                  {totalItems > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                      +{totalItems - 1}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Order Info - Right Side */}
                        <div className="flex-1 flex flex-col gap-4">
                          {/* Header */}
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-base font-medium text-muted-foreground">
                                Order number
                              </p>
                              <Link
                                href={`/client/orders/${order.order_number}`}
                                className="font-mono font-bold text-xl hover:text-primary transition-colors"
                              >
                                {order.order_number}
                              </Link>
                            </div>
                            <Badge
                              variant="outline"
                              className={`${statusColors[status] || statusColors.pending} px-5 py-2.5 text-sm font-bold uppercase tracking-wide rounded-full shadow-sm border-2`}
                            >
                              <span className="relative flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                {statusLabels[status] || order.status}
                              </span>
                            </Badge>
                          </div>

                          {/* Date & Total */}
                          <div className="flex flex-wrap gap-6 text-base">
                            <div>
                              <p className="text-muted-foreground font-medium">Order date</p>
                              <p className="font-semibold">
                                {new Date(order.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium">Total</p>
                              <p className="font-bold text-xl text-primary">
                                {formatVND(order.total_amount || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium">Items</p>
                              <p className="font-semibold">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-auto">
                            <Link href={`/client/orders/${order.order_number}`}>
                              <Button variant="outline" className="w-full sm:w-auto text-base font-semibold">
                                <Eye className="mr-2 h-5 w-5" />
                                View details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredOrders.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
