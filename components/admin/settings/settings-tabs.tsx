"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { GeneralSettings } from "./general-settings";
import { PaymentSettings } from "./payment-settings";
import { ShippingSettings } from "./shipping-settings";
import { NotificationSettings } from "./notification-settings";
import { ApiSettings } from "./api-settings";
import { SecuritySettings } from "./security-settings";

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Tabs
      defaultValue="general"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-6 mb-8">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <Card className="p-6">
        <TabsContent value="general" className="mt-0">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="payment" className="mt-0">
          <PaymentSettings />
        </TabsContent>
        <TabsContent value="shipping" className="mt-0">
          <ShippingSettings />
        </TabsContent>
        <TabsContent value="notifications" className="mt-0">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="api" className="mt-0">
          <ApiSettings />
        </TabsContent>
        <TabsContent value="security" className="mt-0">
          <SecuritySettings />
        </TabsContent>
      </Card>
    </Tabs>
  );
}
