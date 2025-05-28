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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Mail, MessageSquare } from "lucide-react";

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  emailFrom: z.string().email({
    message: "Please enter a valid email address.",
  }),
  emailReplyTo: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional(),
  smtpHost: z.string().min(1, {
    message: "Please enter a valid SMTP host.",
  }),
  smtpPort: z.string().min(1, {
    message: "Please enter a valid SMTP port.",
  }),
  smtpUsername: z.string().min(1, {
    message: "Please enter a valid SMTP username.",
  }),
  smtpPassword: z.string().min(1, {
    message: "Please enter a valid SMTP password.",
  }),
  orderConfirmationTemplate: z.string().optional(),
  shippingConfirmationTemplate: z.string().optional(),
  orderCancelledTemplate: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const defaultValues: NotificationFormValues = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: false,
  emailFrom: "noreply@stylish.com",
  emailReplyTo: "support@stylish.com",
  smtpHost: "smtp.example.com",
  smtpPort: "587",
  smtpUsername: "smtp_user",
  smtpPassword: "********",
  orderConfirmationTemplate:
    "Thank you for your order! Your order #{{order_number}} has been received and is being processed.",
  shippingConfirmationTemplate:
    "Good news! Your order #{{order_number}} has been shipped and is on its way to you.",
  orderCancelledTemplate:
    "Your order #{{order_number}} has been cancelled as requested.",
};

export function NotificationSettings() {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: NotificationFormValues) {
    toast({
      title: "Notification settings updated",
      description: "Your notification settings have been updated successfully.",
    });
    console.log(data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how and when notifications are sent to customers and
          administrators.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Notification Channels</h4>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <CardTitle className="text-base">
                    Email Notifications
                  </CardTitle>
                </div>
                <FormField
                  control={form.control}
                  name="emailNotifications"
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
                  Send email notifications for order updates, shipping
                  confirmations, and more.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <CardTitle className="text-base">SMS Notifications</CardTitle>
                </div>
                <FormField
                  control={form.control}
                  name="smsNotifications"
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
                  Send SMS notifications for order updates and shipping
                  confirmations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <CardTitle className="text-base">
                    Push Notifications
                  </CardTitle>
                </div>
                <FormField
                  control={form.control}
                  name="pushNotifications"
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
                  Send push notifications to customers who have installed your
                  mobile app.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {form.watch("emailNotifications") && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Email Settings</h4>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emailFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <FormControl>
                        <Input placeholder="noreply@stylish.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The email address that will appear in the
                        &quot;From&quot; field.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailReplyTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reply-To Email</FormLabel>
                      <FormControl>
                        <Input placeholder="support@stylish.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The email address customers can reply to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="smtpHost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input placeholder="smtp.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smtpPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input placeholder="587" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="smtpUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smtpPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h4 className="text-sm font-medium mt-6">Email Templates</h4>

              <FormField
                control={form.control}
                name="orderConfirmationTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Confirmation Template</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Thank you for your order!"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use {"{{"} order_number {"}}"}, {"{{"} customer_name{" "}
                      {"}}"}, and other placeholders.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingConfirmationTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Confirmation Template</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your order has been shipped!"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use {"{{"} order_number {"}}"}, {"{{"} tracking_number{" "}
                      {"}}"}, and other placeholders.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderCancelledTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Cancelled Template</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your order has been cancelled."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use {"{{"} order_number {"}}"}, {"{{"} cancellation_reason{" "}
                      {"}}"}, and other placeholders.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button type="submit">Save Notification Settings</Button>
        </form>
      </Form>
    </div>
  );
}
