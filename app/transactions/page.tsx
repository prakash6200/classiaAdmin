"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/api/auth-context"
import { useTransactionContext } from "@/lib/api/transaction-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Transaction {
  id: string
  transactionId: string
  userId: string
  userName: string
  distributorName: string
  amc: string
  amcId: string
  fundName: string
  transactionType: "purchase" | "redemption" | "sip" | "stp" | "swp"
  amount: number
  units: number
  nav: number
  status: "completed" | "pending" | "failed" | "processing" | "cancelled"
  paymentMode: string
  transactionDate: string
  settlementDate?: string
  commissionAmount: number
  riskFlag: boolean
  notes?: string
}

export default function AllTransactionsPage() {
  const { hasPermission, user } = useAuth()
  const { transactions, pagination, loading, error, fetchTransactions } = useTransactionContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [amcFilter, setAmcFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      console.log("Fetching transactions with search term:", searchTerm)
      fetchTransactions(1, 10, searchTerm)
    }
  }, [fetchTransactions, searchTerm, user])

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.fundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.distributorName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || txn.status === statusFilter
    const matchesType = typeFilter === "all" || txn.transactionType === typeFilter
    const matchesAMC = amcFilter === "all" || txn.amc === amcFilter
    const matchesRisk =
      riskFilter === "all" || (riskFilter === "flagged" && txn.riskFlag) || (riskFilter === "normal" && !txn.riskFlag)

    const matchesDate =
      !dateRange ||
      (new Date(txn.transactionDate) >= dateRange.from && new Date(txn.transactionDate) <= dateRange.to)

    return matchesSearch && matchesStatus && matchesType && matchesAMC && matchesRisk && matchesDate
  })

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-500">
            <RefreshCw className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTransactionTypeBadge = (type: Transaction["transactionType"]) => {
    const colors = {
      purchase: "bg-green-100 text-green-800",
      redemption: "bg-red-100 text-red-800",
      sip: "bg-blue-100 text-blue-800",
      stp: "bg-purple-100 text-purple-800",
      swp: "bg-orange-100 text-orange-800",
    }

    return <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>{type.toUpperCase()}</Badge>
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      await fetchTransactions(pagination.page, pagination.limit, searchTerm)
    } finally {
      setIsRefreshing(false)
    }
  }

  const exportTransactions = (format: string) => {
    alert(`Exporting transactions in ${format} format...`)
    // Implement actual export logic
  }

  if (!user) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Transaction Management" }, { label: "All Transactions" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we authenticate your session.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!hasPermission("transaction:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Transaction Management" }, { label: "All Transactions" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view transactions.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Transaction Management" }, { label: "All Transactions" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">All Transactions</h2>
            <p className="text-muted-foreground">Monitor and manage all investment transactions</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={refreshData} disabled={isRefreshing || loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => exportTransactions("CSV")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : pagination.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : transactions.filter((t) => t.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Successful</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : transactions.filter((t) => t.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : transactions.filter((t) => t.status === "failed").length}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Flagged</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : transactions.filter((t) => t.riskFlag).length}
              </div>
              <p className="text-xs text-muted-foreground">Fraud detection</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="redemption">Redemption</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>AMC</Label>
                <Select value={amcFilter} onValueChange={setAmcFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All AMCs</SelectItem>
                    {[...new Set(transactions.map((t) => t.amc))].map((amc) => (
                      <SelectItem key={amc} value={amc}>
                        {amc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
               {/* <DatePickerWithRange date={dateRange} setDate={setDateRange} /> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
            <CardDescription>Real-time transaction monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-muted-foreground">Loading transactions...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center text-muted-foreground">No transactions found</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Distributor</TableHead>
                      <TableHead>Fund</TableHead>
                      <TableHead>AMC ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-sm">{transaction.transactionId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.userName}</div>
                            <div className="text-sm text-muted-foreground">{transaction.userId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.distributorName}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.fundName}</div>
                            <div className="text-sm text-muted-foreground">{transaction.amc}</div>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.amcId}</TableCell>
                        <TableCell>{getTransactionTypeBadge(transaction.transactionType)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">₹{transaction.amount.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{transaction.units} units</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {transaction.riskFlag ? (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                              {transaction.status === "pending" && (
                                <DropdownMenuItem>Approve Transaction</DropdownMenuItem>
                              )}
                              {transaction.status === "failed" && (
                                <DropdownMenuItem>Retry Transaction</DropdownMenuItem>
                              )}
                              {transaction.riskFlag && <DropdownMenuItem>Review Risk Flag</DropdownMenuItem>}
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
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTransactions(pagination.page - 1, pagination.limit, searchTerm)}
                      disabled={pagination.page === 1 || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTransactions(pagination.page + 1, pagination.limit, searchTerm)}
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