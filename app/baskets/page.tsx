"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useBasketContext } from "@/lib/api/basket-context"
import { useAuth } from "@/lib/api/auth-context"
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  TrendingUp,
  Loader2,
  ShoppingBag,
  AlertTriangle,
  CheckCircle,
  FileText,
  Save,
} from "lucide-react"

// Types (shared between create & edit)
type BasketForm = {
  basketName: string
  subscriptionAmount: string
  raName: string
  expectedReturn: string
  subscryptionType: "FREE" | "PAID"
  volatility: "LOW" | "MID" | "HIGH"
  status: "ACTIVE" | "INACTIVE" | "DRAFT"
}

export default function BasketsPage() {
  const router = useRouter()
  const { hasPermission } = useAuth()
  const {
    baskets,
    basketPagination,
    basketLoading,
    basketError,
    fetchBaskets,
    createBasket,
    updateBasket,
  } = useBasketContext()

  // ── CREATE STATE ──
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newBasket, setNewBasket] = useState<BasketForm>({
    basketName: "",
    subscriptionAmount: "",
    raName: "",
    expectedReturn: "",
    subscryptionType: "FREE",
    volatility: "LOW",
    status: "ACTIVE",
  })
  const [creating, setCreating] = useState(false)

  // ── EDIT STATE ──
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingBasket, setEditingBasket] = useState<BasketForm | null>(null)
  const [updating, setUpdating] = useState(false)

  /* ------------------------------------------------------------------ */
  /* Load baskets */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (hasPermission("basket:read")) fetchBaskets(1, 10)
  }, [hasPermission, fetchBaskets])

  /* ------------------------------------------------------------------ */
  /* CREATE BASKET */
  /* ------------------------------------------------------------------ */
  const handleCreateBasket = async () => {
    setCreating(true)
    try {
      await createBasket(newBasket)
      setNewBasket({
        basketName: "",
        subscriptionAmount: "",
        raName: "",
        expectedReturn: "",
        subscryptionType: "FREE",
        volatility: "LOW",
        status: "ACTIVE",
      })
      setShowCreateDialog(false)
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /* OPEN EDIT MODAL */
  /* ------------------------------------------------------------------ */
  const openEditModal = (basket: any) => {
    setEditingBasket({
      basketName: basket.basketName,
      subscriptionAmount: basket.subscriptionAmount,
      raName: basket.raName,
      expectedReturn: basket.expectedReturn,
      subscryptionType: basket.subscryptionType,
      volatility: basket.volatility,
      status: basket.status,
    })
    setShowEditDialog(true)
  }

  /* ------------------------------------------------------------------ */
  /* UPDATE BASKET */
  /* ------------------------------------------------------------------ */
  const handleUpdateBasket = async () => {
    if (!editingBasket) return
    setUpdating(true)
    try {
      const basket = baskets.find(b => b.basketName === editingBasket.basketName)
      if (!basket) throw new Error("Basket not found")
      await updateBasket(basket.id, editingBasket)
      setShowEditDialog(false)
      setEditingBasket(null)
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /* PERMISSION DENIED */
  /* ------------------------------------------------------------------ */
  if (!hasPermission("basket:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Baskets" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  /* ------------------------------------------------------------------ */
  /* MAIN UI */
  /* ------------------------------------------------------------------ */
  return (
    <AuthenticatedLayout
      breadcrumbs={[
        { label: "Basket Management" },
        { label: "All Baskets" },
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Investment Baskets
            </h1>
            <p className="text-gray-400">
              Manage pre-built investment portfolios
            </p>
          </div>

          {hasPermission("basket:create") && (
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-[#d7b56d] hover:bg-[#c9a860] text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Basket
            </Button>
          )}
        </div>

        {/* API Error */}
        {basketError && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
            {basketError}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Baskets
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-[#d7b56d]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {basketLoading ? "..." : basketPagination.total}
              </div>
              <p className="text-xs text-gray-400">All portfolios</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Active
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {basketLoading
                  ? "..."
                  : baskets.filter((b) => b.status === "ACTIVE").length}
              </div>
              <p className="text-xs text-gray-400">
                Available for subscription
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Low Risk
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {basketLoading
                  ? "..."
                  : baskets.filter((b) => b.volatility === "LOW").length}
              </div>
              <p className="text-xs text-gray-400">
                Conservative portfolios
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Free Plans
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {basketLoading
                  ? "..."
                  : baskets.filter((b) => b.subscryptionType === "FREE").length}
              </div>
              <p className="text-xs text-gray-400">No subscription fee</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-white">
                Basket Portfolios
              </CardTitle>
              <Button
                onClick={() => fetchBaskets(1, 10)}
                variant="outline"
                disabled={basketLoading}
              >
                <Loader2
                  className={`h-4 w-4 mr-2 ${basketLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {basketLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-[#d7b56d]" />
              </div>
            ) : baskets.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No baskets yet</p>
                <p className="text-sm">Create your first investment basket</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#d7b56d]/10">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Subscription</TableHead>
                      <TableHead className="text-gray-300">Expected Return</TableHead>
                      <TableHead className="text-gray-300">Volatility</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Holdings</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {baskets.map((basket) => (
                      <TableRow
                        key={basket.id}
                        className="border-b border-[#d7b56d]/10 hover:bg-[#1a1a2e]/50"
                      >
                        <TableCell className="text-white font-medium">
                          {basket.basketName}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          ₹{basket.subscriptionAmount}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {basket.expectedReturn}%
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              basket.status === "ACTIVE"
                                ? "bg-green-900/50 text-green-300"
                                : "bg-gray-900/50 text-gray-300"
                            }
                          >
                            {basket.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {basket.holdings?.length ?? 0} stocks
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {new Date(basket.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-1">
                            {/* VIEW */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/baskets/${basket.id}`)}
                              className="text-[#d7b56d] hover:bg-[#d7b56d]/10"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>

                            {/* EDIT */}
                            {hasPermission("basket:update") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(basket)}
                                className="text-gray-400 hover:bg-gray-800"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                  <span>
                    Showing{" "}
                    {(basketPagination.page - 1) * basketPagination.limit + 1}–{" "}
                    {Math.min(
                      basketPagination.page * basketPagination.limit,
                      basketPagination.total
                    )}{" "}
                    of {basketPagination.total}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fetchBaskets(basketPagination.page - 1, basketPagination.limit)
                      }
                      disabled={basketPagination.page === 1 || basketLoading}
                      className="text-white border-[#d7b56d]/30"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fetchBaskets(basketPagination.page + 1, basketPagination.limit)
                      }
                      disabled={
                        basketPagination.page * basketPagination.limit >= basketPagination.total ||
                        basketLoading
                      }
                      className="text-white border-[#d7b56d]/30"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── CREATE DIALOG ── */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl border border-[#d7b56d]/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Create Investment Basket</DialogTitle>
            </DialogHeader>
            <BasketFormContent
              form={newBasket}
              setForm={setNewBasket}
              loading={creating}
              onSubmit={handleCreateBasket}
              submitLabel="Create Basket"
            />
          </DialogContent>
        </Dialog>

        {/* ── EDIT DIALOG ── */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl border border-[#d7b56d]/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Basket</DialogTitle>
            </DialogHeader>
            {editingBasket && (
              <BasketFormContent
                form={editingBasket}
                setForm={setEditingBasket}
                loading={updating}
                onSubmit={handleUpdateBasket}
                submitLabel="Save Changes"
                submitIcon={<Save className="h-4 w-4 mr-2" />}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}

/* ------------------------------------------------------------------ */
/* Reusable Form Component (Create + Edit)                            */
/* ------------------------------------------------------------------ */
function BasketFormContent({
  form,
  setForm,
  loading,
  onSubmit,
  submitLabel,
  submitIcon,
}: {
  form: BasketForm
  setForm: (f: BasketForm) => void
  loading: boolean
  onSubmit: () => void
  submitLabel: string
  submitIcon?: React.ReactNode
}) {
  return (
    <>
      <div className="space-y-4 py-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Basket Name
          </label>
          <Input
            value={form.basketName}
            onChange={(e) => setForm({ ...form, basketName: e.target.value })}
            placeholder="e.g., Classia Growth Portfolio"
            className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Subscription (₹)
            </label>
            <Input
              type="number"
              value={form.subscriptionAmount}
              onChange={(e) => setForm({ ...form, subscriptionAmount: e.target.value })}
              placeholder="e.g., 1000"
              className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              RA Name
            </label>
            <Input
              value={form.raName}
              onChange={(e) => setForm({ ...form, raName: e.target.value })}
              placeholder="e.g., Classia RA"
              className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Expected Return (%)
            </label>
            <Input
              type="number"
              value={form.expectedReturn}
              onChange={(e) => setForm({ ...form, expectedReturn: e.target.value })}
              placeholder="e.g., 12"
              className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              value={form.subscryptionType}
              onChange={(e) =>
                setForm({ ...form, subscryptionType: e.target.value as any })
              }
              className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white p-2 rounded-md w-full"
            >
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Volatility
            </label>
            <select
              value={form.volatility}
              onChange={(e) =>
                setForm({ ...form, volatility: e.target.value as any })
              }
              className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white p-2 rounded-md w-full"
            >
              <option value="LOW">Low</option>
              <option value="MID">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as any })
              }
              className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white p-2 rounded-md w-full"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            // Close logic is handled by parent
          }}
          className="text-white border-[#d7b56d]/30"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="bg-[#d7b56d] hover:bg-[#c9a860] text-black"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            submitIcon || <Plus className="h-4 w-4 mr-2" />
          )}
          {submitLabel}
        </Button>
      </DialogFooter>
    </>
  )
}