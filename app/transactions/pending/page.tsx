"use client"

import { useState } from "react"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Clock, CheckCircle, XCircle, AlertTriangle, Eye, FileText, DollarSign, Calendar } from "lucide-react"

interface PendingTransaction {
  id: string
  transactionId: string
  type: "deposit" | "withdrawal" | "commission_payout" | "large_transaction" | "kyc_pending"
  userId: string
  userName: string
  distributorName?: string
  amc?: string
  fundName?: string
  amount: number
  requestDate: string
  expiryDate: string
  priority: "high" | "medium" | "low"
  reason: string
  documents: string[]
  riskScore: number
  autoExpiry: boolean
  notes?: string
}

const mockPendingTransactions: PendingTransaction[] = [
  {
    id: "1",
    transactionId: "PND001234567",
    type: "large_transaction",
    userId: "USR001",
    userName: "Arjun Singh",
    distributorName: "Rajesh Kumar",
    amc: "HDFC AMC",
    fundName: "HDFC Equity Fund",
    amount: 500000,
    requestDate: "2024-01-20T10:30:00Z",
    expiryDate: "2024-01-27T10:30:00Z",
    priority: "high",
    reason: "Large investment amount requires manual approval",
    documents: ["pan_card.pdf", "bank_statement.pdf"],
    riskScore: 75,
    autoExpiry: true,
  },
  {
    id: "2",
    transactionId: "PND001234568",
    type: "withdrawal",
    userId: "USR002",
    userName: "Sneha Patel",
    distributorName: "Priya Sharma",
    amc: "ICICI Prudential",
    fundName: "ICICI Balanced Fund",
    amount: 150000,
    requestDate: "2024-01-22T14:15:00Z",
    expiryDate: "2024-01-29T14:15:00Z",
    priority: "medium",
    reason: "Withdrawal amount exceeds daily limit",
    documents: ["withdrawal_request.pdf"],
    riskScore: 45,
    autoExpiry: true,
  },
  {
    id: "3",
    transactionId: "PND001234569",
    type: "commission_payout",
    userId: "DST001",
    userName: "Distributor Commission",
    distributorName: "Amit Patel",
    amount: 25000,
    requestDate: "2024-01-25T09:00:00Z",
    expiryDate: "2024-02-01T09:00:00Z",
    priority: "low",
    reason: "Monthly commission payout approval",
    documents: ["commission_statement.pdf"],
    riskScore: 20,
    autoExpiry: false,
  },
  {
    id: "4",
    transactionId: "PND001234570",
    type: "kyc_pending",
    userId: "USR004",
    userName: "Vikram Gupta",
    distributorName: "Rajesh Kumar",
    amount: 75000,
    requestDate: "2024-01-26T11:45:00Z",
    expiryDate: "2024-02-02T11:45:00Z",
    priority: "high",
    reason: "KYC verification pending for investment",
    documents: ["aadhaar_card.pdf", "pan_card.pdf", "address_proof.pdf"],
    riskScore: 60,
    autoExpiry: true,
  },
]

const rejectionReasons = [
  "Insufficient documentation",
  "KYC verification failed",
  "Suspicious transaction pattern",
  "Amount exceeds regulatory limits",
  "Invalid bank account details",
  "Duplicate transaction detected",
  "Risk assessment failed",
  "Manual review required",
  "Other (specify in notes)",
]

export default function PendingApprovalsPage() {
  const { hasPermission } = useAuth()
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>(mockPendingTransactions)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [filterType, setFilterType] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [approvalDialog, setApprovalDialog] = useState(false)
  const [rejectionDialog, setRejectionDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<PendingTransaction | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionNotes, setRejectionNotes] = useState("")

  const filteredTransactions = pendingTransactions.filter((txn) => {
    const matchesSearch =
      txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (txn.distributorName && txn.distributorName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === "all" || txn.type === filterType
    const matchesPriority = filterPriority === "all" || txn.priority === filterPriority

    return matchesSearch && matchesType && matchesPriority
  })

  const handleTransactionSelection = (transactionId: string, checked: boolean) => {
    setSelectedTransactions((prev) => (checked ? [...prev, transactionId] : prev.filter((id) => id !== transactionId)))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedTransactions(checked ? filteredTransactions.map((t) => t.id) : [])
  }

  const approveTransaction = (transaction: PendingTransaction) => {
    setPendingTransactions((prev) => prev.filter((t) => t.id !== transaction.id))
    alert(`Transaction ${transaction.transactionId} approved successfully!`)
    setApprovalDialog(false)
  }

  const rejectTransaction = () => {
    if (selectedTransaction) {
      setPendingTransactions((prev) => prev.filter((t) => t.id !== selectedTransaction.id))
      alert(`Transaction ${selectedTransaction.transactionId} rejected. Reason: ${rejectionReason}`)
      setRejectionDialog(false)
      setRejectionReason("")
      setRejectionNotes("")
    }
  }

  const bulkApprove = () => {
    setPendingTransactions((prev) => prev.filter((t) => !selectedTransactions.includes(t.id)))
    alert(`${selectedTransactions.length} transactions approved successfully!`)
    setSelectedTransactions([])
  }

  const bulkReject = () => {
    setPendingTransactions((prev) => prev.filter((t) => !selectedTransactions.includes(t.id)))
    alert(`${selectedTransactions.length} transactions rejected!`)
    setSelectedTransactions([])
  }

  const getPriorityBadge = (priority: PendingTransaction["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const getTypeBadge = (type: PendingTransaction["type"]) => {
    const colors = {
      deposit: "bg-green-100 text-green-800",
      withdrawal: "bg-red-100 text-red-800",
      commission_payout: "bg-blue-100 text-blue-800",
      large_transaction: "bg-purple-100 text-purple-800",
      kyc_pending: "bg-orange-100 text-orange-800",
    }

    return <Badge className={colors[type]}>{type.replace("_", " ").toUpperCase()}</Badge>
  }

  const getRiskBadge = (score: number) => {
    if (score >= 70) return <Badge variant="destructive">High Risk</Badge>
    if (score >= 40) return <Badge className="bg-yellow-500">Medium Risk</Badge>
    return <Badge className="bg-green-500">Low Risk</Badge>
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (!hasPermission("transaction:approve")) {
    return (
      <AuthenticatedLayout
        breadcrumbs={[{ label: "Transaction Management", href: "/transactions" }, { label: "Pending Approvals" }]}
      >
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to approve transactions.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout
      breadcrumbs={[{ label: "Transaction Management", href: "/transactions" }, { label: "Pending Approvals" }]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Pending Approvals</h2>
            <p className="text-muted-foreground">Review and approve pending transactions</p>
          </div>
          <div className="flex space-x-2">
            {selectedTransactions.length > 0 && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Bulk Approve ({selectedTransactions.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bulk Approve Transactions</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve {selectedTransactions.length} selected transactions? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={bulkApprove}>Approve All</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Bulk Reject ({selectedTransactions.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bulk Reject Transactions</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject {selectedTransactions.length} selected transactions? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={bulkReject}>Reject All</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTransactions.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingTransactions.filter((t) => t.priority === "high").length}
              </div>
              <p className="text-xs text-muted-foreground">Urgent attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingTransactions.filter((t) => getDaysUntilExpiry(t.expiryDate) <= 2).length}
              </div>
              <p className="text-xs text-muted-foreground">Within 2 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{pendingTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Pending amount</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="commission_payout">Commission Payouts</SelectItem>
                    <SelectItem value="large_transaction">Large Transactions</SelectItem>
                    <SelectItem value="kyc_pending">KYC Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Queue</CardTitle>
            <CardDescription>Transactions requiring manual approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Expires In</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={(checked) => handleTransactionSelection(transaction.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{transaction.transactionId}</TableCell>
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.userName}</div>
                        {transaction.distributorName && (
                          <div className="text-sm text-muted-foreground">via {transaction.distributorName}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{transaction.amount.toLocaleString()}</div>
                      {transaction.fundName && (
                        <div className="text-sm text-muted-foreground">{transaction.fundName}</div>
                      )}
                    </TableCell>
                    <TableCell>{getPriorityBadge(transaction.priority)}</TableCell>
                    <TableCell>{getRiskBadge(transaction.riskScore)}</TableCell>
                    <TableCell>
                      <div
                        className={`text-sm ${getDaysUntilExpiry(transaction.expiryDate) <= 2 ? "text-red-600 font-medium" : ""}`}
                      >
                        {getDaysUntilExpiry(transaction.expiryDate)} days
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>Review transaction information</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Transaction ID</Label>
                                  <p className="font-mono">{transaction.transactionId}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Type</Label>
                                  <p>{transaction.type.replace("_", " ")}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">User</Label>
                                  <p>{transaction.userName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Amount</Label>
                                  <p>₹{transaction.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Risk Score</Label>
                                  <p>{transaction.riskScore}/100</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Priority</Label>
                                  <p>{transaction.priority}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Reason</Label>
                                <p className="text-sm">{transaction.reason}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Documents</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {transaction.documents.map((doc, index) => (
                                    <Badge key={index} variant="outline" className="cursor-pointer">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedTransaction(transaction)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Transaction</DialogTitle>
                              <DialogDescription>Are you sure you want to approve this transaction?</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-muted rounded-lg">
                                <p>
                                  <strong>Transaction ID:</strong> {selectedTransaction?.transactionId}
                                </p>
                                <p>
                                  <strong>User:</strong> {selectedTransaction?.userName}
                                </p>
                                <p>
                                  <strong>Amount:</strong> ₹{selectedTransaction?.amount.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setApprovalDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => selectedTransaction && approveTransaction(selectedTransaction)}>
                                  Approve Transaction
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Transaction</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this transaction
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Rejection Reason</Label>
                                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select reason" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {rejectionReasons.map((reason) => (
                                      <SelectItem key={reason} value={reason}>
                                        {reason}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Additional Notes</Label>
                                <Textarea
                                  value={rejectionNotes}
                                  onChange={(e) => setRejectionNotes(e.target.value)}
                                  placeholder="Provide additional details..."
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setRejectionDialog(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={rejectTransaction}>
                                  Reject Transaction
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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
