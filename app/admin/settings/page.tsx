import { SettingsTabs } from "@/components/admin/settings/settings-tabs";

export const metadata = {
  title: "Store Settings - STYLISH Admin",
  description: "Configure store settings for STYLISH clothing store",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
      </div>
      <SettingsTabs />
    </div>
  );
}
