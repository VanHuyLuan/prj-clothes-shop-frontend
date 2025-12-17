"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ApiService, Order } from "@/lib/api";
import { toast } from "sonner";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-700 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
};

const statusLabels = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderNumber]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getOrderByNumber(orderNumber);
      setOrder(data);
    } catch (error: any) {
      console.error("Error loading order:", error);
      toast.error("Không thể tải thông tin đơn hàng", {
        description: error.message || "Vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Đang tải đơn hàng...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <Package className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-bold">Không tìm thấy đơn hàng</h2>
            <p className="text-muted-foreground">
              Đơn hàng #{orderNumber} không tồn tại hoặc đã bị xóa
            </p>
            <Link href="/client/products">
              <Button>Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = order.status as keyof typeof statusColors;
  const shippingAddr = order.shipping_address;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          {/* Success message */}
          <div className="mb-8 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Đặt hàng thành công!
                </h2>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Mã đơn hàng
                    </p>
                    <p className="font-mono font-bold text-green-900 dark:text-green-100">
                      {order.order_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Ngày đặt hàng
                    </p>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {new Date(order.created_at).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Order details */}
            <div className="md:col-span-2 space-y-6">
              {/* Order items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Sản phẩm đã đặt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items?.map((item: any) => {
                    const variant = item.variant || item.productVariant;
                    const product = variant?.product;
                    const image = product?.images?.[0]?.url || "";

                    return (
                      <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {image ? (
                            <Image
                              src={image}
                              alt={product?.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{product?.name || "Product"}</h4>
                          <p className="text-sm text-muted-foreground">
                            {variant?.size} / {variant?.color}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            SKU: {variant?.sku}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">Số lượng: {item.quantity}</span>
                            <span className="font-medium">
                              ${Number(item.unit_price || item.unitPrice || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Shipping address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shippingAddr ? (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{shippingAddr.street}</p>
                      <p className="text-muted-foreground">
                        {shippingAddr.state}, {shippingAddr.city}
                      </p>
                      <p className="text-muted-foreground">
                        {shippingAddr.zip}, {shippingAddr.country}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa có địa chỉ giao hàng
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Order summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Tổng quan đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Trạng thái</span>
                      <Badge
                        variant="outline"
                        className={statusColors[status] || statusColors.pending}
                      >
                        {statusLabels[status] || order.status}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính</span>
                      <span>${Number(order.total_amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển</span>
                      <span>Miễn phí</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">
                        ${Number(order.total_amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Đặt ngày{" "}
                        {new Date(order.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>Thanh toán khi nhận hàng</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Link href="/client/products">
                      <Button variant="outline" className="w-full">
                        Tiếp tục mua sắm
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="ghost" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Về trang chủ
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
