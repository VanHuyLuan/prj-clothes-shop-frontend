"use client";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Package,
  Tags,
  Percent,
  Star,
  UserCog,
  Boxes,
  Activity,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Real-Time",
    href: "/admin/real-time",
    icon: Activity,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Percent,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UserCog,
  },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 border-r bg-background lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">STYLISH</h1>
      </div>
      <nav className="space-y-1 p-4">
        {sidebarItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
