"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Building2, CreditCard, BookOpen } from "lucide-react"

interface OverviewCardProps {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    isPositive: boolean
  }
}

function OverviewCard({ title, value, description, icon: Icon, trend }: OverviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center pt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ml-1 ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OverviewCards() {
  const cards = [
    {
      title: "Total AUM",
      value: "₹2.4B",
      description: "Assets Under Management",
      icon: TrendingUp,
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: "Active Users",
      value: "12,543",
      description: "Registered investors",
      icon: Users,
      trend: { value: 8.2, isPositive: true },
    },
    {
      title: "AMCs",
      value: "24",
      description: "Asset Management Companies",
      icon: Building2,
      trend: { value: 2.1, isPositive: true },
    },
    {
      title: "Distributors",
      value: "156",
      description: "Active distributors",
      icon: Users,
      trend: { value: 5.4, isPositive: true },
    },
    {
      title: "Monthly Transactions",
      value: "₹45.2M",
      description: "This month's volume",
      icon: CreditCard,
      trend: { value: 15.3, isPositive: true },
    },
    {
      title: "Course Completions",
      value: "1,234",
      description: "Certificates issued",
      icon: BookOpen,
      trend: { value: 23.1, isPositive: true },
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <OverviewCard key={index} {...card} />
      ))}
    </div>
  )
}
