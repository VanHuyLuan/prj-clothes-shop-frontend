"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// MoMo redirects here with query params:
// resultCode=0 → success, resultCode≠0 → failed
// orderId = order_number
function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const resultCode = Number(searchParams.get("resultCode") ?? "-1");
  const orderId = searchParams.get("orderId") ?? "";
  const message = searchParams.get("message") ?? "";
  const isSuccess = resultCode === 0;

  useEffect(() => {
    if (!orderId) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push(`/client/orders/${orderId}`);
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="bg-background border rounded-2xl shadow-lg max-w-md w-full p-10 text-center space-y-6">
        {isSuccess ? (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSuccess
              ? "Đơn hàng của bạn đã được xác nhận và đang được xử lý."
              : message || "Giao dịch không thành công. Vui lòng thử lại."}
          </p>
        </div>

        {orderId && (
          <div className="bg-muted rounded-lg py-3 px-4 text-sm">
            <span className="text-muted-foreground">Mã đơn hàng: </span>
            <span className="font-mono font-semibold">{orderId}</span>
          </div>
        )}

        <div className="space-y-3">
          {orderId && (
            <Link href={`/client/orders/${orderId}`}>
              <Button className="w-full" size="lg">
                Xem đơn hàng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          <Link href="/client/products">
            <Button variant="outline" className="w-full">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>

        {orderId && (
          <p className="text-xs text-muted-foreground">
            Tự động chuyển đến đơn hàng sau{" "}
            <span className="font-semibold text-foreground">{countdown}s</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
