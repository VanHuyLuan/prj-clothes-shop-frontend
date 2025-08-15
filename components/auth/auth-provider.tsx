"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface User {
  id: string
  username: string
  email: string | null
  phone: string | null
  firstName: string | null
  lastName: string | null
  role: string
  avatar: string | null
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  profile: () => Promise<User | null>
  signup: (data: CreateUserDto) => Promise<void>
  logout: () => void
}

export interface CreateUserDto {
  username: string
  firstname: string
  lastname: string
  email: string
  phone: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Hàm lấy access token từ localStorage (tự refresh nếu hết hạn)
  const getAccessToken = async (): Promise<string | null> => {
    const token = localStorage.getItem("token")
    const expiry = localStorage.getItem("tokenExpiry")

    if (!token || !expiry) return null

    if (Date.now() > parseInt(expiry)) {
      // Token đã hết hạn → gọi refresh
      const newToken = await refreshAccessToken()
      return newToken
    }

    return token
  }

  // Hàm refresh token
  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      logout()
      return null
    }

    try {
      const res = await fetch("http://localhost:4000/identities/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (!res.ok) throw new Error("Refresh token failed")

      const data = await res.json()
      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("tokenExpiry", String(Date.now() + data.expiresIn * 1000))

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken) // Nếu BE trả refresh token mới
      }

      return data.accessToken
    } catch (err) {
      console.error("Error refreshing token:", err)
      logout()
      return null
    }
  }

  // Load user khi refresh trang
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser))
      } catch (err) {
        console.error("Error parsing savedUser:", err)
        setUser(null)
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:4000/identities/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error("Invalid credentials")

    const data = await res.json()
    console.log("Login response:", data)

    // Lưu token + expiry
    localStorage.setItem("token", data.accessToken)
    localStorage.setItem("tokenExpiry", String(Date.now() + data.expiresIn * 1000))
    localStorage.setItem("refreshToken", data.refreshToken)

    const userProfile = await profile()
    if (userProfile) {
      setUser(userProfile)
      localStorage.setItem("user", JSON.stringify(userProfile))
    }
  }

  const profile = async () => {
    try {
      const token = await getAccessToken()
      if (!token) throw new Error("No token available")

      const res = await fetch("http://localhost:4000/identities/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)

      return await res.json()
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  }

  const signup = async (dto: CreateUserDto) => {
    const res = await fetch("http://localhost:4000/identities/createuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    })

    if (!res.ok) throw new Error("Signup failed")

    const data = await res.json()
    console.log("User created:", data)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiry")
    localStorage.removeItem("refreshToken")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, profile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
