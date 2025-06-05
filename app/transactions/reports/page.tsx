"use client"

import { useState } from "react"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart,
} from "recharts"
import { Download, TrendingUp, TrendingDown, DollarSign, Activity, Calendar, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const transactionVolumeData = [
  { month: "Jan", volume: 2400000, count: 240, avgTicket: 10000 },
  { month: "Feb", volume: 1398000, count: 139, avgTicket: 10057 },
  { month: "Mar", volume: 9800000, count: 980, avgTicket: 10000 },
  { month: "Apr", volume: 3908000, count: 390, avgTicket: 10020 },
  { month: "May", volume: 4800000, count: 480, avgTicket: 10000 },
  { month: "Jun", volume: 3800000, count: 380, avgTicket: 10000 },
]

const amcWiseData = [
  { amc: "HDFC AMC", volume: 12500000, percentage: 35, transactions: 1250 },
  { amc: "ICICI Prudential", volume: 8900000, percentage: 25, transactions: 890 },
  { amc: "SBI MF", volume: 7100000, percentage: 20, transactions: 710 },
  { amc: "Axis MF", volume: 4300000, percentage: 12, transactions: 430 },
  { amc: "Others", volume: 2800000, percentage: 8, transactions: 280 },
]

const distributorWiseData = [
  { distributor: "Rajesh Kumar", volume: 5600000, transactions: 560, commission: 140000 },
  { distributor: "Priya Sharma", volume: 4200000, transactions: 420, commission: 105000 },
  { distributor: "Amit Patel", volume: 3800000, transactions: 380, commission: 95000 },
  { distributor: "Kavya Reddy", volume: 3100000, transactions: 310, commission: 77500 },
  { distributor: "Others", volume: 8900000, transactions: 890, commission: 222500 },
]

const transactionTypeData = [
  { type: "Purchase", value: 45, color: "#8884d8" },
  { type: "SIP", value: 30, color: "#82ca9d" },
  { type: "Redemption", value: 15, color: "#ffc658" },
  { type: "STP", value: 7, color: "#ff7300" },
  { type: "SWP", value: 3, color: "#00ff00" },
]

const heatmapData = [
  { hour: "00", Mon: 5, Tue: 3, Wed: 8, Thu: 6, Fri: 12, Sat: 15, Sun: 8 },
  { hour: "06", Mon: 15, Tue: 18, Wed: 22, Thu: 25, Fri: 30, Sat: 35, Sun: 20 },
  { hour: "09", Mon: 45, Tue: 50, Wed: 55, Thu: 60, Fri: 65, Sat: 40, Sun: 25 },
  { hour: "12", Mon: 35, Tue: 40, Wed: 45, Thu: 50, Fri: 55, Sat: 30, Sun: 20 },
  { hour: "15", Mon: 25, Tue: 30, Wed: 35, Thu: 40, Fri: 45, Sat: 25, Sun: 15 },
  { hour: "18", Mon: 20, Tue: 25, Wed: 30, Thu: 35, Fri: 40, Sat: 20, Sun: 12 },
  { hour: "21", Mon: 10, Tue: 12, Wed: 15, Thu: 18, Fri: 20, Sat: 15, Sun: 8 },
]

export default function TransactionReportsPage() {
  const { hasPermission } = useAuth()
  const [selectedReport, setSelectedReport] = useState("volume")
  const [dateRange, setDateRange] = useState<any>(null)
  const [selectedAMC, setSelectedAMC] = useState("all")
  const [selectedDistributor, setSelectedDistributor] = useState("all")

  const exportReport = (format: string) => {
    alert(`Exporting ${selectedReport} report in ${format} format...`)
  }

  if (!hasPermission("transaction:reports")) {
    return (
      <AuthenticatedLayout
        breadcrumbs={[{ label: "Transaction Management", href: "/transactions" }, { label: "Transaction Reports" }]}
      >
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view transaction reports.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout
      breadcrumbs={[{ label: "Transaction Management", href: "/transactions" }, { label: "Transaction Reports" }]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Transaction Reports</h2>
            <p className="text-muted-foreground">Comprehensive transaction analytics and insights</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => exportReport("CSV")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport("PDF")}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Customize your report parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volume">Transaction Volume</SelectItem>
                    <SelectItem value="amc-wise">AMC-wise Analysis</SelectItem>
                    <SelectItem value="distributor-wise">Distributor Performance</SelectItem>
                    <SelectItem value="heatmap">Activity Heatmap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">AMC Filter</label>
                <Select value={selectedAMC} onValueChange={setSelectedAMC}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All AMCs</SelectItem>
                    <SelectItem value="hdfc">HDFC AMC</SelectItem>
                    <SelectItem value="icici">ICICI Prudential</SelectItem>
                    <SelectItem value="sbi">SBI MF</SelectItem>
                    <SelectItem value="axis">Axis MF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Distributor Filter</label>
                <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Distributors</SelectItem>
                    <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                    <SelectItem value="priya">Priya Sharma</SelectItem>
                    <SelectItem value="amit">Amit Patel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹25.6M</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +15.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaction Count</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,629</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +8.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Ticket Size</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹9,742</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                -2.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">97.8%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +0.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="volume" className="space-y-4">
          <TabsList>
            <TabsTrigger value="volume">Transaction Volume</TabsTrigger>
            <TabsTrigger value="amc-analysis">AMC Analysis</TabsTrigger>
            <TabsTrigger value="distributor-performance">Distributor Performance</TabsTrigger>
            <TabsTrigger value="transaction-types">Transaction Types</TabsTrigger>
            <TabsTrigger value="heatmap">Activity Heatmap</TabsTrigger>
          </TabsList>

          <TabsContent value="volume" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Transaction Volume</CardTitle>
                  <CardDescription>Transaction volume and count over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      volume: {
                        label: "Volume (₹)",
                        color: "hsl(var(--chart-1))",
                      },
                      count: {
                        label: "Count",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={transactionVolumeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="volume"
                          stroke="var(--color-volume)"
                          fill="var(--color-volume)"
                          fillOpacity={0.3}
                          name="Volume (₹)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction Count Trend</CardTitle>
                  <CardDescription>Number of transactions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Transaction Count",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={transactionVolumeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="var(--color-count)"
                          strokeWidth={2}
                          name="Transaction Count"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="amc-analysis" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>AMC-wise Transaction Volume</CardTitle>
                  <CardDescription>Transaction volume distribution by AMC</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      volume: {
                        label: "Volume (₹)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={amcWiseData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="amc" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="volume" fill="var(--color-volume)" name="Volume (₹)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AMC Performance Summary</CardTitle>
                  <CardDescription>Key metrics by AMC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {amcWiseData.map((amc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{amc.amc}</h4>
                          <p className="text-sm text-muted-foreground">{amc.transactions} transactions</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{(amc.volume / 1000000).toFixed(1)}M</div>
                          <Badge variant="secondary">{amc.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="distributor-performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Distributor Performance</CardTitle>
                <CardDescription>Transaction volume and commission by distributor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distributorWiseData.map((distributor, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{distributor.distributor}</h4>
                        <p className="text-sm text-muted-foreground">Distributor</p>
                      </div>
                      <div>
                        <div className="font-medium">₹{(distributor.volume / 1000000).toFixed(1)}M</div>
                        <p className="text-sm text-muted-foreground">Volume</p>
                      </div>
                      <div>
                        <div className="font-medium">{distributor.transactions}</div>
                        <p className="text-sm text-muted-foreground">Transactions</p>
                      </div>
                      <div>
                        <div className="font-medium">₹{distributor.commission.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">Commission</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transaction-types" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Type Distribution</CardTitle>
                  <CardDescription>Breakdown by transaction type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Percentage",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={transactionTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ type, value }) => `${type}: ${value}%`}
                        >
                          {transactionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SIP vs Lumpsum Ratio</CardTitle>
                  <CardDescription>Investment pattern analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">SIP Investments</h4>
                        <p className="text-sm text-muted-foreground">Systematic Investment Plans</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">30%</div>
                        <p className="text-sm text-muted-foreground">₹7.68M</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Lumpsum Investments</h4>
                        <p className="text-sm text-muted-foreground">One-time purchases</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">45%</div>
                        <p className="text-sm text-muted-foreground">₹11.52M</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Redemptions</h4>
                        <p className="text-sm text-muted-foreground">Fund withdrawals</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">15%</div>
                        <p className="text-sm text-muted-foreground">₹3.84M</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Activity Heatmap</CardTitle>
                <CardDescription>Transaction patterns by day and time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-8 gap-2 text-sm">
                    <div className="font-medium">Time</div>
                    <div className="font-medium text-center">Mon</div>
                    <div className="font-medium text-center">Tue</div>
                    <div className="font-medium text-center">Wed</div>
                    <div className="font-medium text-center">Thu</div>
                    <div className="font-medium text-center">Fri</div>
                    <div className="font-medium text-center">Sat</div>
                    <div className="font-medium text-center">Sun</div>
                  </div>
                  {heatmapData.map((row, index) => (
                    <div key={index} className="grid grid-cols-8 gap-2">
                      <div className="font-medium text-sm">{row.hour}:00</div>
                      <div
                        className={`text-center p-2 rounded text-xs ${row.Mon > 40 ? "bg-red-200" : row.Mon > 20 ? "bg-yellow-200" : "bg-green-200"}`}
                      >
                        {row.Mon}
                      </div>
                      <div
                        className={`text-center p-2 rounded text-xs ${row.Tue > 40 ? "bg-red-200" : row.Tue > 20 ? "bg-yellow-200" : "bg-green-200"}`}
                      >
                        {row.Tue}
                      </div>
                      <div
                        className={`text-center p-2 rounded text-xs ${row.Wed > 40 ? "bg-red-200" : row.Wed > 20 ? "bg-yellow-200" : "bg-green-200"}`}
                      >
                        {row.Wed}
                      </div>
                      <div
                        className={`text-center p-2 rounded text-xs ${row.Thu > 40 ? "bg-red-200" : row.Thu > 20 ? "bg-yellow-200" : "bg-green-200"}`}
                      >
                        {row.Thu}
                      </div>
                      <div
                        className={`text-center p-2 rounded text-xs ${row.Fri > 40 ? "bg-red-200" : row.Fri > 20 ? "bg-yellow-200" : "bg-green-200"}`}
                      >
                        {row.Fri}
                      </div>
                      <div
                        className={`text-center p-2 rounded text-xs ${row.Sat > 40 ? "bg-red-200" : row.Sat > 20 ? "bg-yellow-200" : "bg-green-200"}`}
                      >
                        {row.Sat}
                      </div>
                      <div
                        className={`text-center p-2 rounded text-xs ${row.Sun > 40 ? "bg-red-200" : row.Sun > 20 ? "bg-yellow-200" : "bg-green-200"}`}
                      >
                        {row.Sun}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-200 rounded"></div>
                      <span>Low (0-20)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                      <span>Medium (21-40)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-200 rounded"></div>
                      <span>High (41+)</span>
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
