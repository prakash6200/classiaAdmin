"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/api/auth-context"
import { useAMCContext } from "@/lib/api/amc-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Building2, Users, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface AMC {
  id: string
  name: string
  email: string
  mobile: string
  logo?: string
  status: "active" | "inactive" | "pending"
  aum: number
  distributors: number
  funds: number
  registrationDate: string
  panNumber: string
  contactPersonName: string
}

export default function AMCPage() {
  const router = useRouter()
  const { hasPermission, user } = useAuth()
  const { amcs, pagination, loading, error, fetchAMCs } = useAMCContext()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (user) {
      console.log("Fetching AMCs with search term:", searchTerm)
      fetchAMCs(1, 10, searchTerm)
    }
  }, [fetchAMCs, searchTerm, user])

  const getStatusBadge = (status: AMC["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleAddAMC = () => {
    router.push("/amc/register") // Updated to match create page path
  }

  if (!user) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we authenticate your session.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!hasPermission("amc:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view AMC management.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AMC Management</h2>
            <p className="text-muted-foreground">Manage Asset Management Companies</p>
          </div>
          {hasPermission("amc:create") && (
            <Button onClick={handleAddAMC}>
              <Plus className="h-4 w-4 mr-2" />
              Add AMC
            </Button>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total AMCs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : pagination.total}</div>
              <p className="text-xs text-muted-foreground">
                {loading ? "..." : amcs.filter((a) => a.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : `₹${amcs.reduce((sum: number, a: AMC) => sum + a.aum, 0).toLocaleString("en-IN")}`}
              </div>
              <p className="text-xs text-muted-foreground">Across all AMCs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Distributors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : amcs.reduce((sum: number, a: AMC) => sum + a.distributors, 0)}</div>
              <p className="text-xs text-muted-foreground">Selling AMC funds</p>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* AMC Table */}
        <Card>
          <CardHeader>
            <CardTitle>All AMCs</CardTitle>
            <CardDescription>Complete list of registered Asset Management Companies</CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-muted-foreground">Loading AMCs...</div>
            ) : amcs.length === 0 ? (
              <div className="text-center text-muted-foreground">No AMCs found</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>AMC Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AUM</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amcs.map((amc) => (
                      <TableRow key={amc.id}>
                        <TableCell className="font-medium">{amc.name}</TableCell>
                        <TableCell>{amc.email}</TableCell>
                        <TableCell>{amc.mobile}</TableCell>
                        <TableCell>{amc.panNumber || "N/A"}</TableCell>
                        <TableCell>{amc.contactPersonName || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(amc.status)}</TableCell>
                        <TableCell>₹{amc.aum.toLocaleString("en-IN")}</TableCell>
                        <TableCell>{new Date(amc.registrationDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              {hasPermission("amc:update") && <DropdownMenuItem>Edit AMC</DropdownMenuItem>}
                              {hasPermission("amc:commission") && <DropdownMenuItem>Commission Setup</DropdownMenuItem>}
                              <DropdownMenuItem>View Reports</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} AMCs
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAMCs(pagination.page - 1, pagination.limit, searchTerm)}
                      disabled={pagination.page === 1 || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAMCs(pagination.page + 1, pagination.limit, searchTerm)}
                      disabled={pagination.page * pagination.limit >= pagination.total || loading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}