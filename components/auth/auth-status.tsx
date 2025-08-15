"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User, Settings, ShoppingBag, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider"
import { MotionDiv } from "@/components/providers/motion-provider"

export function AuthStatus() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

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
    )
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-muted/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-200 h-10 w-10"
          >
            {user?.avatar ? (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={`${user.firstName || "User"} avatar`}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-primary">{getUserInitials(user)}</span>
            )}
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          side="bottom"
          sideOffset={8}
          className="w-56 mt-2"
        >
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex cursor-pointer items-center">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/account" className="flex cursor-pointer items-center">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/orders" className="flex cursor-pointer items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/wishlist" className="flex cursor-pointer items-center">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Link>
          </DropdownMenuItem>

          {user?.role === "admin" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleLogout} 
            className="text-red-500 focus:text-red-500 cursor-pointer"
            variant="destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}