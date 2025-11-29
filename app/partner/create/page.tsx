"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/api/auth-context"
import { useAMCContext } from "@/lib/api/amc-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateAMCPage() {
  const router = useRouter()
  const { hasPermission, user } = useAuth()
  const { createAMC } = useAMCContext()
  const [formData, setFormData] = useState({
    name: "",
    panNumber: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    contactPersonName: "",
    contactPerDesignation: "",
    password: "",
    equityPer: "",
    debtPer: "",
    cashSplit: "",
    fundName: "",
  })
  const [documents, setDocuments] = useState({
    logo: null as File | null,
    sebiLicense: null as File | null,
    amlCertificate: null as File | null,
    incorporationCert: null as File | null,
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

  const handleFileUpload = (field: string, file: File) => {
    setDocuments((prev) => ({ ...prev, [field]: file }))
    console.log(`Uploaded ${field}:`, file.name)
  }

  const validateForm = () => {
    if (!formData.name) return "AMC Name is required"
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(formData.panNumber)) return "Invalid PAN format (e.g., ABCDE1234F)"
    if (!formData.email.includes("@")) return "Invalid email format"
    if (!/^\d{10}$/.test(formData.mobile)) return "Mobile must be 10 digits"
    if (!formData.address) return "Address is required"
    if (!formData.city) return "City is required"
    if (!formData.state) return "State is required"
    if (!/^\d{6}$/.test(formData.pinCode)) return "Pincode must be 6 digits"
    if (!formData.contactPersonName) return "Contact Person Name is required"
    if (!formData.contactPerDesignation) return "Contact Person Designation is required"
    if (formData.password.length < 8) return "Password must be at least 8 characters"
    if (!/^\d+$/.test(formData.equityPer) || Number(formData.equityPer) < 0 || Number(formData.equityPer) > 100)
      return "Equity Percentage must be a number between 0 and 100"
    if (!/^\d+$/.test(formData.debtPer) || Number(formData.debtPer) < 0 || Number(formData.debtPer) > 100)
      return "Debt Percentage must be a number between 0 and 100"
    if (!/^\d+$/.test(formData.cashSplit) || Number(formData.cashSplit) < 0 || Number(formData.cashSplit) > 100)
      return "Cash Split must be a number between 0 and 100"
    if (!formData.fundName) return "Fund Name is required"
    if (!documents.sebiLicense) return "SEBI License is required"
    if (!documents.amlCertificate) return "AML Certificate is required"
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
      await createAMC({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        contactPerDesignation: formData.contactPerDesignation,
        contactPersonName: formData.contactPersonName,
        panNumber: formData.panNumber,
        pinCode: formData.pinCode,
        state: formData.state,
        equityPer: Number(formData.equityPer),
        debtPer: Number(formData.debtPer),
        cashSplit: Number(formData.cashSplit),
        fundName: formData.fundName,
      })

      if (documents.logo || documents.sebiLicense || documents.amlCertificate || documents.incorporationCert) {
        const token = localStorage.getItem("jockey-token")
        console.log("Simulating document upload to https://goapi.classiacapital.com/admin/upload-document", {
          token,
          files: Object.entries(documents)
            .filter(([_, file]) => file)
            .map(([field, file]) => ({ field, name: file!.name })),
        })
      }

      if (isClient) {
        router.push("/amc")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while creating AMC"
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "Create AMC" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we authenticate your session.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!hasPermission("amc:create")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "Create AMC" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to create AMCs.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "Create AMC" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Create New AMC</h2>
            <p className="text-white/70">Register a new Asset Management Company</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details of the Partner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">RIA Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., HDFC Asset Management"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange("panNumber", e.target.value)}
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contact@amc.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Phone Number *</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      placeholder="9876543210"
                      required
                    />
                  </div>
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

            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Registered office address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter complete address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Mumbai"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select onValueChange={(value) => handleInputChange("state", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinCode">Pincode *</Label>
                  <Input
                    id="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => handleInputChange("pinCode", e.target.value)}
                    placeholder="400001"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Person</CardTitle>
                <CardDescription>Primary contact for the AMC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                  <Input
                    id="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerDesignation">Designation *</Label>
                  <Input
                    id="contactPerDesignation"
                    value={formData.contactPerDesignation}
                    onChange={(e) => handleInputChange("contactPerDesignation", e.target.value)}
                    placeholder="Manager"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fund Information</CardTitle>
                <CardDescription>Details about the fund</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fundName">Fund Name *</Label>
                  <Input
                    id="fundName"
                    value={formData.fundName}
                    onChange={(e) => handleInputChange("fundName", e.target.value)}
                    placeholder="e.g., HDFC Capital Fund"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equityPer">Equity Percentage *</Label>
                    <Input
                      id="equityPer"
                      type="number"
                      value={formData.equityPer}
                      onChange={(e) => handleInputChange("equityPer", e.target.value)}
                      placeholder="20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="debtPer">Debt Percentage *</Label>
                    <Input
                      id="debtPer"
                      type="number"
                      value={formData.debtPer}
                      onChange={(e) => handleInputChange("debtPer", e.target.value)}
                      placeholder="30"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cashSplit">Cash Split *</Label>
                    <Input
                      id="cashSplit"
                      type="number"
                      value={formData.cashSplit}
                      onChange={(e) => handleInputChange("cashSplit", e.target.value)}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>Upload required compliance documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>AMC Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {documents.logo ? documents.logo.name : "Click to upload logo"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload("logo", e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SEBI License *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                    <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {documents.sebiLicense ? documents.sebiLicense.name : "Upload SEBI license document"}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload("sebiLicense", e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>AML Certificate *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                    <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {documents.amlCertificate ? documents.amlCertificate.name : "Upload AML certificate"}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload("amlCertificate", e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Incorporation Certificate</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                    <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {documents.incorporationCert ? documents.incorporationCert.name : "Upload incorporation certificate"}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload("incorporationCert", e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => isClient && router.push("/amc")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating AMC..." : "Create RIA"}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}