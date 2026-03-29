"use client"

import Link from "next/link"
import React, { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Loader2, Eye, EyeOff } from "lucide-react"
import { COLORS } from "@/lib/colors"

import { AuthInput } from "@/components/ui/auth-input"

export default function LoginPage() {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login({ identifier, password })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to login. Please check your credentials.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 transition-all duration-500" style={{ backgroundColor: COLORS.background.dark }}>
      <Card className="w-full max-w-md backdrop-blur-3xl shadow-2xl relative overflow-hidden" style={{ backgroundColor: `${COLORS.slate[900]}90`, borderColor: COLORS.border.dark }}>
        {/* Glow effect using primary color token */}
        <div className="absolute -top-24 -right-24 h-48 w-48 blur-[100px] rounded-full opacity-20" style={{ backgroundColor: COLORS.primary.vibrant }} />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 blur-[100px] rounded-full opacity-10" style={{ backgroundColor: COLORS.primary.vibrant }} />

        <CardHeader className="space-y-2 text-center relative z-10 pt-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl p-3 shadow-2xl mb-6 backdrop-blur-xl border border-white/5 transition-transform hover:scale-110" style={{ backgroundColor: `${COLORS.slate[800]}50` }}>
            <img src="/images/logo.png" alt="Mana Vyapar Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <CardTitle className="text-4xl font-display font-bold text-white tracking-tight pb-1">
            Merchant Login
          </CardTitle>
          <CardDescription className="text-base max-w-[260px] mx-auto" style={{ color: COLORS.text.secondary }}>
            Log in with your email, username, or phone number to access your dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 pt-6 px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AuthInput
              label="Email, Username, or Phone"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. aditya@mail.com or 98765..."
            />

            <AuthInput
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your secure password"
            />

            {error && (
              <div className="p-4 rounded-2xl border text-sm text-center font-medium animate-in fade-in zoom-in-95 duration-300" style={{ backgroundColor: `${COLORS.error}10`, borderColor: `${COLORS.error}20`, color: COLORS.error }}>
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
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-12 pb-8 text-center text-sm border-t pt-8" style={{ borderTopColor: "rgba(255,255,255,0.05)" }}>
            <span style={{ color: COLORS.text.muted }}>Don&apos;t have an account? </span>
            <Link href="/auth/register" className="font-bold transition-all hover:underline decoration-2 underline-offset-4" style={{ color: COLORS.primary.vibrant }}>
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
