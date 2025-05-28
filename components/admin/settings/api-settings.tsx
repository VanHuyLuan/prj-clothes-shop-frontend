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
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Copy, Key, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const apiFormSchema = z.object({
  apiEnabled: z.boolean(),
  webhooksEnabled: z.boolean(),
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
  orderCreatedWebhook: z.string().url().optional().or(z.literal("")),
  orderUpdatedWebhook: z.string().url().optional().or(z.literal("")),
  orderFulfilledWebhook: z.string().url().optional().or(z.literal("")),
  productUpdatedWebhook: z.string().url().optional().or(z.literal("")),
});

type ApiFormValues = z.infer<typeof apiFormSchema>;

const defaultValues: ApiFormValues = {
  apiEnabled: true,
  webhooksEnabled: false,
  apiKey: "sk_test_51Hb9***************************",
  orderCreatedWebhook: "",
  orderUpdatedWebhook: "",
  orderFulfilledWebhook: "",
  productUpdatedWebhook: "",
};

export function ApiSettings() {
  const form = useForm<ApiFormValues>({
    resolver: zodResolver(apiFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ApiFormValues) {
    toast({
      title: "API settings updated",
      description: "Your API settings have been updated successfully.",
    });
    console.log(data);
  }

  function regenerateApiKey() {
    const newApiKey =
      "sk_test_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    form.setValue("apiKey", newApiKey);
    toast({
      title: "API key regenerated",
      description: "Your API key has been regenerated successfully.",
    });
  }

  function copyApiKey() {
    navigator.clipboard.writeText(form.getValues("apiKey"));
    toast({
      title: "API key copied",
      description: "Your API key has been copied to clipboard.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your store&apos;s API access and webhooks.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Your API key provides full access to your store. Keep it secure and
          never share it publicly.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="apiEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">API Access</FormLabel>
                  <FormDescription>
                    Enable API access to your store.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("apiEnabled") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API Key</CardTitle>
                <CardDescription>
                  Use this key to authenticate API requests to your store.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="flex items-center">
                            <Input {...field} readOnly className="font-mono" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyApiKey}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={regenerateApiKey}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Regenerate</span>
                  </Button>
                </div>

                <div className="flex items-center">
                  <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Last regenerated: May 15, 2023
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <FormField
            control={form.control}
            name="webhooksEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Webhooks</FormLabel>
                  <FormDescription>
                    Enable webhooks to receive notifications about events in
                    your store.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("webhooksEnabled") && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="orderCreatedWebhook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Created Webhook URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-server.com/webhooks/order-created"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This webhook is triggered when a new order is created.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderUpdatedWebhook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Updated Webhook URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-server.com/webhooks/order-updated"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This webhook is triggered when an order is updated.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderFulfilledWebhook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Fulfilled Webhook URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-server.com/webhooks/order-fulfilled"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This webhook is triggered when an order is fulfilled.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productUpdatedWebhook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Updated Webhook URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-server.com/webhooks/product-updated"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This webhook is triggered when a product is updated.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button type="submit">Save API Settings</Button>
        </form>
      </Form>
    </div>
  );
}
