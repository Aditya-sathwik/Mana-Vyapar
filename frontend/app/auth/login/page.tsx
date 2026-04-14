"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthInput } from "@/components/ui/auth-input"

export default function LoginPage() {
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (redirect) {
        router.replace(redirect)
        return
      }

      if (user.role === "Merchant") {
        router.replace("/merchant/dashboard")
      } else if (user.role === "Admin" || user.role === "admin") {
        router.replace("/admin/dashboard")
      } else {
        router.replace("/store")
      }
    }
  }, [user, loading, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login({ identifier, password, remember: rememberMe })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to login. Please check your credentials.")
      }
      setIsLoading(false)
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl relative overflow-hidden rounded-[2rem]">
        {/* Glow effect using global classes */}
        <div className="absolute -top-24 -right-24 h-48 w-48 blur-[100px] rounded-full opacity-20 bg-primary" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 blur-[100px] rounded-full opacity-10 bg-primary" />

        <CardHeader className="space-y-4 text-center relative z-10 pt-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-muted/30 border border-border shadow-2xl mb-2 backdrop-blur-xl transition-transform hover:scale-110">
            <img src="/images/logo.png" alt="Mana Vyapar Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <CardTitle className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none pb-2">
              Login to <span className="text-primary italic">Account</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Welcome back to Mana Vyapar
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-6 px-10 pb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AuthInput
              label="Email, Username, or Phone"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. aditya@mail.com"
            />

            <AuthInput
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-all ${rememberMe ? 'bg-primary' : 'bg-muted border border-border'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-all transform ${rememberMe ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="hidden"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Remember Me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                Forgot?
              </Link>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs font-bold text-center text-destructive uppercase tracking-widest animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-12 text-center text-[10px] font-bold border-t border-border pt-8 uppercase tracking-widest text-muted-foreground">
            <span>Don't have an account? </span>
            <Link href="/auth/register" className="text-primary hover:underline underline-offset-4 decoration-2">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
