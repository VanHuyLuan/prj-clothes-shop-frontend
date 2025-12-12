"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  role: Role;
  address: Address[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: CreateUserDto) => Promise<void>;
  logout: () => Promise<void>;
  profile: () => Promise<User | null>;
}

export interface CreateUserDto {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
}

const API_BASE = "http://api.be-clothesshop.app";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// GLOBAL REFRESH LOCK (prevent refresh spam)
// ============================================
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ============================
  // GET TOKEN (auto refresh)
  // ============================
  const getAccessToken = async (): Promise<string | null> => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (!token || !expiry) return null;

    if (Date.now() > parseInt(expiry)) {
      // token đã hết hạn → refresh
      return await refreshAccessToken();
    }

    return token;
  };

  // ============================
  // REFRESH TOKEN FUNCTION
  // ============================
  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return null;
    }

    // Nếu đang refresh, đợi refreshPromise
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    // Tạo refreshPromise mới
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/identities/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) throw new Error("Refresh failed");

        const data = await res.json();

        // Backend returns new accessToken and expiresIn
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem(
          "tokenExpiry",
          String(Date.now() + data.expiresIn * 1000)
        );
        // Note: refreshToken is not updated, keep using the old one

        return data.accessToken;
      } catch (err) {
        console.error("Refresh Error:", err);
        logout();
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  // ============================
  // FETCH PROFILE (auto retry)
  // ============================
  const profile = async (): Promise<User | null> => {
    try {
      let token = await getAccessToken();
      if (!token) return null;

      let res = await fetch(`${API_BASE}/identities/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        // token expired unexpectedly → refresh
        token = await refreshAccessToken();
        if (!token) return null;

        // retry request
        res = await fetch(`${API_BASE}/identities/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Profile error:", err);
      return null;
    }
  };

  // ============================
  // LOGIN
  // ============================
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/identities/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Invalid email or password");

    const data = await res.json();

    // Save tokens - backend returns accessToken, refreshToken, expiresIn
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem(
      "tokenExpiry",
      String(Date.now() + data.expiresIn * 1000)
    );
    localStorage.setItem("refreshToken", data.refreshToken);

    // Load user info
    const userProfile = await profile();
    if (userProfile) {
      setUser(userProfile);
      localStorage.setItem("user", JSON.stringify(userProfile));
      
      // Route based on user role
      if (typeof window !== 'undefined') {
        const userRole = userProfile.role.name.toLowerCase();
        if (userRole === 'admin' || userRole === 'administrator') {
          window.location.href = '/admin/';
        } else {
          window.location.href = '/';
        }
      }
    }
  };

  // ============================
  // SIGNUP
  // ============================
  const signup = async (dto: CreateUserDto) => {
    const res = await fetch(`${API_BASE}/identities/createuser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) throw new Error("Signup failed");
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Call backend logout to invalidate tokens
        await fetch(`${API_BASE}/identities/logout`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear local storage
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  };

  // ============================
  // LOAD USER ON PAGE REFRESH
  // ============================
  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
