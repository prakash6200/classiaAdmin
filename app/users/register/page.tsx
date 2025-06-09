"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/api/auth-context"
import { useUserContext } from "@/lib/api/user-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateUserPage() {
  const router = useRouter()
  const { hasPermission, user } = useAuth()
  const { createUser } = useUserContext()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name) return "Name is required"
    if (!formData.email.includes("@")) return "Invalid email format"
    if (!/^\d{10}$/.test(formData.mobile)) return "Mobile must be 10 digits"
    if (formData.password.length < 8) return "Password must be at least 8 characters"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsSubmitting(false)
      return
    }

    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      })

      if (isClient) {
        router.push("/users")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while creating user"
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "User Management", href: "/users" }, { label: "Create User" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we authenticate your session.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!hasPermission("user:create")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "User Management", href: "/users" }, { label: "Create User" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to create users.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "User Management", href: "/users" }, { label: "Create User" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create New User</h2>
            <p className="text-muted-foreground">Register a new investor</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Enter the details of the new investor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="e.g., user@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="e.g., 9876543210"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter password (min 8 characters)"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => isClient && router.push("/users")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating User..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}