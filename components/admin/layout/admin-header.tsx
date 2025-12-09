"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, Settings, Store, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/auth-provider";

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    setIsOpen(false);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "AD";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "Admin User";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, orders, customers..."
            className="w-full pl-9 bg-muted/50 border-0 focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right Side Actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-full hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            className="relative flex items-center gap-2 rounded-full hover:bg-muted px-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Avatar className="h-9 w-9 border-2 border-primary/10">
              <AvatarImage 
                src={user?.avatar || undefined} 
                alt={getUserDisplayName()} 
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg z-50">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 border-b">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={user?.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || "admin@example.com"}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs w-fit">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Administrator
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                    onClick={() => {
                      router.push("/admin/settings");
                      setIsOpen(false);
                    }}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Settings</span>
                  </button>

                  <button
                    className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                    onClick={() => {
                      router.push("/");
                      setIsOpen(false);
                    }}
                  >
                    <Store className="mr-3 h-4 w-4" />
                    <span>View Store</span>
                  </button>
                </div>

                <div className="border-t py-2">
                  <button
                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors text-left font-medium"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
