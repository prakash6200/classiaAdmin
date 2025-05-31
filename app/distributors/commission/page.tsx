"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Search, Download, DollarSign, TrendingUp, Clock, AlertTriangle, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CommissionRecord {
  id: string
  distributorName: string
  amc: string
  fund: string
  transactionId: string
  investmentAmount: number
  commissionRate: number
  commissionAmount: number
  status: "earned" | "pending" | "paid" | "disputed"
  earnedDate: string
  paidDate?: string
  payoutSchedule: string
}

const mockCommissionData: CommissionRecord[] = [
  {
    id: "1",
    distributorName: "Rajesh Kumar",
    amc: "HDFC AMC",
    fund: "HDFC Equity Fund",
    transactionId: "TXN001",
    investmentAmount: 100000,
    commissionRate: 2.5,
    commissionAmount: 2500,
    status: "paid",
    earnedDate: "2024-01-15",
    paidDate: "2024-01-30",
    payoutSchedule: "Monthly",
  },
  {
    id: "2",
    distributorName: "Priya Sharma",
    amc: "ICICI Prudential",
    fund: "ICICI Balanced Fund",
    transactionId: "TXN002",
    investmentAmount: 75000,
    commissionRate: 2.0,
    commissionAmount: 1500,
    status: "pending",
    earnedDate: "2024-01-20",
    payoutSchedule: "Monthly",
  },
  {
    id: "3",
    distributorName: "Amit Patel",
    amc: "SBI MF",
    fund: "SBI Large Cap Fund",
    transactionId: "TXN003",
    investmentAmount: 50000,
    commissionRate: 1.8,
    commissionAmount: 900,
    status: "disputed",
    earnedDate: "2024-01-25",
    payoutSchedule: "Monthly",
  },
]

const commissionTrendData = [
  { month: "Jan", earned: 45000, paid: 42000 },
  { month: "Feb", earned: 52000, paid: 45000 },
  { month: "Mar", earned: 48000, paid: 52000 },
  { month: "Apr", earned: 61000, paid: 48000 },
  { month: "May", earned: 55000, paid: 61000 },
  { month: "Jun", earned: 67000, paid: 55000 },
]

export default function CommissionTrackingPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDistributor, setSelectedDistributor] = useState("all")
  const [commissionData] = useState<CommissionRecord[]>(mockCommissionData)
  const [adjustmentDialog, setAdjustmentDialog] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null)
  const [adjustmentData, setAdjustmentData] = useState({
    amount: 0,
    reason: "",
    type: "increase" as "increase" | "decrease",
  })

  const filteredData = commissionData.filter((record) => {
    const matchesSearch =
      record.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.amc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.fund.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesDistributor = selectedDistributor === "all" || record.distributorName === selectedDistributor

    return matchesSearch && matchesStatus && matchesDistributor
  })

  const getStatusBadge = (status: CommissionRecord["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "earned":
        return <Badge className="bg-blue-500">Earned</Badge>
      case "disputed":
        return <Badge variant="destructive">Disputed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleManualAdjustment = () => {
    // Mock adjustment logic
    alert(`Commission ${adjustmentData.type} of ₹${adjustmentData.amount} applied. Reason: ${adjustmentData.reason}`)
    setAdjustmentDialog(false)
    setAdjustmentData({ amount: 0, reason: "", type: "increase" })
  }

  const triggerPayout = () => {
    alert("Payout triggered for pending commissions!")
  }

  const exportData = (format: string) => {
    alert(`Exporting commission data in ${format} format...`)
  }

  if (!hasPermission("distributor:commission")) {
    return (
      <AuthenticatedLayout
        breadcrumbs={[{ label: "Distributor Management", href: "/distributors" }, { label: "Commission Tracking" }]}
      >
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view commission tracking.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout
      breadcrumbs={[{ label: "Distributor Management", href: "/distributors" }, { label: "Commission Tracking" }]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Commission Tracking</h2>
            <p className="text-muted-foreground">Track and manage distributor commissions</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => exportData("CSV")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={triggerPayout}>Trigger Payout</Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹67,000</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹55,000</div>
              <p className="text-xs text-muted-foreground">Last payout</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹12,000</div>
              <p className="text-xs text-muted-foreground">Awaiting payout</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disputed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹900</div>
              <p className="text-xs text-muted-foreground">Needs resolution</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tracking" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tracking">Commission Tracking</TabsTrigger>
            <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
            <TabsTrigger value="disputes">Dispute Management</TabsTrigger>
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search distributors, AMCs..."
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
                        <SelectItem value="earned">Earned</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="disputed">Disputed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Distributor</Label>
                    <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Distributors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Distributors</SelectItem>
                        <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
                        <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                        <SelectItem value="Amit Patel">Amit Patel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Dialog open={adjustmentDialog} onOpenChange={setAdjustmentDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Manual Adjustment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manual Commission Adjustment</DialogTitle>
                          <DialogDescription>Make manual adjustments to commission amounts</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Adjustment Type</Label>
                            <Select
                              value={adjustmentData.type}
                              onValueChange={(value: "increase" | "decrease") =>
                                setAdjustmentData((prev) => ({ ...prev, type: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="increase">Increase</SelectItem>
                                <SelectItem value="decrease">Decrease</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Amount (₹)</Label>
                            <Input
                              type="number"
                              value={adjustmentData.amount}
                              onChange={(e) =>
                                setAdjustmentData((prev) => ({
                                  ...prev,
                                  amount: Number.parseFloat(e.target.value),
                                }))
                              }
                              placeholder="Enter amount"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Reason</Label>
                            <Textarea
                              value={adjustmentData.reason}
                              onChange={(e) =>
                                setAdjustmentData((prev) => ({
                                  ...prev,
                                  reason: e.target.value,
                                }))
                              }
                              placeholder="Enter reason for adjustment"
                            />
                          </div>

                          <Button onClick={handleManualAdjustment} className="w-full">
                            Apply Adjustment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission Table */}
            <Card>
              <CardHeader>
                <CardTitle>Commission Records</CardTitle>
                <CardDescription>Detailed commission tracking for all distributors</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Distributor</TableHead>
                      <TableHead>AMC</TableHead>
                      <TableHead>Fund</TableHead>
                      <TableHead>Investment</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Earned Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.distributorName}</TableCell>
                        <TableCell>{record.amc}</TableCell>
                        <TableCell>{record.fund}</TableCell>
                        <TableCell>₹{record.investmentAmount.toLocaleString()}</TableCell>
                        <TableCell>{record.commissionRate}%</TableCell>
                        <TableCell>₹{record.commissionAmount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>{new Date(record.earnedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Trends</CardTitle>
                <CardDescription>Earned vs Paid commission over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    earned: {
                      label: "Earned (₹)",
                      color: "hsl(var(--chart-1))",
                    },
                    paid: {
                      label: "Paid (₹)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={commissionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="earned"
                        stroke="var(--color-earned)"
                        strokeWidth={2}
                        name="Earned (₹)"
                      />
                      <Line type="monotone" dataKey="paid" stroke="var(--color-paid)" strokeWidth={2} name="Paid (₹)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Disputes</CardTitle>
                <CardDescription>Handle and resolve commission disputes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commissionData
                    .filter((record) => record.status === "disputed")
                    .map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{record.distributorName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {record.amc} - {record.fund}
                            </p>
                            <p className="text-sm">Commission: ₹{record.commissionAmount.toLocaleString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Investigate
                            </Button>
                            <Button size="sm">Resolve</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Historical payout records and schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">January 2024</h4>
                      <p className="text-2xl font-bold">₹42,000</p>
                      <p className="text-sm text-muted-foreground">Paid on Jan 31, 2024</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">February 2024</h4>
                      <p className="text-2xl font-bold">₹45,000</p>
                      <p className="text-sm text-muted-foreground">Paid on Feb 29, 2024</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">March 2024</h4>
                      <p className="text-2xl font-bold">₹52,000</p>
                      <p className="text-sm text-muted-foreground">Paid on Mar 31, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
