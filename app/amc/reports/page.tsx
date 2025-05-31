"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Download, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const aumGrowthData = [
  { month: "Jan", aum: 125.4, inflow: 15.2, outflow: 8.1 },
  { month: "Feb", aum: 132.5, inflow: 18.3, outflow: 11.2 },
  { month: "Mar", aum: 145.8, inflow: 22.1, outflow: 8.8 },
  { month: "Apr", aum: 158.2, inflow: 19.7, outflow: 7.3 },
  { month: "May", aum: 167.9, inflow: 16.4, outflow: 6.7 },
  { month: "Jun", aum: 175.3, inflow: 14.8, outflow: 7.4 },
]

const navChangeData = [
  { date: "2024-01-01", fund: "Equity Fund", oldNav: 125.45, newNav: 127.32, change: 1.49 },
  { date: "2024-01-01", fund: "Debt Fund", oldNav: 45.67, newNav: 45.89, change: 0.48 },
  { date: "2024-01-01", fund: "Hybrid Fund", oldNav: 78.23, newNav: 79.01, change: 1.0 },
]

export default function AMCReportsPage() {
  const { hasPermission } = useAuth()
  const [selectedAMC, setSelectedAMC] = useState("")
  const [dateRange, setDateRange] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState("aum-growth")

  const exportReport = (format: string) => {
    alert(`Exporting report in ${format} format...`)
  }

  if (!hasPermission("amc:reports")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "AMC Reports" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view AMC reports.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "AMC Reports" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AMC Reports</h2>
            <p className="text-muted-foreground">Comprehensive reports and analytics for AMCs</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => exportReport("CSV")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport("PDF")}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Select AMC and date range for reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select AMC</label>
                <Select value={selectedAMC} onValueChange={setSelectedAMC}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AMC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hdfc">HDFC Asset Management</SelectItem>
                    <SelectItem value="icici">ICICI Prudential AMC</SelectItem>
                    <SelectItem value="sbi">SBI Mutual Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aum-growth">AUM Growth</SelectItem>
                    <SelectItem value="nav-changes">NAV Changes</SelectItem>
                    <SelectItem value="inflow-outflow">Inflow/Outflow</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
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
              <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹175.3B</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Inflow</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹14.8B</div>
              <p className="text-xs text-muted-foreground">-9.8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Outflow</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹7.4B</div>
              <p className="text-xs text-muted-foreground">+10.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Funds</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">2 new funds launched</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="aum-growth" className="space-y-4">
          <TabsList>
            <TabsTrigger value="aum-growth">AUM Growth</TabsTrigger>
            <TabsTrigger value="inflow-outflow">Inflow/Outflow</TabsTrigger>
            <TabsTrigger value="nav-changes">NAV Changes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="aum-growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AUM Growth Chart</CardTitle>
                <CardDescription>Assets Under Management growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    aum: {
                      label: "AUM (₹B)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aumGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="aum"
                        stroke="var(--color-aum)"
                        fill="var(--color-aum)"
                        fillOpacity={0.3}
                        name="AUM (₹B)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inflow-outflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Inflow vs Outflow</CardTitle>
                <CardDescription>Investment inflows and outflows comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    inflow: {
                      label: "Inflow (₹B)",
                      color: "hsl(var(--chart-2))",
                    },
                    outflow: {
                      label: "Outflow (₹B)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aumGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="inflow" fill="var(--color-inflow)" name="Inflow (₹B)" />
                      <Bar dataKey="outflow" fill="var(--color-outflow)" name="Outflow (₹B)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nav-changes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>NAV Change Logs</CardTitle>
                <CardDescription>Daily NAV changes for all funds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {navChangeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.fund}</h4>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">₹{item.oldNav}</span>
                          <span>→</span>
                          <span className="text-sm font-medium">₹{item.newNav}</span>
                          <Badge variant={item.change > 0 ? "default" : "destructive"}>
                            {item.change > 0 ? "+" : ""}
                            {item.change}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fund Performance</CardTitle>
                <CardDescription>Performance metrics for all funds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Top Performing Funds</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm">Equity Growth Fund</span>
                        <Badge className="bg-green-500">+15.2%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm">Large Cap Fund</span>
                        <Badge className="bg-green-500">+12.8%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm">Mid Cap Fund</span>
                        <Badge className="bg-green-500">+11.5%</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Underperforming Funds</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">Sector Fund</span>
                        <Badge variant="destructive">-3.2%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">Small Cap Fund</span>
                        <Badge variant="destructive">-1.8%</Badge>
                      </div>
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
