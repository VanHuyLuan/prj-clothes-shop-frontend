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
import { Trash2 } from "lucide-react";
import { useState } from "react";

const shippingFormSchema = z.object({
  weightUnit: z.string().min(1, {
    message: "Please select a weight unit.",
  }),
  dimensionUnit: z.string().min(1, {
    message: "Please select a dimension unit.",
  }),
  freeShippingEnabled: z.boolean(),
  freeShippingThreshold: z.string().optional(),
  shippingOriginAddress: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  shippingOriginCity: z.string().min(2, {
    message: "Please enter a valid city.",
  }),
  shippingOriginState: z.string().min(2, {
    message: "Please enter a valid state/province.",
  }),
  shippingOriginZip: z.string().min(3, {
    message: "Please enter a valid ZIP/postal code.",
  }),
  shippingOriginCountry: z.string().min(2, {
    message: "Please select a country.",
  }),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

const defaultValues: ShippingFormValues = {
  weightUnit: "kg",
  dimensionUnit: "cm",
  freeShippingEnabled: true,
  freeShippingThreshold: "100",
  shippingOriginAddress: "123 Fashion Street",
  shippingOriginCity: "New York",
  shippingOriginState: "NY",
  shippingOriginZip: "10001",
  shippingOriginCountry: "US",
};

type ShippingZone = {
  id: string;
  name: string;
  countries: string[];
  rate: string;
};

export function ShippingSettings() {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    {
      id: "1",
      name: "Domestic",
      countries: ["US"],
      rate: "5.99",
    },
    {
      id: "2",
      name: "International",
      countries: ["Worldwide"],
      rate: "19.99",
    },
  ]);

  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneRate, setNewZoneRate] = useState("");

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ShippingFormValues) {
    toast({
      title: "Shipping settings updated",
      description: "Your shipping settings have been updated successfully.",
    });
    console.log(data);
  }

  function addShippingZone() {
    if (newZoneName && newZoneRate) {
      setShippingZones([
        ...shippingZones,
        {
          id: Date.now().toString(),
          name: newZoneName,
          countries: ["Select countries"],
          rate: newZoneRate,
        },
      ]);
      setNewZoneName("");
      setNewZoneRate("");
    }
  }

  function removeShippingZone(id: string) {
    setShippingZones(shippingZones.filter((zone) => zone.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Shipping Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your store&apos;s shipping options and rates.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="weightUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weight unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="g">Grams (g)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                      <SelectItem value="oz">Ounces (oz)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensionUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimension Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dimension unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cm">Centimeters (cm)</SelectItem>
                      <SelectItem value="m">Meters (m)</SelectItem>
                      <SelectItem value="in">Inches (in)</SelectItem>
                      <SelectItem value="ft">Feet (ft)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="freeShippingEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Free Shipping</FormLabel>
                  <FormDescription>
                    Offer free shipping on orders above a certain amount.
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

          {form.watch("freeShippingEnabled") && (
            <FormField
              control={form.control}
              name="freeShippingThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Shipping Threshold</FormLabel>
                  <FormControl>
                    <Input placeholder="100" {...field} />
                  </FormControl>
                  <FormDescription>
                    Orders above this amount qualify for free shipping.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div>
            <h4 className="text-sm font-medium mb-4">Shipping Origin</h4>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shippingOriginAddress"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Fashion Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingOriginCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingOriginState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingOriginZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP/Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingOriginCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Shipping Zones</h4>
            </div>

            {shippingZones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-base">{zone.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8"
                    onClick={() => removeShippingZone(zone.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Countries</p>
                    <p className="text-sm text-muted-foreground">
                      {zone.countries.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Rate</p>
                    <p className="text-sm text-muted-foreground">
                      ${zone.rate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Shipping Zone</CardTitle>
                <CardDescription>
                  Create a new shipping zone with specific rates.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Zone Name</FormLabel>
                  <Input
                    placeholder="e.g. Europe"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel>Shipping Rate ($)</FormLabel>
                  <Input
                    placeholder="e.g. 12.99"
                    value={newZoneRate}
                    onChange={(e) => setNewZoneRate(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button onClick={addShippingZone} type="button">
                  Add Zone
                </Button>
              </CardContent>
            </Card>
          </div>

          <Button type="submit">Save Shipping Settings</Button>
        </form>
      </Form>
    </div>
  );
}
