import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/api/auth-context"
import { UserProvider } from "@/lib/api/user-context"
import { AMCProvider } from "@/lib/api/amc-context"
import { TransactionProvider } from "@/lib/api/transaction-context"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <AMCProvider>
              <TransactionProvider>{children}</TransactionProvider>
            </AMCProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}