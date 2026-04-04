"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Lock, User, ArrowRight, ShoppingBag, Mail, Phone, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { AuthInput } from "@/components/ui/auth-input"
import toast from "react-hot-toast"
import Link from "next/link"

export default function CustomerLoginPage() {
    const { merchantId } = useParams()
    const { login, user, loading } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get("redirect")

    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // 🛸 Already Logged In?
    useEffect(() => {
        if (!loading && user) {
            if (redirect) {
                router.replace(redirect)
            } else if (user.role === "Customer") {
                router.replace(`/store/${merchantId}`)
            } else {
                router.replace("/merchant/dashboard")
            }
        }
    }, [user, loading, router, redirect, merchantId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            // We use the common login, but then handle the redirect
            await login({ identifier, password, remember: true })
            // Success handled by useEffect redirect
        } catch (err: any) {
            setError(err.message || "Invalid credentials. Please verify your shop account.")
            setIsLoading(false)
        }
    }

    if (loading || user) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 selection:bg-primary/30">
            {/* 🌌 Background Atmosphere */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-10">
                <div className="text-center space-y-4">
                    <div className="h-20 w-20 bg-muted/20 border border-white/10 rounded-3xl mx-auto flex items-center justify-center shadow-2xl backdrop-blur-xl">
                         <ShoppingBag className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none italic">
                            Customer <span className="text-primary italic">Login</span>
                        </h1>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-2">
                             Access Shop ID: <span className="text-white opacity-40">{String(merchantId).slice(-8)}</span>
                        </p>
                    </div>
                </div>

                <Card className="bg-[#0d1525]/80 backdrop-blur-2xl border-[#1e293b] border-2 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-10 md:p-12 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-6">
                                <AuthInput
                                    label="EMAIL / USERNAME / PHONE"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="Enter your registered info"
                                />

                                <AuthInput
                                    label="PASSWORD"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase text-rose-500 text-center tracking-widest"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 italic group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                <>
                                        Login 
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                                )}
                            </button>
                        </form>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div className="flex items-center gap-3 text-muted-foreground opacity-40 justify-center">
                                <div className="h-px w-8 bg-current" />
                                <span className="text-[9px] font-black uppercase tracking-widest">New Customer?</span>
                                <div className="h-px w-8 bg-current" />
                            </div>
                            
                            <Link 
                                href={`/store/${merchantId}/register${redirect ? `?redirect=${redirect}` : ""}`}
                                className="w-full h-14 border-2 border-white/5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                <User className="h-4 w-4" />
                                Create Shop Account
                            </Link>

                            <button onClick={() => window.history.back()} className="w-full text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-all">
                                Return to store
                            </button>
                        </div>
                    </div>
                </Card>

                <div className="flex flex-col items-center gap-4 opacity-20">
                     <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em]">End-to-End Encrypted Session</span>
                     </div>
                </div>
            </div>
        </div>
    )
}
