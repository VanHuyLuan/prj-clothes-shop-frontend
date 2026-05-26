"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, ShoppingBag, CreditCard, Banknote, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import QRCode from "react-qr-code";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiService } from "@/lib/api";
import { toast } from "sonner";
import { formatVND } from "@/lib/utils";

const addressSchema = z.object({
  street: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "District is required"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface SavedAddress extends AddressFormData {
  id: string;
}

type PaymentStatus = "waiting" | "success" | "failed";

const MOMO_QR_TTL = 10 * 60; // 10 minutes (seconds)

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, refreshCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "momo">("cod");
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string> | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // MoMo QR dialog state
  const [momoDialogOpen, setMomoDialogOpen] = useState(false);
  const [momoQrValue, setMomoQrValue] = useState("");
  const [momoDeeplink, setMomoDeeplink] = useState("");
  const [pendingOrderNumber, setPendingOrderNumber] = useState("");
  const [pendingAmount, setPendingAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("waiting");
  const [countdown, setCountdown] = useState(MOMO_QR_TTL);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutSelectedIds");
    if (stored) {
      setSelectedItemIds(new Set(JSON.parse(stored) as string[]));
      sessionStorage.removeItem("checkoutSelectedIds");
    }
  }, []);

  const checkoutItems =
    selectedItemIds && selectedItemIds.size > 0
      ? items.filter((i) => selectedItemIds.has(i.id))
      : items;

  const checkoutTotal = checkoutItems.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );
  const checkoutCount = checkoutItems.reduce((sum, i) => sum + i.quantity, 0);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Vietnam",
    },
  });

  useEffect(() => {
    if (user) loadSavedAddresses();
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && !isPlacingOrder) router.push("/client/cart");
  }, [items, router, isPlacingOrder]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const loadSavedAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const addresses = await ApiService.getAddresses();
      if (addresses && addresses.length > 0) {
        setSavedAddresses(addresses);
        setSelectedAddressId(addresses[0].id);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const stopPolling = useCallback(() => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  }, []);

  const startMomoPolling = useCallback(
    (orderNumber: string) => {
      // Countdown timer
      setCountdown(MOMO_QR_TTL);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            stopPolling();
            setPaymentStatus("failed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Payment status polling
      pollingRef.current = setInterval(async () => {
        try {
          const payment = await ApiService.getPaymentByOrderId(orderNumber);
          if (payment?.status === "completed") {
            stopPolling();
            setPaymentStatus("success");
            setTimeout(() => {
              setMomoDialogOpen(false);
              refreshCart();
              toast.success("Payment successful! Your order has been confirmed.");
              router.push(`/client/orders/${orderNumber}`);
            }, 2000);
          } else if (payment?.status === "failed") {
            stopPolling();
            setPaymentStatus("failed");
          }
        } catch {
          // ignore transient errors
        }
      }, 3000);
    },
    [router, stopPolling, refreshCart]
  );

  const handleCancelMomo = () => {
    stopPolling();
    setMomoDialogOpen(false);
    refreshCart();
    toast.info("Payment cancelled. You can retry payment from the order page.");
    router.push(`/client/orders/${pendingOrderNumber}`);
  };

  const handlePlaceOrder = () => {
    if (user && selectedAddressId !== "new") {
      onSubmit({} as AddressFormData);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);
      setIsPlacingOrder(true);

      let shippingAddress: AddressFormData;

      if (user && selectedAddressId !== "new") {
        const selectedAddr = savedAddresses.find((addr) => addr.id === selectedAddressId);
        if (!selectedAddr) {
          toast.error("Please select a shipping address");
          return;
        }
        shippingAddress = {
          street: selectedAddr.street,
          city: selectedAddr.city,
          state: selectedAddr.state,
          zip: selectedAddr.zip,
          country: selectedAddr.country,
        };
      } else {
        shippingAddress = data;
      }

      let order;

      if (user) {
        order = await ApiService.createOrder({
          items: checkoutItems.map((i) => ({
            product_variant_id: i.variantId,
            quantity: i.quantity,
          })),
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
        });
        await Promise.all(
          checkoutItems.map((i) => ApiService.removeCartItem(i.id).catch(() => {}))
        );
        // refreshCart() is deferred — calling it here empties `items` and triggers
        // the items.length === 0 useEffect redirect before MoMo dialog can show.
      } else {
        const guestCartId = localStorage.getItem("guestCartId");
        if (!guestCartId) {
          toast.error("Cart not found");
          router.push("/client/cart");
          return;
        }
        order = await ApiService.guestCheckout({
          cart_id: guestCartId,
          shipping_address: shippingAddress,
        });
        localStorage.removeItem("guestCartId");
      }

      if (paymentMethod === "momo") {
        const amountVnd = Math.round(Number(order.total_amount));
        const momoResult = await ApiService.createMomoPayment({
          orderId: order.order_number,
          amount: amountVnd,
          orderInfo: `Payment for order ${order.order_number}`,
        });

        if (momoResult.qrCodeUrl || momoResult.payUrl) {
          setPendingOrderNumber(order.order_number);
          setPendingAmount(amountVnd);
          setMomoQrValue(momoResult.qrCodeUrl || momoResult.payUrl);
          setMomoDeeplink(momoResult.deeplink || momoResult.payUrl);
          setPaymentStatus("waiting");
          setMomoDialogOpen(true);
          startMomoPolling(order.order_number);
          // refreshCart() will be called when dialog closes (success/cancel/expire)
        } else {
          toast.error("Could not create MoMo payment. Please try again.");
          refreshCart();
          router.push(`/client/orders/${order.order_number}`);
        }
        return;
      }

      // COD: refresh cart then redirect
      refreshCart();
      toast.success("Order placed successfully!");
      router.push(`/client/orders/${order.order_number}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      if (error.message?.includes("409") || error.message?.includes("stock")) {
        toast.error("Some items are out of stock", {
          description: "Please review your cart",
          action: { label: "View cart", onClick: () => router.push("/client/cart") },
        });
      } else if (error.message?.includes("401")) {
        toast.error("Session expired", { description: "Please sign in again" });
        router.push("/login");
      } else {
        toast.error("Could not place order", { description: error.message || "Please try again later" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (items.length === 0 || checkoutItems.length === 0) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Link
            href="/client/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cart
          </Link>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Shipping Address */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {user && savedAddresses.length > 0 && (
                    <div className="space-y-4">
                      <Label>Select shipping address</Label>
                      <RadioGroup
                        value={selectedAddressId}
                        onValueChange={setSelectedAddressId}
                        className="space-y-3"
                      >
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          >
                            <RadioGroupItem value={addr.id} id={addr.id} />
                            <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                              <div className="font-medium">{addr.street}</div>
                              <div className="text-sm text-muted-foreground">
                                {addr.state}, {addr.city}, {addr.zip}
                              </div>
                              <div className="text-sm text-muted-foreground">{addr.country}</div>
                            </Label>
                          </div>
                        ))}
                        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="new" id="new" />
                          <Label htmlFor="new" className="cursor-pointer">
                            Use a new address
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {(!user || selectedAddressId === "new") && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street address</FormLabel>
                              <FormControl>
                                <Input placeholder="House number, street name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ho Chi Minh City" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                  <Input placeholder="District 1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP code</FormLabel>
                                <FormControl>
                                  <Input placeholder="700000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="Vietnam" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order ({checkoutCount} item{checkoutCount !== 1 ? "s" : ""})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {checkoutItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.size} / {item.color}
                          </p>
                          <p className="text-sm">
                            {item.quantity} x {formatVND(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatVND(checkoutTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatVND(checkoutTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payment method</p>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(v) => setPaymentMethod(v as "cod" | "momo")}
                      className="space-y-2"
                    >
                      <div
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                      >
                        <RadioGroupItem value="cod" id="pm-cod" />
                        <Label htmlFor="pm-cod" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Banknote className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Cash on delivery (COD)</span>
                        </Label>
                      </div>
                      <div
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "momo" ? "border-pink-500 bg-pink-50 dark:bg-pink-950/20" : "hover:bg-muted/50"}`}
                      >
                        <RadioGroupItem value="momo" id="pm-momo" />
                        <Label htmlFor="pm-momo" className="flex items-center gap-2 cursor-pointer flex-1">
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="h-2.5 w-2.5 text-white" />
                          </div>
                          <span className="text-sm">Pay with MoMo</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isLoading || items.length === 0}
                    className={`w-full ${paymentMethod === "momo" ? "bg-pink-600 hover:bg-pink-700 text-white" : ""}`}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : paymentMethod === "momo" ? (
                      "Pay with MoMo"
                    ) : (
                      "Place order"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing an order, you agree to our{" "}
                    <Link href="/terms" className="underline">
                      Terms of Service
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* MoMo QR Payment Dialog */}
      <Dialog
        open={momoDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (paymentStatus === "waiting") handleCancelMomo();
            else setMomoDialogOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-pink-600">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center">
                <CreditCard className="h-3.5 w-3.5 text-white" />
              </div>
              MoMo Payment
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-5 py-2">
            {paymentStatus === "waiting" && (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Open the MoMo app and scan the QR code below to pay
                </p>

                {/* QR Code */}
                <div className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-sm">
                  {momoQrValue ? (
                    <QRCode
                      value={momoQrValue}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "200px" }}
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {pendingAmount.toLocaleString("en-US")}₫
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Order: {pendingOrderNumber}
                  </p>
                </div>

                {/* Countdown */}
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Waiting for payment...</span>
                  <span
                    className={`font-mono font-semibold ${countdown < 60 ? "text-red-500" : "text-foreground"}`}
                  >
                    {formatCountdown(countdown)}
                  </span>
                </div>

                {/* Open MoMo App button (for mobile) */}
                {momoDeeplink && (
                  <a
                    href={momoDeeplink}
                    className="w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                      Open MoMo app
                    </Button>
                  </a>
                )}

                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={handleCancelMomo}
                >
                  Cancel payment
                </Button>
              </>
            )}

            {paymentStatus === "success" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="text-lg font-semibold text-green-600">Payment successful!</p>
                <p className="text-sm text-muted-foreground text-center">
                  Your order has been confirmed. Redirecting...
                </p>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-lg font-semibold text-red-600">Payment failed</p>
                <p className="text-sm text-muted-foreground text-center">
                  The QR code has expired or the payment was unsuccessful.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMomoDialogOpen(false);
                    refreshCart();
                    router.push(`/client/orders/${pendingOrderNumber}`);
                  }}
                >
                  View order
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
