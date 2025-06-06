"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface AMC {
  id: string
  name: string
  logo?: string
  status: "active" | "inactive" | "pending"
  aum: string
  distributors: number
  funds: number
  registrationDate: string
}

interface Pagination {
  limit: number
  page: number
  total: number
}

interface AMCContextType {
  amcs: AMC[]
  pagination: Pagination
  loading: boolean
  error: string | null
  fetchAMCs: (page?: number, limit?: number, search?: string) => Promise<void>
}

const AMCContext = createContext<AMCContextType | undefined>(undefined)

export function AMCProvider({ children }: { children: React.ReactNode }) {
  const [amcs, setAMCs] = useState<AMC[]>([])
  const [pagination, setPagination] = useState<Pagination>({ limit: 10, page: 1, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAMCs = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true)
    setError(null)

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jockey-token") : null
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

      const response = await fetch(`https://api.classiacapital.com/amc/list?${queryParams}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      console.log("AMC List API Response:", result)

      if (!response.ok || !result.status) {
        throw new Error(result.message || "Failed to fetch AMCs")
      }

      const apiUsers = result.data.users
      const paginationData = result.data.pagination

      // Filter for AMC role and map to AMC interface
      const mappedAMCs: AMC[] = apiUsers
        .filter((apiUser: any) => apiUser.Role === "AMC")
        .map((apiUser: any) => ({
          id: apiUser.ID.toString(),
          name: apiUser.Name,
          logo: apiUser.ProfileImage || "", // Default to empty string
          status: apiUser.IsBlocked
            ? "inactive"
            : apiUser.UserKYC > 0
            ? "active"
            : "pending",
          aum: `₹${(apiUser.MainBalance || 0).toLocaleString("en-IN")}`, // Using MainBalance as proxy
          distributors: 0, // Default: Await API update
          funds: 0, // Default: Await API update
          registrationDate: apiUser.CreatedAt.split("T")[0],
        }))

      setAMCs(mappedAMCs)
      setPagination({
        limit: paginationData.limit,
        page: paginationData.page,
        total: paginationData.total,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching AMCs"
      setError(errorMessage)
      console.error("AMC Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AMCContext.Provider value={{ amcs, pagination, loading, error, fetchAMCs }}>
      {children}
    </AMCContext.Provider>
  )
}

export const useAMCContext = () => {
  const context = useContext(AMCContext)
  if (context === undefined) {
    throw new Error("useAMCContext must be used within an AMCProvider")
  }
  return context
}