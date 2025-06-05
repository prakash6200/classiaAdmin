"use client"

import { useAuth } from "@/lib/api/auth-context"
import { LoginForm } from "@/components/login-form"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { useEffect } from "react"

export default function HomePage() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Redirect to dashboard if user is logged in
      window.location.href = "/dashboard"
    }
  }, [user])

  if (!user) {
    return <LoginForm />
  }

  return (
    <AuthenticatedLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Redirecting to Dashboard...</h2>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}