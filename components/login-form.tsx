"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/api/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [emailOrMobile, setEmailOrMobile] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(emailOrMobile, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600">
              <img src="/images/app-logo.jpeg" alt="Jockey Trading Logo" className="h-12 w-12 object-contain" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Jockey Trading Admin</CardTitle>
          <CardDescription className="text-center">Sign in to your admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrMobile">Email or Mobile</Label>
              <Input
                id="emailOrMobile"
                type="text"
                placeholder="admin@jockey.com or 6200134797"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Super Admin:</strong> superadmin@classiacapital.com
              </p>
              <p>
                <strong>Admin:</strong> admin@classiacapital.com
              </p>
              <p>
                <strong>AMC:</strong> amc1@classiacapital.com
              </p>
              <p>
                <strong>Distributor:</strong> distributor@classiacapital.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}