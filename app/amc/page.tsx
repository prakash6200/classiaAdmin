"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Building2, Users, TrendingUp } from "lucide-react"
import { AuthenticatedLayout } from "@/components/authenticated-layout"

interface AMC {
  id: string
  name: string
  logo?: string
  status: "active" | "inactive" | "pending"
  aum: string
  distributors: number
  funds: number
  registrationDate: string
}

const mockAMCs: AMC[] = [
  {
    id: "1",
    name: "HDFC Asset Management",
    status: "active",
    aum: "₹2.4B",
    distributors: 45,
    funds: 23,
    registrationDate: "2023-01-15",
  },
  {
    id: "2",
    name: "ICICI Prudential AMC",
    status: "active",
    aum: "₹1.8B",
    distributors: 38,
    funds: 19,
    registrationDate: "2023-02-20",
  },
  {
    id: "3",
    name: "SBI Mutual Fund",
    status: "pending",
    aum: "₹0",
    distributors: 0,
    funds: 0,
    registrationDate: "2024-01-10",
  },
]

export default function AMCPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [amcs] = useState<AMC[]>(mockAMCs)

  const filteredAMCs = amcs.filter((amc) => amc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusBadge = (status: AMC["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
            <Button>
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
              <div className="text-2xl font-bold">{amcs.length}</div>
              <p className="text-xs text-muted-foreground">{amcs.filter((a) => a.status === "active").length} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹4.2B</div>
              <p className="text-xs text-muted-foreground">Across all AMCs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Distributors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">83</div>
              <p className="text-xs text-muted-foreground">Selling AMC funds</p>
            </CardContent>
          </Card>
        </div>

        {/* AMC Table */}
        <Card>
          <CardHeader>
            <CardTitle>All AMCs</CardTitle>
            <CardDescription>Complete list of registered Asset Management Companies</CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search AMCs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>AMC Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AUM</TableHead>
                  <TableHead>Distributors</TableHead>
                  <TableHead>Funds</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAMCs.map((amc) => (
                  <TableRow key={amc.id}>
                    <TableCell className="font-medium">{amc.name}</TableCell>
                    <TableCell>{getStatusBadge(amc.status)}</TableCell>
                    <TableCell>{amc.aum}</TableCell>
                    <TableCell>{amc.distributors}</TableCell>
                    <TableCell>{amc.funds}</TableCell>
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
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
