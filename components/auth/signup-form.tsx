"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Mail, Phone, Lock, Sparkles, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

export function SignupForm() {
  const [username, setUsername] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would call an API endpoint
      await signup({ username, firstname, lastname, email, phone, password })
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })
      router.push("/login")
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Signup failed",
        description: "There was a problem creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-blue-100">Join us and start your shopping journey</p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Form section */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="firstname" 
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  First Name
                </Label>
                <div className="relative group">
                  <Input
                    id="firstname"
                    placeholder="John"
                    required
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity -z-10"></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="lastname" 
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Last Name
                </Label>
                <div className="relative group">
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    required
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity -z-10"></div>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label 
                htmlFor="username" 
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Username
              </Label>
              <div className="relative group">
                <Input
                  id="username"
                  placeholder="johndoe"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity -z-10"></div>
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity -z-10"></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="phone" 
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <div className="relative group">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+84 123 456 789"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity -z-10"></div>
                </div>
              </div>
            </div>

            {/* Password fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-4 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity -z-10"></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="confirm-password" 
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-gray-50 dark:bg-gray-800/50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity -z-10"></div>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                or sign up with
              </span>
            </div>
          </div>

          {/* Social signup buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* Sign in link */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="h-2 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600"></div>
      </div>

      {/* Trust badge */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Your data is protected with 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}
