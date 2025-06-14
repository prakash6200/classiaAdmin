"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface Transaction {
  id: string
  transactionId: string
  userId: string
  userName: string
  distributorName: string
  amc: string
  amcId: string
  fundName: string
  transactionType: "purchase" | "redemption" | "sip" | "stp" | "swp"
  amount: number
  units: number
  nav: number
  status: "completed" | "pending" | "failed" | "processing" | "cancelled"
  paymentMode: string
  transactionDate: string
  settlementDate?: string
  commissionAmount: number
  riskFlag: boolean
  notes?: string
}

interface Pagination {
  limit: number
  page: number
  total: number
}

interface TransactionContextType {
  transactions: Transaction[]
  pagination: Pagination
  loading: boolean
  error: string | null
  fetchTransactions: (page?: number, limit?: number, search?: string) => Promise<void>
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const amcMap: Record<string, string> = {
  "2": "HDFC AMC",
  // Add more mappings as needed
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pagination, setPagination] = useState<Pagination>({ limit: 10, page: 1, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async (page = 1, limit = 10, search = "") => {
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

      const response = await fetch(`https://api.classiacapital.com/admin/transaction/list?${queryParams}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      const result = await response.json()
      console.log("Transaction List API Response:", result)

      if (!response.ok || !result.status) {
        throw new Error(result.message || "Failed to fetch transactions")
      }

      const apiTransactions = result.data.Transactions
      const paginationData = result.data.pagination

      const mappedTransactions: Transaction[] = apiTransactions.map((txn: any) => ({
        id: txn.ID.toString(),
        transactionId: `TXN${txn.ID.toString().padStart(8, "0")}`,
        userId: `USR${txn.UserID.toString().padStart(3, "0")}`,
        userName: "Unknown User", // Default: No user name in API
        distributorName: "N/A", // Default: No distributor in API
        amc: amcMap[txn.AmcID.toString()] || `AMC ${txn.AmcID}`,
        amcId: txn.AmcID.toString(),
        fundName: "Unknown Fund", // Default: No fund name in API
        transactionType: txn.TransactionType === "DEPOSIT" ? "purchase" : "redemption",
        amount: txn.Amount,
        units: 0, // Default: No units in API
        nav: 0, // Default: No NAV in API
        status: txn.Status.toLowerCase() as Transaction["status"],
        paymentMode: "N/A", // Default: No payment mode in API
        transactionDate: txn.CreatedAt,
        settlementDate: undefined, // Default: No settlement date in API
        commissionAmount: 0, // Default: No commission in API
        riskFlag: txn.Amount > 1000000, // Flag large transactions
        notes: "", // Default: No notes in API
      }))

      setTransactions(mappedTransactions)
      setPagination({
        limit: paginationData.limit,
        page: paginationData.page,
        total: paginationData.total,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching transactions"
      setError(errorMessage)
      console.error("Transaction Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <TransactionContext.Provider value={{ transactions, pagination, loading, error, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactionContext = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactionContext must be used within a TransactionProvider")
  }
  return context
}