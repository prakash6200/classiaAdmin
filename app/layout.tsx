import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/api/auth-context"
import { UserProvider } from "@/lib/api/user-context"
import { AMCProvider } from "@/lib/api/amc-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jockey Trading Admin",
  description: "Mutual Fund Distribution Admin Panel",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <UserProvider>
              <AMCProvider>{children}</AMCProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}