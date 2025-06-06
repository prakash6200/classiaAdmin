"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

// Define User interface to match users.tsx
interface User {
  id: string
  name: string
  email: string
  phone: string
  kycStatus: "verified" | "pending" | "rejected"
  investmentValue: string
  distributor: string
  joinDate: string
}

// Define pagination interface
interface Pagination {
  limit: number
  page: number
  total: number
}

// Define context type
interface UserContextType {
  users: User[]
  pagination: Pagination
  loading: boolean
  error: string | null
  fetchUsers: (page?: number, limit?: number, search?: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({ limit: 10, page: 1, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("jockey-token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (search) {
        queryParams.append("search", search)
      }

      const response = await fetch(`https://api.classiacapital.com/admin/user/list?${queryParams}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      console.log("User List API Response:", result)

      if (!response.ok || !result.status) {
        throw new Error(result.message || "Failed to fetch users")
      }

      const apiUsers = result.data.users
      const paginationData = result.data.pagination

      // Map API users to User interface
      const mappedUsers: User[] = apiUsers.map((apiUser: any) => ({
        id: apiUser.ID.toString(),
        name: apiUser.Name,
        email: apiUser.Email || "",
        phone: apiUser.Mobile || "",
        kycStatus:
          apiUser.IsBlocked ? "rejected" : apiUser.UserKYC > 0 ? "verified" : "pending",
        investmentValue: `₹${(apiUser.MainBalance || 0).toLocaleString("en-IN")}`,
        distributor: "Unknown", // Placeholder: API doesn't provide distributor
        joinDate: apiUser.CreatedAt.split("T")[0], // Extract date from CreatedAt
      }))

      setUsers(mappedUsers)
      setPagination({
        limit: paginationData.limit,
        page: paginationData.page,
        total: paginationData.total,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching users"
      setError(errorMessage)
      console.error("User Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <UserContext.Provider value={{ users, pagination, loading, error, fetchUsers }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}