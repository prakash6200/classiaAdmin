"use client"

import { useState } from "react"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Users, TrendingUp, CreditCard } from "lucide-react"

interface Distributor {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "suspended"
  amc: string
  clients: number
  aum: string
  commission: string
  joinDate: string
}

const mockDistributors: Distributor[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    status: "active",
    amc: "HDFC AMC",
    clients: 156,
    aum: "₹2.4M",
    commission: "₹45,230",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    status: "active",
    amc: "ICICI Prudential",
    clients: 89,
    aum: "₹1.8M",
    commission: "₹32,100",
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit@example.com",
    status: "suspended",
    amc: "SBI MF",
    clients: 45,
    aum: "₹890K",
    commission: "₹12,450",
    joinDate: "2023-03-10",
  },
]

export default function DistributorsPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [distributors] = useState<Distributor[]>(mockDistributors)

  const filteredDistributors = distributors.filter((distributor) =>
    distributor.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: Distributor["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (!hasPermission("distributor:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Distributor Management" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view distributor management.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Distributor Management" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Distributor Management</h2>
            <p className="text-muted-foreground">Manage mutual fund distributors</p>
          </div>
          {hasPermission("distributor:create") && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Distributor
            </Button>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distributors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{distributors.length}</div>
              <p className="text-xs text-muted-foreground">
                {distributors.filter((d) => d.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹5.1M</div>
              <p className="text-xs text-muted-foreground">Across all distributors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹89,780</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Distributors Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Distributors</CardTitle>
            <CardDescription>Complete list of registered distributors</CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search distributors..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AMC</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>AUM</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDistributors.map((distributor) => (
                  <TableRow key={distributor.id}>
                    <TableCell className="font-medium">{distributor.name}</TableCell>
                    <TableCell>{distributor.email}</TableCell>
                    <TableCell>{getStatusBadge(distributor.status)}</TableCell>
                    <TableCell>{distributor.amc}</TableCell>
                    <TableCell>{distributor.clients}</TableCell>
                    <TableCell>{distributor.aum}</TableCell>
                    <TableCell>{distributor.commission}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          {hasPermission("distributor:update") && <DropdownMenuItem>Edit Distributor</DropdownMenuItem>}
                          <DropdownMenuItem>View Commission</DropdownMenuItem>
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
