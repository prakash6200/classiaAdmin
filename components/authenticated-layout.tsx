"use client"

import React from "react"
import { useAuth } from "@/lib/api/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export function AuthenticatedLayout({ children, breadcrumbs = [] }: AuthenticatedLayoutProps) {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        {/* Animated Background for entire content area */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 50%, #000000 100%)',
            }}
          />
          
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

        {/* Header */}
        <header className="relative z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear border-b border-[#d7b56d]/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1 text-[#d7b56d] hover:bg-[#d7b56d]/10" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-[#d7b56d]/20" />

            {/* Breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="text-gray-400 hover:text-[#d7b56d]">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator className="hidden md:block text-[#d7b56d]/30" />
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href} className="text-gray-400 hover:text-[#d7b56d]">
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-[#d7b56d]">{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 px-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-gray-400 hover:text-[#d7b56d] hover:bg-[#d7b56d]/10"
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#d7b56d] text-[#00004D] border-none">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-80 bg-[#1a1a2e]/95 backdrop-blur-xl border-[#d7b56d]/20"
              >
                <div className="p-2">
                  <h4 className="font-medium mb-2 text-[#d7b56d]">Notifications</h4>
                  <div className="space-y-2">
                    <div className="p-2 rounded-md bg-[#0a0a0f]/50 border border-[#d7b56d]/10 hover:border-[#d7b56d]/30 transition-all">
                      <p className="text-sm font-medium text-white">New AMC Registration</p>
                      <p className="text-xs text-gray-400">HDFC Asset Management registered</p>
                    </div>
                    <div className="p-2 rounded-md bg-[#0a0a0f]/50 border border-[#d7b56d]/10 hover:border-[#d7b56d]/30 transition-all">
                      <p className="text-sm font-medium text-white">Large Transaction</p>
                      <p className="text-xs text-gray-400">₹50L investment detected</p>
                    </div>
                    <div className="p-2 rounded-md bg-[#0a0a0f]/50 border border-[#d7b56d]/10 hover:border-[#d7b56d]/30 transition-all">
                      <p className="text-sm font-medium text-white">Course Completion</p>
                      <p className="text-xs text-gray-400">25 certificates issued</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-[#d7b56d] hover:bg-[#d7b56d]/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-auto bg-gradient-to-br from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/50">
          {children}
        </main>

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
      </SidebarInset>
    </SidebarProvider>
  )
}