"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { MotionDiv } from "@/components/providers/motion-provider";

export function AuthStatus() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="hover:bg-muted/80">
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="relative overflow-hidden rounded-full transition-all duration-300 hover:shadow-md"
            >
              <span className="relative z-10">Sign up</span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80 opacity-100 transition-all duration-300 hover:opacity-80"></span>
            </Button>
          </MotionDiv>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full border border-muted/30 bg-muted/30 hover:bg-muted/80 flex items-center gap-1 px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-5 w-5" />
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white border rounded-md shadow-lg z-50">
          <div className="flex flex-col space-y-1 p-3 border-b">
            <p className="text-base font-semibold leading-relaxed">{user.lastName}</p>
            <p className="text-sm leading-relaxed text-gray-500">
              {user.email}
            </p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/account" 
              className="flex items-center px-3 py-2.5 text-sm font-medium hover:bg-gray-100 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-3"></span>
              My Account
            </Link>
            
            <Link 
              href="/orders" 
              className="flex items-center px-3 py-2.5 text-sm font-medium hover:bg-gray-100 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-3"></span>
              My Orders
            </Link>
            
            {user?.role === "admin" && (
              <Link 
                href="/admin" 
                className="flex items-center px-3 py-2.5 text-sm font-medium hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-3"></span>
                Admin Dashboard
              </Link>
            )}
          </div>
          
          <div className="border-t py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-gray-100 cursor-pointer"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
