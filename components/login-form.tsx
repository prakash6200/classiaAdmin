"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, Phone } from "lucide-react"
import { AnimatedBackground } from "./animated_background"
import { useAuth } from "@/lib/api/auth-context" // Import useAuth

export function LoginForm() {
  const [emailOrMobile, setEmailOrMobile] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth() // Get login function

  // Auto-focus form container for Enter key
  useEffect(() => {
    const form = document.getElementById("login-form")
    form?.focus()
  }, [])

  const handleSubmit = async () => {
    if (!emailOrMobile.trim() || !password) {
      setError("Please enter email/mobile and password")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await login(emailOrMobile.trim(), password)
      // Success → HomePage will redirect via useEffect
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit()
    }
  }

  return (
    <AnimatedBackground>
      <div className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-[#0f0f1a]/80 backdrop-blur-2xl border border-[#d7b56d]/20 shadow-2xl shadow-[#d7b56d]/20">
          <CardHeader className="space-y-4 pb-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-2">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d7b56d] via-[#c9a860] to-[#b8955d] animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-[3px] rounded-3xl bg-[#0a0a0f] flex items-center justify-center">
                  <div className="text-4xl font-bold text-[#d7b56d] drop-shadow-[0_0_10px_rgba(215,181,109,0.5)]">
                    CC
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold text-[#d7b56d] drop-shadow-[0_0_20px_rgba(215,181,109,0.3)]">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                Sign in to Classia Capital Admin
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div
              id="login-form"
              className="space-y-6"
              onKeyDown={handleKeyDown}
              tabIndex={0}
              style={{ outline: "none" }}
            >
              {/* Email/Mobile Input */}
              <div className="space-y-2">
                <Label htmlFor="emailOrMobile" className="text-gray-300 font-medium">
                  Email or Mobile
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {emailOrMobile.includes("@") ? (
                      <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#d7b56d] transition-colors" />
                    ) : (
                      <Phone className="h-5 w-5 text-gray-500 group-focus-within:text-[#d7b56d] transition-colors" />
                    )}
                  </div>
                  <Input
                    id="emailOrMobile"
                    type="text"
                    placeholder="Enter email or mobile number"
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    className="pl-11 h-12 bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white placeholder:text-gray-500 focus:border-[#d7b56d] focus:ring-[#d7b56d]/30 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#d7b56d] transition-colors" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white placeholder:text-gray-500 focus:border-[#d7b56d] focus:ring-[#d7b56d]/30 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#d7b56d] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="bg-red-950/50 border-red-900/50 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-gradient-to-r from-[#d7b56d] via-[#c9a860] to-[#d7b56d] hover:from-[#c9a860] hover:via-[#d7b56d] hover:to-[#c9a860] text-[#00004D] font-semibold shadow-lg shadow-[#d7b56d]/30 transition-all duration-300 hover:shadow-[#d7b56d]/50 hover:scale-[1.02] bg-[length:200%_100%] animate-shimmer"
                disabled={isLoading}
                style={{
                  animation: isLoading ? 'none' : 'shimmer 3s linear infinite'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#00004D]/30 border-t-[#00004D] rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button className="text-sm text-gray-400 hover:text-[#d7b56d] transition-colors">
                  Forgot your password?
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </AnimatedBackground>
  )
}

export default LoginForm