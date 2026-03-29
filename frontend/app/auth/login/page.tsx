"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Store } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthInput } from "@/components/ui/auth-input"
import { apiFetch } from "@/lib/api-client"
import { Modal } from "@/components/ui/modal"
import toast from "react-hot-toast"

export default function LoginPage() {
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Store Setup Modal State
  const [showStoreSetup, setShowStoreSetup] = useState(false)
  const [storeName, setStoreName] = useState("")
  const [storeLoading, setStoreLoading] = useState(false)

  // AUTH GUARD: If user is already logged in, they shouldn't be here.
  useEffect(() => {
    if (!loading && user) {
      checkStoreAndRedirect(user)
    }
  }, [user, loading])

  const checkStoreAndRedirect = async (userData: any) => {
    if (userData.role === "Merchant") {
      try {
        const res = await apiFetch("/stores/me")
        if (res.success && res.data) {
          router.replace("/merchant/dashboard")
        } else {
          setShowStoreSetup(true)
        }
      } catch (err) {
        setShowStoreSetup(true)
      }
    } else if (userData.role === "Super Admin" || userData.role === "admin") {
      router.replace("/admin/dashboard")
    } else {
      router.replace("/store")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login({ identifier, password })
      // Redirect logic is handled by the useEffect watching the 'user' object
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to login. Please check your credentials.")
      }
      setIsLoading(false)
    }
  }

  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      toast.error("Store name is required")
      return
    }

    try {
      setStoreLoading(true)
      const res = await apiFetch("/stores", {
        method: "POST",
        body: JSON.stringify({ name: storeName.trim() })
      })

      if (res.success) {
        toast.success("Store created successfully!")
        router.replace("/merchant/dashboard")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create store")
    } finally {
      setStoreLoading(false)
    }
  }

  // Prevent flicker before redirect
  if (loading || (user && !showStoreSetup)) {
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

      {/* Store Creation Modal */}
      <Modal
        isOpen={showStoreSetup}
        onClose={() => { }} // User must create a store
        title="Create Your Store"
        description="Give your business a name to start selling."
        confirmLabel="Create Store"
        onConfirm={handleCreateStore}
        isLoading={storeLoading}
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <Store className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
              A store identifies your business on the Mana-Vyapar network. You can change the colors and logo after setup.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Business Name</label>
            <input
              type="text"
              placeholder="e.g. Skyline Electronics"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
