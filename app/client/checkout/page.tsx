"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

// Validation schema for shipping address
const addressSchema = z.object({
  street: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  city: z.string().min(2, "Thành phố không được để trống"),
  state: z.string().min(2, "Quận/Huyện không được để trống"),
  zip: z.string().min(5, "Mã bưu điện phải có ít nhất 5 ký tự"),
  country: z.string().min(2, "Quốc gia không được để trống"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface SavedAddress extends AddressFormData {
  id: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotalPrice, getTotalItems } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Form for address
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

  // Load saved addresses for logged-in users
  useEffect(() => {
    if (user) {
      loadSavedAddresses();
    }
  }, [user]);

  // Load addresses from user profile or address API
  const loadSavedAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const addresses = await ApiService.getAddresses();
      if (addresses && addresses.length > 0) {
        setSavedAddresses(addresses);
        setSelectedAddressId(addresses[0].id); // Select first address by default
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/client/cart");
    }
  }, [items, router]);

  // Handle checkout
  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);

      let shippingAddress: AddressFormData;

      // Determine shipping address
      if (user && selectedAddressId !== "new") {
        // Use selected saved address
        const selectedAddr = savedAddresses.find((addr) => addr.id === selectedAddressId);
        if (!selectedAddr) {
          toast.error("Vui lòng chọn địa chỉ giao hàng");
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
        // Use form data (new address or guest)
        shippingAddress = data;
      }

      let order;

      if (user) {
        // User checkout
        order = await ApiService.checkout({
          shipping_address: shippingAddress,
        });
      } else {
        // Guest checkout
        const guestCartId = localStorage.getItem("guestCartId");
        if (!guestCartId) {
          toast.error("Không tìm thấy giỏ hàng");
          router.push("/client/cart");
          return;
        }

        order = await ApiService.guestCheckout({
          cart_id: guestCartId,
          shipping_address: shippingAddress,
        });

        // Clear guest cart after successful checkout
        localStorage.removeItem("guestCartId");
      }

      // Success - redirect to order confirmation
      toast.success("Đặt hàng thành công!");
      router.push(`/client/orders/${order.order_number}`);
    } catch (error: any) {
      console.error("Checkout error:", error);

      // Handle specific errors
      if (error.message?.includes("409") || error.message?.includes("stock")) {
        toast.error("Một số sản phẩm đã hết hàng", {
          description: "Vui lòng kiểm tra lại giỏ hàng",
          action: {
            label: "Xem giỏ hàng",
            onClick: () => router.push("/client/cart"),
          },
        });
      } else if (error.message?.includes("401")) {
        toast.error("Phiên đăng nhập đã hết hạn", {
          description: "Vui lòng đăng nhập lại",
        });
        router.push("/login");
      } else {
        toast.error("Không thể đặt hàng", {
          description: error.message || "Vui lòng thử lại sau",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Back button */}
          <Link
            href="/client/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại giỏ hàng
          </Link>

          <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Shipping Address */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Saved addresses for logged-in users */}
                  {user && savedAddresses.length > 0 && (
                    <div className="space-y-4">
                      <Label>Chọn địa chỉ giao hàng</Label>
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
                            <Label
                              htmlFor={addr.id}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="font-medium">{addr.street}</div>
                              <div className="text-sm text-muted-foreground">
                                {addr.state}, {addr.city}, {addr.zip}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {addr.country}
                              </div>
                            </Label>
                          </div>
                        ))}
                        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="new" id="new" />
                          <Label htmlFor="new" className="cursor-pointer">
                            Sử dụng địa chỉ mới
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Address form - show for guest or when "new" is selected */}
                  {(!user || selectedAddressId === "new") && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Địa chỉ</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Số nhà, tên đường"
                                  {...field}
                                />
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
                                <FormLabel>Thành phố</FormLabel>
                                <FormControl>
                                  <Input placeholder="Hồ Chí Minh" {...field} />
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
                                <FormLabel>Quận/Huyện</FormLabel>
                                <FormControl>
                                  <Input placeholder="Quận 1" {...field} />
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
                                <FormLabel>Mã bưu điện</FormLabel>
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
                                <FormLabel>Quốc gia</FormLabel>
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
                    Đơn hàng ({getTotalItems()} sản phẩm)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order items */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {items.map((item) => (
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
                          <p className="text-sm font-medium truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.size} / {item.color}
                          </p>
                          <p className="text-sm">
                            {item.quantity} x ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển</span>
                      <span>Miễn phí</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading || items.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Đặt hàng"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Bằng cách đặt hàng, bạn đồng ý với{" "}
                    <Link href="/terms" className="underline">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    của chúng tôi
                  </p>
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
