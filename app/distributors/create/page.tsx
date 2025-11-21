"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, FileText, CheckCircle, AlertCircle, User, Building, CreditCard } from "lucide-react"

export default function CreateDistributorPage() {
  const { hasPermission } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    pan: "",
    aadhaar: "",

    // Business Information
    businessName: "",
    businessType: "",
    gstin: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessPincode: "",

    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",

    // AMC Assignment
    assignedAMCs: [] as string[],

    // Training
    enableTraining: true,
    assignedCourses: [] as string[],
  })

  const [documents, setDocuments] = useState({
    photo: null as File | null,
    panCard: null as File | null,
    aadhaarCard: null as File | null,
    bankPassbook: null as File | null,
    gstCertificate: null as File | null,
    businessLicense: null as File | null,
  })

  const [verificationStatus, setVerificationStatus] = useState({
    pan: "pending",
    gstin: "pending",
    bank: "pending",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, file: File) => {
    setDocuments((prev) => ({ ...prev, [field]: file }))
  }

  const handleAMCSelection = (amcId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedAMCs: checked ? [...prev.assignedAMCs, amcId] : prev.assignedAMCs.filter((id) => id !== amcId),
    }))
  }

  const verifyPAN = async () => {
    setVerificationStatus((prev) => ({ ...prev, pan: "verified" }))
  }

  const verifyGSTIN = async () => {
    setVerificationStatus((prev) => ({ ...prev, gstin: "verified" }))
  }

  const verifyBank = async () => {
    setVerificationStatus((prev) => ({ ...prev, bank: "verified" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Distributor created successfully!")
    }, 2000)
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  if (!hasPermission("distributor:create")) {
    return (
      <AuthenticatedLayout
        breadcrumbs={[{ label: "Distributor Management", href: "/distributors" }, { label: "Create Distributor" }]}
      >
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to create distributors.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout
      breadcrumbs={[{ label: "Distributor Management", href: "/distributors" }, { label: "Create Distributor" }]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Create New Distributor</h2>
            <p className="text-muted-foreground">Onboard a new mutual fund distributor</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step}
                  </div>
                  <div className="ml-2 text-sm">
                    {step === 1 && "Personal Info"}
                    {step === 2 && "Business Details"}
                    {step === 3 && "Documents"}
                    {step === 4 && "AMC Assignment"}
                  </div>
                  {step < 4 && <div className="w-16 h-px bg-muted mx-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Enter the distributor's personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
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

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
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
                    <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                    <Input
                      id="aadhaar"
                      value={formData.aadhaar}
                      onChange={(e) => handleInputChange("aadhaar", e.target.value)}
                      placeholder="1234 5678 9012"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Business Information
                </CardTitle>
                <CardDescription>Enter business details and address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      placeholder="ABC Financial Services"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="company">Private Limited Company</SelectItem>
                        <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <div className="flex gap-2">
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange("gstin", e.target.value)}
                      placeholder="22ABCDE1234F1Z5"
                    />
                    <Button type="button" variant="outline" onClick={verifyGSTIN}>
                      {verificationStatus.gstin === "verified" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    placeholder="Enter complete business address"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessCity">City *</Label>
                    <Input
                      id="businessCity"
                      value={formData.businessCity}
                      onChange={(e) => handleInputChange("businessCity", e.target.value)}
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessState">State *</Label>
                    <Select onValueChange={(value) => handleInputChange("businessState", value)}>
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
                  <div className="space-y-2">
                    <Label htmlFor="businessPincode">Pincode *</Label>
                    <Input
                      id="businessPincode"
                      value={formData.businessPincode}
                      onChange={(e) => handleInputChange("businessPincode", e.target.value)}
                      placeholder="400001"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Documents & Bank Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Bank Details
                  </CardTitle>
                  <CardDescription>Enter bank account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        placeholder="HDFC Bank"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                      <Input
                        id="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        placeholder="1234567890123456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="ifscCode"
                          value={formData.ifscCode}
                          onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                          placeholder="HDFC0001234"
                          required
                        />
                        <Button type="button" variant="outline" onClick={verifyBank}>
                          {verificationStatus.bank === "verified" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Document Upload
                  </CardTitle>
                  <CardDescription>Upload required documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Profile Photo *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload profile photo</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload("photo", e.target.files[0])}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>PAN Card *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload PAN card</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload("panCard", e.target.files[0])}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Aadhaar Card *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload Aadhaar card</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload("aadhaarCard", e.target.files[0])}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Bank Passbook *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload bank passbook</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload("bankPassbook", e.target.files[0])}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>GST Certificate</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload GST certificate</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) =>
                              e.target.files?.[0] && handleFileUpload("gstCertificate", e.target.files[0])
                            }
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Business License</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Upload business license</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) =>
                              e.target.files?.[0] && handleFileUpload("businessLicense", e.target.files[0])
                            }
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: AMC Assignment & Training */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AMC Assignment</CardTitle>
                  <CardDescription>Select AMCs this distributor can sell funds for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["HDFC Asset Management", "ICICI Prudential AMC", "SBI Mutual Fund", "Axis Mutual Fund"].map(
                      (amc) => (
                        <div key={amc} className="flex items-center space-x-2">
                          <Checkbox
                            id={amc}
                            checked={formData.assignedAMCs.includes(amc)}
                            onCheckedChange={(checked) => handleAMCSelection(amc, checked as boolean)}
                          />
                          <Label htmlFor={amc}>{amc}</Label>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training & Courses</CardTitle>
                  <CardDescription>Configure training modules for the distributor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableTraining"
                      checked={formData.enableTraining}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, enableTraining: checked as boolean }))
                      }
                    />
                    <Label htmlFor="enableTraining">Enable training module access</Label>
                  </div>

                  {formData.enableTraining && (
                    <div className="space-y-4 pl-6">
                      <h4 className="font-medium">Assign Courses</h4>
                      {["Mutual Fund Basics", "KYC Compliance", "Investment Advisory", "Digital Platform Training"].map(
                        (course) => (
                          <div key={course} className="flex items-center space-x-2">
                            <Checkbox
                              id={course}
                              checked={formData.assignedCourses.includes(course)}
                              onCheckedChange={(checked) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  assignedCourses: checked
                                    ? [...prev.assignedCourses, course]
                                    : prev.assignedCourses.filter((c) => c !== course),
                                }))
                              }}
                            />
                            <Label htmlFor={course}>{course}</Label>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verification Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Verification Summary</CardTitle>
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
                      {verificationStatus.gstin === "verified" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="text-sm">GSTIN Verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {verificationStatus.bank === "verified" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="text-sm">Bank Verification</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <>
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Distributor..." : "Create Distributor"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}
