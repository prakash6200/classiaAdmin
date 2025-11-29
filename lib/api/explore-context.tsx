// lib/api/explore-context.tsx
"use client"

import { createContext, useContext, useState } from "react"
import { Globe, Smartphone, Apple } from "lucide-react"

export interface Platform {
  type: "web" | "android" | "ios"
  name: string
  url: string
  icon: any
  available: boolean
}

export interface Product {
  id: number
  name: string
  displayName: string
  description: string
  category: string
  features: string[]
  platforms: Platform[]
  color: string
  bgColor: string
  downloads?: string
  rating?: number
  lastUpdated?: string
}

interface ExploreContextType {
  products: Product[]
  getProductById: (id: number) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined)

// Static product data - can be moved to API later
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "classia-capital",
    displayName: "Classia Capital",
    description: "Complete investment platform for smart investors. Trade, invest, and grow your wealth with confidence. Access mutual funds, basket trading, educational courses, and 24/7 support.",
    category: "Investment Platform",
    features: [
      "Real-time portfolio tracking",
      "Mutual fund investments",
      "Basket trading strategies",
      "Educational courses & resources",
      "24/7 customer support",
      "Secure transactions",
      "Performance analytics",
      "Tax planning tools"
    ],
    platforms: [
      {
        type: "web",
        name: "Website",
        url: "https://classiacapital.com/",
        icon: Globe,
        available: true
      },
      {
        type: "android",
        name: "Play Store",
        url: "https://play.google.com/store/apps/details?id=com.classia.capital",
        icon: Smartphone,
        available: true
      },
      {
        type: "ios",
        name: "App Store",
        url: "https://apps.apple.com/in/app/classia-capital/id6748376094",
        icon: Apple,
        available: true
      }
    ],
    color: "from-[#d7b56d] to-[#c9a860]",
    bgColor: "bg-gradient-to-br from-[#d7b56d]/10 to-[#c9a860]/5",
    downloads: "10K+",
    rating: 4.5
  },
  {
    id: 2,
    name: "classia-distributor",
    displayName: "Classia Distributor",
    description: "Empower your distribution network. Manage clients, track commissions, and grow your business seamlessly. Perfect for financial distributors and advisors.",
    category: "Distribution Network",
    features: [
      "Client management system",
      "Commission tracking",
      "Real-time analytics dashboard",
      "Team collaboration tools",
      "Performance reports",
      "Client onboarding",
      "Document management",
      "Revenue insights"
    ],
    platforms: [
      {
        type: "web",
        name: "Website",
        url: "https://classiacapital.com/",
        icon: Globe,
        available: false
      },
      {
        type: "android",
        name: "Play Store",
        url: "https://play.google.com/store/apps/details?id=com.classia.distributor",
        icon: Smartphone,
        available: true
      },
      {
        type: "ios",
        name: "App Store",
        url: "#",
        icon: Apple,
        available: false
      }
    ],
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
    downloads: "5K+",
    rating: 4.3
  },
  {
    id: 3,
    name: "classia-partner",
    displayName: "Classia Partner",
    description: "Partner management platform for AMCs. Streamline operations, manage partnerships, and drive growth. Comprehensive solution for asset management companies.",
    category: "AMC Management",
    features: [
      "Partner onboarding & KYC",
      "Transaction monitoring",
      "Commission setup & automation",
      "Analytics dashboard",
      "Compliance tracking",
      "Document verification",
      "Multi-level hierarchy",
      "Automated reporting"
    ],
    platforms: [
      {
        type: "web",
        name: "Website",
        url: "https://classiacapital.com/",
        icon: Globe,
        available: false
      },
      {
        type: "android",
        name: "Play Store",
        url: "https://play.google.com/store/apps/details?id=com.classia.jt",
        icon: Smartphone,
        available: true
      },
      {
        type: "ios",
        name: "App Store",
        url: "https://apps.apple.com/in/app/classia-amc/id6748380061",
        icon: Apple,
        available: true
      }
    ],
    color: "from-emerald-400 to-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
    downloads: "3K+",
    rating: 4.6
  }
]

export function ExploreProvider({ children }: { children: React.ReactNode }) {
  const [products] = useState<Product[]>(PRODUCTS)

  const getProductById = (id: number) => {
    return products.find((p) => p.id === id)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter((p) => p.category === category)
  }

  return (
    <ExploreContext.Provider
      value={{
        products,
        getProductById,
        getProductsByCategory,
      }}
    >
      {children}
    </ExploreContext.Provider>
  )
}

export const useExploreContext = () => {
  const ctx = useContext(ExploreContext)
  if (!ctx) throw new Error("useExploreContext must be used within an ExploreProvider")
  return ctx
}