"use client"

import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<"loading" | "error">("loading")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get("accessToken")
    const refreshToken = params.get("refreshToken")
    const expiresIn = params.get("expiresIn")

    if (!accessToken) {
      setStatus("error")
      setTimeout(() => { window.location.href = "/login?error=google_failed" }, 2000)
      return
    }

    // Lưu token theo đúng format của auth-provider
    localStorage.setItem("token", accessToken)
    localStorage.setItem(
      "tokenExpiry",
      String(Date.now() + parseInt(expiresIn || "3600") * 1000)
    )
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    }

    // Fetch profile để xác định role và redirect
    fetch(`${API_BASE}/identities/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (!user) {
          // Token hợp lệ nhưng profile lỗi → vẫn về trang chủ
          window.location.href = "/"
          return
        }
        // Lưu user vào localStorage để auth-provider đọc khi trang load lại
        localStorage.setItem("user", JSON.stringify(user))

        const role = user?.role?.name?.toLowerCase()
        // Full page reload để auth-provider khởi tạo lại từ localStorage
        if (role === "admin" || role === "administrator") {
          window.location.href = "/admin"
        } else {
          window.location.href = "/"
        }
      })
      .catch(() => {
        window.location.href = "/"
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 gap-5">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-6 h-6" />
        <span className="text-xl font-bold tracking-widest uppercase">STYLISH</span>
      </div>

      {status === "loading" ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black dark:border-gray-700 dark:border-t-white rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Signing you in with Google...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium text-red-500">Google sign-in failed</p>
          <p className="text-xs text-gray-400">Redirecting back to login...</p>
        </div>
      )}
    </div>
  )
}
