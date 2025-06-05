"use client"

import type * as React from "react"
import { useAuth } from "@/lib/api/auth-context"
import {
  Building2,
  Users,
  CreditCard,
  BookOpen,
  UserPlus,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  Shield,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
    permission: "dashboard:read",
  },
  {
    title: "AMC Management",
    icon: Building2,
    permission: "amc:read",
    items: [
      { title: "All AMCs", url: "/amc", permission: "amc:read" },
      { title: "Create AMC", url: "/amc/create", permission: "amc:create" },
      { title: "Commission Setup", url: "/amc/commission", permission: "amc:commission" },
      { title: "AMC Reports", url: "/amc/reports", permission: "amc:reports" },
    ],
  },
  {
    title: "Distributor Management",
    icon: Users,
    permission: "distributor:read",
    items: [
      { title: "All Distributors", url: "/distributors", permission: "distributor:read" },
      { title: "Create Distributor", url: "/distributors/create", permission: "distributor:create" },
      { title: "Commission Tracking", url: "/distributors/commission", permission: "distributor:commission" },
      { title: "Distributor Reports", url: "/distributors/reports", permission: "distributor:reports" },
    ],
  },
  {
    title: "User Management",
    icon: UserPlus,
    permission: "user:read",
    items: [
      { title: "All Users", url: "/users", permission: "user:read" },
      { title: "KYC Status", url: "/users/kyc", permission: "user:kyc" },
      { title: "Investment History", url: "/users/investments", permission: "user:investments" },
    ],
  },
  {
    title: "Transaction Management",
    icon: CreditCard,
    permission: "transaction:read",
    items: [
      { title: "All Transactions", url: "/transactions", permission: "transaction:read" },
      { title: "Pending Approvals", url: "/transactions/pending", permission: "transaction:approve" },
      { title: "Transaction Reports", url: "/transactions/reports", permission: "transaction:reports" },
    ],
  },
  {
    title: "Courses & Certification",
    icon: BookOpen,
    permission: "course:read",
    items: [
      { title: "All Courses", url: "/courses", permission: "course:read" },
      { title: "Create Course", url: "/courses/create", permission: "course:create" },
      { title: "Certificates", url: "/courses/certificates", permission: "course:certificates" },
      { title: "Progress Tracking", url: "/courses/progress", permission: "course:progress" },
    ],
  },
  {
    title: "Co-User Access",
    icon: Shield,
    permission: "couser:read",
    items: [
      { title: "All Co-Users", url: "/co-users", permission: "couser:read" },
      { title: "Create Co-User", url: "/co-users/create", permission: "couser:create" },
      { title: "Access Logs", url: "/co-users/logs", permission: "couser:logs" },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout, hasPermission } = useAuth()

  const filteredNavigation = navigationItems.filter((item) => hasPermission(item.permission))

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600">
            <img src="/images/app-logo.jpeg" alt="Jockey Trading Logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-lg">Jockey Trading</span>
            <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items
                            .filter((subItem) => hasPermission(subItem.permission))
                            .map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs capitalize">{user?.role?.replace("_", " ")}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Settings className="h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
