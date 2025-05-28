import { SettingsTabs } from "@/components/admin/settings/settings-tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences.
        </p>
      </div>
      <SettingsTabs />
    </div>
  );
}
