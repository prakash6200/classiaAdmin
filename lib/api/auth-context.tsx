"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType } from "@/types/auth"

// Define permission mapping for roles
const rolePermissions: Record<string, string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: ["amc:*", "distributor:*", "user:*", "transaction:*", "course:*"],
  AMC: ["amc:read", "amc:update", "distributor:read", "transaction:read"],
  DISTRIBUTOR: ["course:read", "transaction:read", "user:read"],
  USER: ["user:read", "transaction:read"], // Default permissions for USER role
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored auth token and user
    const storedUser = localStorage.getItem("jockey-user")
    const storedToken = localStorage.getItem("jockey-token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (emailOrMobile: string, password: string) => {
    try {
      const formData = new URLSearchParams()
      if (emailOrMobile.includes("@")) {
        formData.append("email", emailOrMobile)
      } else {
        formData.append("mobile", emailOrMobile)
      }
      formData.append("password", password)

      const response = await fetch("https://api.classiacapital.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const result = await response.json()
      if (!result.status) {
        throw new Error(result.message || "Login failed")
      }

      const apiUser = result.data.user
      const token = result.data.token

      // Map API user to internal User type
      const user: User = {
        id: apiUser.ID.toString(),
        name: apiUser.Name,
        email: apiUser.Email || "",
        mobile: apiUser.Mobile || "",
        role: apiUser.Role.toLowerCase(), // Normalize role to lowercase
        permissions: rolePermissions[apiUser.Role] || rolePermissions.USER, // Assign permissions based on role
      }

      setUser(user)
      localStorage.setItem("jockey-user", JSON.stringify(user))
      localStorage.setItem("jockey-token", token)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("jockey-user")
    localStorage.removeItem("jockey-token")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.permissions.includes("*")) return true
    return user.permissions.some((p) => p === permission || (p.endsWith(":*") && permission.startsWith(p.slice(0, -1))))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}