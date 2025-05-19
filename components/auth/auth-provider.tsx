"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is admin - for demo purposes, we'll use a simple check
  const isAdmin = user?.email === "admin@example.com";

  const login = async (email: string, password: string) => {
    // Mock implementation - in a real app, this would call an API
    return new Promise<void>((resolve) => {
      // Simple validation to make use of password parameter
      if (!password || password.length < 1) {
        throw new Error("Password is required");
      }

      setTimeout(() => {
        setUser({
          id: "user-1",
          name: "John Doe",
          email,
        });
        resolve();
      }, 500);
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock implementation - in a real app, this would call an API
    return new Promise<void>((resolve) => {
      // Simple validation to make use of password parameter
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      setTimeout(() => {
        setUser({
          id: "user-1",
          name,
          email,
        });
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
