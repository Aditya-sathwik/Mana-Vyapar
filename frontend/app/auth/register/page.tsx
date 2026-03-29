"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Loader2, User, Mail, Phone, Lock, Briefcase, Eye, EyeOff } from "lucide-react"
import { COLORS } from "@/lib/colors"

import { AuthInput } from "@/components/ui/auth-input"

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "email" && !formData.username ? { username: value.split("@")[0] } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      await register(formData)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12 transition-all duration-500" style={{ backgroundColor: COLORS.background.dark }}>
      <Card className="w-full max-w-lg backdrop-blur-3xl shadow-2xl relative overflow-hidden" style={{ backgroundColor: `${COLORS.slate[900]}90`, borderColor: COLORS.border.dark }}>
        {/* Glow effect - Matches Login page's premium aesthetic */}
        <div className="absolute -top-32 -right-32 h-64 w-64 blur-[120px] rounded-full opacity-20" style={{ backgroundColor: COLORS.primary.vibrant }} />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 blur-[120px] rounded-full opacity-10" style={{ backgroundColor: COLORS.primary.vibrant }} />

        <CardHeader className="space-y-2 text-center pb-10 border-b relative z-10" style={{ borderBottomColor: "rgba(255,255,255,0.05)" }}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl p-3 shadow-2xl mb-6 backdrop-blur-xl border border-white/5 transition-transform hover:scale-110" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
            <img src="/images/logo.png" alt="Mana Vyapar Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <CardTitle className="text-4xl font-display font-bold text-white tracking-tight">
            Get Started
          </CardTitle>
          <CardDescription className="max-w-[280px] mx-auto text-base" style={{ color: COLORS.text.secondary }}>
            Join Mana-Vyapar to digitize your business operations today.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-10 px-8 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <AuthInput
                label="Full Name"
                icon={User}
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
              />

              <AuthInput
                label="Business Name"
                icon={Briefcase}
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                placeholder="My Store"
              />
            </div>

            <AuthInput
              label="Email Address"
              type="email"
              icon={Mail}
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />

            <AuthInput
              label="Phone Number"
              type="tel"
              icon={Phone}
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />

            <AuthInput
              label="Password"
              type="password"
              icon={Lock}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            
            {error && (
              <div className="p-4 rounded-2xl border text-sm text-center font-medium animate-in fade-in zoom-in-95" style={{ backgroundColor: `${COLORS.error}10`, borderColor: `${COLORS.error}20`, color: COLORS.error }}>
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-white font-bold text-lg transition-all active:scale-[0.98] mt-4" 
              style={{ 
                backgroundColor: COLORS.primary.vibrant,
                boxShadow: `0 8px 30px ${COLORS.primary.vibrant}33`
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          
          <div className="mt-12 pt-8 border-t text-center text-sm pb-4" style={{ borderTopColor: "rgba(255,255,255,0.05)" }}>
            <span style={{ color: COLORS.text.muted }}>Already have an account? </span>
            <Link href="/auth/login" className="transition-all font-bold hover:underline decoration-2 underline-offset-4" style={{ color: COLORS.primary.vibrant }}>
              Log in instead
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
