"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Lock, User, ArrowRight, ShoppingBag, Mail, Phone, Info, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { AuthInput } from "@/components/ui/auth-input"
import toast from "react-hot-toast"
import Link from "next/link"

export default function CustomerRegisterPage() {
    const { merchantId } = useParams()
    const { register, user, loading } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get("redirect")

    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: ""
    })
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
            await register({
                ...formData,
                businessName: `Customer of ${merchantId}`, // Default name if required
                role: "Customer",
                merchantId: String(merchantId)
            })
            // Success handled by auth-context logic (usually redirects to login or dashboard)
            // But we'll handle the immediate feedback here.
            toast.success("Welcome aboard!")
            const loginUrl = `/store/${merchantId}/login${redirect ? `?redirect=${redirect}` : ""}`
            router.push(loginUrl)
        } catch (err: any) {
            setError(err.message || "Unable to register. Please check your info.")
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
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
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-xl relative z-10 space-y-12">
                <div className="text-center space-y-4">
                    <div className="h-20 w-20 bg-muted/20 border border-white/10 rounded-3xl mx-auto flex items-center justify-center shadow-2xl backdrop-blur-xl group hover:scale-110 transition-all duration-500 hover:border-primary/40">
                         <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
                            Create Shop <span className="text-primary italic">Account</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-4 opacity-70">
                             Shop ID Partition: <span className="text-white">{String(merchantId).slice(-12)}</span>
                        </p>
                    </div>
                </div>

                <Card className="bg-[#0d1525]/80 backdrop-blur-3xl border-[#1e293b] border-2 rounded-[3.5rem] overflow-hidden shadow-2xl">
                    <div className="p-10 md:p-14 space-y-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <AuthInput
                                    label="FULL NAME"
                                    name="fullname"
                                    required
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                />

                                <AuthInput
                                    label="USERNAME"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose username"
                                />

                                <AuthInput
                                    label="EMAIL ADDRESS"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="e.g. customer@mail.com"
                                />

                                <AuthInput
                                    label="PHONE NUMBER"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Valid phone"
                                />

                                <div className="md:col-span-2">
                                     <AuthInput
                                        label="SECURE PASSWORD"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase text-rose-500 text-center tracking-widest leading-none"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 bg-primary text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 italic group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Join Shop Workspace
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-10 border-t border-white/5 space-y-6">
                            <div className="flex items-center gap-3 text-muted-foreground opacity-40 justify-center">
                                <div className="h-px w-8 bg-current" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Registered Already?</span>
                                <div className="h-px w-8 bg-current" />
                            </div>
                            
                            <Link 
                                href={`/store/${merchantId}/login${redirect ? `?redirect=${redirect}` : ""}`}
                                className="w-full h-14 border-2 border-white/5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                <Lock className="h-4 w-4" />
                                Return to Login
                            </Link>

                            <div className="flex items-center justify-center gap-4 opacity-30 group-hover:opacity-100 transition-all">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Verified Shop Security</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
