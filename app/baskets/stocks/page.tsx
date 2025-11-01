"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/api/auth-context"
import { useBasketContext } from "@/lib/api/basket-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Loader2,
  Search,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export default function StocksPage() {
  const router = useRouter()
  const { hasPermission } = useAuth()
  const {
    stocks,
    stocksLoading,
  
    fetchStocks,
  } = useBasketContext()

  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const limit = 50

  // -----------------------------------------------------------------
  // Load first page
  // -----------------------------------------------------------------
  useEffect(() => {
    if (hasPermission("basket:stocks")) fetchStocks(1, limit)
  }, [hasPermission])

  // -----------------------------------------------------------------
  // Client-side search
  // -----------------------------------------------------------------
  const filtered = searchTerm
    ? stocks.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stocks

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

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Stock Management" }]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Stock Market</h1>
            <p className="text-gray-400">
              Browse and analyze available stocks
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setPage(1)
              fetchStocks(1, limit)
            }}
            disabled={stocksLoading}
          >
            <Loader2
              className={`h-4 w-4 mr-2 ${stocksLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* API error */}
       
        

        {/* Search */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white placeholder-gray-500"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Stocks
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#d7b56d]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stocks.length}
              </div>
              <p className="text-xs text-gray-400">Available for trading</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Equity (EQ)
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stocks.filter((s) => s.series === "EQ").length}
              </div>
              <p className="text-xs text-gray-400">Equity stocks</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                BSE Listed
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stocks.filter((s) => s.series !== "BE").length}
              </div>
              <p className="text-xs text-gray-400">BSE active</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Stock List</CardTitle>
          </CardHeader>
          <CardContent>
            {stocksLoading && page === 1 ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-[#d7b56d]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No stocks found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#d7b56d]/10">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Symbol</TableHead>
                      <TableHead className="text-gray-300">Series</TableHead>
                      <TableHead className="text-gray-300">Face Value</TableHead>
                      <TableHead className="text-gray-300">ISIN</TableHead>
                      <TableHead className="text-gray-300">Listed</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((stock) => (
                      <TableRow
                        key={stock.id}
                        className="border-b border-[#d7b56d]/10 hover:bg-[#1a1a2e]/50"
                      >
                        <TableCell className="text-white font-medium">
                          {stock.name}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <Badge className="bg-[#d7b56d]/20 text-[#d7b56d]">
                            {stock.symbol}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <Badge
                            variant="outline"
                            className={
                              stock.series === "EQ"
                                ? "text-green-400 border-green-500/50"
                                : "text-yellow-400 border-yellow-500/50"
                            }
                          >
                            {stock.series}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          ₹{stock.faceValue}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {stock.isinNumber}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {new Date(stock.dateOfListing).getFullYear()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/stocks/${stock.id}?exchange=NSE&symbol=${stock.symbol}`
                              )
                            }
                            className="text-[#d7b56d] hover:bg-[#d7b56d]/10"
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Chart
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Load-more */}
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const next = page + 1
                      setPage(next)
                      fetchStocks(next, limit)
                    }}
                    disabled={stocksLoading}
                    className="text-white border-[#d7b56d]/30"
                  >
                    {stocksLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}