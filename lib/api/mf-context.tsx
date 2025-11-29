"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface FundManager {
  name: string
  tenure: string
  end_date?: string
  start_date?: string
}

export interface Holding {
  name: string
  sector: string
  weight_?: number
  assets?: string
  instrument: string
}

export interface AdvancedRatios {
  beta: number
  alpha: number
  sharpe: number
  sortino: number
  p_b_ratio: string
  p_e_ratio: string
  top_5_holdings: string
  top_20_holdings: string
}

export interface DebtSectorAllocation {
  energy: string
  others: string
  financial: string
  sovereign: string
  construction: string
  capital_goods: string
}

export interface EquityDebtCashSplit {
  cash: string
  debt: string
  equity?: string
}

export interface Analysis {
  holding_analysis_report: {
    advanced_ratios: AdvancedRatios
    debt_sector_allocation: DebtSectorAllocation
    equity_debt_cash_split: EquityDebtCashSplit
  }
}

export interface MutualFund {
  id: number
  amc: string
  scheamName: string
  scheamCode: string
  dayChange: string | null
  weekChange: string | null
  monthChange: string | null
  sixMonthChange: string | null
  oneYearChange: string | null
  threeYearsChange: string | null
  fiveYearsChange: string | null
  allTime: string | null
  mfData: number
  fundManagers: FundManager[] | { fund_management: FundManager[] } | any
  holdings: {
    portfolio?: Holding[]
    as_on_date?: string
    total_holdings?: number
  } | Holding[] | any
  category: {
    category: string
  } | string | any
  analysis?: Analysis | any
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalRecords: number
}

interface MutualFundContextType {
  mutualFunds: MutualFund[]
  pagination: Pagination
  loading: boolean
  error: string | null
  fetchMutualFunds: (page?: number, sizePerPage?: number) => Promise<void>
  updateMutualFund: (mfId: number, status: boolean) => Promise<void>
}

const MutualFundContext = createContext<MutualFundContextType | undefined>(undefined)

export function MutualFundProvider({ children }: { children: React.ReactNode }) {
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("jockey-token") : null

  const fetchMutualFunds = useCallback(
    async (page = 1, sizePerPage = 10) => {
      if (!token) {
        setError("Authentication token missing")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          sizePerPage: sizePerPage.toString(),
          isProd: "true",
        })

        const res = await fetch(`https://nodeapi.classiacapital.com/mutual-fund/list?${params}`, {
          headers: { Authorization: token },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message || "Failed to load mutual funds")

        setMutualFunds(data.data.mfList)
        setPagination({
          currentPage: parseInt(data.data.currentPage),
          totalPages: data.data.totalPages,
          totalRecords: data.data.totalRecords,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error")
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  const updateMutualFund = useCallback(
    async (mfId: number, status: boolean) => {
      if (!token) throw new Error("Missing token")
      setLoading(true)

      try {
        const formData = new URLSearchParams()
        formData.append("mfId", mfId.toString())
        formData.append("status", status.toString())

        const res = await fetch(`https://nodeapi.classiacapital.com/mutual-fund/admin/mf-update`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message || "Update failed")

        // Refresh the list after update
        await fetchMutualFunds(pagination.currentPage, 10)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Update failed")
        throw e
      } finally {
        setLoading(false)
      }
    },
    [token, fetchMutualFunds, pagination]
  )

  return (
    <MutualFundContext.Provider
      value={{
        mutualFunds,
        pagination,
        loading,
        error,
        fetchMutualFunds,
        updateMutualFund,
      }}
    >
      {children}
    </MutualFundContext.Provider>
  )
}

export const useMutualFundContext = () => {
  const ctx = useContext(MutualFundContext)
  if (!ctx) throw new Error("useMutualFundContext must be used within a MutualFundProvider")
  return ctx
}