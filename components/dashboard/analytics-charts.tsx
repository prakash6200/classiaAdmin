"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const investmentData = [
  { month: "Jan", amount: 2400, transactions: 240 },
  { month: "Feb", amount: 1398, transactions: 139 },
  { month: "Mar", amount: 9800, transactions: 980 },
  { month: "Apr", amount: 3908, transactions: 390 },
  { month: "May", amount: 4800, transactions: 480 },
  { month: "Jun", amount: 3800, transactions: 380 },
]

const commissionData = [
  { month: "Jan", amc: 45000, distributor: 32000 },
  { month: "Feb", amc: 52000, distributor: 38000 },
  { month: "Mar", amc: 48000, distributor: 35000 },
  { month: "Apr", amc: 61000, distributor: 42000 },
  { month: "May", amc: 55000, distributor: 39000 },
  { month: "Jun", amc: 67000, distributor: 45000 },
]

export function AnalyticsCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Investment Trends</CardTitle>
          <CardDescription>Monthly investment volume and transaction count</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              amount: {
                label: "Investment Amount (₹)",
                color: "hsl(var(--chart-1))",
              },
              transactions: {
                label: "Transactions",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  name="Investment Amount"
                />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="var(--color-transactions)"
                  strokeWidth={2}
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Payouts</CardTitle>
          <CardDescription>Monthly commission distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              amc: {
                label: "AMC Commission",
                color: "hsl(var(--chart-3))",
              },
              distributor: {
                label: "Distributor Commission",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amc" fill="var(--color-amc)" name="AMC Commission" />
                <Bar dataKey="distributor" fill="var(--color-distributor)" name="Distributor Commission" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
