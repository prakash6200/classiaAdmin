"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useBasketContext } from "@/lib/api/basket-context"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  TrendingUp,
  Edit,
  Trash,
  Plus,
  ChevronLeft,
  Loader2,
  FileText,
  ShoppingBag,
} from "lucide-react"

export default function BasketDetailPage() {
  const params = useParams()
  const basketId = Number(params.id)
  const router = useRouter()
  const { hasPermission } = useAuth()
  const {
    baskets,
    basketLoading,
    updateBasket,
    addStockToBasket,
    removeStockFromBasket,
    stocks,
    stocksLoading,
    fetchStocks,
  } = useBasketContext()

  const [editing, setEditing] = useState(false)
  const [showAddStockDialog, setShowAddStockDialog] = useState(false)
  const [updatedBasket, setUpdatedBasket] = useState({
    basketName: "",
    subscriptionAmount: "",
    raName: "",
    expectedReturn: "",
    subscryptionType: "FREE" as "FREE" | "PAID",
    volatility: "LOW" as "LOW" | "MID" | "HIGH",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "DRAFT",
  })
  const [newHolding, setNewHolding] = useState({
    stockId: 0,
    holdinPercentage: "",
    slPrice: "",
    tgtPrice: "",
    orderType: "MARKET" as "MARKET" | "LIMIT",
  })
  const [updating, setUpdating] = useState(false)
  const [addingStock, setAddingStock] = useState(false)

  const basket = baskets.find((b) => b.id === basketId)

  // Load stocks for the dropdown (once)
  useEffect(() => {
    fetchStocks(1, 100) // 100 is enough for a dropdown
  }, [fetchStocks])

  // Sync edit form when basket loads
  useEffect(() => {
    if (basket) {
      setUpdatedBasket({
        basketName: basket.basketName,
        subscriptionAmount: basket.subscriptionAmount,
        raName: basket.raName,
        expectedReturn: basket.expectedReturn,
        subscryptionType: basket.subscryptionType,
        volatility: basket.volatility,
        status: basket.status,
      })
    }
  }, [basket])

  const handleUpdateBasket = async () => {
    setUpdating(true)
    try {
      await updateBasket(basketId, updatedBasket)
      setEditing(false)
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(false)
    }
  }

  const handleAddStock = async () => {
    if (!newHolding.stockId || !newHolding.holdinPercentage.trim()) return
    setAddingStock(true)
    try {
      await addStockToBasket(basketId, newHolding)
      setNewHolding({ stockId: 0, holdinPercentage: "", slPrice: "", tgtPrice: "", orderType: "MARKET" })
      setShowAddStockDialog(false)
    } catch (e) {
      console.error(e)
    } finally {
      setAddingStock(false)
    }
  }

  const handleRemoveStock = async (stockId: number) => {
    if (!confirm("Remove this stock from the basket?")) return
    try {
      await removeStockFromBasket(basketId, stockId)
    } catch (e) {
      console.error(e)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Permission / Not-found */
  /* ------------------------------------------------------------------ */
  if (!hasPermission("basket:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Basket Management", href: "/baskets" }, { label: "Detail" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  if (!basket) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Basket Management", href: "/baskets" }, { label: "Detail" }]}>
        <div className="p-8 text-center text-gray-400">Basket not found</div>
      </AuthenticatedLayout>
    )
  }

  /* ------------------------------------------------------------------ */
  /* Main UI */
  /* ------------------------------------------------------------------ */
  return (
    <AuthenticatedLayout
      breadcrumbs={[
        { label: "Basket Management", href: "/baskets" },
        { label: basket.basketName },
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">{basket.basketName}</h1>
            <p className="text-gray-400 mt-1">Investment portfolio management</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            {hasPermission("basket:update") && (
              <Button onClick={() => setEditing(!editing)} className="bg-[#d7b56d] hover:bg-[#c9a860] text-black">
                {editing ? "Cancel" : <Edit className="h-4 w-4 mr-1" />} {editing ? "Cancel" : "Edit"}
              </Button>
            )}
          </div>
        </div>

        {/* Loading overlay for the whole page */}
        {basketLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loader2 className="h-12 w-12 animate-spin text-[#d7b56d]" />
          </div>
        )}

        {/* Basket Info Card */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#d7b56d]" />
              Portfolio Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Subscription Amount</span>
                <span className="text-white font-semibold">₹{basket.subscriptionAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">RA Name</span>
                <span className="text-white">{basket.raName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expected Return</span>
                <span className="text-white">{basket.expectedReturn}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <Badge variant="outline" className="text-white border-[#d7b56d]/40">
                  {basket.subscryptionType}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Volatility</span>
                <Badge
                  className={`${
                    basket.volatility === "LOW"
                      ? "bg-green-900/50 text-green-300"
                      : basket.volatility === "MID"
                      ? "bg-yellow-900/50 text-yellow-300"
                      : "bg-red-900/50 text-red-300"
                  }`}
                >
                  {basket.volatility}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <Badge
                  className={
                    basket.status === "ACTIVE"
                      ? "bg-green-900/50 text-green-300"
                      : "bg-gray-900/50 text-gray-300"
                  }
                >
                  {basket.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Holdings</span>
                <span className="text-white">{basket.holdings.length} stocks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-gray-400 text-sm">
                  {new Date(basket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form (only when editing) */}
        {editing && (
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Edit Basket Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Basket Name</label>
                  <Input
                    value={updatedBasket.basketName}
                    onChange={(e) => setUpdatedBasket({ ...updatedBasket, basketName: e.target.value })}
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subscription (₹)</label>
                  <Input
                    type="number"
                    value={updatedBasket.subscriptionAmount}
                    onChange={(e) => setUpdatedBasket({ ...updatedBasket, subscriptionAmount: e.target.value })}
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">RA Name</label>
                  <Input
                    value={updatedBasket.raName}
                    onChange={(e) => setUpdatedBasket({ ...updatedBasket, raName: e.target.value })}
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Expected Return (%)</label>
                  <Input
                    type="number"
                    value={updatedBasket.expectedReturn}
                    onChange={(e) => setUpdatedBasket({ ...updatedBasket, expectedReturn: e.target.value })}
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <select
                    value={updatedBasket.subscryptionType}
                    onChange={(e) =>
                      setUpdatedBasket({ ...updatedBasket, subscryptionType: e.target.value as any })
                    }
                    className="w-full bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white p-2 rounded-md"
                  >
                    <option value="FREE">Free</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Volatility</label>
                  <select
                    value={updatedBasket.volatility}
                    onChange={(e) =>
                      setUpdatedBasket({ ...updatedBasket, volatility: e.target.value as any })
                    }
                    className="w-full bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white p-2 rounded-md"
                  >
                    <option value="LOW">Low</option>
                    <option value="MID">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={updatedBasket.status}
                    onChange={(e) => setUpdatedBasket({ ...updatedBasket, status: e.target.value as any })}
                    className="w-full bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white p-2 rounded-md"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setEditing(false)} className="text-white border-[#d7b56d]/30">
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateBasket}
                  disabled={updating}
                  className="bg-[#d7b56d] hover:bg-[#c9a860] text-black"
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  Update Basket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Holdings Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#d7b56d]" />
                Portfolio Holdings
              </CardTitle>

              {hasPermission("basket:update") && (
                <Button onClick={() => setShowAddStockDialog(true)} className="bg-[#d7b56d] hover:bg-[#c9a860] text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {basketLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-[#d7b56d]" />
              </div>
            ) : (basket.holdings ?? []).length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No holdings yet</p>
                <p className="text-sm">Add stocks to build this portfolio</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#d7b56d]/10">
                    <TableHead className="text-gray-300">Stock</TableHead>
                    <TableHead className="text-gray-300">Symbol</TableHead>
                    <TableHead className="text-gray-300">Weight</TableHead>
                    <TableHead className="text-gray-300">Order Type</TableHead>
                    <TableHead className="text-gray-300">SL Price</TableHead>
                    <TableHead className="text-gray-300">Target Price</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(basket.holdings ?? []).map((holding) => {
                    const stock = stocks.find((s) => s.id === holding.stockId)
                    return (
                      <TableRow key={holding.stockId} className="border-b border-[#d7b56d]/10 hover:bg-[#1a1a2e]/50">
                        <TableCell className="text-white font-medium">
                          {stock?.name ?? `Stock #${holding.stockId}`}
                        </TableCell>
                        <TableCell className="text-gray-300">{stock?.symbol ?? holding.stockId}</TableCell>
                        <TableCell className="text-gray-300">{holding.holdinPercentage}%</TableCell>
                        <TableCell className="text-gray-300">{holding.orderType}</TableCell>
                        <TableCell className="text-gray-300">₹{holding.slPrice}</TableCell>
                        <TableCell className="text-gray-300">₹{holding.tgtPrice}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStock(holding.stockId)}
                            className="text-red-400 hover:bg-red-950/30"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Stock Dialog */}
        <Dialog open={showAddStockDialog} onOpenChange={setShowAddStockDialog}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl border border-[#d7b56d]/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Add Stock to Basket</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
                <select
                  value={newHolding.stockId}
                  onChange={(e) => setNewHolding({ ...newHolding, stockId: Number(e.target.value) })}
                  className="w-full bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white p-2 rounded-md"
                >
                  <option value={0}>Select stock...</option>
                  {stocks.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.symbol} - {stock.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Weight (%)</label>
                  <Input
                    type="number"
                    value={newHolding.holdinPercentage}
                    onChange={(e) => setNewHolding({ ...newHolding, holdinPercentage: e.target.value })}
                    placeholder="25"
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Order Type</label>
                  <select
                    value={newHolding.orderType}
                    onChange={(e) => setNewHolding({ ...newHolding, orderType: e.target.value as any })}
                    className="w-full bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white p-2 rounded-md"
                  >
                    <option value="MARKET">Market</option>
                    <option value="LIMIT">Limit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stop Loss (₹)</label>
                  <Input
                    type="number"
                    value={newHolding.slPrice}
                    onChange={(e) => setNewHolding({ ...newHolding, slPrice: e.target.value })}
                    placeholder="100"
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Target (₹)</label>
                  <Input
                    type="number"
                    value={newHolding.tgtPrice}
                    onChange={(e) => setNewHolding({ ...newHolding, tgtPrice: e.target.value })}
                    placeholder="150"
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddStockDialog(false)} className="text-white border-[#d7b56d]/30">
                Cancel
              </Button>
              <Button
                onClick={handleAddStock}
                disabled={addingStock || !newHolding.stockId}
                className="bg-[#d7b56d] hover:bg-[#c9a860] text-black"
              >
                {addingStock ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}