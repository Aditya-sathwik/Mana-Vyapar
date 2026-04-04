"use client"

import { useState, useEffect } from "react"
import {
    Plus,
    FileText,
    Trash2,
    ExternalLink,
    CheckCircle2,
    Clock,
    Layout,
    Search,
    Filter,
    Activity,
    Copy,
    Eye,
    Edit2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api-client"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function FormsListPage() {
    const [forms, setForms] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    useEffect(() => {
        fetchForms()
    }, [])

    const fetchForms = async () => {
        try {
            const response = await apiFetch("/dynamic-forms/list")
            if (response.success) {
                setForms(response.data)
            }
        } catch (error: any) {
            toast.error("Unable to load your forms at the moment.")
        } finally {
            setLoading(false)
        }
    }

    const deleteForm = async (id: string) => {
        if (!confirm("Are you sure you want to delete this form?")) return

        try {
            const response = await apiFetch(`/dynamic-forms/${id}`, {
                method: "DELETE"
            })
            if (response.success) {
                toast.success("Form deleted")
                setForms(forms.filter(f => f._id !== id))
            }
        } catch (error: any) {
            toast.error("Failed to delete form")
        }
    }

    const copyLink = (id: string) => {
        const link = `${window.location.origin}/forms/${id}`
        navigator.clipboard.writeText(link)
        toast.success("Link copied to clipboard!")
    }

    const filteredForms = forms.filter(f =>
        f.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Activity className="h-16 w-16 text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Loading Your Workspace</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-24">
            {/* 🛸 Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="h-3 w-3" />
                        Manager Mode Active
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
                        Customer <span className="text-primary italic">Forms</span>
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">Manage your engagement tools</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/merchant/forms")}
                        className="h-16 px-10 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Plus className="h-5 w-5" />
                        Create New Form
                    </button>
                </div>
            </div>

            {/* 🔍 Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="Search for a form by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-16 bg-card border-border border-2 rounded-2xl pl-16 pr-6 font-bold focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
                <button className="h-16 px-8 bg-card border-border border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-3">
                    <Filter className="h-5 w-5" />
                    Filter
                </button>
            </div>

            {/* 📦 Forms Grid */}
            {filteredForms.length === 0 ? (
                <Card className="p-32 flex flex-col items-center justify-center border-dashed border-border/50 bg-muted/5 opacity-50 space-y-6">
                    <FileText className="h-16 w-16 text-muted-foreground/30" />
                    <div className="text-center">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-2">No Forms Found</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Start by creating your first customer engagement form</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
                    {filteredForms.map((form: any) => (
                        <Card key={form._id} className="group relative bg-card border-border border-2 overflow-hidden hover:border-primary/30 transition-all rounded-[2rem]">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Layout className="h-6 w-6" />
                                    </div>
                                    <button
                                        onClick={() => deleteForm(form._id)}
                                        className="h-10 w-10 flex items-center justify-center bg-muted text-muted-foreground hover:text-rose-500 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase truncate">{form.title}</h3>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                                        {form.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Submissions</p>
                                        <p className="text-sm font-black italic">{form.totalSubmissions || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Created</p>
                                        <p className="text-sm font-black italic">{new Date(form.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-6">
                                    <button
                                        onClick={() => router.push(`/merchant/forms/${form._id}/results`)}
                                        className="h-12 bg-primary text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Results
                                    </button>
                                    <button
                                        onClick={() => router.push(`/merchant/forms?id=${form._id}`)}
                                        className="h-12 bg-card border border-border rounded-xl font-black text-[9px] uppercase tracking-widest hover:border-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit Design
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => copyLink(form._id)}
                                        className="w-full h-12 bg-muted text-muted-foreground hover:text-foreground rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <Copy className="h-4 w-4" />
                                        Copy Form Link
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
