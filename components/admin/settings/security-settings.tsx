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
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const securityFormSchema = z.object({
  twoFactorAuth: z.boolean(),
  passwordPolicy: z.string().min(1, {
    message: "Please select a password policy.",
  }),
  sessionTimeout: z.string().min(1, {
    message: "Please select a session timeout.",
  }),
  loginAttempts: z.string().min(1, {
    message: "Please enter a valid number of login attempts.",
  }),
  ipWhitelist: z.string().optional(),
  adminAccessRestriction: z.boolean(),
  dataEncryption: z.boolean(),
  privacyPolicy: z
    .string()
    .min(10, {
      message: "Privacy policy must be at least 10 characters.",
    })
    .optional(),
  termsOfService: z
    .string()
    .min(10, {
      message: "Terms of service must be at least 10 characters.",
    })
    .optional(),
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

const defaultValues: SecurityFormValues = {
  twoFactorAuth: false,
  passwordPolicy: "strong",
  sessionTimeout: "30",
  loginAttempts: "5",
  ipWhitelist: "",
  adminAccessRestriction: false,
  dataEncryption: true,
  privacyPolicy:
    "Our privacy policy outlines how we collect, use, and protect your personal information...",
  termsOfService:
    "By using our services, you agree to these terms and conditions...",
};

export function SecuritySettings() {
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: SecurityFormValues) {
    toast({
      title: "Security settings updated",
      description: "Your security settings have been updated successfully.",
    });
    console.log(data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your store&apos;s security and privacy settings.
        </p>
      </div>

      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Security Best Practices</AlertTitle>
        <AlertDescription>
          We recommend enabling two-factor authentication and setting a strong
          password policy to protect your store.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Authentication</h4>

            <FormField
              control={form.control}
              name="twoFactorAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <FormLabel className="text-base">
                        Two-Factor Authentication
                      </FormLabel>
                    </div>
                    <FormDescription>
                      Require a verification code in addition to a password when
                      logging in.
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="passwordPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Policy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select password policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">
                          Basic (min. 8 characters)
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium (min. 10 chars, 1 number)
                        </SelectItem>
                        <SelectItem value="strong">
                          Strong (min. 12 chars, mixed case, numbers, symbols)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define the complexity requirements for passwords.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Timeout (minutes)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How long until inactive users are logged out.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="loginAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Login Attempts</FormLabel>
                    <FormControl>
                      <Input placeholder="5" {...field} />
                    </FormControl>
                    <FormDescription>
                      Number of failed login attempts before account lockout.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ipWhitelist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Whitelist</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.1, 10.0.0.1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of allowed IP addresses.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="adminAccessRestriction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <FormLabel className="text-base">
                        Admin Access Restriction
                      </FormLabel>
                    </div>
                    <FormDescription>
                      Restrict admin access to specific IP addresses in the
                      whitelist.
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

            <FormField
              control={form.control}
              name="dataEncryption"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <FormLabel className="text-base">
                        Data Encryption
                      </FormLabel>
                    </div>
                    <FormDescription>
                      Encrypt sensitive customer data in the database.
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
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Legal Documents</h4>

            <FormField
              control={form.control}
              name="privacyPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy Policy</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your privacy policy URL"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to your privacy policy or the policy text.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsOfService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms of Service</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your terms of service URL"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to your terms of service or the terms text.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Save Security Settings</Button>
        </form>
      </Form>
    </div>
  );
}
