"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data - replace with actual API calls
const mockUsers: Record<string, User> = {
  "super@admin.com": {
    id: "1",
    name: "Super Admin",
    email: "super@admin.com",
    role: "super_admin",
    permissions: ["*"],
  },
  "admin@jockey.com": {
    id: "2",
    name: "Admin User",
    email: "admin@jockey.com",
    role: "admin",
    permissions: ["amc:*", "distributor:*", "user:*", "transaction:*", "course:*"],
  },
  "amc@example.com": {
    id: "3",
    name: "AMC Manager",
    email: "amc@example.com",
    role: "amc",
    amcId: "amc-1",
    permissions: ["amc:read", "amc:update", "distributor:read", "transaction:read"],
  },
  "distributor@example.com": {
    id: "4",
    name: "Distributor",
    email: "distributor@example.com",
    role: "distributor",
    distributorId: "dist-1",
    permissions: ["course:read", "transaction:read", "user:read"],
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem("jockey-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    const foundUser = mockUsers[email]
    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("jockey-user", JSON.stringify(foundUser))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("jockey-user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.permissions.includes("*")) return true
    return user.permissions.some((p) => p === permission || (p.endsWith(":*") && permission.startsWith(p.slice(0, -1))))
  }

  return <AuthContext.Provider value={{ user, login, logout, hasPermission }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
