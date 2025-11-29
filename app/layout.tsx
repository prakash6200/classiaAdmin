import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/api/auth-context"
import { UserProvider } from "@/lib/api/user-context"
import { AMCProvider } from "@/lib/api/amc-context"
import { TransactionProvider } from "@/lib/api/transaction-context"
import { SupportProvider } from "@/lib/api/support-context"
import { CourseProvider } from "@/lib/api/course-context"
import { BasketProvider } from "@/lib/api/basket-context" // ← NEW
import { ContactProvider } from "@/lib/api/contact-context"
import { ExploreProvider } from "@/lib/api/explore-context"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <AMCProvider>
              <TransactionProvider>
                <SupportProvider>
                  <CourseProvider>
                    <BasketProvider>
                      <ContactProvider>
                                   <ExploreProvider>
                          {children}
                        </ExploreProvider>

            </ContactProvider>
                    </BasketProvider>
                  </CourseProvider>
                </SupportProvider>
              </TransactionProvider>
            </AMCProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}