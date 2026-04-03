"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, ArrowLeft, ShieldCheck } from "lucide-react"
import { AuthInput } from "@/components/ui/auth-input"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Logic for backend reset would go here
      // For now, simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSuccess(true)
      toast.success("Reset link sent if account exists")
    } catch (err: any) {
      toast.error("Failed to send reset link")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background overflow-hidden relative">
      {/* Background Orbs for premium look */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -ml-20 -mb-20" />

      <Card className="w-full max-w-md bg-card/50 backdrop-blur-2xl border-border shadow-2xl relative overflow-hidden rounded-[2.5rem]">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <CardHeader className="space-y-6 text-center relative z-10 pt-10 px-10">
          <Link href="/auth/login" className="absolute left-6 top-8 p-3 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-95 group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/10 border border-primary/20 shadow-2xl mb-2 backdrop-blur-xl group hover:scale-110 transition-transform">
             {isSuccess ? (
                <ShieldCheck className="h-10 w-10 text-primary animate-in zoom-in-50 duration-500" />
             ) : (
                <Mail className="h-10 w-10 text-primary group-hover:rotate-12 transition-transform" />
             )}
          </div>

          {!isSuccess ? (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <CardTitle className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none pb-3">
                Forgotten <span className="text-primary italic">Access?</span>
              </CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                Enter your registered ID to recover your command credentials.
              </CardDescription>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-300">
              <CardTitle className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none pb-3">
                Hyperlink <span className="text-primary italic">Dispatched</span>
              </CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                If an account exists for <span className="text-foreground">{email}</span>, recovery instructions are manifest.
              </CardDescription>
            </div>
          )}
        </CardHeader>

        <CardContent className="relative z-10 pt-6 px-10 pb-12">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <AuthInput
                label="Registered Email ID"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aditya@hq.com"
                icon={Mail}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-emerald-600 text-white font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 active:scale-95 transition-all mt-4 group"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Initiate Recovery
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 pt-4">
               <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center animate-in slide-in-from-bottom-4 duration-500">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                     Recovery protocol initiated. Please check your inbox (and spam) for the validation link. Valid for 1 hour.
                  </p>
               </div>
               
               <Button
                asChild
                className="w-full h-14 rounded-2xl bg-muted border border-border text-foreground hover:bg-muted/80 font-black text-[11px] uppercase tracking-[0.2em] transition-all"
              >
                <Link href="/auth/login">Return to Hangar</Link>
              </Button>
            </div>
          )}

          {!isSuccess && (
            <div className="mt-12 text-center text-[10px] font-bold border-t border-border pt-8 uppercase tracking-[0.2em] text-muted-foreground">
              <span>Recalled your passkey? </span>
              <Link href="/auth/login" className="text-primary hover:underline underline-offset-4 decoration-2">
                Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Decorative footer snippet */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/20 pointer-events-none whitespace-nowrap">
        Protocol 404 // Mana Vyapar Security
      </div>
    </div>
  )
}
