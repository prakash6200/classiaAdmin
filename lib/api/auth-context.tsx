"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType } from "@/types/auth"

const rolePermissions: Record<string, string[]> = {
  super_admin: ["*"],
  admin: ["amc:*", "distributor:*", "user:*", "transaction:*", "course:*"],
  amc: ["amc:read", "amc:update", "distributor:read", "transaction:read"],
  distributor: ["course:read", "transaction:read", "user:read"],
  user: ["user:read", "transaction:read"],
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("jockey-user")
    const storedToken = localStorage.getItem("jockey-token")
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      console.log("Loaded stored user:", parsedUser)
      console.log("Loaded stored token:", storedToken)
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

      console.log("Sending login request with:", formData.toString())

      const response = await fetch("https://api.classiacapital.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (!response.ok) {
        throw new Error(result.message || "Invalid credentials")
      }

      if (!result.status) {
        throw new Error(result.message || "Login failed")
      }

      const apiUser = result.data.user
      const token = result.data.token
      console.log("API User Data:", apiUser)
      console.log("API Token:", token)

      const roleMap: Record<string, string> = {
        "SUPER-ADMIN": "super_admin",
        DISTRIBUTOR: "distributor",
        USER: "user",
        ADMIN: "admin",
        AMC: "amc",
      }

      const mappedRole = roleMap[apiUser.Role] || "user"

      const user: User = {
        id: apiUser.ID.toString(),
        name: apiUser.Name,
        email: apiUser.Email || "",
        mobile: apiUser.Mobile || "",
        role: mappedRole,
        permissions: rolePermissions[mappedRole] || rolePermissions.user,
        amcId: apiUser.Role === "AMC" ? apiUser.ID.toString() : undefined,
        distributorId: apiUser.Role === "DISTRIBUTOR" ? apiUser.ID.toString() : undefined,
      }

      console.log("Mapped User:", user)
      console.log("Assigned Permissions:", user.permissions)

      setUser(user)
      localStorage.setItem("jockey-user", JSON.stringify(user))
      localStorage.setItem("jockey-token", token)
    } catch (error) {
      console.error("Login Error:", error)
      throw new Error(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("jockey-user")
    localStorage.removeItem("jockey-token")
    console.log("User logged out")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) {
      console.log(`Permission check for ${permission}: No user logged in`)
      return false
    }
    if (user.permissions.includes("*")) {
      console.log(`Permission check for ${permission}: Allowed (super admin)`)
      return true
    }
    const allowed = user.permissions.some(
      (p) => p === permission || (p.endsWith(":*") && permission.startsWith(p.slice(0, -1)))
    )
    console.log(`Permission check for ${permission}: ${allowed ? "Allowed" : "Denied"}`, user.permissions)
    return allowed
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