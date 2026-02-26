"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthStatus } from "@/components/auth/auth-status";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { SearchButton } from "@/components/client/search/search-button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const isHomePage = pathname === "/";

  const navItems = [
    { name: "Women", href: "/client/women" },
    { name: "Men", href: "/client/men" },
    { name: "Kids", href: "/client/kids" },
    { name: "Accessories", href: "/client/accessories" },
    { name: "Sale", href: "/client/sale" },
    { name: "✨ Virtual Try-On", href: "/client/virtual-tryon" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b bg-background/80 backdrop-blur-md"
          : isHomePage
          ? "bg-transparent"
          : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-screen-xl flex items-center justify-between h-20 px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden",
                isHomePage && !scrolled ? "text-white" : "text-foreground"
              )}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "text-2xl font-bold",
              isHomePage && !scrolled ? "text-foreground" : "text-foreground"
            )}
          >
            STYLISH
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium relative group transition-colors",
                  isActive && "font-semibold",
                  isHomePage && !scrolled
                    ? " hover:text-white/80"
                    : "text-foreground hover:text-primary"
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )}
                ></span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <SearchButton 
            isHomePage={isHomePage}
            scrolled={scrolled}
          />
          <Link href="/client/cart">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full relative",
                isHomePage && !scrolled
                  ? "border-white/30 hover:bg-white/10"
                  : "border-muted/30 hover:bg-muted/80"
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
