"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Mail, Phone, Lock, Briefcase, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthInput } from "@/components/ui/auth-input"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
]

export default function RegisterPage() {
  const { register, user, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
  })
  const [countryCode, setCountryCode] = useState("+91")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // AUTH GUARD: If user is already logged in, they shouldn't be here.
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "Merchant") {
         router.replace("/merchant/dashboard")
      } else {
         router.replace("/store")
      }
    }
  }, [user, loading])

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required"
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "email" && !formData.username ? { username: value.split("@")[0] } : {}),
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return

    setIsLoading(true)
    try {
      // Combine phone with country code
      const finalData = {
        ...formData,
        phone: `${countryCode}${formData.phone.replace(/^\+/, '')}`
      }
      await register(finalData)
      // Redirect handled by useEffect
    } catch (err: any) {
      setIsLoading(false)
      // Errors handled by toast in AuthContext
    }
  }

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12 bg-background">
      <Card className="w-full max-w-2xl bg-card border-border shadow-2xl relative overflow-hidden rounded-[2.5rem]">
        {/* Subtle left glow consistent with login page */}
        <div className="absolute -bottom-32 -left-32 h-64 w-64 blur-[120px] rounded-full opacity-10 bg-primary pointer-events-none" />

        <CardHeader className="space-y-4 text-center pb-10 border-b border-border/50 relative z-10 pt-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-muted/30 border border-border shadow-2xl mb-2 backdrop-blur-xl transition-transform hover:scale-110">
            <img src="/images/logo.png" alt="Mana Vyapar Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <CardTitle className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none pb-2">
              {step === 1 ? (
                <>Create <span className="text-primary italic">Account</span></>
              ) : (
                <>Your <span className="text-primary italic">Business</span></>
              )}
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-4">
              <span className={step === 1 ? "text-primary border-b-2 border-primary pb-1" : ""}>Personal Info</span>
              <ArrowRight className="h-3 w-3" />
              <span className={step === 2 ? "text-primary border-b-2 border-primary pb-1" : ""}>Business Details</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-10 px-10 relative z-10 pb-12">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AuthInput
                  label="Full Name"
                  icon={User}
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.fullname}
                />

                <AuthInput
                  label="Username"
                  icon={User}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  error={errors.username}
                />

                <AuthInput
                  label="Email"
                  type="email"
                  icon={Mail}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  error={errors.email}
                />

                <div className="space-y-2 w-full group">
                  <label className="block text-[10px] font-black uppercase tracking-widest ml-1.5 text-muted-foreground transition-colors group-focus-within:text-primary">
                    Phone Number
                  </label>
                  <div className="flex gap-2 relative">
                    <div className="relative shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-14 pl-4 pr-10 rounded-2xl border border-border bg-muted/30 text-sm font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <div className="flex-1 relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                       <input
                         type="tel"
                         name="phone"
                         value={formData.phone}
                         onChange={handleChange}
                         placeholder="98765-43210"
                         className={cn(
                           "w-full h-14 pl-12 pr-5 rounded-2xl border border-border bg-muted/30 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                           errors.phone && "border-destructive focus:ring-destructive/20"
                         )}
                       />
                    </div>
                  </div>
                  {errors.phone && <p className="text-[10px] ml-1.5 mt-1.5 font-black uppercase tracking-wider text-destructive">{errors.phone}</p>}
                </div>

                <AuthInput
                  label="Password"
                  type="password"
                  icon={Lock}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.password}
                />
              </div>

              <div className="flex gap-4">
                 <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  Next Step <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-6">
                <AuthInput
                  label="Business Name"
                  icon={Briefcase}
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Skyline Stores"
                  error={errors.businessName}
                />
                
                <div className="p-6 rounded-3xl border border-border bg-muted/20 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-muted text-muted-foreground">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-foreground uppercase tracking-wider">Registration Notice</p>
                    <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight opacity-70">
                      By registering, you establish your presence on the Mana-Vyapar network. You can configure your store's theme, logo, and inventory after activation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-14 rounded-2xl bg-muted hover:bg-muted-foreground/10 text-muted-foreground font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 h-14 rounded-2xl bg-primary hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>Complete Registration <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-border/50 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Already have an account? </span>
            <Link href="/auth/login" className="text-primary hover:underline underline-offset-4 decoration-2">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
