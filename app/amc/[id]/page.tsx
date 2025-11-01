"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft } from "lucide-react"

interface AMC {
  id: string
  name: string
  email: string
  mobile: string
  logo?: string
  status: "active" | "inactive" | "pending"
  aum: number
  distributors: number
  funds: number
  registrationDate: string
  panNumber: string
  address: string
  city: string
  state: string
  pinCode: string
  contactPersonName: string
  contactPerDesignation: string
  isMobileVerified: boolean
  isEmailVerified: boolean
  isBlocked: boolean
  isDeleted: boolean
  fundName: string
  equityPer: number
  debtPer: number
  cashSplit: number
}

export default function AMCDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const { hasPermission, user } = useAuth()
  const [amc, setAmc] = useState<AMC | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && id) {
      const fetchAMC = async () => {
        setLoading(true)
        setError(null)

        try {
          const token = localStorage.getItem("jockey-token")
          if (!token) {
            throw new Error("No authentication token found")
          }

          const response = await fetch(`https://.classiacapital.com/amc/list?page=1&limit=1&id=${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          const result = await response.json()
          console.log("AMC Details API Response:", result)

          if (!response.ok || !result.status || !result.data.users[0]) {
            throw new Error(result.message || "Failed to fetch AMC details")
          }

          const apiUser = result.data.users[0]
          const mappedAMC: AMC = {
            id: apiUser.ID.toString(),
            name: apiUser.Name,
            email: apiUser.Email,
            mobile: apiUser.Mobile,
            logo: apiUser.ProfileImage || "",
            status: apiUser.IsBlocked
              ? "inactive"
              : apiUser.UserKYC > 0
              ? "active"
              : "pending",
            aum: apiUser.MainBalance || 0,
            distributors: 0,
            funds: 0,
            registrationDate: apiUser.CreatedAt.split("T")[0],
            panNumber: apiUser.PanNumber || "",
            address: apiUser.Address || "",
            city: apiUser.City || "",
            state: apiUser.State || "",
            pinCode: apiUser.PinCode || "",
            contactPersonName: apiUser.ContactPersonName || "",
            contactPerDesignation: apiUser.ContactPerDesignation || "",
            isMobileVerified: apiUser.IsMobileVerified || false,
            isEmailVerified: apiUser.IsEmailVerified || false,
            isBlocked: apiUser.IsBlocked || false,
            isDeleted: apiUser.IsDeleted || false,
            fundName: apiUser.FundName || "",
            equityPer: apiUser.EquityPer || 0,
            debtPer: apiUser.DebtPer || 0,
            cashSplit: apiUser.CashSplit || 0,
          }

          setAmc(mappedAMC)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching AMC details"
          setError(errorMessage)
          console.error("AMC Details Fetch Error:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchAMC()
    }
  }, [user, id])

  if (!user) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "AMC Details" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we authenticate your session.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!hasPermission("amc:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "AMC Details" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view AMC details.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "AMC Details" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AMC Details</h2>
            <p className="text-muted-foreground">Detailed information for {amc?.name || "AMC"}</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/amc")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to AMC List
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center text-muted-foreground">Loading AMC details...</div>
        ) : !amc ? (
          <div className="text-center text-muted-foreground">AMC not found</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Name:</strong> {amc.name}
                </div>
                <div>
                  <strong>Email:</strong> {amc.email}
                </div>
                <div>
                  <strong>Mobile:</strong> {amc.mobile}
                </div>
                <div>
                  <strong>PAN Number:</strong> {amc.panNumber || "N/A"}
                </div>
                <div>
                  <strong>Status:</strong> {amc.status}
                </div>
                <div>
                  <strong>AUM:</strong> ₹{amc.aum.toLocaleString("en-IN")}
                </div>
                <div>
                  <strong>Registration Date:</strong> {new Date(amc.registrationDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Contact Person:</strong> {amc.contactPersonName || "N/A"}
                </div>
                <div>
                  <strong>Designation:</strong> {amc.contactPerDesignation || "N/A"}
                </div>
                <div>
                  <strong>Email Verified:</strong> {amc.isEmailVerified ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Mobile Verified:</strong> {amc.isMobileVerified ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Blocked:</strong> {amc.isBlocked ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Deleted:</strong> {amc.isDeleted ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Address:</strong> {amc.address || "N/A"}
                </div>
                <div>
                  <strong>City:</strong> {amc.city || "N/A"}
                </div>
                <div>
                  <strong>State:</strong> {amc.state || "N/A"}
                </div>
                <div>
                  <strong>Pincode:</strong> {amc.pinCode || "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fund Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Fund Name:</strong> {amc.fundName || "N/A"}
                </div>
                <div>
                  <strong>Equity Percentage:</strong> {amc.equityPer}%
                </div>
                <div>
                  <strong>Debt Percentage:</strong> {amc.debtPer}%
                </div>
                <div>
                  <strong>Cash Split:</strong> {amc.cashSplit}%
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}