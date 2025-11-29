// lib/api/settings-context.tsx
"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface AppSettings {
  app_maintenance: boolean
  force_update: boolean
  ios_latest_version: string
  android_latest_version: string
}

interface SettingsContextType {
  settings: AppSettings | null
  loading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
  updateSettings: (settings: AppSettings) => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("jockey-token") : null

  const fetchSettings = useCallback(async () => {
    if (!token) {
      setError("Authentication token missing")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("https://goapi.classiacapital.com/admin/get-maintenance", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!data.status) throw new Error(data.message || "Failed to load settings")

      setSettings(data.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error")
    } finally {
      setLoading(false)
    }
  }, [token])

  const updateSettings = useCallback(
    async (newSettings: AppSettings) => {
      if (!token) throw new Error("Missing token")
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("https://goapi.classiacapital.com/admin/create-maintenance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newSettings),
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message || "Update failed")

        setSettings(newSettings)
        await fetchSettings()
      } catch (e) {
        setError(e instanceof Error ? e.message : "Update failed")
        throw e
      } finally {
        setLoading(false)
      }
    },
    [token, fetchSettings]
  )

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettingsContext = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error("useSettingsContext must be used within a SettingsProvider")
  return ctx
}