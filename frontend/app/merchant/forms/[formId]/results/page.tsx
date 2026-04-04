"use client"

import { useState, useEffect } from "react"
import {
    Layout,
    ArrowLeft,
    Loader2,
    Search,
    Filter,
    Activity,
    Table as TableIcon,
    Download,
    Calendar,
    User,
    CheckCircle2,
    FileText,
    Clock,
    X
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api-client"
import toast from "react-hot-toast"
import { useRouter, useParams } from "next/navigation"

export default function FormResultsPage() {
    const { formId } = useParams()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSub, setSelectedSub] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await apiFetch(`/dynamic-forms/${formId}/responses`)
                if (response.success) {
                    setData(response.data)
                }
            } catch (error: any) {
                toast.error("Unable to load feedback.")
            } finally {
                setLoading(false)
            }
        }
        fetchResults()
    }, [formId])

    const handleDownloadCSV = () => {
        if (!data?.submissions || data.submissions.length === 0) {
            toast.error("No submissions found to export.")
            return
        }

        const { form, submissions } = data
        
        // Define Headers: Customer Info + Form Fields
        const headers = ["Customer Name", "Phone", "Email", "Submission Date", ...form.fields.map((f: any) => f.label)]
        
        // Prepare CSV Rows
        const rows = submissions.map((sub: any) => {
            const customerName = sub.customerId?.fullname || "Guest Shopper"
            const phone = sub.customerId?.phone || "Private Entry"
            const email = sub.customerId?.email || "N/A"
            const date = new Date(sub.createdAt).toLocaleString()
            
            // Map responses to match headers (by field label)
            const formResponses = form.fields.map((field: any) => {
                const resp = sub.responses.find((r: any) => r.fieldLabel === field.label)
                const val = resp ? resp.value : ""
                // Escape commas and quotes for CSV
                return `"${String(val).replace(/"/g, '""')}"`
            })

            return [`"${customerName}"`, `"${phone}"`, `"${email}"`, `"${date}"`, ...formResponses].join(",")
        })

        const csvContent = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `form_results_${form.title.replace(/\s+/g, "_").toLowerCase()}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("CSV Downloaded successfully!")
    }

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Activity className="h-16 w-16 text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Gathering Customer Feedback</p>
            </div>
        )
    }

    const { form, submissions } = data || { form: null, submissions: [] }

    return (
        <div className="space-y-12 pb-24 relative min-h-screen">
            {/* 🛸 Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/merchant/forms/list")}
                        className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back to My Forms
                    </button>
                    <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
                        Form <span className="text-primary italic">Results</span>
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">
                        Feedback for: <span className="text-foreground">{form?.title || "Unknown Form"}</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleDownloadCSV}
                        className="h-14 md:h-16 px-8 md:px-10 bg-card border-border border-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-primary/30 active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Download className="h-5 w-5" />
                        Report (CSV)
                    </button>
                </div>
            </div>

            {/* 📊 Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
                {[
                    { label: "Total Responses", val: submissions.length, icon: User, color: "emerald" },
                    { label: "Active Status", val: form?.isActive ? "Live" : "Stopped", icon: Activity, color: "indigo" },
                    { label: "Last Submission", val: submissions.length > 0 ? new Date(submissions[0].createdAt).toLocaleDateString() : "Never", icon: Clock, color: "blue" },
                ].map((kpi, i) => (
                    <Card key={i} className="p-6 md:p-8 border-border bg-card/30 backdrop-blur-xl group hover:border-primary/30 transition-all overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary")}>
                                    <kpi.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
                            <h3 className="text-2xl md:text-3xl font-black tracking-tighter">{kpi.val}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 📝 Responses Content */}
            <div className="space-y-6 px-4 md:px-0">
                <div className="flex items-center gap-3">
                    <TableIcon className="h-6 w-6 text-primary" />
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Response History</h3>
                    <div className="h-px flex-1 bg-border/50" />
                </div>

                {submissions.length === 0 ? (
                    <Card className="p-20 md:p-32 flex flex-col items-center justify-center border-dashed border-border/50 bg-muted/5 opacity-50 space-y-6">
                        <FileText className="h-12 md:h-16 w-12 md:w-16 text-muted-foreground/30" />
                        <div className="text-center">
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-widest mb-2">No Responses Yet</h3>
                            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Share the form link with your customers to see results here</p>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* 🖥️ Desktop Table View */}
                        <div className="hidden md:block bg-card/30 backdrop-blur-xl border-2 border-border/50 rounded-[2rem] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-border/50">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Customer</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Key Insights</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Submitted</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-border/30">
                                    {submissions.map((sub: any) => (
                                        <tr 
                                            key={sub._id} 
                                            onClick={() => setSelectedSub(sub)}
                                            className="hover:bg-primary/5 cursor-pointer transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center font-black text-primary text-xs uppercase shadow-inner">
                                                        {sub.customerId?.fullname?.charAt(0) || "G"}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-tight">{sub.customerId?.fullname || "Guest Shopper"}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{sub.customerId?.phone || "Private Entry"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    {(sub.responses || []).slice(0, 2).map((resp: any, i: number) => (
                                                        <p key={i} className="text-[10px] font-bold truncate max-w-[300px]">
                                                            <span className="text-muted-foreground uppercase opacity-50">{resp.fieldLabel}:</span> {String(resp.value)}
                                                        </p>
                                                    ))}
                                                    {sub.responses?.length > 2 && (
                                                         <p className="text-[8px] font-black text-primary uppercase opacity-60">+ {sub.responses.length - 2} more insights</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                                                    {new Date(sub.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 📱 Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {submissions.map((sub: any) => (
                                <Card 
                                    key={sub._id} 
                                    onClick={() => setSelectedSub(sub)}
                                    className="p-6 bg-card/50 border-2 border-border/50 rounded-2xl relative overflow-hidden active:scale-[0.98] transition-transform"
                                >
                                     <div className="flex items-center gap-4 mb-6 pt-2 border-b border-border/30 pb-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-[10px] shrink-0">
                                            {sub.customerId?.fullname?.charAt(0) || "G"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-tight truncate">{sub.customerId?.fullname || "Guest Shopper"}</p>
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {new Date(sub.createdAt).toLocaleDateString()} • {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {(sub.responses || []).slice(0, 3).map((resp: any, i: number) => (
                                            <div key={i} className="space-y-1">
                                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 leading-none">{resp.fieldLabel}</p>
                                                <p className="text-[10px] font-bold leading-relaxed">{String(resp.value)}</p>
                                            </div>
                                        ))}
                                        {sub.responses?.length > 3 && (
                                            <p className="text-[8px] font-black text-primary uppercase text-center mt-2">+ See {sub.responses.length - 3} more</p>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between">
                                          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-[8px] font-black uppercase tracking-widest">Verified</div>
                                          <Download className="h-4 w-4 text-muted-foreground opacity-30" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* 🛸 Response Detail Modal */}
            <AnimatePresence>
                {selectedSub && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSub(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-2xl bg-card border-2 border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 md:p-12 space-y-8 max-h-[85vh] overflow-y-auto">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                            <User className="h-7 w-7 text-primary" />
                                        </div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">
                                            {selectedSub.customerId?.fullname || "Guest Shopper"}
                                        </h2>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            Submitted on {new Date(selectedSub.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedSub(null)}
                                        className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Detailed Responses</h3>
                                        <div className="h-px flex-1 bg-border/50" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {selectedSub.responses.map((resp: any, i: number) => (
                                            <div key={i} className="p-6 bg-muted/30 border border-border/50 rounded-2xl space-y-2 hover:border-primary/20 transition-all">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                                    {resp.fieldLabel}
                                                </p>
                                                <p className="text-sm font-bold text-foreground leading-relaxed whitespace-pre-wrap">
                                                    {String(resp.value)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button 
                                        onClick={() => setSelectedSub(null)}
                                        className="px-8 py-4 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
                                    >
                                        Close Review
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}


