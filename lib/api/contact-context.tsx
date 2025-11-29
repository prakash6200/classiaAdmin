// lib/api/contact-context.tsx
"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface ContactForm {
  id: number
  name: string
  email: string
  mobile: string
  country: string | null
  address: string | null
  reason: string
  message: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalRecords: number
  sizePerPage: number
}

interface ContactContextType {
  contacts: ContactForm[]
  pagination: Pagination
  loading: boolean
  error: string | null
  fetchContacts: (page?: number, sizePerPage?: number) => Promise<void>
  deleteContact: (contactId: number) => Promise<void>
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<ContactForm[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
    sizePerPage: 10,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("jockey-token") : null

  const fetchContacts = useCallback(
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
        })

        const res = await fetch(`https://nodeapi.classiacapital.com/auth/form/list?${params}`, {
          headers: { Authorization: token },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message || "Failed to load contacts")

        // Filter out contacts where both country and address are null
        const filteredContacts = data.data.contactList.filter(
          (contact: ContactForm) => contact.country !== null || contact.address !== null
        )

        setContacts(filteredContacts)
        setPagination({
          currentPage: parseInt(data.data.currentPage),
          totalPages: data.data.totalPages,
          totalRecords: data.data.totalRecords,
          sizePerPage,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error")
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  const deleteContact = useCallback(
    async (contactId: number) => {
      if (!token) throw new Error("Missing token")
      setLoading(true)

      try {
        // Assuming there's a delete endpoint - adjust if needed
        const res = await fetch(`https://nodeapi.classiacapital.com/auth/form/${contactId}`, {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message || "Delete failed")

        await fetchContacts(pagination.currentPage, pagination.sizePerPage)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Delete failed")
        throw e
      } finally {
        setLoading(false)
      }
    },
    [token, fetchContacts, pagination]
  )

  return (
    <ContactContext.Provider
      value={{
        contacts,
        pagination,
        loading,
        error,
        fetchContacts,
        deleteContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  )
}

export const useContactContext = () => {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error("useContactContext must be used within a ContactProvider")
  return ctx
}