"use client"

import React from "react"
import { useAuth } from "@/lib/api/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Download, RefreshCw, TrendingUp, Users, Building2, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import type { LucideIcon } from "lucide-react"

// Stats Card Component with proper TypeScript types
interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend?: 'up' | 'down'
  trendValue?: string
}

function StatsCard({ title, value, description, icon: Icon, trend, trendValue }: StatsCardProps): React.JSX.Element {
  const isPositive = trend === 'up'
  
  return (
    <Card className="bg-[#1a1a2e]/80 backdrop-blur-xl border-[#d7b56d]/20 hover:border-[#d7b56d]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#d7b56d]/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-[#d7b56d]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-400">{description}</p>
          {trendValue && (
            <div className={`flex items-center text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case "super_admin":
      case "admin":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Revenue"
              value="₹245.8M"
              description="Total AUM"
              icon={TrendingUp}
              trend="up"
              trendValue="+12.5%"
            />
            <StatsCard
              title="Active AMCs"
              value="23"
              description="Registered AMCs"
              icon={Building2}
              trend="up"
              trendValue="+2"
            />
            <StatsCard
              title="Distributors"
              value="156"
              description="Active distributors"
              icon={Users}
              trend="up"
              trendValue="+8.3%"
            />
            <StatsCard
              title="Transactions"
              value="2,431"
              description="This month"
              icon={CreditCard}
              trend="up"
              trendValue="+15.2%"
            />
          </div>
        )
      case "amc":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Your AMC Performance"
              value="₹125.4M"
              description="Total AUM"
              icon={TrendingUp}
              trend="up"
              trendValue="+8.2%"
            />
            <StatsCard
              title="Active Distributors"
              value="23"
              description="Active this month"
              icon={Users}
            />
            <StatsCard
              title="Commission Paid"
              value="₹2.4M"
              description="To distributors"
              icon={CreditCard}
            />
          </div>
        )
      case "distributor":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Your Earnings"
              value="₹45,230"
              description="Commission earned"
              icon={TrendingUp}
              trend="up"
              trendValue="+5.2%"
            />
            <StatsCard
              title="Active Clients"
              value="156"
              description="Active investors"
              icon={Users}
            />
            <StatsCard
              title="Course Progress"
              value="3/5"
              description="Courses completed"
              icon={Building2}
            />
          </div>
        )
      case "user":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Your Balance"
              value={`₹${user?.mainBalance?.toLocaleString() || '45,000'}`}
              description="Available funds"
              icon={CreditCard}
            />
            <StatsCard
              title="Recent Transactions"
              value="5"
              description="Transactions this month"
              icon={TrendingUp}
            />
            <StatsCard
              title="Portfolio Performance"
              value="+12.5%"
              description="Annualized return"
              icon={TrendingUp}
              trend="up"
              trendValue="+2.3%"
            />
          </div>
        )
      default:
        return (
          <Card className="bg-[#1a1a2e]/80 backdrop-blur-xl border-[#d7b56d]/20">
            <CardHeader>
              <CardTitle className="text-[#d7b56d]">Welcome to Your Dashboard</CardTitle>
              <CardDescription className="text-gray-400">No specific content available for your role.</CardDescription>
            </CardHeader>
          </Card>
        )
    }
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Overview" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Animated Gradient Orbs */}
          <div 
            className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #d7b56d 0%, #00004D 40%, transparent 70%)',
              animation: 'float-diagonal 25s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #00004D 0%, #d7b56d 40%, transparent 70%)',
              animation: 'float-diagonal 30s ease-in-out infinite reverse'
            }}
          />
          
          {/* Animated Grid */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(215,181,109,0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(215,181,109,0.4) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              animation: 'grid-flow 25s linear infinite',
              maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
            }}
          />
          
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                background: i % 2 === 0 ? '#d7b56d' : '#00004D',
                boxShadow: `0 0 ${10 + Math.random() * 20}px ${i % 2 === 0 ? '#d7b56d' : '#00004D'}`,
                animation: `float-orb ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        {/* Content - with relative positioning to appear above background */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#d7b56d] mb-1">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-400">Here's what's happening with your account today.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-[#1a1a2e]/50 border-[#d7b56d]/30 text-gray-300 hover:bg-[#d7b56d]/10 hover:text-[#d7b56d] hover:border-[#d7b56d]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-[#1a1a2e]/50 border-[#d7b56d]/30 text-gray-300 hover:bg-[#d7b56d]/10 hover:text-[#d7b56d] hover:border-[#d7b56d]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-[#1a1a2e]/50 border-[#d7b56d]/30 text-gray-300 hover:bg-[#d7b56d]/10 hover:text-[#d7b56d] hover:border-[#d7b56d]"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            {getRoleSpecificContent()}

            {/* Recent Activity */}
            <Card className="bg-[#1a1a2e]/80 backdrop-blur-xl border-[#d7b56d]/20">
              <CardHeader>
                <CardTitle className="text-[#d7b56d]">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f]/50 border border-[#d7b56d]/10 hover:border-[#d7b56d]/30 transition-all">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">New AMC Registration</p>
                      <p className="text-sm text-gray-400">HDFC Asset Management registered</p>
                    </div>
                    <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] border-[#d7b56d]/30">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f]/50 border border-[#d7b56d]/10 hover:border-[#d7b56d]/30 transition-all">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">Large Transaction Alert</p>
                      <p className="text-sm text-gray-400">₹50L investment in Equity Fund</p>
                    </div>
                    <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] border-[#d7b56d]/30">4 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f]/50 border border-[#d7b56d]/10 hover:border-[#d7b56d]/30 transition-all">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">Course Completion</p>
                      <p className="text-sm text-gray-400">25 distributors completed MF Basics</p>
                    </div>
                    <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] border-[#d7b56d]/30">1 day ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <style jsx>{`
          @keyframes float-diagonal {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(100px, -100px) scale(1.1);
            }
            66% {
              transform: translate(-50px, 100px) scale(0.9);
            }
          }
          
          @keyframes grid-flow {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(60px, 60px);
            }
          }
          
          @keyframes float-orb {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.3;
            }
            25% {
              transform: translate(30px, -30px);
              opacity: 0.6;
            }
            50% {
              transform: translate(-20px, 40px);
              opacity: 0.4;
            }
            75% {
              transform: translate(40px, 20px);
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    </AuthenticatedLayout>
  )
}