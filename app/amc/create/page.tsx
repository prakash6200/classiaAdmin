"use client"

import type React from "react"
import { useState } from "react"
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
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function CreateAMCPage() {
  const router = useRouter()
  const { hasPermission } = useAuth()
  const { createAMC } = useAMCContext()
  const [formData, setFormData] = useState({
    name: "",
    pan: "",
    gstin: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactPerson: "",
    designation: "",
    password: "",
  })
  const [documents, setDocuments] = useState({
    logo: null as File | null,
    sebiLicense: null as File | null,
    amlCertificate: null as File | null,
    incorporationCert: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState({
    pan: "pending",
    email: "pending",
    gstin: "pending",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, file: File) => {
    setDocuments((prev) => ({ ...prev, [field]: file }))
    console.log(`Uploaded ${field}:`, file.name) // Log for debugging
  }

  const verifyPAN = async () => {
    // Mock PAN verification
    setVerificationStatus((prev) => ({ ...prev, pan: "verified" }))
  }

  const verifyEmail = async () => {
    // Mock email verification
    setVerificationStatus((prev) => ({ ...prev, email: "verified" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Call createAMC with required fields
      await createAMC({
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        password: formData.password,
      })

      // Log additional fields and documents (for future API integration)
      console.log("Additional fields not sent to API:", {
        pan: formData.pan,
        gstin: formData.gstin,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        contactPerson: formData.contactPerson,
        designation: formData.designation,
      })
      console.log("Documents not sent to API:", documents)

      // Mock file upload (await real API)
      if (documents.logo || documents.sebiLicense || documents.amlCertificate || documents.incorporationCert) {
        console.log("Pending file upload to https://api.classiacapital.com/admin/upload-document")
      }

      // Redirect to /amc
      router.push("/amc")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while creating AMC"
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
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
            <h2 className="text-3xl font-bold tracking-tight">Create New AMC</h2>
            <p className="text-muted-foreground">Register a new Asset Management Company</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details of the AMC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">AMC Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., HDFC Asset Management"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="pan"
                        value={formData.pan}
                        onChange={(e) => handleInputChange("pan", e.target.value)}
                        placeholder="ABCDE1234F"
                        required
                      />
                      <Button type="button" variant="outline" onClick={verifyPAN}>
                        {verificationStatus.pan === "verified" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange("gstin", e.target.value)}
                      placeholder="22ABCDE1234F1Z5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="contact@amc.com"
                        required
                      />
                      <Button type="button" variant="outline" onClick={verifyEmail}>
                        {verificationStatus.email === "verified" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
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
                    placeholder="Enter password"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
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
                    <Select onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="400001"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Person */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Person</CardTitle>
                <CardDescription>Primary contact for the AMC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person Name *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    placeholder="Chief Executive Officer"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
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

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  {verificationStatus.pan === "verified" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="text-sm">PAN Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  {verificationStatus.email === "verified" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="text-sm">Email Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  {verificationStatus.gstin === "verified" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="text-sm">GSTIN Verification</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/amc")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating AMC..." : "Create AMC"}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}