"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
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
  Sparkles,
  ShoppingBasket,
  Headphones,
  Phone,
  Cog,
  TrendingUp,
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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/api/auth-context"

const navigationItems = [
  // ── ALL NAVIGATION ITEMS IN ONE LIST ───────────────────────────────────

    {
    title: "Explore",
    icon: Sparkles,
    url: "/explore",
    permission: "explore:read"
  },

  { title: "Dashboard", icon: Home, url: "/dashboard", permission: "dashboard:read" },
  
  {
    title: "Partner Management",
    icon: Building2,
    permission: "amc:read",
    items: [
      { title: "All Partner", url: "/partner", permission: "amc:read" },
      { title: "Create Partner ", url: "/partner/create", permission: "amc:create" },
      { title: "Commission Setup", url: "/partner/commission", permission: "amc:commission" },
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
    ],
  },
  
  {
    title: "User Management",
    icon: UserPlus,
    permission: "user:read",
    items: [
      { title: "All Users", url: "/users", permission: "user:read" },
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
    title: "Courses",
    icon: BookOpen,
    permission: "course:read",
    items: [
      { title: "All Courses", url: "/courses", permission: "course:read" },
    ],
  },
  
  {
    title: "Basket Management",
    icon: ShoppingBasket,
    permission: "basket:read",
    items: [
      { title: "All Baskets", url: "/baskets", permission: "basket:read" },
      { title: "Stock Management", url: "/baskets/stocks", permission: "basket:stocks" },
    ],
  },

  
    {
    title: "Mutual Funds",
    icon: TrendingUp,
    permission: "mf:read",
    items: [
      { title: "All Funds", url: "/mutual-funds", permission: "mf:read" },
    ],
  },
  
  {
    title: "Support",
    icon: Headphones,
    permission: "support:read",
    items: [
      { title: "Ticket", url: "/support", permission: "support:read" },
    ],
  },

  {
    title: "Contact",
    icon: Phone,
    permission: "contact:read",
    items: [
      { title: "Contact List", url: "/contact", permission: "contact:read" },
    ],
  },


  {
  title: "Settings",
  icon: Settings,
  permission: "settings:read",
  items: [
    { title: "App Management", url: "/settings", permission: "settings:read" },
  ],
},
]






export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, hasPermission } = useAuth()

  const filteredNavigation = navigationItems.filter((item) => hasPermission(item.permission))

  // Handle logout with redirect
  const handleLogout = async () => {
    await logout()
    router.push('/') // Redirect to home/login page
  }

  return (
    <Sidebar
      variant="inset"
      className="border-r border-[#d7b56d]/10 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] backdrop-blur-2xl"
      {...props}
    >
      {/* ── HEADER ── */}
      <SidebarHeader className="border-b border-[#d7b56d]/10 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] backdrop-blur-2xl">
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="relative group">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#d7b56d] to-[#b8955d] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f0f1a] border border-[#d7b56d]/30 overflow-hidden">
              <div className="text-xl font-bold text-[#d7b56d] drop-shadow-lg">CC</div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#d7b56d] via-[#c9a860] to-[#d7b56d] bg-clip-text text-transparent">
              Classia Capital
            </h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>

      {/* ── SINGLE SECTION: ALL NAVIGATION ── */}
      <SidebarContent className=" py-3 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] backdrop-blur-2xl">
        <SidebarGroup>
         
          <SidebarGroupContent className="mt-3 space-y-1">
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.url
                const hasActiveChild = item.items?.some((sub) => pathname === sub.url)

                return (
                  <SidebarMenuItem key={item.title}>
                    {item.items ? (
                      <Collapsible defaultOpen={hasActiveChild} className="group/collapsible">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`
                              w-full justify-between rounded-xl  py-3 h-[50px] text-left text-sm font-medium
                              transition-all duration-200 group
                              hover:bg-[#1a1a2e] hover:text-[#d7b56d]
                              data-[state=open]:bg-[#1a1a2e] data-[state=open]:text-[#d7b56d]
                              ${hasActiveChild ? "bg-[#1a1a2e] text-[#d7b56d]" : "text-gray-300"}
                            `}
                          >
                            <div className="flex items-center gap-3 py-4">
                              <div className="relative">
                                <item.icon className="h-5 w-5 transition-colors" />
                                <div className=" inset-0 blur-xl bg-[#d7b56d] opacity-0 group-hover:opacity-30 transition-opacity" />
                              </div>
                              <span>{item.title}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-1 space-y-1 border-l-2 border-[#d7b56d]/20 ">
                            {item.items
                              .filter((sub) => hasPermission(sub.permission))
                              .map((subItem) => {
                                const isSubActive = pathname === subItem.url
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <a
                                        href={subItem.url}
                                        className={`
                                          block rounded-lg  h-[40px] text-sm font-medium transition-all duration-200
                                          hover:bg-[#1a1a2e]/70 hover:text-[#d7b56d] 
                                          ${isSubActive ? "bg-[#1a1a2e] text-white" : "text-gray-100"}
                                        `}
                                      >
                                        {subItem.title}
                                      </a>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`
                            flex items-center rounded-xl  py-1 text-sm font-medium transition-all group
                            hover:bg-[#1a1a2e] hover:text-[#d7b56d]
                            ${isActive ? "bg-gradient-to-r from-[#d7b56d]/20 to-[#c9a860]/10 text-[#d7b56d] border-l-4 border-[#d7b56d]" : "text-gray-300"}
                          `}
                        >
                          <div className="relative">
                            <item.icon className="h-5 w-5 transition-colors" />
                            <div className="absolute inset-0 blur-xl bg-[#d7b56d] opacity-0 group-hover:opacity-40 transition-opacity" />
                          </div>
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── FOOTER (Logout with Redirect!) ── */}
      <SidebarFooter className="border-t border-[#d7b56d]/10 bg-gradient-to-t from-[#0a0a0f] to-[#0f0f1a]/50 backdrop-blur-md">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-start rounded-xl h-full hover:bg-[#1a1a2e] data-[state=open]:bg-[#1a1a2e] transition-all duration-200"
                >
                  <Avatar className="h-8 w-8 rounded-full transition-all">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[#d7b56d] to-[#b8955d] text-[#00004D] font-bold text-lg">
                      {user?.name?.[0] ?? "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 text-left">
                    <p className="truncate text-sm font-semibold text-white">{user?.name ?? "Guest"}</p>
                    <Badge
                      variant="secondary"
                      className="h-5 px-2 text-xs font-medium bg-[#d7b56d]/20 text-[#d7b56d] border border-[#d7b56d]/40"
                    >
                      {user?.role?.replace("_", " ") ?? "User"}
                    </Badge>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-64 h-22 rounded-xl justify-between bg-[#0f0f1a]/95 backdrop-blur-xl border border-[#d7b56d]/20 shadow-2xl flex flex-col"
                side="top"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem className="rounded-lg py-2 text-white hover:bg-[#1a1a2e] hover:text-[#d7b56d] transition-all">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-all cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar