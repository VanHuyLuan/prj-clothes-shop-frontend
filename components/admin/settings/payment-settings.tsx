"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, ShoppingCartIcon as Paypal, Wallet } from "lucide-react";

const paymentFormSchema = z.object({
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
  stripeEnabled: z.boolean(),
  stripeKey: z
    .string()
    .min(10, {
      message: "Please enter a valid Stripe key.",
    })
    .optional(),
  paypalEnabled: z.boolean(),
  paypalClientId: z.string().optional(),
  cashOnDelivery: z.boolean(),
  taxRate: z.string().min(1, {
    message: "Please enter a valid tax rate.",
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const defaultValues: PaymentFormValues = {
  currency: "USD",
  stripeEnabled: true,
  stripeKey: "pk_test_51Hb9***************************",
  paypalEnabled: false,
  paypalClientId: "",
  cashOnDelivery: true,
  taxRate: "7.5",
};

export function PaymentSettings() {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: PaymentFormValues) {
    toast({
      title: "Payment settings updated",
      description: "Your payment settings have been updated successfully.",
    });
    console.log(data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Payment Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your store&apos;s payment methods and settings.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The currency used for all transactions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="7.5" {...field} />
                  </FormControl>
                  <FormDescription>
                    Default tax rate applied to orders.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Payment Methods</h4>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <CardTitle className="text-base">Stripe</CardTitle>
                </div>
                <FormField
                  control={form.control}
                  name="stripeEnabled"
                  render={({ field }) => (
                    <FormItem className="ml-auto flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardHeader>
              <CardContent>
                <CardDescription className="pb-4">
                  Accept credit card payments via Stripe.
                </CardDescription>
                {form.watch("stripeEnabled") && (
                  <FormField
                    control={form.control}
                    name="stripeKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stripe API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="pk_test_..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Paypal className="h-4 w-4" />
                  <CardTitle className="text-base">PayPal</CardTitle>
                </div>
                <FormField
                  control={form.control}
                  name="paypalEnabled"
                  render={({ field }) => (
                    <FormItem className="ml-auto flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardHeader>
              <CardContent>
                <CardDescription className="pb-4">
                  Accept payments via PayPal.
                </CardDescription>
                {form.watch("paypalEnabled") && (
                  <FormField
                    control={form.control}
                    name="paypalClientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PayPal Client ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your PayPal client ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4" />
                  <CardTitle className="text-base">Cash on Delivery</CardTitle>
                </div>
                <FormField
                  control={form.control}
                  name="cashOnDelivery"
                  render={({ field }) => (
                    <FormItem className="ml-auto flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Allow customers to pay with cash upon delivery.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Button type="submit">Save changes</Button>
        </form>
      </Form>
    </div>
  );
}
