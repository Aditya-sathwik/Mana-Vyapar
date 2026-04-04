"use client"

import { useState, useEffect } from "react"
import { 
    Loader2, 
    CheckCircle2, 
    ArrowRight,
    Layout,
    AlertCircle,
    ChevronDown,
    Lock,
    Globe,
    UserCircle2,
    Search
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api-client"
import toast from "react-hot-toast"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"

function SearchableSelect({ field, value, onChange }: { field: any, value: string, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    
    const filteredOptions = field.options.filter((opt: any) => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedLabel = field.options.find((opt: any) => opt.value === value)?.label || field.placeholder || "Select option..."

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-16 bg-[#0d1525] border-2 border-[#1e293b] rounded-2xl px-6 text-[10px] flex items-center justify-between focus:border-primary/50 transition-all font-black uppercase tracking-[0.2em] text-white"
            >
                <span className={cn(!value && "text-muted-foreground/40")}>{selectedLabel}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-[#0d1525] border-2 border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden p-3 space-y-3"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <input
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full h-10 bg-[#161f30] border border-[#1e293b] rounded-xl pl-10 pr-4 text-[9px] font-black uppercase text-white focus:outline-none focus:border-primary/30"
                            />
                        </div>

                        <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt: any) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value)
                                            setIsOpen(false)
                                            setSearchTerm("")
                                        }}
                                        className={cn(
                                            "w-full p-3 rounded-lg text-left text-[9px] font-black uppercase tracking-widest transition-all",
                                            value === opt.value ? "bg-primary text-white" : "text-muted-foreground hover:bg-[#161f30] hover:text-white"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))
                            ) : (
                                <p className="text-[9px] text-center py-4 text-muted-foreground uppercase font-black italic">No matches</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function PublicFormPage() {
    const { formId } = useParams()
    const [form, setForm] = useState<any>(null)
    const [responses, setResponses] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user, loading: authLoading } = useAuth()
    const isLoggedIn = !!user

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await apiFetch(`/dynamic-forms/public/${formId}`)
                if (response.success) {
                    setForm(response.data)
                }
            } catch (err: any) {
                setError(err.message || "Offline")
            } finally {
                setLoading(false)
            }
        }
        fetchForm()
    }, [formId])

    // 🛸 Enhanced Merchant Filtration: Redirect for non-logged in users on private forms
    useEffect(() => {
        if (!loading && !authLoading && form?.accessType === "REGISTERED" && !isLoggedIn) {
            // Auto-redirect to merchant-specific login within the store logic
            const loginUrl = `/store/${form.merchantId}/login?redirect=/forms/${formId}`
            window.location.href = loginUrl
        }
    }, [loading, authLoading, form, isLoggedIn, formId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const response = await apiFetch(`/dynamic-forms/submit/${formId}`, {
                method: "POST",
                body: JSON.stringify({ responses })
            })
            if (response.success) {
                setSubmitted(true)
                toast.success("Engagement recorded!")
            }
        } catch (err: any) {
            toast.error(err.message || "Failed.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center">
                <div className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (form?.accessType === "REGISTERED" && !isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
                <Card className="max-w-md w-full p-10 bg-[#0d1525] border-[#1e293b] border-2 rounded-[2rem] space-y-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black uppercase text-white tracking-widest leading-none mb-1">Access Restricted</h1>
                        <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em]">Validated Shop ID: {form?.merchantId?.slice(-6) || "N/A"}</p>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground/60 leading-relaxed px-4">This form is only for registered shop customers. Please login to continue.</p>
                    <button 
                        onClick={() => window.location.href = `/store/${form.merchantId}/login?redirect=/forms/${formId}`}
                        className="w-full h-14 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/10 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                    >
                        <UserCircle2 className="h-4 w-4" />
                        Login Now
                    </button>
                    <div className="pt-2">
                        <button onClick={() => window.history.back()} className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all underline underline-offset-4">Return To Shop</button>
                    </div>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center text-white">
                 <AlertCircle className="h-12 w-12 text-rose-500 mb-6 opacity-30" />
                 <h1 className="text-xl font-black uppercase italic mb-2 tracking-widest">Form Offline</h1>
                 <p className="text-muted-foreground text-[8px] uppercase tracking-widest">Blueprint no longer accepting data.</p>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
                 <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 border-2 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                </div>
                <h1 className="text-5xl text-white tracking-tighter uppercase italic leading-none mb-4">Wowed!</h1>
                <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] mb-10">Your response has been secured.</p>
                <button onClick={() => window.location.reload()} className="h-14 px-10 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95 italic">One More Time</button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#030712] text-foreground font-black selection:bg-primary selection:text-white pb-24 overflow-x-hidden">
            {/* 🛸 Global Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-xl mx-auto pt-24 px-6 space-y-20 relative">
                <div className="space-y-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-primary opacity-80">
                         {form.accessType === 'REGISTERED' ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                         <span className="text-[9px] uppercase tracking-[0.6em] font-black">{form.accessType} ENABLER</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl text-white tracking-tighter uppercase leading-[0.85] italic">{form.title}</h1>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] leading-relaxed max-w-md mx-auto opacity-60 italic">{form.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-16">
                    <div className="space-y-12">
                        {form.fields.map((field: any, idx: number) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="space-y-5">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground ml-4 flex items-center gap-3">
                                    <span className="text-primary italic opacity-40 font-black">#{idx + 1}</span>
                                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                                    {field.hasSearch && <Search className="h-2.5 w-2.5 opacity-20" />}
                                </label>

                                {field.type === 'textarea' ? (
                                    <textarea required={field.required} placeholder={field.placeholder} onChange={(e) => setResponses({ ...responses, [field.label]: e.target.value })} className="w-full bg-[#0d1525] border-2 border-[#1e293b] rounded-[1.75rem] p-8 text-[11px] min-h-[160px] focus:outline-none focus:border-primary/50 text-white font-black uppercase tracking-widest placeholder:text-muted-foreground/10 leading-relaxed shadow-lg" />
                                ) : field.type === 'dropdown' ? (
                                    field.hasSearch ? (
                                        <SearchableSelect 
                                            field={field} 
                                            value={responses[field.label] || ""} 
                                            onChange={(val) => setResponses({ ...responses, [field.label]: val })} 
                                        />
                                    ) : (
                                        <div className="relative group/select">
                                            <select required={field.required} defaultValue="" onChange={(e) => setResponses({ ...responses, [field.label]: e.target.value })} className="w-full h-16 bg-[#0d1525] border-2 border-[#1e293b] rounded-[1.25rem] px-8 text-[10px] appearance-none focus:outline-none focus:border-primary/50 text-white font-black uppercase tracking-widest shadow-lg">
                                                <option value="" disabled>{field.placeholder}</option>
                                                {field.options.map((opt: any, i: number) => <option key={i} value={opt.value} className="bg-[#0d1525]">{opt.label}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                                        </div>
                                    )
                                ) : (field.type === 'radio' || field.type === 'checkbox') ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-1">
                                        {field.options.map((opt: any) => {
                                            const isSelected = field.type === 'radio' 
                                                ? responses[field.label] === opt.value
                                                : (responses[field.label] || []).includes(opt.value);
                                            
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => {
                                                        if(field.type === 'radio') {
                                                            setResponses({ ...responses, [field.label]: opt.value });
                                                        } else {
                                                            const current = responses[field.label] || [];
                                                            const updated = isSelected 
                                                                ? current.filter((v: any) => v !== opt.value)
                                                                : [...current, opt.value];
                                                            setResponses({ ...responses, [field.label]: updated });
                                                        }
                                                    }}
                                                    className={cn(
                                                        "h-16 px-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group transition-all duration-300",
                                                        isSelected 
                                                            ? "bg-primary text-white border-primary shadow-xl shadow-primary/10 scale-[1.01]" 
                                                            : "bg-[#0d1525] border-[#1e293b] text-muted-foreground/60 hover:border-primary/30 hover:bg-[#161f30] hover:text-white"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-4 w-4 border-2 flex items-center justify-center shrink-0 transition-all",
                                                        isSelected ? "bg-white border-white" : "border-muted-foreground/20",
                                                        field.type === 'radio' ? "rounded-full" : "rounded-md"
                                                    )}>
                                                        {isSelected && <div className={cn("h-1.5 w-1.5 bg-primary", field.type === 'radio' ? "rounded-full" : "rounded-sm")} />}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <input type={field.type} required={field.required} placeholder={field.placeholder} onChange={(e) => setResponses({ ...responses, [field.label]: e.target.value })} className="w-full h-16 bg-[#0d1525] border-2 border-[#1e293b] rounded-[1.25rem] px-8 text-[11px] focus:outline-none focus:border-primary/50 text-white font-black uppercase tracking-widest placeholder:text-muted-foreground/10 shadow-lg" />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={submitting} className="w-full h-16 bg-primary text-white rounded-2xl text-[11px] uppercase tracking-[0.6em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6 italic group font-black relative overflow-hidden">
                            {submitting ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    Submit Form
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="pt-24 border-t border-[#1e293b]/50 text-center space-y-6 opacity-30 group hover:opacity-100 transition-all duration-700">
                    <p className="text-[9px] font-black uppercase tracking-[0.8em] text-muted-foreground italic">Architected By</p>
                    <div className="flex items-center justify-center gap-4">
                         <div className="h-8 w-8 bg-primary/20 rounded-xl flex items-center justify-center shadow-lg shadow-primary/5">
                            <span className="text-[10px] font-black text-primary">MV</span>
                         </div>
                         <span className="text-[12px] font-black tracking-[0.5em] text-foreground uppercase italic underline underline-offset-8 decoration-primary/20">Mana Vyapar</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
