"use client"

import { useAuth } from "@/lib/auth-context"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Download, RefreshCw } from "lucide-react"
import { AuthenticatedLayout } from "@/components/authenticated-layout"

export default function DashboardPage() {
  const { user } = useAuth()

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case "super_admin":
      case "admin":
        return (
          <>
            <OverviewCards />
            <AnalyticsCharts />
          </>
        )
      case "amc":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Your AMC Performance</CardTitle>
                <CardDescription>Current month statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹125.4M</div>
                <p className="text-xs text-muted-foreground">Total AUM</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Distributors</CardTitle>
                <CardDescription>Distributors selling your funds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Active this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Commission Paid</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹2.4M</div>
                <p className="text-xs text-muted-foreground">To distributors</p>
              </CardContent>
            </Card>
          </div>
        )
      case "distributor":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Your Earnings</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹45,230</div>
                <p className="text-xs text-muted-foreground">Commission earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Clients</CardTitle>
                <CardDescription>Investors under you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">Active investors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>Certification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3/5</div>
                <p className="text-xs text-muted-foreground">Courses completed</p>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Overview" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {getRoleSpecificContent()}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New AMC Registration</p>
                    <p className="text-sm text-muted-foreground">HDFC Asset Management registered</p>
                  </div>
                  <Badge variant="secondary">2 hours ago</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Large Transaction Alert</p>
                    <p className="text-sm text-muted-foreground">₹50L investment in Equity Fund</p>
                  </div>
                  <Badge variant="secondary">4 hours ago</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Course Completion</p>
                    <p className="text-sm text-muted-foreground">25 distributors completed MF Basics</p>
                  </div>
                  <Badge variant="secondary">1 day ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
