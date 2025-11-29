"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/api/auth-context"
import { useBasketContext } from "@/lib/api/basket-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Search,
  TrendingUp,
  CheckCircle,
  Building2,
  Eye,
  BarChart3,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function StocksPage() {
  const { hasPermission } = useAuth()
  const {
    stocks,
    stocksPagination,
    stocksLoading,
    stocksError,
    fetchStocks,
    updateStockStatus,
  } = useBasketContext()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (hasPermission("basket:stocks")) fetchStocks(1, 20)
  }, [hasPermission, fetchStocks])

  const handleToggleStatus = async (stockId: number, currentStatus: boolean) => {
    setUpdating(true)
    try {
      await updateStockStatus(stockId, !currentStatus)
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(false)
    }
  }

  // Client-side search
  const filtered = searchTerm
    ? stocks.filter(
        (s) =>
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.sector.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stocks

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
            <h1 className="text-3xl font-bold text-white">Stock Management</h1>
            <p className="text-gray-400">Browse and manage available stocks</p>
          </div>
          <Button onClick={() => fetchStocks(1, 20)} variant="outline" disabled={stocksLoading}>
            <Loader2 className={`h-4 w-4 mr-2 ${stocksLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Error */}
        {stocksError && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
            {stocksError}
          </div>
        )}

        {/* Search */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, symbol, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white placeholder-gray-500"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Stocks</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#d7b56d]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stocksPagination.total.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Available stocks</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {stocks.filter((s) => !s.isDeleted).length}
              </div>
              <p className="text-xs text-gray-400">Active stocks</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">NSE Listed</CardTitle>
              <Building2 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {stocks.filter((s) => s.exchId === "NSE").length}
              </div>
              <p className="text-xs text-gray-400">NSE exchange</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Current Page</CardTitle>
              <BarChart3 className="h-4 w-4 text-[#d7b56d]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stocksPagination.page} / {Math.ceil(stocksPagination.total / stocksPagination.limit)}
              </div>
              <p className="text-xs text-gray-400">Page navigation</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">Stock List</CardTitle>
          </CardHeader>
          <CardContent>
            {stocksLoading ? (
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#d7b56d]/10">
                        <TableHead className="text-gray-300">Symbol</TableHead>
                        <TableHead className="text-gray-300">Full Name</TableHead>
                        <TableHead className="text-gray-300">Sector</TableHead>
                        <TableHead className="text-gray-300">Market Cap</TableHead>
                        <TableHead className="text-gray-300">Series</TableHead>
                        <TableHead className="text-gray-300">Exchange</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((stock) => (
                        <TableRow
                          key={stock.id}
                          className="border-b border-[#d7b56d]/10 hover:bg-[#1a1a2e]/50"
                        >
                          <TableCell>
                            <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] font-mono">
                              {stock.symbol}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-medium max-w-xs truncate">
                            {stock.fullName}
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm">
                            {stock.sector || "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="flex flex-col">
                              <span className="font-medium">₹{stock.marketCap.toFixed(2)} Cr</span>
                              <Badge
                                variant="outline"
                                className={`text-xs mt-1 ${
                                  stock.marketCapType === "Large Cap"
                                    ? "text-green-400 border-green-500/50"
                                    : stock.marketCapType === "Mid Cap"
                                    ? "text-blue-400 border-blue-500/50"
                                    : "text-yellow-400 border-yellow-500/50"
                                }`}
                              >
                                {stock.marketCapType}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
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
                            <Badge variant="outline" className="text-blue-400 border-blue-500/50">
                              {stock.exchId}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={!stock.isDeleted}
                              onCheckedChange={() => handleToggleStatus(stock.id, !stock.isDeleted)}
                              disabled={updating}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedStock(stock)}
                              className="text-[#d7b56d] hover:bg-[#1a1a2e]"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                  <span>
                    Showing {(stocksPagination.page - 1) * stocksPagination.limit + 1}–
                    {Math.min(stocksPagination.page * stocksPagination.limit, stocksPagination.total)} of{" "}
                    {stocksPagination.total.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchStocks(stocksPagination.page - 1, stocksPagination.limit)}
                      disabled={stocksPagination.page === 1 || stocksLoading}
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchStocks(stocksPagination.page + 1, stocksPagination.limit)}
                      disabled={
                        stocksPagination.page >= Math.ceil(stocksPagination.total / stocksPagination.limit) ||
                        stocksLoading
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedStock} onOpenChange={() => setSelectedStock(null)}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl border-[#d7b56d]/20 max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedStock && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl">{selectedStock.fullName}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {selectedStock.symbol} • {selectedStock.exchId}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-[#1a1a2e]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="industry">Industry</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Symbol</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold text-[#d7b56d]">{selectedStock.symbol}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">ISIN</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold text-white">{selectedStock.isin}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Market Cap</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold text-white">₹{selectedStock.marketCap} Cr</p>
                          <Badge className="mt-2 bg-[#d7b56d]/20 text-[#d7b56d]">
                            {selectedStock.marketCapType}
                          </Badge>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Face Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold text-white">
                            ₹{selectedStock.faceValue || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                      <CardHeader>
                        <CardTitle className="text-white">Exchange Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between p-2 bg-[#0f0f1a]/50 rounded">
                          <span className="text-gray-400">Exchange</span>
                          <span className="text-white font-medium">{selectedStock.exchId}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#0f0f1a]/50 rounded">
                          <span className="text-gray-400">Series</span>
                          <span className="text-white font-medium">{selectedStock.series}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#0f0f1a]/50 rounded">
                          <span className="text-gray-400">Token</span>
                          <span className="text-white font-medium">{selectedStock.token}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-[#0f0f1a]/50 rounded">
                          <span className="text-gray-400">Market Lot</span>
                          <span className="text-white font-medium">{selectedStock.marketLot}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Strike Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold text-white">
                            ₹{selectedStock.strikePrice || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Tick Size</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold text-white">
                            {selectedStock.tickSize || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Instrument Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold text-white">
                            {selectedStock.instrumentType || "Equity"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Expiry</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold text-white">
                            {selectedStock.expiry === "0" ? "No Expiry" : selectedStock.expiry}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="industry" className="space-y-4 mt-4">
                    <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                      <CardHeader>
                        <CardTitle className="text-white">Sector & Industry</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-4 bg-[#0f0f1a]/50 rounded-lg">
                          <p className="text-xs text-gray-400 uppercase mb-2">Sector</p>
                          <p className="text-lg font-bold text-[#d7b56d]">{selectedStock.sector}</p>
                        </div>
                        <div className="p-4 bg-[#0f0f1a]/50 rounded-lg">
                          <p className="text-xs text-gray-400 uppercase mb-2">Industry</p>
                          <p className="text-lg font-bold text-white">{selectedStock.industry}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedStock.indexSymbol && (
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader>
                          <CardTitle className="text-white">Index Membership</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedStock.indexSymbol.split(",").map((index: string, i: number) => (
                              <Badge key={i} className="bg-[#d7b56d]/20 text-[#d7b56d]">
                                {index.trim()}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}