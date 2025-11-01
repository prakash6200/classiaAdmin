"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronLeft, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react"

export default function StockChartPage() {
  const router = useRouter()
  const params = useParams()
  const search = useSearchParams()
  const { hasPermission } = useAuth()

  const stockId = params.id as string
  const exchange = search.get("exchange") ?? "NSE"
  const symbol = search.get("symbol") ?? ""

  const [stock, setStock] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // -----------------------------------------------------------------
  // Fetch the **real** stock name from the API (optional but nice)
  // -----------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("jockey-token")
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`https://nodeapi.classiacapital.com/basket/stocks-list?limit=1&id=${stockId}`, {
      headers: { Authorization: `${token}` },
    })
      .then(r => r.json())
      .then(json => {
        if (json.status && json.data.stocksList[0]) {
          setStock(json.data.stocksList[0])
        }
      })
      .catch(() => { /* fallback to URL data */ })
      .finally(() => setLoading(false))
  }, [stockId])

  // -----------------------------------------------------------------
  // Permission guard
  // -----------------------------------------------------------------
  if (!hasPermission("basket:stocks")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Stock Management" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  // -----------------------------------------------------------------
  // Loading UI
  // -----------------------------------------------------------------
  if (loading) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Stock Management" }, { label: "…" }]}>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#d7b56d]" />
          <p className="mt-4 text-gray-400">Loading chart…</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  const displayName = stock?.name ?? `${symbol} (${exchange})`
  const chartUrl = `https://www.tradingview.com/chart/?symbol=${exchange}:${symbol}`

  return (
    <AuthenticatedLayout
      breadcrumbs={[
        { label: "Stock Management", href: "/stocks" },
        { label: displayName },
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{displayName}</h1>
            <p className="text-gray-400">{symbol} – {exchange}</p>
          </div>

          <Button variant="outline" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* TradingView Chart */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Live Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[600px] w-full overflow-hidden rounded-lg">
              <iframe
                src={chartUrl}
                className="absolute inset-0 w-full h-full"
                title={`${symbol} chart`}
                allowFullScreen
                frameBorder="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats (you can replace with real data later) */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Current Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">—</div>
              <p className="text-xs text-gray-400">Live data not loaded</p>
            </CardContent>
          </Card>

          {/* … other cards … */}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}