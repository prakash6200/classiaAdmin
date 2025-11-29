"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface Holding {
  stockId: number
  holdinPercentage: string
  orderType: string
  slPrice: string
  tgtPrice: string
}

export interface Basket {
  id: number
  basketName: string
  subscriptionAmount: string
  raName: string
  expectedReturn: string
  subscryptionType: "FREE" | "PAID"
  volatility: "LOW" | "MID" | "HIGH"
  status: "ACTIVE" | "INACTIVE" | "DRAFT"
  holdings: Holding[]
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface Stock {
  id: number
  exchId: string
  token: number
  symbol: string
  series: string
  fullName: string
  expiry: string
  strikePrice: number
  marketLot: number
  instrumentType: string
  isin: string
  faceValue: number | null
  tickSize: number | null
  sector: string
  industry: string
  marketCap: number
  marketCapType: string
  indexSymbol: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface Pagination {
  limit: number
  page: number
  total: number
}

interface BasketContextType {
  // Baskets
  baskets: Basket[]
  basketPagination: Pagination
  basketLoading: boolean
  basketError: string | null
  fetchBaskets: (page?: number, limit?: number) => Promise<void>
  createBasket: (data: {
    basketName: string
    subscriptionAmount: string
    raName: string
    expectedReturn: string
    subscryptionType: "FREE" | "PAID"
    volatility: "LOW" | "MID" | "HIGH"
    status: "ACTIVE" | "INACTIVE" | "DRAFT"
  }) => Promise<void>
  updateBasket: (basketId: number, data: {
    basketName: string
    subscriptionAmount: string
    raName: string
    expectedReturn: string
    subscryptionType: "FREE" | "PAID"
    volatility: "LOW" | "MID" | "HIGH"
    status: "ACTIVE" | "INACTIVE" | "DRAFT"
  }) => Promise<void>

  // Holdings
  addStockToBasket: (basketId: number, data: {
    stockId: number
    holdinPercentage: string
    slPrice: string
    tgtPrice: string
    orderType: string
  }) => Promise<void>
  removeStockFromBasket: (basketId: number, stockId: number) => Promise<void>

  // Stocks
  stocks: Stock[]
  stocksPagination: Pagination
  stocksLoading: boolean
  stocksError: string | null
  fetchStocks: (page?: number, sizePerPage?: number) => Promise<void>
  updateStockStatus: (stockId: number, status: boolean) => Promise<void>
}

const BasketContext = createContext<BasketContextType | undefined>(undefined)

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [baskets, setBaskets] = useState<Basket[]>([])
  const [basketPagination, setBasketPagination] = useState<Pagination>({ limit: 10, page: 1, total: 0 })
  const [basketLoading, setBasketLoading] = useState(false)
  const [basketError, setBasketError] = useState<string | null>(null)

  const [stocks, setStocks] = useState<Stock[]>([])
  const [stocksPagination, setStocksPagination] = useState<Pagination>({ limit: 20, page: 1, total: 0 })
  const [stocksLoading, setStocksLoading] = useState(false)
  const [stocksError, setStocksError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("jockey-token") : null

  // ── BASKETS ─────────────────────────────────────
  const fetchBaskets = useCallback(
    async (page = 1, limit = 10) => {
      if (!token) return
      setBasketLoading(true)
      setBasketError(null)

      try {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        const res = await fetch(`https://nodeapi.classiacapital.com/basket/list`, {
          headers: { Authorization: token },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message)

        const mapped = data.data.basketList.map((b: any) => ({
          id: b.id,
          basketName: b.basketName,
          subscriptionAmount: b.subscriptionAmount,
          raName: b.raName,
          expectedReturn: b.expectedReturn,
          subscryptionType: b.subscryptionType,
          volatility: b.volatility,
          status: b.status,
          holdings: b.holdings || [],
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
          isDeleted: b.isDeleted,
        }))

        setBaskets(mapped)
        setBasketPagination({ limit: data.data.limit || 10, page: data.data.currentPage, total: data.data.totalRecords })
      } catch (e) {
        setBasketError(e instanceof Error ? e.message : "Failed to load baskets")
      } finally {
        setBasketLoading(false)
      }
    },
    [token]
  )

  const createBasket = useCallback(
    async (data: {
      basketName: string
      subscriptionAmount: string
      raName: string
      expectedReturn: string
      subscryptionType: "FREE" | "PAID"
      volatility: "LOW" | "MID" | "HIGH"
      status: "ACTIVE" | "INACTIVE" | "DRAFT"
    }) => {
      if (!token) throw new Error("Missing token")
      setBasketLoading(true)

      try {
        const form = new URLSearchParams()
        form.append("basketName", data.basketName)
        form.append("subscriptionAmount", data.subscriptionAmount)
        form.append("raName", data.raName)
        form.append("expectedReturn", data.expectedReturn)
        form.append("subscryptionType", data.subscryptionType)
        form.append("volatility", data.volatility)
        form.append("status", data.status)

        const res = await fetch("https://nodeapi.classiacapital.com/basket/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: token,
          },
          body: form,
        })

        const result = await res.json()
        if (!result.status) throw new Error(result.message || "Failed to create basket")

        await fetchBaskets(1, 10)
      } catch (e) {
        setBasketError(e instanceof Error ? e.message : "Create failed")
        throw e
      } finally {
        setBasketLoading(false)
      }
    },
    [token, fetchBaskets]
  )

  const updateBasket = useCallback(
    async (basketId: number, data: {
      basketName: string
      subscriptionAmount: string
      raName: string
      expectedReturn: string
      subscryptionType: "FREE" | "PAID"
      volatility: "LOW" | "MID" | "HIGH"
      status: "ACTIVE" | "INACTIVE" | "DRAFT"
    }) => {
      if (!token) throw new Error("Missing token")
      setBasketLoading(true)

      try {
        const form = new URLSearchParams()
        form.append("basketId", basketId.toString())
        form.append("basketName", data.basketName)
        form.append("subscriptionAmount", data.subscriptionAmount)
        form.append("raName", data.raName)
        form.append("expectedReturn", data.expectedReturn)
        form.append("subscryptionType", data.subscryptionType)
        form.append("volatility", data.volatility)
        form.append("status", data.status)

        const res = await fetch("https://nodeapi.classiacapital.com/basket/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: token,
          },
          body: form,
        })

        const result = await res.json()
        if (!result.status) throw new Error(result.message || "Failed to update basket")

        await fetchBaskets(1, 10)
      } catch (e) {
        setBasketError(e instanceof Error ? e.message : "Update failed")
        throw e
      } finally {
        setBasketLoading(false)
      }
    },
    [token, fetchBaskets]
  )

  // ── HOLDINGS ─────────────────────────────────────
  const addStockToBasket = useCallback(
    async (basketId: number, data: {
      stockId: number
      holdinPercentage: string
      slPrice: string
      tgtPrice: string
      orderType: string
    }) => {
      if (!token) throw new Error("Missing token")
      setBasketLoading(true)

      try {
        const form = new URLSearchParams()
        form.append("basketId", basketId.toString())
        form.append("stockId", data.stockId.toString())
        form.append("holdinPercentage", data.holdinPercentage)
        form.append("slPrice", data.slPrice)
        form.append("tgtPrice", data.tgtPrice)
        form.append("orderType", data.orderType)

        const res = await fetch("https://nodeapi.classiacapital.com/basket/add-stocks", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: token,
          },
          body: form,
        })

        const result = await res.json()
        if (!result.status) throw new Error(result.message || "Failed to add stock")

        await fetchBaskets(1, 10)
      } catch (e) {
        setBasketError(e instanceof Error ? e.message : "Add stock failed")
        throw e
      } finally {
        setBasketLoading(false)
      }
    },
    [token, fetchBaskets]
  )

  const removeStockFromBasket = useCallback(
    async (basketId: number, stockId: number) => {
      if (!token) throw new Error("Missing token")
      setBasketLoading(true)

      try {
        const form = new URLSearchParams()
        form.append("basketId", basketId.toString())
        form.append("stockId", stockId.toString())

        const res = await fetch("https://nodeapi.classiacapital.com/basket/remove-stocks", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: token,
          },
          body: form,
        })

        const result = await res.json()
        if (!result.status) throw new Error(result.message || "Failed to remove stock")

        await fetchBaskets(1, 10)
      } catch (e) {
        setBasketError(e instanceof Error ? e.message : "Remove stock failed")
        throw e
      } finally {
        setBasketLoading(false)
      }
    },
    [token, fetchBaskets]
  )

  // ── STOCKS ─────────────────────────────────────
  const fetchStocks = useCallback(
    async (page = 1, sizePerPage = 20) => {
      if (!token) return
      setStocksLoading(true)
      setStocksError(null)

      try {
        const params = new URLSearchParams({ 
          page: page.toString(), 
          sizePerPage: sizePerPage.toString() 
        })
        const res = await fetch(`https://nodeapi.classiacapital.com/basket/stocks-list?${params}`, {
          headers: { Authorization: token },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message || "Failed to load stocks")

        setStocks(data.data.stocksList)
        setStocksPagination({
          limit: sizePerPage,
          page: parseInt(data.data.currentPage),
          total: data.data.totalRecords,
        })
      } catch (e) {
        setStocksError(e instanceof Error ? e.message : "Failed to load stocks")
      } finally {
        setStocksLoading(false)
      }
    },
    [token]
  )

  const updateStockStatus = useCallback(
    async (stockId: number, status: boolean) => {
      if (!token) throw new Error("Missing token")
      setStocksLoading(true)

      try {
        const form = new URLSearchParams()
        form.append("stockId", stockId.toString())
        form.append("status", status.toString())

        const res = await fetch("https://nodeapi.classiacapital.com/basket/stock-update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: token,
          },
          body: form,
        })

        const result = await res.json()
        if (!result.status) throw new Error(result.message || "Failed to update stock")

        await fetchStocks(stocksPagination.page, stocksPagination.limit)
      } catch (e) {
        setStocksError(e instanceof Error ? e.message : "Update failed")
        throw e
      } finally {
        setStocksLoading(false)
      }
    },
    [token, fetchStocks, stocksPagination]
  )

  return (
    <BasketContext.Provider
      value={{
        baskets,
        basketPagination,
        basketLoading,
        basketError,
        fetchBaskets,
        createBasket,
        updateBasket,
        addStockToBasket,
        removeStockFromBasket,
        stocks,
        stocksPagination,
        stocksLoading,
        stocksError,
        fetchStocks,
        updateStockStatus,
      }}
    >
      {children}
    </BasketContext.Provider>
  )
}

export const useBasketContext = () => {
  const ctx = useContext(BasketContext)
  if (!ctx) throw new Error("useBasketContext must be used within a BasketProvider")
  return ctx
}