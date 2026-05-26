"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Tags,
  UserCog,
  Boxes,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products",  href: "/admin/products",   icon: Package },
  { title: "Categories",href: "/admin/categories", icon: Tags },
  { title: "Inventory", href: "/admin/inventory",  icon: Boxes },
  { title: "Orders",    href: "/admin/orders",     icon: ShoppingBag },
  { title: "Customers", href: "/admin/customers",  icon: Users },
  { title: "Users",     href: "/admin/users",      icon: UserCog },
  { title: "Settings",  href: "/admin/settings",   icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden w-64 border-r bg-background lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">STYLISH</h1>
      </div>
      <nav className="space-y-1 p-4">
        {sidebarItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
