
"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface AMC {
  id: string
  name: string
  email: string
  mobile: string
  logo?: string
  status: "active" | "inactive" | "pending"
  aum: number
  distributors: number
  funds: number
  registrationDate: string
  panNumber: string
  address: string
  city: string
  state: string
  pinCode: string
  contactPersonName: string
  contactPerDesignation: string
  isMobileVerified: boolean
  isEmailVerified: boolean
  isBlocked: boolean
  isDeleted: boolean
  fundName: string
  equityPer: number
  debtPer: number
  cashSplit: number
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
  createAMC: (data: {
    name: string
    email: string
    mobile: string
    password: string
    address: string
    city: string
    contactPerDesignation: string
    contactPersonName: string
    panNumber: string
    pinCode: string
    state: string
    equityPer: number
    debtPer: number
    cashSplit: number
    fundName: string
  }) => Promise<void>
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

      const response = await fetch(`https://goapi.classiacapital.com/amc/list?${queryParams}`, {
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

      let apiUsers = result.data.users
      const paginationData = result.data.pagination

      if (search) {
        apiUsers = apiUsers.filter((user: any) =>
          user.Name.toLowerCase().includes(search.toLowerCase()) ||
          user.Email.toLowerCase().includes(search.toLowerCase())
        )
      }

      const mappedAMCs: AMC[] = apiUsers
        .filter((apiUser: any) => apiUser.Role === "AMC")
        .map((apiUser: any) => ({
          id: apiUser.ID.toString(),
          name: apiUser.Name,
          email: apiUser.Email,
          mobile: apiUser.Mobile,
          logo: apiUser.ProfileImage || "",
          status: apiUser.IsBlocked
            ? "inactive"
            : apiUser.UserKYC > 0
            ? "active"
            : "pending",
          aum: apiUser.MainBalance || 0,
          distributors: 0,
          funds: 0,
          registrationDate: apiUser.CreatedAt.split("T")[0],
          panNumber: apiUser.PanNumber || "",
          address: apiUser.Address || "",
          city: apiUser.City || "",
          state: apiUser.State || "",
          pinCode: apiUser.PinCode || "",
          contactPersonName: apiUser.ContactPersonName || "",
          contactPerDesignation: apiUser.ContactPerDesignation || "",
          isMobileVerified: apiUser.IsMobileVerified || false,
          isEmailVerified: apiUser.IsEmailVerified || false,
          isBlocked: apiUser.IsDeleted || false,
          isDeleted: apiUser.IsDeleted || false,
          fundName: apiUser.FundName || "",
          equityPer: apiUser.EquityPer || 0,
          debtPer: apiUser.DebtPer || 0,
          cashSplit: apiUser.CashSplit || 0,
        }))

      setAMCs(mappedAMCs)
      setPagination({
        limit: paginationData.limit,
        page: paginationData.page,
        total: search ? mappedAMCs.length : paginationData.total,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching AMCs"
      setError(errorMessage)
      console.error("AMC Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createAMC = useCallback(
    async (data: {
      name: string
      email: string
      mobile: string
      password: string
      address: string
      city: string
      contactPerDesignation: string
      contactPersonName: string
      panNumber: string
      pinCode: string
      state: string
      equityPer: number
      debtPer: number
      cashSplit: number
      fundName: string
    }) => {
      setLoading(true)
      setError(null)

      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("jockey-token") : null
        if (!token) {
          throw new Error("No authentication token found")
        }

        const formData = new URLSearchParams()
        formData.append("name", data.name)
        formData.append("email", data.email)
        formData.append("mobile", data.mobile)
        formData.append("password", data.password)
        formData.append("address", data.address)
        formData.append("city", data.city)
        formData.append("contactPerDesignation", data.contactPerDesignation)
        formData.append("contactPersonName", data.contactPersonName)
        formData.append("panNumber", data.panNumber)
        formData.append("pinCode", data.pinCode)
        formData.append("state", data.state)
        formData.append("equityPer", data.equityPer.toString())
        formData.append("debtPer", data.debtPer.toString())
        formData.append("cashSplit", data.cashSplit.toString())
        formData.append("fundName", data.fundName)

        const response = await fetch("https://goapi.classiacapital.com/admin/register-amc", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        })

        const result = await response.json()
        console.log("AMC Create API Response:", result)

        if (!response.ok || !result.status) {
          throw new Error(result.message || "Failed to create AMC")
        }

        await fetchAMCs(1, 10)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while creating AMC"
        setError(errorMessage)
        console.error("AMC Create Error:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchAMCs]
  )

  return (
    <AMCContext.Provider value={{ amcs, pagination, loading, error, fetchAMCs, createAMC }}>
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