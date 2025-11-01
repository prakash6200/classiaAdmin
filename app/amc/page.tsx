"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/api/auth-context"
import { useAMCContext } from "@/lib/api/amc-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { DarkCard } from "@/components/ui/dark-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Building2, Users, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AMCPage() {
  const router = useRouter()
  const { hasPermission, user } = useAuth()
  const { amcs, pagination, loading, error, fetchAMCs } = useAMCContext()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (user) fetchAMCs(1, 10, searchTerm)
  }, [fetchAMCs, searchTerm, user])

  const getStatusBadge = (status: "active" | "inactive" | "pending") => {
    const map = {
      active: "bg-green-500 text-white",
      inactive: "bg-gray-600 text-white",
      pending: "bg-yellow-500 text-white",
    }
    return <Badge className={map[status]}>{status}</Badge>
  }

  const handleBlockUnblock = async (id: string, isDeleted: boolean) => {
    const token = localStorage.getItem("jockey-token")
    await fetch(`https://goapi.classiacapital.com/admin/update-amc?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ isDeleted: (!isDeleted).toString() }),
    })
    fetchAMCs(1, 10, searchTerm)
  }

  if (!user) return <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management" }]}><div className="p-8 text-center">Loading…</div></AuthenticatedLayout>
  if (!hasPermission("amc:read")) return <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management" }]}><div className="p-8 text-center text-red-400">Access Denied</div></AuthenticatedLayout>

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management" }]}>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">AMC Management</h2>
            <p className="text-muted-foreground">Manage Asset Management Companies</p>
          </div>
          {hasPermission("amc:create") && (
            <Button onClick={() => router.push("/amc/register")} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Add AMC
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <DarkCard title="Total AMCs">
            <div className="text-2xl font-bold">{loading ? "…" : pagination.total}</div>
            <p className="text-xs text-muted-foreground">{loading ? "…" : `${amcs.filter(a => a.status === "active").length} active`}</p>
          </DarkCard>

          <DarkCard title="Total AUM">
            <div className="text-2xl font-bold">
              {loading ? "…" : `₹${amcs.reduce((s, a) => s + a.aum, 0).toLocaleString("en-IN")}`}
            </div>
            <p className="text-xs text-muted-foreground">Across all AMCs</p>
          </DarkCard>

          <DarkCard title="Active Distributors">
            <div className="text-2xl font-bold">{loading ? "…" : amcs.reduce((s, a) => s + a.distributors, 0)}</div>
            <p className="text-xs text-muted-foreground">Selling AMC funds</p>
          </DarkCard>
        </div>

        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        {/* Table */}
        <DarkCard title="All AMCs" description="Complete list of registered Asset Management Companies">
          <div className="flex items-center mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading…</p>
          ) : amcs.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No AMCs found</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead className="text-muted-foreground">AMC Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Mobile</TableHead>
                    <TableHead className="text-muted-foreground">PAN</TableHead>
                    <TableHead className="text-muted-foreground">Contact</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">AUM</TableHead>
                    <TableHead className="text-muted-foreground">Registered</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amcs.map(amc => (
                    <TableRow key={amc.id} className="border-border/10 hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">{amc.name}</TableCell>
                      <TableCell className="text-muted-foreground">{amc.email}</TableCell>
                      <TableCell className="text-muted-foreground">{amc.mobile}</TableCell>
                      <TableCell className="text-muted-foreground">{amc.panNumber || "N/A"}</TableCell>
                      <TableCell className="text-muted-foreground">{amc.contactPersonName || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(amc.status)}</TableCell>
                      <TableCell className="text-foreground">₹{amc.aum.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(amc.registrationDate).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem onClick={() => router.push(`/amc/${amc.id}`)}>View Details</DropdownMenuItem>
                            {hasPermission("amc:update") && <DropdownMenuItem>Edit AMC</DropdownMenuItem>}
                            {hasPermission("amc:commission") && <DropdownMenuItem>Commission Setup</DropdownMenuItem>}
                            <DropdownMenuItem>View Reports</DropdownMenuItem>
                            {hasPermission("amc:update") && (
                              <DropdownMenuItem onClick={() => handleBlockUnblock(amc.id, amc.isDeleted)}>
                                {amc.isDeleted ? "Unblock" : "Block"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAMCs(pagination.page - 1, pagination.limit, searchTerm)}
                    disabled={pagination.page === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAMCs(pagination.page + 1, pagination.limit, searchTerm)}
                    disabled={pagination.page * pagination.limit >= pagination.total || loading}
                  >
                    Next<ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DarkCard>
      </div>
    </AuthenticatedLayout>
  )
}