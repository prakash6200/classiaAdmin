// lib/api/support-context.tsx
"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface Message {
  text: string
  time: string
  sender: "admin" | "user"
}

export interface Ticket {
  id: number
  title: string
  status: "OPEN" | "PENDING" | "CLOSED"
  priority: "low" | "medium" | "high"
  category: string
  createdAt: string
  updatedAt: string
  messages: Message[] // ← always an array (empty if null)
}

interface Pagination {
  limit: number
  page: number
  total: number
}

interface SupportContextType {
  tickets: Ticket[]
  pagination: Pagination
  loading: boolean
  error: string | null
  fetchTickets: (page?: number, limit?: number) => Promise<void>
  replyTicket: (ticketId: number, message: string) => Promise<void>
  closeTicket: (ticketId: number) => Promise<void>
}

const SupportContext = createContext<SupportContextType | undefined>(undefined)

export function SupportProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [pagination, setPagination] = useState<Pagination>({ limit: 20, page: 1, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("jockey-token") : null

  const fetchTickets = useCallback(
    async (page = 1, limit = 20) => {
      if (!token) {
        setError("Authentication token missing")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })

        const res = await fetch(`https://goapi.classiacapital.com/support/admin-list?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message || "Failed to load tickets")

        const mapped: Ticket[] = data.data.tickets.map((t: any) => ({
          id: t.ID,
          title: t.title,
          status: t.status,
          priority: t.priority,
          category: t.category,
          createdAt: t.CreatedAt,
          updatedAt: t.UpdatedAt,
          // ← Convert null → [] so .map() never breaks
          messages: Array.isArray(t.message) ? t.message : [],
        }))

        setTickets(mapped)
        setPagination(data.data.pagination)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error")
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  const replyTicket = useCallback(
    async (ticketId: number, message: string) => {
      if (!token) throw new Error("Missing token")
      setLoading(true)

      const form = new URLSearchParams()
      form.append("ticketId", ticketId.toString())
      form.append("message", message)

      const res = await fetch("https://goapi.classiacapital.com/support/admin-replay", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: form,
      })

      const data = await res.json()
      if (!data.status) throw new Error(data.message || "Reply failed")

      await fetchTickets(pagination.page, pagination.limit)
      setLoading(false)
    },
    [token, fetchTickets, pagination]
  )

  const closeTicket = useCallback(
    async (ticketId: number) => {
      if (!token) throw new Error("Missing token")
      setLoading(true)

      const form = new URLSearchParams()
      form.append("ticketId", ticketId.toString())
      form.append("message", "Ticket closed by admin.")

      const res = await fetch("https://goapi.classiacapital.com/support/user-close-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: form,
      })

      const data = await res.json()
      if (!data.status) throw new Error(data.message || "Close failed")

      await fetchTickets(pagination.page, pagination.limit)
      setLoading(false)
    },
    [token, fetchTickets, pagination]
  )

  return (
    <SupportContext.Provider
      value={{
        tickets,
        pagination,
        loading,
        error,
        fetchTickets,
        replyTicket,
        closeTicket,
      }}
    >
      {children}
    </SupportContext.Provider>
  )
}

export const useSupportContext = () => {
  const ctx = useContext(SupportContext)
  if (!ctx) throw new Error("useSupportContext must be used within a SupportProvider")
  return ctx
}